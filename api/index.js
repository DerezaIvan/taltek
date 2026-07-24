import cors from 'cors';
import express from 'express';
import rateLimit from 'express-rate-limit';
import nodemailer from 'nodemailer';
import fs from 'fs/promises';
import path from 'path';
import { spawn } from 'child_process';

const app = express();
const PORT = process.env.PORT || 3001;
const LEADS_DIR = process.env.LEADS_DIR || '/app/data';

const DIRECTUS_URL = process.env.PUBLIC_DIRECTUS_URL?.replace(/\/$/, '') || '';
const DIRECTUS_API_TOKEN = process.env.DIRECTUS_API_TOKEN || '';
const isDirectusConfigured = DIRECTUS_URL && DIRECTUS_API_TOKEN;

const allowedOrigin = process.env.CORS_ORIGIN || '*';
app.use(
  cors({
    origin: allowedOrigin,
    methods: ['POST', 'OPTIONS'],
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
  gondola: 'dereza2012@yandex.ru',
  covered: 'dereza2012@yandex.ru',
  grain: 'dereza2012@yandex.ru',
};

const isSmtpConfigured = smtpHost && smtpUser && smtpPass && fromEmail && toEmail;

let transporter = null;
if (isSmtpConfigured) {
  transporter = nodemailer.createTransport({
    host: smtpHost,
    port: smtpPort,
    secure: smtpPort === 465,
    auth: {
      user: smtpUser,
      pass: smtpPass,
    },
  });

  transporter.verify(error => {
    if (error) {
      console.error('Ошибка подключения к SMTP:', error.message);
    } else {
      console.log('SMTP подключение успешно');
    }
  });
} else {
  console.warn(
    'SMTP не настроен. Заявки отправляться не будут. Задайте SMTP_HOST, SMTP_USER, SMTP_PASS, FROM_EMAIL, TO_EMAIL для полноценной работы.'
  );
}

if (isDirectusConfigured) {
  console.log('Directus интеграция включена:', DIRECTUS_URL);
} else {
  console.warn('Directus не настроен. Заявки будут сохраняться только в файлы.');
}

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

  let emailSent = false;
  let emailError = null;

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

    try {
      await transporter.sendMail({
        from: `"Сайт Taltek" <${fromEmail}>`,
        to: recipient,
        subject,
        text,
        html,
        replyTo: lead.email || undefined,
      });
      emailSent = true;
    } catch (error) {
      emailError = error.message;
      console.error('Ошибка отправки письма:', error);
    }
  }

  let directusSaved = false;
  let directusError = null;

  if (isDirectusConfigured) {
    try {
      await saveLeadToDirectus(lead);
      directusSaved = true;
    } catch (error) {
      directusError = error.message;
      console.error('Ошибка сохранения в Directus:', error);
    }
  }

  try {
    await saveLeadToFile(lead);
  } catch (error) {
    console.error('Ошибка сохранения заявки в файл:', error);
    return res.status(500).json({ error: 'Не удалось сохранить заявку. Попробуйте позже.' });
  }

  const notices = [];
  if (!emailSent) {
    notices.push(
      transporter
        ? 'Заявка сохранена, но письмо не удалось отправить.'
        : 'Заявка сохранена. Отправка письма временно недоступна.'
    );
  }
  if (isDirectusConfigured && !directusSaved) {
    notices.push('Directus временно недоступен, заявка сохранена в файл.');
  }

  res.json({
    success: true,
    savedToDirectus: directusSaved,
    emailSent,
    notice: notices.length > 0 ? notices.join(' ') : undefined,
  });
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
      ? 'Пересборка сайта после изменений в CMS завершилась успешно.'
      : 'Пересборка сайта после изменений в CMS завершилась с ошибкой. Изменения НЕ опубликованы, сайт работает в прежней версии.',
    '',
    `Начало: ${lastRebuild.startedAt}`,
    `Окончание: ${lastRebuild.finishedAt}`,
    `Код завершения: ${lastRebuild.exitCode}`,
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

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', directus: Boolean(isDirectusConfigured) });
});

app.use((_req, res) => {
  res.status(404).json({ error: 'Not found' });
});

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
