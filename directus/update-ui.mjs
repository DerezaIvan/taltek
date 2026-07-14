#!/usr/bin/env node

/**
 * Скрипт для обновления отображаемых названий, иконок и подсказок
 * в Directus, чтобы коллекции и поля были понятны заказчику.
 *
 * Запуск:
 *   DIRECTUS_URL=http://localhost:8055 \
 *   DIRECTUS_ADMIN_EMAIL=admin@example.com \
 *   DIRECTUS_ADMIN_PASSWORD=directus \
 *   node directus/update-ui.mjs
 */

const DIRECTUS_URL = (process.env.DIRECTUS_URL || 'http://localhost:8055').replace(/\/$/, '');
const ADMIN_EMAIL = process.env.DIRECTUS_ADMIN_EMAIL || 'admin@example.com';
const ADMIN_PASSWORD = process.env.DIRECTUS_ADMIN_PASSWORD || 'directus';

const RU = { language: 'ru-RU', translation: '' };

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

function tr(text) {
  return [{ ...RU, translation: text }];
}

const uiConfig = [
  {
    collection: 'site_settings',
    meta: {
      icon: 'settings',
      note: 'Глобальные настройки сайта: название, логотип, телефон, адрес.',
      translations: tr('Настройки сайта'),
    },
    fields: {
      site_name: {
        note: 'Название сайта во вкладке браузера и SEO',
        translations: tr('Название сайта'),
      },
      site_url: {
        note: 'Основной URL сайта, например https://taltektrans.pro/',
        translations: tr('URL сайта'),
      },
      logo: { note: 'Логотип в шапке и футере', translations: tr('Логотип') },
      hotline_phone_display: {
        note: 'Телефон как он отображается',
        translations: tr('Телефон горячей линии'),
      },
      hotline_phone_href: {
        note: 'Ссылка для звонка, например tel:+78005339888',
        translations: tr('Ссылка на звонок'),
      },
      main_address: { note: 'Адрес главного офиса', translations: tr('Адрес офиса') },
      contact_emails: {
        note: 'JSON-массив email-ов [{ label, href }]',
        translations: tr('Контактные email'),
      },
    },
  },
  {
    collection: 'navigation_items',
    meta: {
      icon: 'list',
      note: 'Пункты верхнего меню сайта.',
      translations: tr('Меню навигации'),
      display_template: '{{label}}',
    },
    fields: {
      label: { note: 'Текст ссылки в меню', translations: tr('Название ссылки') },
      href: { note: 'Адрес страницы, например /about/', translations: tr('Ссылка') },
      sort: { note: 'Порядок в меню', translations: tr('Порядок') },
      status: { note: 'published — видно, draft — скрыто', translations: tr('Статус') },
    },
  },
  {
    collection: 'pages',
    meta: {
      icon: 'article',
      note: 'SEO-настройки страниц: title, description, hero.',
      translations: tr('Страницы и SEO'),
      display_template: '{{slug}} — {{title}}',
    },
    fields: {
      slug: {
        note: 'Идентификатор страницы: home, about, services, contacts, privacy, not_found',
        translations: tr('Код страницы'),
      },
      title: { note: 'Заголовок вкладки и SEO', translations: tr('SEO-заголовок') },
      description: { note: 'Описание для поисковиков', translations: tr('SEO-описание') },
      og_image: { note: 'Картинка для соцсетей', translations: tr('OG-изображение') },
      hero_title: {
        note: 'Заголовок Hero-секции (если используется)',
        translations: tr('Заголовок Hero'),
      },
      hero_subtitle: { note: 'Подзаголовок Hero-секции', translations: tr('Подзаголовок Hero') },
      status: { note: 'published — страница доступна, draft — нет', translations: tr('Статус') },
      sort: { note: 'Порядок (не влияет на сайт)', translations: tr('Порядок') },
    },
  },
  {
    collection: 'home_hero',
    meta: {
      icon: 'home',
      note: 'Первый экран главной страницы.',
      translations: tr('Главная — Hero'),
    },
    fields: {
      title: { note: 'Главный заголовок на первом экране', translations: tr('Заголовок') },
      subtitle: { note: 'Текст под заголовком', translations: tr('Подзаголовок') },
      background: { note: 'Фоновое изображение первого экрана', translations: tr('Фон') },
    },
  },
  {
    collection: 'about_intro',
    meta: {
      icon: 'info',
      note: 'Блок «О компании» с текстом и изображением.',
      translations: tr('О компании — вступление'),
      display_template: '{{title}}',
    },
    fields: {
      title: { note: 'Заголовок блока', translations: tr('Заголовок') },
      lead: { note: 'Вступительный абзац', translations: tr('Лид') },
      paragraphs: { note: 'JSON-массив абзацев текста', translations: tr('Абзацы') },
      image: { note: 'Изображение в блоке', translations: tr('Изображение') },
      image_alt: { note: 'Описание изображения', translations: tr('Alt изображения') },
    },
  },
  {
    collection: 'our_mission',
    meta: {
      icon: 'target',
      note: 'Блок «Наша миссия» с галереей.',
      translations: tr('Наша миссия'),
    },
    fields: {
      title: { note: 'Заголовок миссии', translations: tr('Заголовок') },
      subtitle: { note: 'Подзаголовок миссии', translations: tr('Подзаголовок') },
      gallery: { note: 'Галерея изображений', translations: tr('Галерея') },
    },
  },
  {
    collection: 'key_services',
    meta: {
      icon: 'star',
      note: 'Три ключевые услуги на главной.',
      translations: tr('Ключевые услуги'),
      display_template: '{{title}}',
    },
    fields: {
      id: { note: 'Код услуги (латиницей), например wagon-supply', translations: tr('Код') },
      title: { note: 'Название услуги', translations: tr('Название') },
      description: { note: 'Краткое описание', translations: tr('Описание') },
    },
  },
  {
    collection: 'delivery_section',
    meta: {
      icon: 'local_shipping',
      note: 'Заголовок блока доставки на главной.',
      translations: tr('Доставка — заголовок'),
    },
    fields: {
      title: { note: 'Заголовок блока доставки', translations: tr('Заголовок') },
    },
  },
  {
    collection: 'delivery_steps',
    meta: {
      icon: 'format_list_numbered',
      note: 'Шаги доставки (01–05).',
      translations: tr('Доставка — шаги'),
      display_template: '{{step_id}}. {{title}}',
    },
    fields: {
      step_id: { note: 'Номер шага: 01, 02, 03, 04, 05', translations: tr('Номер шага') },
      title: { note: 'Заголовок шага', translations: tr('Заголовок') },
      description: { note: 'Описание шага', translations: tr('Описание') },
    },
  },
  {
    collection: 'why_us_items',
    meta: {
      icon: 'thumb_up',
      note: 'Блок «Почему мы» с преимуществами.',
      translations: tr('Почему мы'),
      display_template: '{{title}}',
    },
    fields: {
      id: { note: 'Код преимущества', translations: tr('Код') },
      title: { note: 'Заголовок преимущества', translations: tr('Название') },
      description: { note: 'Описание преимущества', translations: tr('Описание') },
    },
  },
  {
    collection: 'what_you_get_items',
    meta: {
      icon: 'check_circle',
      note: 'Блок «Что вы получаете».',
      translations: tr('Что вы получаете'),
      display_template: '{{title}}',
    },
    fields: {
      id: { note: 'Код пункта', translations: tr('Код') },
      title: { note: 'Название пункта', translations: tr('Название') },
    },
  },
  {
    collection: 'stats_items',
    meta: {
      icon: 'show_chart',
      note: 'Цифры «Талтэк в цифрах».',
      translations: tr('Цифры'),
      display_template: '{{label}} — {{value}}',
    },
    fields: {
      id: { note: 'Код цифры', translations: tr('Код') },
      label: { note: 'Название показателя', translations: tr('Показатель') },
      value: { note: 'Значение, например 16 000', translations: tr('Значение') },
      description: { note: 'Пояснение к значению', translations: tr('Пояснение') },
    },
  },
  {
    collection: 'fleet_park_section',
    meta: {
      icon: 'train',
      note: 'Заголовок блока парка вагонов.',
      translations: tr('Парк вагонов — заголовок'),
    },
    fields: {
      title: { note: 'Заголовок блока', translations: tr('Заголовок') },
    },
  },
  {
    collection: 'fleet_park_cards',
    meta: {
      icon: 'train',
      note: 'Карточки с цифрами парка вагонов.',
      translations: tr('Парк вагонов — карточки'),
      display_template: '{{label}}',
    },
    fields: {
      id: { note: 'Код карточки', translations: tr('Код') },
      value: { note: 'Значение, например 13 000', translations: tr('Значение') },
      label: { note: 'Подпись', translations: tr('Подпись') },
      badge: { note: 'Дополнительная метка', translations: tr('Метка') },
    },
  },
  {
    collection: 'fleet_models',
    meta: {
      icon: 'train',
      note: 'Модели вагонов парка.',
      translations: tr('Модели вагонов'),
      display_template: '{{title}}',
    },
    fields: {
      id: { note: 'Код модели', translations: tr('Код') },
      variant: { note: 'default или reserve', translations: tr('Вариант') },
      badge: { note: 'Тип вагона: Полувагон, Крытый вагон и т.п.', translations: tr('Тип вагона') },
      title: { note: 'Название модели', translations: tr('Название') },
      description: { note: 'Описание модели', translations: tr('Описание') },
      image: { note: 'Изображение вагона', translations: tr('Изображение') },
      image_alt: { note: 'Описание изображения', translations: tr('Alt') },
      specs: {
        note: 'JSON-массив характеристик [{ label, value }]',
        translations: tr('Характеристики'),
      },
    },
  },
  {
    collection: 'cta_blocks',
    meta: {
      icon: 'campaign',
      note: 'CTA-блоки на главной, о компании и услугах.',
      translations: tr('Призывы к действию'),
      display_template: '{{id}} — {{title}}',
    },
    fields: {
      id: { note: 'Код блока: home, about, services', translations: tr('Код блока') },
      title: { note: 'Заголовок CTA', translations: tr('Заголовок') },
      subtitle: { note: 'Подзаголовок CTA', translations: tr('Подзаголовок') },
    },
  },
  {
    collection: 'about_page_hero',
    meta: {
      icon: 'image',
      note: 'Фоновое изображение на странице «О компании».',
      translations: tr('О компании — фон'),
    },
    fields: {
      image: { note: 'Фоновое изображение', translations: tr('Изображение') },
      image_position: { note: 'CSS позиция, например 72% 38%', translations: tr('Позиция фона') },
    },
  },
  {
    collection: 'services_page_hero',
    meta: {
      icon: 'image',
      note: 'Фоновое изображение на странице «Услуги».',
      translations: tr('Услуги — фон'),
    },
    fields: {
      image: { note: 'Фоновое изображение', translations: tr('Изображение') },
      image_position: { note: 'CSS позиция', translations: tr('Позиция фона') },
    },
  },
  {
    collection: 'contacts_page_hero',
    meta: {
      icon: 'image',
      note: 'Фоновое изображение на странице «Контакты».',
      translations: tr('Контакты — фон'),
    },
    fields: {
      image: { note: 'Фоновое изображение', translations: tr('Изображение') },
      image_position: { note: 'CSS позиция', translations: tr('Позиция фона') },
    },
  },
  {
    collection: 'contract_contacts_section',
    meta: {
      icon: 'contact_mail',
      note: 'Заголовок и фон блока «Заключить контракт».',
      translations: tr('Контракты — заголовок'),
    },
    fields: {
      title: { note: 'Заголовок блока', translations: tr('Заголовок') },
      background: { note: 'Фоновое изображение', translations: tr('Фон') },
    },
  },
  {
    collection: 'contract_contacts_cards',
    meta: {
      icon: 'contact_mail',
      note: 'Карточки контактных лиц для заключения договоров.',
      translations: tr('Контракты — контакты'),
      display_template: '{{name}}',
    },
    fields: {
      id: { note: 'Код карточки', translations: tr('Код') },
      name: { note: 'ФИО', translations: tr('Имя') },
      role_lines: { note: 'JSON-массив строк должности', translations: tr('Должность') },
      phone: { note: 'Телефон для отображения', translations: tr('Телефон') },
      phone_href: { note: 'Ссылка tel:', translations: tr('Ссылка на звонок') },
      email: { note: 'Email', translations: tr('Email') },
      photo: { note: 'Фотография', translations: tr('Фото') },
    },
  },
  {
    collection: 'operations_contacts_section',
    meta: {
      icon: 'support_agent',
      note: 'Заголовки блока операционных контактов.',
      translations: tr('Операционные контакты — заголовки'),
    },
    fields: {
      dispatchers_title: {
        note: 'Заголовок блока диспетчеров',
        translations: tr('Заголовок диспетчеров'),
      },
      dispatchers_subtitle: {
        note: 'Подзаголовок блока диспетчеров',
        translations: tr('Подзаголовок диспетчеров'),
      },
      territories_title: {
        note: 'Заголовок блока территорий',
        translations: tr('Заголовок территорий'),
      },
    },
  },
  {
    collection: 'operations_dispatchers',
    meta: {
      icon: 'headset',
      note: 'Карточки диспетчеров по направлениям.',
      translations: tr('Диспетчеры'),
      display_template: '{{title}}',
    },
    fields: {
      id: { note: 'Код направления', translations: tr('Код') },
      title: { note: 'Название направления', translations: tr('Направление') },
      phone: { note: 'Телефон', translations: tr('Телефон') },
      phone_href: { note: 'Ссылка tel:', translations: tr('Ссылка на звонок') },
      badge: { note: 'Режим работы', translations: tr('Режим работы') },
    },
  },
  {
    collection: 'operations_territories',
    meta: {
      icon: 'location_on',
      note: 'Территории и телефоны офисов.',
      translations: tr('Территории'),
      display_template: '{{city}}',
    },
    fields: {
      id: { note: 'Код города', translations: tr('Код') },
      city: { note: 'Город', translations: tr('Город') },
      phone: { note: 'Телефон', translations: tr('Телефон') },
      phone_href: { note: 'Ссылка tel:', translations: tr('Ссылка на звонок') },
    },
  },
  {
    collection: 'privacy_page',
    meta: {
      icon: 'policy',
      note: 'Вступление страницы политики конфиденциальности.',
      translations: tr('Политика — вступление'),
    },
    fields: {
      intro: { note: 'Вступительный текст', translations: tr('Вступление') },
    },
  },
  {
    collection: 'privacy_sections',
    meta: {
      icon: 'policy',
      note: 'Разделы страницы политики конфиденциальности.',
      translations: tr('Политика — разделы'),
      display_template: '{{title}}',
    },
    fields: {
      id: { note: 'Код раздела', translations: tr('Код') },
      title: { note: 'Заголовок раздела', translations: tr('Заголовок') },
      blocks: { note: 'JSON-массив блоков { type, text, items }', translations: tr('Блоки') },
    },
  },
  {
    collection: 'submissions',
    meta: {
      icon: 'inbox',
      note: 'Заявки из контактной формы.',
      translations: tr('Заявки'),
      display_template: '{{name}} — {{phone}}',
    },
    fields: {
      name: { note: 'Имя', translations: tr('Имя') },
      phone: { note: 'Телефон', translations: tr('Телефон') },
      email: { note: 'Email', translations: tr('Email') },
      company: { note: 'Компания', translations: tr('Компания') },
      wagon_type: { note: 'Тип вагона', translations: tr('Тип вагона') },
      direction_from: { note: 'Откуда', translations: tr('Откуда') },
      direction_to: { note: 'Куда', translations: tr('Куда') },
      comment: { note: 'Комментарий', translations: tr('Комментарий') },
      status: { note: 'new / processed / archived', translations: tr('Статус') },
    },
  },
];

async function updateCollection(token, config) {
  try {
    await request(`/collections/${config.collection}`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify({ meta: config.meta }),
    });
    console.log(`✅ Обновлена коллекция: ${config.collection}`);
  } catch (error) {
    console.error(`❌ Ошибка обновления коллекции ${config.collection}:`, error.message);
  }
}

async function updateField(token, collection, fieldName, meta) {
  try {
    await request(`/fields/${collection}/${fieldName}`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify({ meta }),
    });
    console.log(`  ✅ Обновлено поле: ${collection}.${fieldName}`);
  } catch (error) {
    console.error(`  ❌ Ошибка обновления поля ${collection}.${fieldName}:`, error.message);
  }
}

async function main() {
  console.log(`Подключение к ${DIRECTUS_URL}...`);
  const token = await login();
  console.log('Авторизация успешна\n');

  for (const config of uiConfig) {
    await updateCollection(token, config);
    if (config.fields) {
      for (const [fieldName, meta] of Object.entries(config.fields)) {
        await updateField(token, config.collection, fieldName, meta);
      }
    }
  }

  console.log('\nГотово. Перезагрузи страницу админки.');
}

main().catch(error => {
  console.error('Ошибка:', error.message);
  process.exit(1);
});
