export const DISPATCHERS_TITLE = 'Диспетчерский центр';

export const DISPATCHERS_SUBTITLE_LINES = [
  'Контроль продвижения груза в реальном времени:',
  'статус и местонахождение вагонов.',
] as const;

export const TERRITORIES_TITLE = 'Наши территории';

export type DispatcherCardData = {
  id: string;
  title: string;
  phone: string;
  phoneHref: string;
  badge?: string;
  phone2?: string;
  phoneHref2?: string;
  badge2?: string;
  email?: string;
};

export const DISPATCHER_CARDS: DispatcherCardData[] = [
  {
    id: 'gondola',
    title: 'Полувагоны',
    phone: '8\u00a0800\u00a0533\u00a09\u00a0888 доб. 101',
    phoneHref: 'tel:+78005339888,101',
    badge: 'Круглосуточно',
    phone2: '+7\u00a0921\u00a0763\u00a031\u00a097',
    phoneHref2: 'tel:+792176303197',
    email: 'disp-online@taltektrans.pro',
  },
  {
    id: 'covered-grain',
    title: 'Крытые вагоны',
    phone: '8\u00a0800\u00a0533\u00a09\u00a0888 доб. 102',
    phoneHref: 'tel:+78005339888,102',
    badge: 'Режим работы: 08:00 – 20:00 (по МСК)',
    phone2: '+7\u00a0921\u00a0430\u00a093\u00a079',
    phoneHref2: 'tel:+79214309379',
    email: 'dispkr@taltektrans.pro',
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

export type TerritoryCardData = {
  id: string;
  city: string;
  phone: string;
  phoneHref: string;
};
