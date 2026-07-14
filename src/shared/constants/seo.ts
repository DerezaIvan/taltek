const url = 'https://taltektrans.pro/';

export const OG_IMAGE_PATH = '/images/what-you-get.webp';
const ogImageUrl = `${url.replace(/\/$/, '')}${OG_IMAGE_PATH}`;

export const SITE_NAME = 'АО «ТалТЭК Транс»';

export const DEFAULT_SEO = {
  title: 'АО «ТалТЭК Транс» — железнодорожные грузоперевозки по России',
  description:
    'Перевозка грузов железнодорожным транспортом. Собственный парк вагонов, грузоотправки по всей России, полный спектр логистических услуг.',
  url,
  ogImage: ogImageUrl,
} as const;

export const JSON_LD_ORGANIZATION = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: SITE_NAME,
  url,
  description: DEFAULT_SEO.description,
} as const;

export const PAGE_SEO = {
  home: {
    title: DEFAULT_SEO.title,
    description: DEFAULT_SEO.description,
    path: '/',
  },
  about: {
    title: 'О компании — АО «ТалТЭК Транс»',
    description:
      'Узнайте больше о компании ТалТЭК Транс: миссия, преимущества, собственный парк вагонов и география железнодорожных перевозок.',
    path: '/about/',
  },
  services: {
    title: 'Услуги и подвижной состав — АО «ТалТЭК Транс»',
    description:
      'Железнодорожные перевозки, аренда и подача вагонов, диспетчерское сопровождение и расчёт тарифов от АО «ТалТЭК Транс».',
    path: '/services/',
  },
  contacts: {
    title: 'Контакты — АО «ТалТЭК Транс»',
    description:
      'Контактная информация АО «ТалТЭК Транс»: адрес главного офиса в Москве, телефон, email и реквизиты для связи.',
    path: '/contacts/',
  },
  privacy: {
    title: 'Политика конфиденциальности — АО «ТалТЭК Транс»',
    description: 'Политика конфиденциальности и обработки персональных данных АО «ТалТЭК Транс».',
    path: '/privacy/',
  },
  notFound: {
    title: 'Страница не найдена — АО «ТалТЭК Транс»',
    description:
      'Запрашиваемая страница не найдена. Вернитесь на главную или воспользуйтесь навигацией сайта.',
    path: '/404/',
  },
} as const;

export type PageSeoKey = keyof typeof PAGE_SEO;

export function getPageSeo(key: PageSeoKey) {
  const page = PAGE_SEO[key];
  return {
    ...page,
    url: `${url.replace(/\/$/, '')}${page.path}`,
    ogImage: ogImageUrl,
  };
}
