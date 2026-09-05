import cors from 'cors';
import express from 'express';
import rateLimit from 'express-rate-limit';
import nodemailer from 'nodemailer';
import ExcelJS from 'exceljs';
import { createChallenge, verifySolution } from 'altcha-lib';
import fs from 'fs/promises';
import path from 'path';
import { spawn } from 'child_process';
import { startWeeklyDigest } from './weekly-digest.mjs';

const app = express();
const PORT = process.env.PORT || 3001;
const LEADS_DIR = process.env.LEADS_DIR || '/app/data';

app.set('trust proxy', 1);

const DIRECTUS_URL = process.env.PUBLIC_DIRECTUS_URL?.replace(/\/$/, '') || '';
const DIRECTUS_API_TOKEN = process.env.DIRECTUS_API_TOKEN || '';
const isDirectusConfigured = DIRECTUS_URL && DIRECTUS_API_TOKEN;

const allowedOrigin = process.env.CORS_ORIGIN || '*';
app.use(
  cors({
    origin: allowedOrigin,
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type'],
  })
);
app.use(express.json({ limit: '1mb' }));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Слишком много попыток. Попробуйте позже.' },
});
app.use('/contact', limiter);

const smtpHost = process.env.SMTP_HOST;
const smtpPort = Number(process.env.SMTP_PORT) || 587;
const smtpUser = process.env.SMTP_USER;
const smtpPass = process.env.SMTP_PASS;
const fromEmail = process.env.FROM_EMAIL;
const toEmail = process.env.TO_EMAIL;

const WAGON_TYPE_EMAILS = {
  gondola: 'pv@taltektrans.pro',
  covered: 'kv@taltektrans.pro',
  grain: 'e.kokoeva@taltektrans.pro',
};

const isSmtpConfigured = smtpHost && fromEmail && toEmail;

const ALTCHA_HMAC_KEY = process.env.ALTCHA_HMAC_KEY || '';

if (!ALTCHA_HMAC_KEY) {
  console.warn('ALTCHA не настроена. Задайте ALTCHA_HMAC_KEY для проверки заявок капчей.');
}

let transporter = null;
if (isSmtpConfigured) {
  const transportOptions = {
    host: smtpHost,
    port: smtpPort,
    secure: smtpPort === 465,
  };
  if (smtpUser && smtpPass) {
    transportOptions.auth = {
      user: smtpUser,
      pass: smtpPass,
    };
  }
  transporter = nodemailer.createTransport(transportOptions);

  transporter.verify(error => {
    if (error) {
      console.error('Ошибка подключения к SMTP:', error.message);
    } else {
      console.log('SMTP подключение успешно');
    }
  });
} else {
  console.warn(
    'SMTP не настроен. Заявки отправляться не будут. Задайте SMTP_HOST, FROM_EMAIL, TO_EMAIL (и SMTP_USER/SMTP_PASS при необходимости авторизации) для полноценной работы.'
  );
}

if (isDirectusConfigured) {
  console.log('Directus интеграция включена:', DIRECTUS_URL);
} else {
  console.warn('Directus не настроен. Заявки будут сохраняться только в файлы.');
}

startWeeklyDigest({
  getTransporter: () => transporter,
  directusUrl: DIRECTUS_URL,
  directusToken: DIRECTUS_API_TOKEN,
});

function validatePhone(value) {
  const digits = value.replace(/\D/g, '');
  return digits.length >= 10;
}

