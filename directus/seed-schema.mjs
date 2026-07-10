#!/usr/bin/env node

/**
 * Скрипт для первоначального создания коллекций Directus
 * на основе directus/schema.md.
 *
 * Запуск:
 *   DIRECTUS_URL=http://localhost:8055 \
 *   DIRECTUS_ADMIN_EMAIL=admin@example.com \
 *   DIRECTUS_ADMIN_PASSWORD=directus \
 *   node directus/seed-schema.mjs
 *
 * Или через .env:
 *   set -a && source .env && set +a && node directus/seed-schema.mjs
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

function field(type, name, options = {}) {
  const base = {
    field: name,
    type,
    meta: {
      interface: options.interface ?? null,
      special: options.special ?? null,
      options: options.options ?? null,
      required: options.required ?? false,
      note: options.note ?? null,
      hidden: options.hidden ?? false,
    },
    schema: {
      is_nullable: !(options.required ?? false),
      default_value: options.default ?? null,
    },
  };

  if (type === 'string' && options.max_length) {
    base.schema.max_length = options.max_length;
  }

  if (options.is_primary_key) {
    base.schema.is_primary_key = true;
    base.schema.has_auto_increment = options.auto_increment ?? false;
  }

  return base;
}

const helpers = {
  input: (name, options = {}) =>
    field('string', name, { interface: 'input', max_length: 255, ...options }),
  textarea: (name, options = {}) =>
    field('text', name, { interface: 'input', options: { editor: 'textarea' }, ...options }),
  integer: (name, options = {}) => field('integer', name, { interface: 'input', ...options }),
  dropdown: (name, choices, options = {}) =>
    field('string', name, {
      interface: 'select-dropdown',
      options: { choices: choices.map(value => ({ text: value, value })) },
      ...options,
    }),
  json: (name, options = {}) =>
    field('json', name, { interface: 'input-code', options: { language: 'json' }, ...options }),
  image: (name, options = {}) =>
    field('uuid', name, { interface: 'file-image', special: ['file'], ...options }),
  files: (name, options = {}) =>
    field('alias', name, { interface: 'files', special: ['files'], ...options }),
  dateTime: (name, options = {}) =>
    field('dateTime', name, { interface: 'datetime', special: ['date-created'], ...options }),
};

function collection(name, options = {}) {
  const isStringPK = options.primaryKey === 'string';

  const pkField = isStringPK
    ? helpers.input('id', {
        required: true,
        is_primary_key: true,
        auto_increment: false,
        note: 'Уникальный код (латиницей), например wagon-supply',
      })
    : helpers.integer('id', {
        required: true,
        interface: null,
        is_primary_key: true,
        auto_increment: true,
      });

  const fields = [
    ...(options.singleton
      ? []
      : [
          helpers.dropdown('status', ['published', 'draft'], { default: 'draft' }),
          helpers.integer('sort'),
        ]),
    ...options.fields,
  ];

  return {
    collection: name,
    meta: {
      icon: options.icon ?? 'box',
      note: options.note ?? null,
      singleton: options.singleton ?? false,
      sort_field: options.singleton ? null : 'sort',
    },
    schema: { name },
    pkField,
    fields,
  };
}

const collections = [
  collection('site_settings', {
    singleton: true,
    icon: 'settings',
    fields: [
      helpers.input('site_name', { required: true }),
      helpers.input('site_url', { required: true }),
      helpers.image('logo'),
      helpers.input('hotline_phone_display', { required: true }),
      helpers.input('hotline_phone_href', { required: true }),
      helpers.textarea('main_address', { required: true }),
      helpers.json('contact_emails'),
    ],
  }),

  collection('navigation_items', {
    icon: 'list',
    fields: [helpers.input('label', { required: true }), helpers.input('href', { required: true })],
  }),

  collection('pages', {
    icon: 'article',
    fields: [
      helpers.input('slug', { required: true }),
      helpers.input('title', { required: true }),
      helpers.textarea('description'),
      helpers.image('og_image'),
      helpers.input('hero_title'),
      helpers.textarea('hero_subtitle'),
    ],
  }),

  collection('home_hero', {
    singleton: true,
    icon: 'home',
    fields: [
      helpers.textarea('title', { required: true }),
      helpers.textarea('subtitle', { required: true }),
      helpers.image('background'),
    ],
  }),

  collection('about_intro', {
    icon: 'info',
    fields: [
      helpers.input('title', { required: true }),
      helpers.textarea('lead', { required: true }),
      helpers.json('paragraphs'),
      helpers.image('image'),
      helpers.input('image_alt'),
    ],
  }),

  collection('our_mission', {
    singleton: true,
    icon: 'target',
    fields: [
      helpers.input('title', { required: true }),
      helpers.textarea('subtitle', { required: true }),
      helpers.json('gallery', { note: 'JSON-массив путей к изображениям' }),
    ],
  }),

  collection('key_services', {
    icon: 'star',
    primaryKey: 'string',
    fields: [
      helpers.input('title', { required: true }),
      helpers.textarea('description', { required: true }),
    ],
  }),

  collection('delivery_section', {
    singleton: true,
    icon: 'local_shipping',
    fields: [helpers.textarea('title', { required: true })],
  }),

  collection('delivery_steps', {
    icon: 'format_list_numbered',
    fields: [
      helpers.input('step_id', { required: true }),
      helpers.input('title', { required: true }),
      helpers.textarea('description', { required: true }),
    ],
  }),

  collection('why_us_items', {
    icon: 'thumb_up',
    primaryKey: 'string',
    fields: [
      helpers.input('title', { required: true }),
      helpers.textarea('description', { required: true }),
    ],
  }),

  collection('what_you_get_items', {
    icon: 'check_circle',
    primaryKey: 'string',
    fields: [helpers.input('title', { required: true })],
  }),

  collection('stats_items', {
    icon: 'show_chart',
    primaryKey: 'string',
    fields: [
      helpers.input('label', { required: true }),
      helpers.input('value', { required: true }),
      helpers.input('description', { required: true }),
    ],
  }),

  collection('fleet_park_section', {
    singleton: true,
    icon: 'train',
    fields: [helpers.textarea('title', { required: true })],
  }),

  collection('fleet_park_cards', {
    icon: 'train',
    primaryKey: 'string',
    fields: [
      helpers.input('value', { required: true }),
      helpers.input('label', { required: true }),
      helpers.input('badge', { required: true }),
    ],
  }),

  collection('fleet_models', {
    icon: 'train',
    primaryKey: 'string',
    fields: [
      helpers.dropdown('variant', ['default', 'reserve'], { required: true }),
      helpers.input('badge', { required: true }),
      helpers.input('title', { required: true }),
      helpers.textarea('description', { required: true }),
      helpers.image('image'),
      helpers.input('image_alt'),
      helpers.json('specs'),
    ],
  }),

  collection('cta_blocks', {
    icon: 'campaign',
    primaryKey: 'string',
    fields: [
      helpers.textarea('title', { required: true }),
      helpers.textarea('subtitle', { required: true }),
    ],
  }),

  collection('about_page_hero', {
    singleton: true,
    icon: 'image',
    fields: [helpers.image('image'), helpers.input('image_position')],
  }),

  collection('services_page_hero', {
    singleton: true,
    icon: 'image',
    fields: [helpers.image('image'), helpers.input('image_position')],
  }),

  collection('contacts_page_hero', {
    singleton: true,
    icon: 'image',
    fields: [helpers.image('image'), helpers.input('image_position')],
  }),

  collection('contract_contacts_section', {
    singleton: true,
    icon: 'contact_mail',
    fields: [helpers.input('title', { required: true }), helpers.image('background')],
  }),

  collection('contract_contacts_cards', {
    icon: 'contact_mail',
    primaryKey: 'string',
    fields: [
      helpers.input('name', { required: true }),
      helpers.json('role_lines'),
      helpers.input('phone', { required: true }),
      helpers.input('phone_href', { required: true }),
      helpers.input('email', { required: true }),
      helpers.image('photo'),
    ],
  }),

  collection('operations_contacts_section', {
    singleton: true,
    icon: 'support_agent',
    fields: [
      helpers.input('dispatchers_title', { required: true }),
      helpers.textarea('dispatchers_subtitle', { required: true }),
      helpers.input('territories_title', { required: true }),
    ],
  }),

  collection('operations_dispatchers', {
    icon: 'headset',
    primaryKey: 'string',
    fields: [
      helpers.input('title', { required: true }),
      helpers.input('phone', { required: true }),
      helpers.input('phone_href', { required: true }),
      helpers.input('badge', { required: true }),
    ],
  }),

  collection('operations_territories', {
    icon: 'location_on',
    primaryKey: 'string',
    fields: [
      helpers.input('city', { required: true }),
      helpers.input('phone', { required: true }),
      helpers.input('phone_href', { required: true }),
    ],
  }),

  collection('privacy_page', {
    singleton: true,
    icon: 'policy',
    fields: [helpers.textarea('intro', { required: true })],
  }),

  collection('privacy_sections', {
    icon: 'policy',
    primaryKey: 'string',
    fields: [
      helpers.input('title', { required: true }),
      helpers.json('blocks'),
    ],
  }),

  collection('submissions', {
    icon: 'inbox',
    fields: [
      helpers.input('name', { required: true }),
      helpers.input('phone', { required: true }),
      helpers.input('email'),
      helpers.input('company'),
      helpers.input('wagon_type'),
      helpers.input('direction_from'),
      helpers.input('direction_to'),
      helpers.textarea('comment'),
      helpers.dropdown('status', ['new', 'processed', 'archived'], { default: 'new' }),
    ],
  }),
];

async function createCollection(token, collection) {
  const { pkField, fields, ...collectionPayload } = collection;

  const payload = {
    ...collectionPayload,
    fields: [pkField],
  };

  try {
    await request('/collections', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify(payload),
    });
    console.log(`✅ Коллекция создана: ${collection.collection}`);
  } catch (error) {
    if (error.message.includes('already exists') || error.message.includes('Duplicate')) {
      console.log(`⚠️ Коллекция уже существует: ${collection.collection}`);
    } else {
      throw error;
    }
  }
}

async function createField(token, collectionName, field) {
  try {
    await request(`/fields/${collectionName}`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify(field),
    });
    console.log(`  ✅ Поле создано: ${collectionName}.${field.field}`);
  } catch (error) {
    if (error.message.includes('already exists') || error.message.includes('Duplicate')) {
      console.log(`  ⚠️ Поле уже существует: ${collectionName}.${field.field}`);
    } else {
      console.error(`  ❌ Ошибка создания поля ${collectionName}.${field.field}:`, error.message);
    }
  }
}

async function main() {
  console.log(`Подключение к ${DIRECTUS_URL}...`);
  const token = await login();
  console.log('Авторизация успешна\n');

  for (const col of collections) {
    await createCollection(token, col);
    for (const f of col.fields) {
      await createField(token, col.collection, f);
    }
  }

  console.log('\nГотово. Перезагрузи страницу админки, чтобы увидеть коллекции.');
}

main().catch(error => {
  console.error('Ошибка:', error.message);
  process.exit(1);
});
