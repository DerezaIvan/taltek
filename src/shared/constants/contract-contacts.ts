export const CONTRACT_CONTACTS_TITLE = 'Заключить контракт на оказание услуг';

export const CONTRACT_CONTACTS_BACKGROUND = '/images/contract-contacts-bg.webp';
export const CONTRACT_CONTACTS_BACKGROUND_WIDTH = 2400;
export const CONTRACT_CONTACTS_BACKGROUND_HEIGHT = 660;

const CONTRACT_CONTACTS_PHONE = {
  display: '8 800 533 9 888',
  href: 'tel:+78005339888',
} as const;

export const CONTRACT_CONTACTS_CARDS = [
  {
    id: 'igor-barbitsky',
    name: 'Игорь Барбицкий',
    roleLines: ['Руководитель департамента по перевозкам', 'в полувагонах'],
    phone: CONTRACT_CONTACTS_PHONE.display,
    phoneHref: CONTRACT_CONTACTS_PHONE.href,
    email: 'i.barbitsky@taltektrans.pro',
    emailHref: 'mailto:i.barbitsky@taltektrans.pro',
    photoSrc: '/images/igor-barbitsky.webp',
    photoAlt: 'Игорь Барбицкий',
  },
  {
    id: 'anastasia-afanasyeva',
    name: 'Анастасия Афанасьева',
    roleLines: ['Руководитель департамента по перевозкам', 'в крытых вагонах'],
    phone: CONTRACT_CONTACTS_PHONE.display,
    phoneHref: CONTRACT_CONTACTS_PHONE.href,
    email: 'a.afanaseva@taltektrans.pro',
    emailHref: 'mailto:a.afanaseva@taltektrans.pro',
    photoSrc: '/images/anastasia-afanasyeva.webp',
    photoAlt: 'Анастасия Афанасьева',
  },
  {
    id: 'oleg-netsvetaylo',
    name: 'Олег Нецветайло',
    roleLines: ['Руководитель департамента по перевозкам', 'в зерновозах'],
    phone: CONTRACT_CONTACTS_PHONE.display,
    phoneHref: CONTRACT_CONTACTS_PHONE.href,
    email: 'o.netsvetaylo@taltektrans.pro',
    emailHref: 'mailto:o.netsvetaylo@taltektrans.pro',
    photoSrc: '/images/oleg-netsvetaylo.webp',
    photoAlt: 'Олег Нецветайло',
  },
] as const;

export type ContractContactCardData = (typeof CONTRACT_CONTACTS_CARDS)[number];
