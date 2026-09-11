#!/usr/bin/env node

const DIRECTUS_URL = (process.env.DIRECTUS_URL || 'http://localhost:8055').replace(/\/$/, '');
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || process.env.DIRECTUS_ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || process.env.DIRECTUS_ADMIN_PASSWORD;

if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
  throw new Error('Не заданы данные администратора Directus');
}

async function request(path, options = {}, allowedStatuses = []) {
  const response = await fetch(`${DIRECTUS_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (allowedStatuses.includes(response.status)) {
    return { status: response.status, data: null };
  }

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Directus API error ${response.status}: ${body}`);
  }

  return {
    status: response.status,
    data: response.status === 204 ? null : await response.json(),
  };
}

async function login() {
  const result = await request('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD }),
  });

  return result.data.data.access_token;
}

async function ensureOkpoField(token, collection) {
  const fieldPath = `/fields/${encodeURIComponent(collection)}/okpo`;
  const existing = await request(
    fieldPath,
    { headers: { Authorization: `Bearer ${token}` } },
    [404],
  );

  if (existing.status !== 404) {
    console.log(`Поле ${collection}.okpo уже существует`);
    return;
  }

  await request(`/fields/${encodeURIComponent(collection)}`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify({
      field: 'okpo',
      type: 'string',
      meta: {
        interface: 'input',
        required: false,
        note: 'ОКПО',
        translations: [{ language: 'ru-RU', translation: 'ОКПО' }],
      },
      schema: {
        is_nullable: true,
        max_length: 255,
      },
    }),
  });

  await request(fieldPath, { headers: { Authorization: `Bearer ${token}` } });
  console.log(`Поле ${collection}.okpo создано`);
}

async function main() {
  const token = await login();

  await ensureOkpoField(token, 'submissions');
  await ensureOkpoField(token, 'blocked_submissions');
}

main().catch(error => {
  console.error(`Миграция ОКПО завершилась с ошибкой: ${error.message}`);
  process.exit(1);
});