function validateEmail(value) {
  if (!value) return true;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

app.post('/contact', async (req, res) => {
  const { name, phone, email, company, wagonType, directionFrom, directionTo, comment } = req.body;

  if (!name?.trim() || !phone?.trim()) {
    return res.status(400).json({ error: 'Имя и телефон обязательны для заполнения' });
  }

  if (name.trim().length < 2) {
    return res.status(400).json({ error: 'Имя должно содержать не менее 2 символов' });
  }

  if (!validatePhone(phone)) {
    return res.status(400).json({ error: 'Введите корректный номер телефона' });
  }

  if (!validateEmail(email)) {
    return res.status(400).json({ error: 'Введите корректный email' });
  }

  if (ALTCHA_HMAC_KEY) {
    const captchaToken = req.body.captchaToken ?? '';
    const captchaValid = await verifySolution(captchaToken, ALTCHA_HMAC_KEY).catch(() => false);
    if (!captchaValid) {
      logBlockedSubmission(req, captchaToken ? 'invalid_token' : 'no_token');
      return res.status(400).json({ error: 'Проверка не пройдена. Подтвердите, что вы не робот.' });
    }
  }

  const wagonTypeLabel =
    {
      gondola: 'Полувагон',
      covered: 'Крытый вагон',
      grain: 'Вагон-зерновоз',
    }[wagonType] ||
    wagonType ||
    'Не указан';

  const lead = {
    createdAt: new Date().toISOString(),
    name: name.trim(),
    phone: phone.trim(),
    email: email?.trim() || '',
    company: company?.trim() || '',
    wagonType: wagonTypeLabel,
    directionFrom: directionFrom?.trim() || '',
    directionTo: directionTo?.trim() || '',
    comment: comment?.trim() || '',
  };

  let mailOptions = null;
  if (transporter) {
    const recipient = WAGON_TYPE_EMAILS[wagonType] || toEmail;
    const subject = `Новая заявка с сайта от ${lead.name}`;

    const text = [
      'Имя:',
      lead.name,
      '',
      'Телефон:',
      lead.phone,
      '',
      lead.email ? `Email: ${lead.email}` : null,
      lead.company ? `Компания: ${lead.company}` : null,
      `Тип вагона: ${lead.wagonType}`,
      lead.directionFrom || lead.directionTo
        ? `Направление: ${lead.directionFrom || '—'} → ${lead.directionTo || '—'}`
        : null,
      lead.comment ? `Комментарий: ${lead.comment}` : null,
    ]
      .filter(Boolean)
      .join('\n');

    const html = `
      <h2>Новая заявка с сайта Taltek</h2>
      <table border="0" cellpadding="6" cellspacing="0" style="font-family: sans-serif;">
        <tr><td><strong>Имя</strong></td><td>${escapeHtml(lead.name)}</td></tr>
        <tr><td><strong>Телефон</strong></td><td>${escapeHtml(lead.phone)}</td></tr>
        ${lead.email ? `<tr><td><strong>Email</strong></td><td>${escapeHtml(lead.email)}</td></tr>` : ''}
        ${lead.company ? `<tr><td><strong>Компания</strong></td><td>${escapeHtml(lead.company)}</td></tr>` : ''}
        <tr><td><strong>Тип вагона</strong></td><td>${escapeHtml(lead.wagonType)}</td></tr>
        ${lead.directionFrom || lead.directionTo ? `<tr><td><strong>Направление</strong></td><td>${escapeHtml(lead.directionFrom || '—')} → ${escapeHtml(lead.directionTo || '—')}</td></tr>` : ''}
        ${lead.comment ? `<tr><td><strong>Комментарий</strong></td><td>${escapeHtml(lead.comment)}</td></tr>` : ''}
      </table>
    `;

    mailOptions = {
      from: `"Сайт Taltek" <${fromEmail}>`,
      to: recipient,
      subject,
      text,
      html,
      replyTo: lead.email || undefined,
    };
  }

  try {
    await saveLeadToFile(lead);
  } catch (error) {
    console.error('Ошибка сохранения заявки в файл:', error);
    return res.status(500).json({ error: 'Не удалось сохранить заявку. Попробуйте позже.' });
  }

  res.json({ success: true });

  if (mailOptions) {
    transporter.sendMail(mailOptions).catch(error => {
      console.error('Ошибка отправки письма:', error);
    });
  }

  if (isDirectusConfigured) {
    saveLeadToDirectus(lead).catch(error => {
      console.error('Ошибка сохранения в Directus:', error);
    });
  }
});

async function saveLeadToDirectus(lead) {
  const response = await fetch(`${DIRECTUS_URL}/items/submissions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${DIRECTUS_API_TOKEN}`,
    },
    body: JSON.stringify({
      name: lead.name,
      phone: lead.phone,
      email: lead.email,
      company: lead.company,
      wagon_type: lead.wagonType,
      direction_from: lead.directionFrom,
      direction_to: lead.directionTo,
      comment: lead.comment,
      status: 'new',
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Directus error ${response.status}: ${body}`);
  }

  console.log('Заявка сохранена в Directus');
}

// Отклонённые капчей заявки пишем в Directus (blocked_submissions), чтобы менеджер
// видел попытки спама в Аналитике. Запись идёт в фоне и не влияет на ответ клиенту.
function logBlockedSubmission(req, reason) {
  if (!isDirectusConfigured) return;

  const cut = (value, max = 255) =>
    String(value ?? '')
      .slice(0, max)
      .trim();

  const payload = {
    reason,
    ip: cut(req.ip, 45),
    user_agent: cut(req.get('user-agent'), 1000),
    name: cut(req.body?.name),
    phone: cut(req.body?.phone),
    email: cut(req.body?.email),
    company: cut(req.body?.company),
    wagon_type: cut(req.body?.wagonType),
    direction_from: cut(req.body?.directionFrom),
    direction_to: cut(req.body?.directionTo),
    comment: cut(req.body?.comment, 5000),
  };

  fetch(`${DIRECTUS_URL}/items/blocked_submissions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${DIRECTUS_API_TOKEN}`,
    },
    body: JSON.stringify(payload),
  })
    .then(async response => {
      if (!response.ok) {
        console.error(
          'Не удалось записать заблокированную заявку:',
          response.status,
          await response.text()
        );
      }
    })
    .catch(error => {
      console.error('Ошибка записи заблокированной заявки:', error);
    });
}

async function saveLeadToFile(lead) {
  await fs.mkdir(LEADS_DIR, { recursive: true });
  const filename = `${new Date().toISOString().replace(/[:.]/g, '-')}.json`;
  const filepath = path.join(LEADS_DIR, filename);
  await fs.writeFile(filepath, JSON.stringify(lead, null, 2), 'utf-8');
  console.log('Заявка сохранена в файл:', filepath);
}

const REBUILD_TOKEN = process.env.REBUILD_TOKEN || '';
const REBUILD_CWD = process.env.REBUILD_CWD || '/compose';
const REBUILD_NOTIFY_EMAILS = (process.env.REBUILD_NOTIFY_EMAILS || '')
  .split(',')
  .map(e => e.trim())
  .filter(Boolean);

let rebuildRunning = false;
let rebuildPending = false;
let lastRebuild = null;
let rebuildLogTail = [];

function appendRebuildLog(line) {
  rebuildLogTail.push(line);
  if (rebuildLogTail.length > 50) rebuildLogTail.shift();
}

function runRebuild() {
  rebuildRunning = true;
  rebuildLogTail = [];
  lastRebuild = { startedAt: new Date().toISOString(), finishedAt: null, exitCode: null };

  console.log('Запуск пересборки фронтенда: docker compose up -d --build --no-deps frontend');
  const child = spawn('docker', ['compose', 'up', '-d', '--build', '--no-deps', 'frontend'], {
    cwd: REBUILD_CWD,
    env: { ...process.env, CONTENT_CACHEBUST: String(Date.now()) },
  });

  child.stdout.on('data', data => {
    const line = data.toString().trimEnd();
    console.log('[rebuild]', line);
    appendRebuildLog(line);
  });
  child.stderr.on('data', data => {
    const line = data.toString().trimEnd();
    console.error('[rebuild]', line);
    appendRebuildLog(line);
  });

  child.on('error', error => {
    console.error('Не удалось запустить пересборку:', error.message);
    finishRebuild(-1);
  });

  child.on('close', code => {
    console.log(`Пересборка завершена с кодом ${code}`);
    finishRebuild(code);
  });
}

async function sendRebuildNotification() {
  if (!transporter || REBUILD_NOTIFY_EMAILS.length === 0 || !lastRebuild) return;

  const success = lastRebuild.exitCode === 0;
  const subject = success
    ? 'Сайт taltektrans.pro успешно обновлён'
    : 'Ошибка обновления сайта taltektrans.pro';

  const lines = [
    success
      ? `Дата внесения правки: ${formatMoscowDate(lastRebuild.finishedAt)}`
      : 'Пересборка сайта после изменений в CMS завершилась с ошибкой. Изменения НЕ опубликованы, сайт работает в прежней версии.\n\n' +
        `Дата правки: ${formatMoscowDate(lastRebuild.finishedAt)}`,
  ];

  if (!success && rebuildLogTail.length > 0) {
    lines.push('', 'Последние строки лога сборки:', '', rebuildLogTail.join('\n'));
  }

  try {
    await transporter.sendMail({
      from: `"Сайт Taltek" <${fromEmail}>`,
      to: REBUILD_NOTIFY_EMAILS.join(', '),
      subject,
      text: lines.join('\n'),
    });
    console.log('Уведомление о пересборке отправлено:', REBUILD_NOTIFY_EMAILS.join(', '));
  } catch (error) {
    console.error('Не удалось отправить уведомление о пересборке:', error.message);
  }
}

function finishRebuild(exitCode) {
  rebuildRunning = false;
  if (lastRebuild) {
    lastRebuild.finishedAt = new Date().toISOString();
    lastRebuild.exitCode = exitCode;
  }
  sendRebuildNotification();
  if (rebuildPending) {
    rebuildPending = false;
    console.log('Запуск отложенной пересборки');
    runRebuild();
  }
}

function checkRebuildToken(req, res, next) {
  if (!REBUILD_TOKEN) {
    return res.status(503).json({ error: 'Пересборка не настроена. Задайте REBUILD_TOKEN.' });
  }
  if (req.get('X-Rebuild-Token') !== REBUILD_TOKEN) {
    return res.status(401).json({ error: 'Неверный токен пересборки' });
  }
  next();
}

app.post('/rebuild', checkRebuildToken, (_req, res) => {
  if (rebuildRunning) {
    rebuildPending = true;
    return res.status(202).json({ success: true, running: true, pending: true });
  }
  runRebuild();
  res.status(202).json({ success: true, running: true, pending: false });
});

app.get('/rebuild/status', checkRebuildToken, (_req, res) => {
  res.json({ running: rebuildRunning, pending: rebuildPending, lastRun: lastRebuild });
});

const EXPORT_TOKEN = process.env.EXPORT_TOKEN || '';

// Список полей коллекции submissions кэшируем ненадолго: поле created_at
// могут добавить в Directus уже после деплоя, и выгрузка должна это подхватить.
const FIELDS_CACHE_TTL = 5 * 60 * 1000;
let submissionsFieldsCache = null;
let submissionsFieldsCachedAt = 0;

async function getSubmissionsFields() {
  if (submissionsFieldsCache && Date.now() - submissionsFieldsCachedAt < FIELDS_CACHE_TTL) {
    return submissionsFieldsCache;
  }
  const response = await fetch(`${DIRECTUS_URL}/fields/submissions`, {
    headers: { Authorization: `Bearer ${DIRECTUS_API_TOKEN}` },
  });
  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Directus error ${response.status}: ${body}`);
  }
  const { data } = await response.json();
  submissionsFieldsCache = new Set(data.map(field => field.field));
  submissionsFieldsCachedAt = Date.now();
  return submissionsFieldsCache;
}

function checkExportToken(req, res, next) {
  if (!EXPORT_TOKEN) {
    return res.status(503).json({ error: 'Выгрузка не настроена. Задайте EXPORT_TOKEN.' });
  }
  // Токен принимаем и из query (?token=), чтобы выгрузку можно было открыть простой ссылкой.
  const token = req.get('X-Export-Token') || req.query.token || '';
  if (token !== EXPORT_TOKEN) {
    return res.status(401).json({ error: 'Неверный токен доступа' });
  }
  next();
}

app.get('/export/submissions.xlsx', checkExportToken, async (req, res) => {
  if (!isDirectusConfigured) {
    return res.status(503).json({ error: 'Directus не настроен, выгрузка недоступна.' });
  }

  const { from, to, status } = req.query;
  const datePattern = /^\d{4}-\d{2}-\d{2}$/;
  if ((from && !datePattern.test(from)) || (to && !datePattern.test(to))) {
    return res
      .status(400)
      .json({ error: 'Даты указывайте в формате ГГГГ-ММ-ДД (например, 2026-09-01)' });
  }

  try {
    const fields = await getSubmissionsFields();
    const hasCreatedAt = fields.has('created_at');

    const params = new URLSearchParams({
      limit: '-1',
      sort: hasCreatedAt ? '-created_at' : '-id',
    });
    if (hasCreatedAt && from) params.append('filter[created_at][_gte]', `${from}T00:00:00`);
    if (hasCreatedAt && to) params.append('filter[created_at][_lte]', `${to}T23:59:59`);
    if (status) params.append('filter[status][_eq]', status);

    const response = await fetch(`${DIRECTUS_URL}/items/submissions?${params}`, {
      headers: { Authorization: `Bearer ${DIRECTUS_API_TOKEN}` },
    });
    if (!response.ok) {
      const body = await response.text();
      throw new Error(`Directus error ${response.status}: ${body}`);
    }
    const { data: submissions } = await response.json();

    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'Taltek';
    const sheet = workbook.addWorksheet('Заявки');

    sheet.columns = [
      { header: 'ID', key: 'id', width: 8 },
      { header: 'Дата', key: 'created_at', width: 18 },
      { header: 'Имя', key: 'name', width: 24 },
      { header: 'Телефон', key: 'phone', width: 20 },
      { header: 'Email', key: 'email', width: 28 },
      { header: 'Компания', key: 'company', width: 24 },
      { header: 'Тип вагона', key: 'wagon_type', width: 18 },
      { header: 'Откуда', key: 'direction_from', width: 18 },
      { header: 'Куда', key: 'direction_to', width: 18 },
      { header: 'Комментарий', key: 'comment', width: 40 },
    ];
    sheet.getRow(1).font = { bold: true };

    for (const item of submissions) {
      sheet.addRow({
        id: item.id,
        created_at: item.created_at ? formatMoscowDateTime(item.created_at) : '',
        name: item.name || '',
        phone: item.phone || '',
        email: item.email || '',
        company: item.company || '',
        wagon_type: item.wagon_type || '',
        direction_from: item.direction_from || '',
        direction_to: item.direction_to || '',
        comment: item.comment || '',
      });
    }

    const filename = `submissions-${new Date().toISOString().slice(0, 10)}.xlsx`;
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    await workbook.xlsx.write(res);
    res.end();
    console.log(`Выгрузка заявок в Excel: ${submissions.length} строк`);
  } catch (error) {
    console.error('Ошибка выгрузки заявок:', error);
    if (res.headersSent) {
      res.end();
    } else {
      res.status(502).json({ error: 'Не удалось получить заявки из Directus. Попробуйте позже.' });
    }
  }
});

app.get('/captcha/challenge', async (_req, res) => {
  if (!ALTCHA_HMAC_KEY) {
    return res.status(503).json({ error: 'Капча не настроена. Задайте ALTCHA_HMAC_KEY.' });
  }
  const challenge = await createChallenge({ hmacKey: ALTCHA_HMAC_KEY });
  res.json(challenge);
});

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', directus: Boolean(isDirectusConfigured) });
});

app.use((_req, res) => {
  res.status(404).json({ error: 'Not found' });
});

function formatMoscowDate(isoDate) {
  const parts = new Intl.DateTimeFormat('ru-RU', {
    timeZone: 'Europe/Moscow',
    hour: '2-digit',
    minute: '2-digit',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).formatToParts(new Date(isoDate));
  const get = type => parts.find(p => p.type === type)?.value || '';
  return `${get('hour')}:${get('minute')} ${get('day')} ${get('month')} ${get('year')} г.`;
}

function formatMoscowDateTime(isoDate) {
  const parts = new Intl.DateTimeFormat('ru-RU', {
    timeZone: 'Europe/Moscow',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).formatToParts(new Date(isoDate));
  const get = type => parts.find(p => p.type === type)?.value || '';
  return `${get('day')}.${get('month')}.${get('year')} ${get('hour')}:${get('minute')}`;
}

function escapeHtml(value) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

app.listen(PORT, () => {
  console.log(`API запущен на порту ${PORT}`);
});
