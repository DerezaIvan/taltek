import ExcelJS from 'exceljs';

// Europe/Moscow — всегда UTC+3, перехода на летнее время нет.
const MSK_OFFSET_MS = 3 * 60 * 60 * 1000;
const DAY_MS = 24 * 60 * 60 * 1000;
const WEEK_MS = 7 * 24 * 60 * 60 * 1000;
const DIGEST_WEEKDAYS_UTC = [3, 5]; // Среда и пятница; для МСК в 09:00 день совпадает с UTC.

// Рассылка заявок за непересекающиеся периоды: каждую среду и пятницу
// в 09:00 МСК (06:00 UTC) отправляет XLSX-отчёт на адреса из DIGEST_EMAILS.
export function startWeeklyDigest({ getTransporter, directusUrl, directusToken }) {
  const recipients = (process.env.DIGEST_EMAILS || '')
    .split(',')
    .map(email => email.trim())
    .filter(Boolean);

  if (recipients.length === 0) {
    console.warn(
      'Рассылка заявок не запущена: не задан DIGEST_EMAILS (список получателей через запятую).'
    );
    return;
  }
  if (!directusUrl || !directusToken) {
    console.warn(
      'Рассылка заявок не запущена: Directus не настроен (PUBLIC_DIRECTUS_URL / DIRECTUS_API_TOKEN).'
    );
    return;
  }

  const baseUrl = directusUrl.replace(/\/$/, '');
  const run = () => runDigest({ getTransporter, directusUrl: baseUrl, directusToken, recipients });

  if (!getTransporter()) {
    console.warn('Рассылка заявок: SMTP не настроен, планировщик не запущен.');
  } else {
    scheduleNextRun(run, recipients);
  }

  if (process.env.DIGEST_RUN_NOW === '1') {
    console.log('DIGEST_RUN_NOW=1: выполняем еженедельную рассылку немедленно.');
    run();
  }
}

function scheduleNextRun(run, recipients) {
  const nextRun = getNextRunDate();
  console.log(
    `Рассылка заявок запущена. Следующая отправка: ${nextRun.toISOString()} ` +
      `(${formatMoscowDateTime(nextRun)} МСК). Получатели: ${recipients.join(', ')}`
  );
  setTimeout(() => {
    run();
    scheduleNextRun(run, recipients);
  }, nextRun.getTime() - Date.now());
}

async function runDigest({ getTransporter, directusUrl, directusToken, recipients }) {
  try {
    const { start, end } = getDigestRange();
    const periodLabel = `${formatMoscowDay(start)}–${formatMoscowDay(end)}`;

    const submissions = await fetchSubmissions(directusUrl, directusToken, start, end);
    const buffer = await buildWorkbook(submissions);
    console.log(
      `Рассылка заявок: отчёт за период ${periodLabel} сформирован, ` +
        `заявок: ${submissions.length}, XLSX ${buffer.length} байт.`
    );

    const transporter = getTransporter();
    if (!transporter) {
      console.warn('Рассылка заявок: SMTP не настроен, письмо не отправлено.');
      return;
    }

    await transporter.sendMail({
      from: process.env.FROM_EMAIL ? `"Сайт Taltek" <${process.env.FROM_EMAIL}>` : undefined,
      to: recipients.join(', '),
      subject: `Заявки с сайта за период ${periodLabel}`,
      text:
        submissions.length > 0
          ? `Заявки с сайта за период ${periodLabel}.\n\nВсего заявок: ${submissions.length}.\n\nСписок заявок — во вложенном Excel-файле.`
          : `Заявки с сайта за период ${periodLabel}.\n\nЗа указанный период заявок не было.\n\nПисьмо отправлено для подтверждения того, что рассылка работает.`,
      attachments: [
        {
          filename: `zayavki-${formatMoscowIsoDay(start)}-${formatMoscowIsoDay(end)}.xlsx`,
          content: buffer,
        },
      ],
    });
    console.log(`Рассылка заявок отправлена (${submissions.length} заявок): ${recipients.join(', ')}`);
  } catch (error) {
    console.error('Ошибка рассылки заявок:', error);
  }
}

// Для среды: предыдущая пятница 00:00:00 МСК — вторник 23:59:59 МСК.
// Для пятницы: среда 00:00:00 МСК — четверг 23:59:59 МСК.
// При ручном запуске берём период последнего наступившего дня рассылки.
export function getDigestRange(now = new Date()) {
  const mskNow = new Date(now.getTime() + MSK_OFFSET_MS);
  const mskWeekday = mskNow.getUTCDay();
  const beforeDispatchTime = mskNow.getUTCHours() < 9;
  let daysSinceWednesday = (mskWeekday - 3 + 7) % 7;
  let daysSinceFriday = (mskWeekday - 5 + 7) % 7;
  if (daysSinceWednesday === 0 && beforeDispatchTime) daysSinceWednesday = 7;
  if (daysSinceFriday === 0 && beforeDispatchTime) daysSinceFriday = 7;
  const dispatchWeekday = daysSinceWednesday <= daysSinceFriday ? 3 : 5;
  const daysSinceDispatch = Math.min(daysSinceWednesday, daysSinceFriday);
  const dispatchDayMsk = Date.UTC(
    mskNow.getUTCFullYear(),
    mskNow.getUTCMonth(),
    mskNow.getUTCDate() - daysSinceDispatch
  );
  const startDaysBeforeDispatch = dispatchWeekday === 3 ? 5 : 2;

  return {
    start: new Date(dispatchDayMsk - MSK_OFFSET_MS - startDaysBeforeDispatch * DAY_MS),
    end: new Date(dispatchDayMsk - MSK_OFFSET_MS - 1),
  };
}

// Ближайшая среда или пятница в 06:00:00 UTC (09:00 МСК) в будущем.
export function getNextRunDate(now = new Date()) {
  const candidates = DIGEST_WEEKDAYS_UTC.map(weekday => {
    const daysUntilWeekday = (weekday - now.getUTCDay() + 7) % 7;
    let next = Date.UTC(
      now.getUTCFullYear(),
      now.getUTCMonth(),
      now.getUTCDate() + daysUntilWeekday,
      6,
      0,
      0
    );
    if (next <= now.getTime()) next += WEEK_MS;
    return next;
  });

  return new Date(Math.min(...candidates));
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
