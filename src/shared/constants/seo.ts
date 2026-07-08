const url = 'https://taltek.ru/';

export const SITE_NAME = 'Taltek';

export const DEFAULT_SEO = {
  title: 'Талтэк',
  description: 'Талтэк — заготовка лендинга',
  url,
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
    title: 'Талтэк — Главная',
    description: DEFAULT_SEO.description,
    path: '/',
  },
  about: {
    title: 'Талтэк — О компании',
    description: 'Информация о компании Талтэк',
    path: '/about/',
  },
  services: {
    title: 'Талтэк — Услуги и подвижной состав',
    description: 'Услуги и подвижной состав компании Талтэк',
    path: '/services/',
  },
  contacts: {
    title: 'Талтэк — Контакты',
    description: 'Контактная информация компании Талтэк',
    path: '/contacts/',
  },
  privacy: {
    title: 'Талтэк — Политика конфиденциальности',
    description: 'Политика конфиденциальности и обработки персональных данных АО «ТалТЭК Транс»',
    path: '/privacy/',
  },
  notFound: {
    title: 'Талтэк — Страница не найдена',
    description: 'Запрашиваемая страница не найдена',
    path: '/404/',
  },
} as const;

export type PageSeoKey = keyof typeof PAGE_SEO;

export function getPageSeo(key: PageSeoKey) {
  const page = PAGE_SEO[key];
  return {
    ...page,
    url: `${url.replace(/\/$/, '')}${page.path}`,
  };
}
