#!/usr/bin/env node

/**
 * Вспомогательный скрипт для удаления коллекции our_mission
 * и пересоздания её с правильным типом поля gallery.
 */

const DIRECTUS_URL = (process.env.DIRECTUS_URL || 'http://localhost:8055').replace(/\/$/, '');
const ADMIN_EMAIL = process.env.DIRECTUS_ADMIN_EMAIL || 'admin@example.com';
const ADMIN_PASSWORD = process.env.DIRECTUS_ADMIN_PASSWORD || 'directus';

async function request(path, options = {}) {
  const url = `${DIRECTUS_URL}${path}`;
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Directus API error ${response.status}: ${body}`);
  }

  const contentType = response.headers.get('content-type');
  if (contentType?.includes('application/json')) {
    return response.json();
  }
  return null;
}

async function login() {
  const result = await request('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD }),
  });
  return result.data.access_token;
}

async function deleteField(token, collection, field) {
  try {
    await request(`/fields/${collection}/${field}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log(`🗑️  Удалено поле ${collection}.${field}`);
  } catch (error) {
    console.log(`⚠️  Не удалось удалить поле ${collection}.${field}: ${error.message}`);
  }
}

async function deleteCollection(token, collection) {
  try {
    await request(`/collections/${collection}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log(`🗑️  Удалена коллекция ${collection}`);
  } catch (error) {
    console.log(`⚠️  Не удалось удалить коллекцию ${collection}: ${error.message}`);
  }
}

async function main() {
  const token = await login();
  await deleteField(token, 'our_mission', 'gallery');
  await deleteCollection(token, 'our_mission');
  console.log('Готово. Теперь запусти node directus/seed-schema.mjs');
}

main().catch((error) => {
  console.error('Ошибка:', error.message);
  process.exit(1);
});
