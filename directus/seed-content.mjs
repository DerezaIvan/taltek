#!/usr/bin/env node

/**
 * Скрипт для заполнения Directus текущим контентом из constants.
 * Запускать после seed-schema.mjs.
 *
 *   DIRECTUS_URL=http://localhost:8055 \
 *   DIRECTUS_ADMIN_EMAIL=admin@example.com \
 *   DIRECTUS_ADMIN_PASSWORD=directus \
 *   node directus/seed-content.mjs
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

async function clearCollection(token, collection) {
  try {
    const list = await request(`/items/${collection}?limit=-1`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const ids = list?.data?.map(item => item.id) ?? [];
    if (!ids.length) return;

    for (const id of ids) {
      await request(`/items/${collection}/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
    }
    console.log(`  🗑️  Очищено записей: ${ids.length}`);
  } catch (error) {
    console.log(`  ⚠️  Не удалось очистить: ${error.message}`);
  }
}

async function createItem(token, collection, payload) {
  return request(`/items/${collection}`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(payload),
  });
}

async function createSingleton(token, collection, payload) {
  try {
    await request(`/items/${collection}`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify(payload),
    });
  } catch {
    await createItem(token, collection, payload);
  }
}

const content = {
  site_settings: {
    site_name: 'Taltek',
    site_url: 'https://taltektrans.pro/',
    hotline_phone_display: '8 800 533 9 888',
    hotline_phone_href: 'tel:+78005339888',
    main_address: '125047, Россия, г. Москва, Дукат Плейс 3, Гашека 6, офис 1210',
    contact_emails: [
      { label: 'zayavka@taltektrans.pro', href: 'mailto:zayavka@taltektrans.pro' },
      { label: 'info@taltektrans.pro', href: 'mailto:info@taltektrans.pro' },
    ],
  },

  navigation_items: [
    { label: 'Главная', href: '/', sort: 1, status: 'published' },
    { label: 'О компании', href: '/about/', sort: 2, status: 'published' },
    { label: 'Услуги и подвижной состав', href: '/services/', sort: 3, status: 'published' },
    { label: 'Контакты', href: '/contacts/', sort: 4, status: 'published' },
  ],

  pages: [
    {
      slug: 'home',
      title: 'АО «ТалТЭК Транс» — железнодорожные грузоперевозки по России',
      description:
        'Перевозка грузов железнодорожным транспортом. Собственный парк вагонов, грузоотправки по всей России, полный спектр логистических услуг.',
      status: 'published',
      sort: 1,
    },
    {
      slug: 'about',
      title: 'О компании — АО «ТалТЭК Транс»',
      description:
        'Узнайте больше о компании ТалТЭК Транс: миссия, преимущества, собственный парк вагонов и география железнодорожных перевозок.',
      status: 'published',
      sort: 2,
    },
    {
      slug: 'services',
      title: 'Услуги и подвижной состав — АО «ТалТЭК Транс»',
      description:
        'Железнодорожные перевозки, аренда и подача вагонов, диспетчерское сопровождение и расчёт тарифов от АО «ТалТЭК Транс».',
      status: 'published',
      sort: 3,
    },
    {
      slug: 'contacts',
      title: 'Контакты — АО «ТалТЭК Транс»',
      description:
        'Контактная информация АО «ТалТЭК Транс»: адрес главного офиса в Москве, телефон, email и реквизиты для связи.',
      status: 'published',
      sort: 4,
    },
    {
      slug: 'privacy',
      title: 'Политика конфиденциальности — АО «ТалТЭК Транс»',
      description: 'Политика конфиденциальности и обработки персональных данных АО «ТалТЭК Транс».',
      status: 'published',
      sort: 5,
    },
    {
      slug: 'notFound',
      title: 'Страница не найдена — АО «ТалТЭК Транс»',
      description:
        'Запрашиваемая страница не найдена. Вернитесь на главную или воспользуйтесь навигацией сайта.',
      status: 'published',
      sort: 6,
    },
  ],

  home_hero: {
    title: 'Мы не ждём лучших времён\nМы создаём их сами',
    subtitle:
      'АО «ТалТЭК Транс» — железнодорожный оператор с собственным парком более 16 000 вагонов и 16-летним опытом организации перевозок',
  },

  about_intro: [
    {
      title: 'АО «ТалТЭК Транс»',
      lead: 'Более 15 лет мы предлагаем комплексные транспортные решения и организуем перевозку грузов широкой номенклатуры в различных видах подвижного состава на внутрироссийских и экспортных направлениях.',
      paragraphs: [
        'Свои грузы нам доверяют крупнейшие компании угольной, металлургической, строительной, химической, пищевой, лесопромышленной и целлюлозно-бумажной отраслей, сельхозпроизводители и ведущие поставщики России и других стран.',
        'Мы гордимся тем, что помогаем нашим партнёрам расширять и укреплять своё дело и растём вместе с ними.',
        'Наша миссия - делать совместный бизнес во благо всех заинтересованных сторон.',
      ],
      image_alt: 'Вагон с логотипом ТалТЭК Транс на железнодорожных путях',
      sort: 1,
      status: 'published',
    },
  ],

  our_mission: {
    title: 'Наша миссия',
    subtitle: 'Делать совместный бизнес во благо всех заинтересованных сторон.',
    gallery: [
      '/images/our-mission-69.webp',
      '/images/our-mission-71.webp',
      '/images/our-mission-72.webp',
      '/images/our-mission-73.webp',
    ],
  },

  key_services: [
    {
      id: 'wagon-supply',
      title: 'Подбор и подача вагонов под погрузку',
      description:
        'Подбор подвижного состава под нужды заказчика и взаимодействие с владельцами путей общего и необщего пользования по подаче и уборке вагонов.',
      sort: 1,
      status: 'published',
    },
    {
      id: 'tariff-payment',
      title: 'Расчёт, оформление и оплата железнодорожного тарифа и сборов',
      description: 'Платёжно-финансовые услуги.',
      sort: 2,
      status: 'published',
    },
    {
      id: 'dispatch-support',
      title: 'Диспетчерское сопровождение на всех этапах перевозки',
      description: 'Контроль и сопровождение груза на всём пути следования.',
      sort: 3,
      status: 'published',
    },
  ],

  delivery_section: {
    title: 'ДОСТАВИМ ВАШ ГРУЗ ПО ВСЕЙ СЕТИ ЖЕЛЕЗНОДОРОЖНОЙ КОЛЕИ 1520 ММ НАДЁЖНО И В СРОК',
  },

  delivery_steps: [
    {
      step_id: '01',
      title: 'Разработаем маршрут и логистическую схему',
      description:
        'с учётом характеристик груза, требований по срокам, регионам отправления и прибытия.',
      sort: 1,
      status: 'published',
    },
    {
      step_id: '02',
      title: 'Предоставим вагон под погрузку',
      description: 'на всём пространстве 1520.',
      sort: 2,
      status: 'published',
    },
    {
      step_id: '03',
      title: 'Проведём погрузочно-разгрузочные работы',
      description: 'с соблюдением регламентов.',
      sort: 3,
      status: 'published',
    },
    {
      step_id: '04',
      title: 'Оформим и организуем оплату',
      description: 'транспортных и разрешительных документов.',
      sort: 4,
      status: 'published',
    },
    {
      step_id: '05',
      title: 'Проконтролируем груз в пути',
      description: 'отследим движение вагона и оповестим Вас о местонахождении груза.',
      sort: 5,
      status: 'published',
    },
  ],

  why_us_items: [
    {
      id: 'own-fleet',
      title: 'Собственный парк',
      description: 'Грузовые вагоны различной модификации в управлении.',
      sort: 1,
      status: 'published',
    },
    {
      id: 'geography',
      title: 'Широкая география',
      description: 'Логистика на всём пространстве колеи 1520.',
      sort: 2,
      status: 'published',
    },
    {
      id: 'automation',
      title: 'Автоматизация процессов',
      description: 'Обширный инструментарий планирования и оптимизации логистических цепей.',
      sort: 3,
      status: 'published',
    },
    {
      id: 'speed',
      title: 'Скорость решений',
      description: 'Быстрый отклик на запросы и потребности заказчика.',
      sort: 4,
      status: 'published',
    },
    {
      id: 'competencies',
      title: 'Профессиональные компетенции',
      description: '15+ лет на рынке транспортно-логистических услуг.',
      sort: 5,
      status: 'published',
    },
    {
      id: 'team',
      title: 'Команда единомышленников',
      description: '100+ профессионалов своего дела.',
      sort: 6,
      status: 'published',
    },
  ],

  what_you_get_items: [
    { id: 'reliability', title: 'Надёжность перевозки', sort: 1, status: 'published' },
    {
      id: 'route-planning',
      title: 'Эффективное планирование маршрутов',
      sort: 2,
      status: 'published',
    },
    {
      id: 'support',
      title: 'Квалифицированная техническая поддержка',
      sort: 3,
      status: 'published',
    },
    { id: 'deal-speed', title: 'Оперативность сделки', sort: 4, status: 'published' },
    {
      id: 'fleet-selection',
      title: 'Высокая скорость подбора подвижного состава',
      sort: 5,
      status: 'published',
    },
    { id: 'rates', title: 'Оптимальный расчёт ставок', sort: 6, status: 'published' },
  ],

  stats_items: [
    {
      id: 'fleet',
      label: 'Общий парк',
      value: '16 000',
      description: 'вагонов в управлении',
      sort: 1,
      status: 'published',
    },
    {
      id: 'turnover',
      label: 'Грузооборот',
      value: '200 МЛН+',
      description: 'тонно-км с 2010 года',
      sort: 2,
      status: 'published',
    },
    {
      id: 'shipments',
      label: 'Вагоноотправки',
      value: '160 000+',
      description: 'ежегодно',
      sort: 3,
      status: 'published',
    },
    {
      id: 'experience',
      label: 'Опыт работы',
      value: '15+ ЛЕТ',
      description: 'на рынке железнодорожной логистики',
      sort: 4,
      status: 'published',
    },
    {
      id: 'team',
      label: 'Команда',
      value: '100+',
      description: 'специалистов',
      sort: 5,
      status: 'published',
    },
    {
      id: 'geography',
      label: 'Представительства',
      value: '6',
      description: 'Москва, Санкт-Петербург, Новосибирск, Иркутск, Бийск, Новокузнецк',
      sort: 6,
      status: 'published',
    },
  ],

  fleet_park_section: {
    title: 'Наш собственный парк —\nгарантия сохранности Вашего груза',
  },

  fleet_park_cards: [
    {
      id: 'gondola',
      value: '13 000',
      label: 'Полувагоны разной модификации',
      badge: '45% — инновационная модель 12-2159',
      sort: 1,
      status: 'published',
    },
    {
      id: 'covered',
      value: '3 200',
      label: 'Крытые вагоны',
      badge: 'большекубовых вагонов 11-2163',
      sort: 2,
      status: 'published',
    },
  ],

  fleet_models: [
    {
      id: '12-2159',
      variant: 'default',
      badge: 'Полувагон',
      title: 'Модель 12-2159',
      description: 'Высокая эффективность тяжеловесных перевозок, в том числе на длинных плечах.',
      image_alt: 'Полувагон модель 12-2159',
      specs: [
        { label: 'Грузоподъёмность', value: 'до 75 т' },
        { label: 'Объём кузова', value: '~94 м³' },
        { label: 'Количество', value: 'уточняется' },
        { label: 'Год выпуска', value: '2025/2026' },
      ],
      sort: 1,
      status: 'published',
    },
    {
      id: '12-2153',
      variant: 'default',
      badge: 'Полувагон',
      title: 'Модель 12-2153',
      description: 'Оптимальное решение для массовых перевозок грузов.',
      image_alt: 'Полувагон модель 12-2153',
      specs: [
        { label: 'Грузоподъёмность', value: 'до 70 т' },
        { label: 'Объём кузова', value: 'до 88 м³' },
        { label: 'Количество', value: 'уточняется' },
        { label: 'Год выпуска', value: '2022-2025' },
      ],
      sort: 2,
      status: 'published',
    },
    {
      id: '11-2163',
      variant: 'default',
      badge: 'Крытый вагон',
      title: 'Модель 11-2163',
      description: 'Надежная перевозка тарно-штучных и пакетированных грузов в больших объемах.',
      image_alt: 'Крытый вагон модель 11-2163',
      specs: [
        { label: 'Грузоподъёмность', value: 'до 68 т' },
        { label: 'Объём кузова', value: 'до 161 м³' },
        { label: 'Количество', value: 'уточняется' },
        { label: 'Год выпуска', value: '2025/2026' },
      ],
      sort: 3,
      status: 'published',
    },
  ],

  cta_blocks: [
    {
      id: 'home',
      title: 'Нужно перевезти груз по железной дороге?',
      subtitle: 'Оставьте запрос - подберём подвижной состав и рассчитаем решение под Вашу задачу.',
      status: 'published',
    },
    {
      id: 'about',
      title: 'Хотите узнать о парке и условиях?',
      subtitle: 'Расскажем про подвижной состав и подберём решение под Ваш груз.',
      status: 'published',
    },
    {
      id: 'services',
      title: 'Подберём вагоны под Ваш груз',
      subtitle: 'Укажите тип груза и направление — рассчитаем решение.',
      status: 'published',
    },
  ],

  about_page_hero: {
    image_position: '72% 38%',
  },

  services_page_hero: {
    image_position: '72% 38%',
  },

  contacts_page_hero: {
    image_position: '72% 38%',
  },

  contract_contacts_section: {
    title: 'Заключить контракт на оказание услуг',
  },

  contract_contacts_cards: [
    {
      id: 'igor-barbitsky',
      name: 'Игорь Барбицкий',
      role_lines: ['Руководитель департамента по перевозкам', 'в полувагонах'],
      phone: '8 800 533 9 888 доб. 204',
      phone_href: 'tel:+78005339888,204',
      email: 'i.barbitsky@taltektrans.pro',
      sort: 1,
      status: 'published',
    },
    {
      id: 'anastasia-afanasyeva',
      name: 'Анастасия Афанасьева',
      role_lines: ['Руководитель департамента по перевозкам', 'в крытых вагонах'],
      phone: '8 800 533 9 888 доб. 206',
      phone_href: 'tel:+78005339888,206',
      email: 'a.afanaseva@taltektrans.pro',
      sort: 2,
      status: 'published',
    },
    {
      id: 'oleg-netsvetaylo',
      name: 'Олег Нецветайло',
      role_lines: ['Руководитель департамента по перевозкам', 'в зерновозах'],
      phone: '8 800 533 9 888 доб. 220',
      phone_href: 'tel:+78005339888,220',
      email: 'o.netsvetaylo@taltektrans.pro',
      sort: 3,
      status: 'published',
    },
  ],

  operations_contacts_section: {
    dispatchers_title: 'Диспетчеры по направлениям',
    dispatchers_subtitle:
      'Сопровождают перевозку в реальном времени:\nстатус и местонахождение вагонов, сроки прибытия груза.',
    territories_title: 'Наши территории',
  },

  operations_dispatchers: [
    {
      id: 'gondola',
      title: 'Полувагоны',
      phone: '8 800 533 9 888 доб. 101',
      phone_href: 'tel:+78005339888,101',
      badge: 'Круглосуточно',
      sort: 1,
      status: 'published',
    },
    {
      id: 'covered-grain',
      title: 'Крытые вагоны',
      phone: '8 800 533 9 888 доб. 102',
      phone_href: 'tel:+78005339888,102',
      badge: 'Режим работы: 08:00 – 20:00 (по МСК)',
      sort: 2,
      status: 'published',
    },
  ],

  operations_territories: [
    {
      id: 'moscow',
      city: 'Москва',
      phone: '+7 (495) 900 10 95',
      phone_href: 'tel:+74959001095',
      sort: 1,
      status: 'published',
    },
    {
      id: 'saint-petersburg',
      city: 'Санкт-Петербург',
      phone: '+7 (812) 602 14 75',
      phone_href: 'tel:+78126021475',
      sort: 2,
      status: 'published',
    },
    {
      id: 'novokuznetsk',
      city: 'Новокузнецк',
      phone: '+7 (384) 399 34 81',
      phone_href: 'tel:+73843993481',
      sort: 3,
      status: 'published',
    },
    {
      id: 'irkutsk',
      city: 'Иркутск',
      phone: '+7 (908) 661 17 71',
      phone_href: 'tel:+79086611771',
      sort: 4,
      status: 'published',
    },
    {
      id: 'biysk',
      city: 'Бийск',
      phone: '+7 (906) 926 80 09',
      phone_href: 'tel:+79069268009',
      sort: 5,
      status: 'published',
    },
    {
      id: 'novosibirsk',
      city: 'Новосибирск',
      phone: '+7 (931) 543 37 10',
      phone_href: 'tel:+79315433710',
      sort: 6,
      status: 'published',
    },
  ],

  privacy_page: {
    intro:
      'Акционерное общество «ТалТЭК Транс» (далее — «Компания», «Оператор») уважает право каждого пользователя на неприкосновенность частной жизни и обеспечивает защиту персональных данных в соответствии с Федеральным законом Российской Федерации №152-ФЗ «О персональных данных», а также иными нормативными правовыми актами Российской Федерации.\n\nНастоящая Политика определяет порядок обработки персональных данных пользователей сайта Компании.',
  },

  privacy_sections: [
    {
      id: 'general',
      title: '1. Общие положения',
      blocks: [
        {
          type: 'paragraph',
          text: '1.1. Использование сайта означает согласие пользователя с настоящей Политикой.',
        },
        {
          type: 'paragraph',
          text: '1.2. Если пользователь не согласен с условиями настоящей Политики, он должен прекратить использование сайта.',
        },
        {
          type: 'paragraph',
          text: '1.3. Настоящая Политика применяется исключительно к официальному сайту Компании и не распространяется на сайты третьих лиц, ссылки на которые могут размещаться на сайте.',
        },
      ],
      sort: 1,
      status: 'published',
    },
    {
      id: 'operator',
      title: '2. Оператор персональных данных',
      blocks: [
        { type: 'paragraph', text: 'Оператором персональных данных является:' },
        { type: 'paragraph', text: 'Акционерное общество «ТалТЭК Транс»' },
        {
          type: 'paragraph',
          text: 'Контактные данные указываются в разделе «Контакты» официального сайта.',
        },
      ],
      sort: 2,
      status: 'published',
    },
    {
      id: 'data',
      title: '3. Какие персональные данные обрабатываются',
      blocks: [
        {
          type: 'paragraph',
          text: 'Компания может обрабатывать следующие категории персональных данных:',
        },
        {
          type: 'list',
          items: [
            'фамилия, имя, отчество;',
            'контактный телефон;',
            'адрес электронной почты;',
            'наименование организации;',
            'должность;',
            'сведения, содержащиеся в обращениях пользователя;',
            'IP-адрес;',
            'сведения о браузере, устройстве и операционной системе;',
            'файлы cookie;',
            'информация о действиях пользователя на сайте;',
            'иные сведения, добровольно предоставленные пользователем через формы обратной связи.',
          ],
        },
        {
          type: 'paragraph',
          text: 'Компания не осуществляет обработку специальных категорий персональных данных, если иное не предусмотрено законодательством Российской Федерации.',
        },
      ],
      sort: 3,
      status: 'published',
    },
    {
      id: 'purposes',
      title: '4. Цели обработки персональных данных',
      blocks: [
        {
          type: 'paragraph',
          text: 'Персональные данные обрабатываются исключительно для следующих целей:',
        },
        {
          type: 'list',
          items: [
            'рассмотрение обращений пользователей;',
            'предоставление информации о транспортно-логистических услугах Компании;',
            'подготовка коммерческих предложений;',
            'организация взаимодействия с потенциальными и действующими клиентами;',
            'заключение и исполнение договоров;',
            'обработка запросов соискателей;',
            'повышение качества работы сайта;',
            'обеспечение безопасности сайта;',
            'выполнение требований законодательства Российской Федерации.',
          ],
        },
      ],
      sort: 4,
      status: 'published',
    },
    {
      id: 'legal-basis',
      title: '5. Правовые основания обработки',
      blocks: [
        { type: 'paragraph', text: 'Обработка персональных данных осуществляется на основании:' },
        {
          type: 'list',
          items: [
            'согласия субъекта персональных данных;',
            'заключения и исполнения договоров;',
            'исполнения обязанностей, предусмотренных законодательством Российской Федерации;',
            'законных интересов Компании, не нарушающих права и свободы субъектов персональных данных.',
          ],
        },
      ],
      sort: 5,
      status: 'published',
    },
    {
      id: 'processing',
      title: '6. Порядок обработки персональных данных',
      blocks: [
        {
          type: 'paragraph',
          text: 'Компания осуществляет обработку персональных данных с использованием средств автоматизации и без использования таких средств.',
        },
        { type: 'paragraph', text: 'При обработке персональных данных Компания обеспечивает их:' },
        {
          type: 'list',
          items: [
            'законность;',
            'конфиденциальность;',
            'актуальность;',
            'доступность;',
            'защиту от неправомерного доступа, изменения, распространения, уничтожения и иных неправомерных действий.',
          ],
        },
      ],
      sort: 6,
      status: 'published',
    },
    {
      id: 'transfer',
      title: '7. Передача персональных данных третьим лицам',
      blocks: [
        {
          type: 'paragraph',
          text: 'Компания не передает персональные данные третьим лицам, за исключением случаев:',
        },
        {
          type: 'list',
          items: [
            'когда это необходимо для исполнения договора;',
            'когда передача предусмотрена законодательством Российской Федерации;',
            'при наличии согласия субъекта персональных данных;',
            'при привлечении организаций, оказывающих услуги по сопровождению информационных систем, хостинга, технической поддержки или иных услуг, необходимых для функционирования сайта, при условии соблюдения требований законодательства о защите персональных данных.',
          ],
        },
      ],
      sort: 7,
      status: 'published',
    },
    {
      id: 'cookies',
      title: '8. Использование файлов Cookie',
      blocks: [
        {
          type: 'paragraph',
          text: 'Сайт может использовать файлы cookie и аналогичные технологии для:',
        },
        {
          type: 'list',
          items: [
            'обеспечения корректной работы сайта;',
            'анализа посещаемости;',
            'улучшения пользовательского опыта;',
            'повышения безопасности.',
          ],
        },
        {
          type: 'paragraph',
          text: 'Пользователь может самостоятельно изменить настройки использования cookie в своем браузере.',
        },
      ],
      sort: 8,
      status: 'published',
    },
    {
      id: 'retention',
      title: '9. Срок хранения персональных данных',
      blocks: [
        {
          type: 'paragraph',
          text: 'Персональные данные хранятся не дольше, чем этого требуют цели обработки либо законодательство Российской Федерации.',
        },
        {
          type: 'paragraph',
          text: 'По достижении целей обработки персональные данные уничтожаются либо обезличиваются, если иное не предусмотрено законодательством.',
        },
      ],
      sort: 9,
      status: 'published',
    },
    {
      id: 'rights',
      title: '10. Права субъекта персональных данных',
      blocks: [
        { type: 'paragraph', text: 'Пользователь вправе:' },
        {
          type: 'list',
          items: [
            'получать сведения об обработке своих персональных данных;',
            'требовать уточнения, блокирования или уничтожения персональных данных;',
            'отзывать согласие на обработку персональных данных;',
            'обжаловать действия Оператора в уполномоченные органы или суд;',
            'пользоваться иными правами, предусмотренными законодательством Российской Федерации.',
          ],
        },
      ],
      sort: 10,
      status: 'published',
    },
    {
      id: 'security',
      title: '11. Меры по защите персональных данных',
      blocks: [
        {
          type: 'paragraph',
          text: 'Компания принимает необходимые организационные и технические меры по защите персональных данных, включая:',
        },
        {
          type: 'list',
          items: [
            'ограничение доступа к персональным данным;',
            'использование средств защиты информации;',
            'применение антивирусной защиты;',
            'резервное копирование данных;',
            'контроль доступа к информационным системам;',
            'проведение внутренних мероприятий по обеспечению безопасности персональных данных.',
          ],
        },
      ],
      sort: 11,
      status: 'published',
    },
    {
      id: 'changes',
      title: '12. Изменение Политики',
      blocks: [
        { type: 'paragraph', text: 'Компания вправе вносить изменения в настоящую Политику.' },
        {
          type: 'paragraph',
          text: 'Актуальная редакция Политики всегда размещается на официальном сайте Компании.',
        },
      ],
      sort: 12,
      status: 'published',
    },
    {
      id: 'contacts',
      title: '13. Контактная информация',
      blocks: [
        {
          type: 'paragraph',
          text: 'По вопросам обработки персональных данных пользователь может обратиться в Компанию посредством контактных данных, размещенных на официальном сайте.',
        },
        {
          type: 'paragraph',
          text: 'Дата вступления Политики в силу определяется датой ее опубликования на сайте.',
        },
      ],
      sort: 13,
      status: 'published',
    },
  ],
};

async function seedSingleton(token, collection, payload) {
  console.log(`\n📦 ${collection}`);
  await createSingleton(token, collection, { id: 1, ...payload, status: 'published' });
}

async function seedList(token, collection, items) {
  console.log(`\n📦 ${collection} (${items.length} записей)`);
  await clearCollection(token, collection);
  for (const item of items) {
    await createItem(token, collection, item);
  }
}

async function main() {
  console.log(`Подключение к ${DIRECTUS_URL}...`);
  const token = await login();
  console.log('Авторизация успешна\n');

  await seedSingleton(token, 'site_settings', content.site_settings);
  await seedList(token, 'navigation_items', content.navigation_items);
  await seedList(token, 'pages', content.pages);
  await seedSingleton(token, 'home_hero', content.home_hero);
  await seedList(token, 'about_intro', content.about_intro);
  await seedSingleton(token, 'our_mission', content.our_mission);
  await seedList(token, 'key_services', content.key_services);
  await seedSingleton(token, 'delivery_section', content.delivery_section);
  await seedList(token, 'delivery_steps', content.delivery_steps);
  await seedList(token, 'why_us_items', content.why_us_items);
  await seedList(token, 'what_you_get_items', content.what_you_get_items);
  await seedList(token, 'stats_items', content.stats_items);
  await seedSingleton(token, 'fleet_park_section', content.fleet_park_section);
  await seedList(token, 'fleet_park_cards', content.fleet_park_cards);
  await seedList(token, 'fleet_models', content.fleet_models);
  await seedList(token, 'cta_blocks', content.cta_blocks);
  await seedSingleton(token, 'about_page_hero', content.about_page_hero);
  await seedSingleton(token, 'services_page_hero', content.services_page_hero);
  await seedSingleton(token, 'contacts_page_hero', content.contacts_page_hero);
  await seedSingleton(token, 'contract_contacts_section', content.contract_contacts_section);
  await seedList(token, 'contract_contacts_cards', content.contract_contacts_cards);
  await seedSingleton(token, 'operations_contacts_section', content.operations_contacts_section);
  await seedList(token, 'operations_dispatchers', content.operations_dispatchers);
  await seedList(token, 'operations_territories', content.operations_territories);
  await seedSingleton(token, 'privacy_page', content.privacy_page);
  await seedList(token, 'privacy_sections', content.privacy_sections);

  console.log('\n✅ Готово. Все данные перенесены в Directus.');
  console.log('Перезагрузи админку, чтобы увидеть заполненные коллекции.');
}

main().catch(error => {
  console.error('Ошибка:', error.message);
  process.exit(1);
});
