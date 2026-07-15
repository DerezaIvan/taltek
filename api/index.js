import cors from 'cors';
import express from 'express';
import rateLimit from 'express-rate-limit';
import nodemailer from 'nodemailer';

const app = express();
const PORT = process.env.PORT || 3001;

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

function validatePhone(value) {
  const digits = value.replace(/\D/g, '');
  return digits.length >= 10;
}

function validateEmail(value) {
  if (!value) return true;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

app.post('/contact', async (req, res) => {
  if (!transporter) {
    return res.status(503).json({ error: 'Отправка заявок временно недоступна: SMTP не настроен' });
  }

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

  const recipient = WAGON_TYPE_EMAILS[wagonType] || toEmail;

  const subject = `Новая заявка с сайта от ${name.trim()}`;

  const text = [
    'Имя:',
    name.trim(),
    '',
    'Телефон:',
    phone.trim(),
    '',
    email ? `Email: ${email.trim()}` : null,
    company ? `Компания: ${company.trim()}` : null,
    `Тип вагона: ${wagonTypeLabel}`,
    directionFrom || directionTo
      ? `Направление: ${directionFrom.trim() || '—'} → ${directionTo.trim() || '—'}`
      : null,
    comment ? `Комментарий: ${comment.trim()}` : null,
  ]
    .filter(Boolean)
    .join('\n');

  const html = `
    <h2>Новая заявка с сайта Taltek</h2>
    <table border="0" cellpadding="6" cellspacing="0" style="font-family: sans-serif;">
      <tr><td><strong>Имя</strong></td><td>${escapeHtml(name.trim())}</td></tr>
      <tr><td><strong>Телефон</strong></td><td>${escapeHtml(phone.trim())}</td></tr>
      ${email ? `<tr><td><strong>Email</strong></td><td>${escapeHtml(email.trim())}</td></tr>` : ''}
      ${company ? `<tr><td><strong>Компания</strong></td><td>${escapeHtml(company.trim())}</td></tr>` : ''}
      <tr><td><strong>Тип вагона</strong></td><td>${escapeHtml(wagonTypeLabel)}</td></tr>
      ${directionFrom || directionTo ? `<tr><td><strong>Направление</strong></td><td>${escapeHtml(directionFrom.trim() || '—')} → ${escapeHtml(directionTo.trim() || '—')}</td></tr>` : ''}
      ${comment ? `<tr><td><strong>Комментарий</strong></td><td>${escapeHtml(comment.trim())}</td></tr>` : ''}
    </table>
  `;

  try {
    await transporter.sendMail({
      from: `"Сайт Taltek" <${fromEmail}>`,
      to: recipient,
      subject,
      text,
      html,
      replyTo: email?.trim() || undefined,
    });

    res.json({ success: true });
  } catch (error) {
    console.error('Ошибка отправки письма:', error);
    res.status(500).json({ error: 'Не удалось отправить заявку. Попробуйте позже.' });
  }
});

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
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
