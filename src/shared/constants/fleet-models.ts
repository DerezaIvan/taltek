export const FLEET_MODELS_TITLE = 'Модели вагонов нашего парка';

export type FleetModelVariant = 'default' | 'reserve';

export interface FleetModelSpec {
  label: string;
  value: string;
}

export interface FleetModelItem {
  id: string;
  variant: FleetModelVariant;
  badge: string;
  title: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
  specs: readonly FleetModelSpec[];
}

const DEFAULT_SPECS_TAIL: readonly FleetModelSpec[] = [
  { label: 'Количество', value: 'уточняется' },
  { label: 'Год выпуска', value: '2025/2026' },
];

export const FLEET_MODELS_ITEMS: readonly FleetModelItem[] = [
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
      { label: 'Количество', value: 'уточняется' },
      { label: 'Год выпуска', value: '2022-2025' },
    ],
  },
  {
    id: '11-2163',
    variant: 'default',
    badge: 'Крытый вагон',
    title: 'Модель 11-2163',
    description: 'Надежная перевозка тарно-штучных и пакетированных грузов в больших объемах.',
    imageSrc: '/images/wagon-fleet-11-2163.webp',
    imageAlt: 'Крытый вагон модель 11-2163',
    specs: [
      { label: 'Грузоподъёмность', value: 'до 68 т' },
      { label: 'Объём кузова', value: 'до 161 м³' },
      ...DEFAULT_SPECS_TAIL,
    ],
  },
];
