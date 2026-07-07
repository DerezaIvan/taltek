export const FLEET_MODELS_TITLE = 'Модели вагонов нашего парка';
export const FLEET_MODELS_SUBTITLE = 'Полувагоны и крытые вагоны';

const DEFAULT_SPECS_TAIL = [
  { label: 'Количество', value: 'уточняется' },
  { label: 'Год выпуска', value: '2025/2026' },
] as const;

export const FLEET_MODELS_ITEMS = [
  {
    id: '12-2159',
    variant: 'default',
    badge: 'Полувагон',
    title: 'Модель 12-2159',
    description: 'Высокая эффективность тяжеловесных перевозок, в том числе на длинных плечах.',
    imageSrc: '/images/wagon-fleet.webp',
    imageAlt: 'Полувагон модель 12-2159',
    specs: [
      { label: 'Грузоподъёмность', value: 'до 75 т' },
      { label: 'Объём кузова', value: '~94 м³' },
      ...DEFAULT_SPECS_TAIL,
    ],
  },
  {
    id: '12-2153',
    variant: 'default',
    badge: 'Полувагон',
    title: 'Модель 12-2153',
    description: 'Оптимальное решение для массовых перевозок грузов.',
    imageSrc: '/images/wagon-fleet-12-2153.webp',
    imageAlt: 'Полувагон модель 12-2153',
    specs: [
      { label: 'Грузоподъёмность', value: 'до 70 т' },
      { label: 'Объём кузова', value: 'до 88 м³' },
      ...DEFAULT_SPECS_TAIL,
    ],
  },
  {
    id: '11-2163',
    variant: 'default',
    badge: 'Крытый вагон',
    title: 'Модель 11-2163',
    description: 'Высокая эффективность тяжеловесных перевозок, в том числе на длинных плечах.',
    imageSrc: '/images/wagon-fleet-11-2163.webp',
    imageAlt: 'Крытый вагон модель 11-2163',
    specs: [
      { label: 'Грузоподъёмность', value: 'до 68 т' },
      { label: 'Объём кузова', value: 'до 161 м³' },
      ...DEFAULT_SPECS_TAIL,
    ],
  },
  {
    id: '19-9567',
    variant: 'reserve',
    badge: 'В резерве',
    title: 'Вагон-зерновоз · 19-9567',
    description: '',
    imageSrc: '/images/wagon-fleet-19-9567.webp',
    imageAlt: 'Вагон-зерновоз 19-9567',
    specs: [
      { label: 'Грузоподъёмность', value: '71,5 т' },
      { label: 'Объём кузова', value: '118 м³' },
      { label: 'Количество', value: 'уточняется' },
      { label: 'Год выпуска', value: '2026' },
    ],
  },
] as const;

export type FleetModelItem = (typeof FLEET_MODELS_ITEMS)[number];
export type FleetModelSpec = FleetModelItem['specs'][number];
