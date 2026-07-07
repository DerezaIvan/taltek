export const DISPATCHERS_TITLE = 'Диспетчеры по направлениям';

export const DISPATCHERS_SUBTITLE_LINES = [
  'Сопровождают перевозку в реальном времени:',
  'статус и местонахождение вагонов, сроки прибытия груза.',
] as const;

export const TERRITORIES_TITLE = 'Наши территории';

export const DISPATCHER_CARDS = [
  {
    id: 'gondola',
    title: 'Полувагоны',
    phone: '+7 (495) 900 10 95 доб. 101',
    phoneHref: 'tel:+74959001095,101',
    badge: 'Круглосуточно',
  },
  {
    id: 'covered-grain',
    title: 'Крытые вагоны и зерновозы',
    phone: '+7 (495) 900 10 95 доб. 102',
    phoneHref: 'tel:+74959001095,102',
    badge: 'Режим работы: 08:00 – 20:00 (по МСК)',
  },
] as const;

export const TERRITORY_CARDS = [
  {
    id: 'moscow',
    city: 'Москва',
    phone: '+7 (495) 900 10 95',
    phoneHref: 'tel:+74959001095',
  },
  {
    id: 'saint-petersburg',
    city: 'Санкт-Петербург',
    phone: '+7 (812) 602 14 75',
    phoneHref: 'tel:+78126021475',
  },
  {
    id: 'novokuznetsk',
    city: 'Новокузнецк',
    phone: '+7 (384) 399 34 81',
    phoneHref: 'tel:+73843993481',
  },
  {
    id: 'irkutsk',
    city: 'Иркутск',
    phone: '+7 (908) 661 17 71',
    phoneHref: 'tel:+79086611771',
  },
  {
    id: 'biysk',
    city: 'Бийск',
    phone: '+7 (906) 926 80 09',
    phoneHref: 'tel:+79069268009',
  },
  {
    id: 'novosibirsk',
    city: 'Новосибирск',
    phone: '+7 (931) 543 37 10',
    phoneHref: 'tel:+79315433710',
  },
] as const;

export type DispatcherCardData = (typeof DISPATCHER_CARDS)[number];
export type TerritoryCardData = (typeof TERRITORY_CARDS)[number];
