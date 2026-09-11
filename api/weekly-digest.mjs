import ExcelJS from 'exceljs';

// Europe/Moscow — всегда UTC+3, перехода на летнее время нет.
const MSK_OFFSET_MS = 3 * 60 * 60 * 1000;
const WEEK_MS = 7 * 24 * 60 * 60 * 1000;

// Еженедельная рассылка заявок за прошлую неделю: каждый понедельник
// в 09:00 МСК (06:00 UTC) отправляет XLSX-отчёт на адреса из DIGEST_EMAILS.
export function startWeeklyDigest({ getTransporter, directusUrl, directusToken }) {
  const recipients = (process.env.DIGEST_EMAILS || '')
    .split(',')
    .map(email => email.trim())
    .filter(Boolean);

  if (recipients.length === 0) {
    console.warn(
      'Еженедельная рассылка не запущена: не задан DIGEST_EMAILS (список получателей через запятую).'
    );
    return;
  }
  if (!directusUrl || !directusToken) {
    console.warn(
      'Еженедельная рассылка не запущена: Directus не настроен (PUBLIC_DIRECTUS_URL / DIRECTUS_API_TOKEN).'
    );
    return;
  }

  const baseUrl = directusUrl.replace(/\/$/, '');
  const run = () => runDigest({ getTransporter, directusUrl: baseUrl, directusToken, recipients });

  if (!getTransporter()) {
    console.warn('Еженедельная рассылка: SMTP не настроен, планировщик не запущен.');
  } else {
    const nextRun = getNextRunDate();
    console.log(
      `Еженедельная рассылка заявок запущена. Следующая отправка: ${nextRun.toISOString()} ` +
        `(${formatMoscowDateTime(nextRun)} МСК). Получатели: ${recipients.join(', ')}`
    );
    setTimeout(() => {
      run();
      setInterval(run, WEEK_MS);
    }, nextRun.getTime() - Date.now());
  }

  if (process.env.DIGEST_RUN_NOW === '1') {
    console.log('DIGEST_RUN_NOW=1: выполняем еженедельную рассылку немедленно.');
    run();
  }
}

async function runDigest({ getTransporter, directusUrl, directusToken, recipients }) {
  try {
    const { start, end } = getLastWeekRange();
    const periodLabel = `${formatMoscowDay(start)}–${formatMoscowDay(end)}`;

    const submissions = await fetchSubmissions(directusUrl, directusToken, start, end);
    const buffer = await buildWorkbook(submissions);
    console.log(
      `Еженедельная рассылка: отчёт за неделю ${periodLabel} сформирован, ` +
        `заявок: ${submissions.length}, XLSX ${buffer.length} байт.`
    );

    const transporter = getTransporter();
    if (!transporter) {
      console.warn('Еженедельная рассылка: SMTP не настроен, письмо не отправлено.');
      return;
    }

    await transporter.sendMail({
      from: process.env.FROM_EMAIL ? `"Сайт Taltek" <${process.env.FROM_EMAIL}>` : undefined,
      to: recipients.join(', '),
      subject: `Заявки с сайта за неделю ${periodLabel}`,
      text:
        submissions.length > 0
          ? `Заявки с сайта за неделю ${periodLabel}.\n\nВсего заявок: ${submissions.length}.\n\nСписок заявок — во вложенном Excel-файле.`
          : `Заявки с сайта за неделю ${periodLabel}.\n\nЗа прошедшую неделю заявок не было.\n\nПисьмо отправлено для подтверждения того, что рассылка работает.`,
      attachments: [
        {
          filename: `zayavki-${formatMoscowIsoDay(start)}.xlsx`,
          content: buffer,
        },
      ],
    });
    console.log(`Еженедельная рассылка отправлена (${submissions.length} заявок): ${recipients.join(', ')}`);
  } catch (error) {
    console.error('Ошибка еженедельной рассылки заявок:', error);
  }
}

// Прошлая неделя: понедельник 00:00:00 МСК — воскресенье 23:59:59 МСК.
// Считаем в сдвинутом на +3 часа времени, где UTC-поля даты — это московское время.
function getLastWeekRange(now = new Date()) {
  const mskNow = new Date(now.getTime() + MSK_OFFSET_MS);
  const daysSinceMonday = (mskNow.getUTCDay() + 6) % 7;
  const thisMondayMsk = Date.UTC(
    mskNow.getUTCFullYear(),
    mskNow.getUTCMonth(),
    mskNow.getUTCDate() - daysSinceMonday
  );
  // Границы в UTC для фильтра по created_at (DateTime в UTC).
  return {
    start: new Date(thisMondayMsk - MSK_OFFSET_MS - WEEK_MS),
    end: new Date(thisMondayMsk - MSK_OFFSET_MS - 1000),
  };
}

// Ближайший понедельник 06:00:00 UTC (09:00 МСК) в будущем.
function getNextRunDate(now = new Date()) {
  const daysUntilMonday = (8 - now.getUTCDay()) % 7;
  let next = Date.UTC(
    now.getUTCFullYear(),
    now.getUTCMonth(),
    now.getUTCDate() + daysUntilMonday,
    6,
    0,
    0
  );
  if (next <= now.getTime()) next += WEEK_MS;
  return new Date(next);
}

async function fetchSubmissions(directusUrl, directusToken, start, end) {
  const params = new URLSearchParams({ limit: '-1', sort: '-created_at' });
  params.set('filter[created_at][_gte]', start.toISOString());
  params.set('filter[created_at][_lte]', end.toISOString());

  const response = await fetch(`${directusUrl}/items/submissions?${params}`, {
    headers: { Authorization: `Bearer ${directusToken}` },
  });
  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Directus error ${response.status}: ${body}`);
  }
  const { data } = await response.json();
  return data;
}

async function buildWorkbook(submissions) {
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
    { header: 'ОКПО', key: 'okpo', width: 14 },
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
      okpo: item.okpo || '',
      wagon_type: item.wagon_type || '',
      direction_from: item.direction_from || '',
      direction_to: item.direction_to || '',
      comment: item.comment || '',
    });
  }

  return workbook.xlsx.writeBuffer();
}

function moscowParts(date) {
  const parts = new Intl.DateTimeFormat('ru-RU', {
    timeZone: 'Europe/Moscow',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).formatToParts(new Date(date));
  const get = type => parts.find(p => p.type === type)?.value || '';
  return {
    day: get('day'),
    month: get('month'),
    year: get('year'),
    hour: get('hour'),
    minute: get('minute'),
  };
}

function formatMoscowDay(date) {
  const p = moscowParts(date);
  return `${p.day}.${p.month}.${p.year}`;
}

function formatMoscowIsoDay(date) {
  const p = moscowParts(date);
  return `${p.year}-${p.month}-${p.day}`;
}

function formatMoscowDateTime(date) {
  const p = moscowParts(date);
  return `${p.day}.${p.month}.${p.year} ${p.hour}:${p.minute}`;
}
