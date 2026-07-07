const url = 'https://taltek.ru/';

export const SITE_NAME = 'Taltek';

export const DEFAULT_SEO = {
  title: 'Taltek',
  description: 'Taltek — заготовка лендинга',
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
    title: 'Taltek — Главная',
    description: DEFAULT_SEO.description,
    path: '/',
  },
  about: {
    title: 'Taltek — О компании',
    description: 'Информация о компании Taltek',
    path: '/about/',
  },
  services: {
    title: 'Taltek — Услуги и подвижной состав',
    description: 'Услуги и подвижной состав компании Taltek',
    path: '/services/',
  },
  contacts: {
    title: 'Taltek — Контакты',
    description: 'Контактная информация компании Taltek',
    path: '/contacts/',
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
