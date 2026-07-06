export const DELIVERY_SECTION_TITLE =
  'ДОСТАВИМ ВАШ ГРУЗ ПО ВСЕЙ СЕТИ ЖЕЛЕЗНОДОРОЖНОЙ КОЛЕИ 1520 ММ — НАДЁЖНО И В СРОК';

export const DELIVERY_STEPS = [
  {
    id: '01',
    title: 'Разработаем маршрут и логистическую схему',
    description:
      'С учётом характеристик груза, требований по срокам, регионам отправления и прибытия.',
  },
  {
    id: '02',
    title: 'Предоставим вагон под погрузку',
    description: 'На всём пространстве 1520.',
  },
  {
    id: '03',
    title: 'Проведём погрузочно-разгрузочные работы',
    description: 'С соблюдением регламентов и фотофиксацией процесса.',
  },
  {
    id: '04',
    title: 'Оформим и организуем оплату',
    description: 'Транспортных и разрешительных документов.',
  },
  {
    id: '05',
    title: 'Проконтролируем груз в пути',
    description: 'Отследим движение вагона и оповестим Вас о местонахождении груза.',
  },
] as const;

export type DeliveryStep = (typeof DELIVERY_STEPS)[number];

export type DeliveryIconId = 'route' | 'crane' | 'documents';

export const DELIVERY_IMAGES = {
  taltek: {
    webp: '/images/taltek.webp',
    png: '/images/taltek.png',
  },
  train: {
    webp: '/images/train.webp',
    png: '/images/train.png',
  },
  train2: {
    webp: '/images/train-2.webp',
    png: '/images/train-2.png',
  },
} as const;

export type DeliveryImageKey = keyof typeof DELIVERY_IMAGES;

export type DeliveryRowItem =
  | { type: 'text'; stepId: DeliveryStep['id']; width: number; height: number }
  | { type: 'icon'; iconId: DeliveryIconId; width: number; height: number }
  | {
      type: 'image';
      imageKey: DeliveryImageKey;
      width: number;
      height: number;
      alt: string;
    };

export const DELIVERY_TOP_ROWS: DeliveryRowItem[][] = [
  [
    { type: 'text', stepId: '01', width: 410, height: 170 },
    { type: 'icon', iconId: 'route', width: 170, height: 170 },
    { type: 'text', stepId: '02', width: 320, height: 170 },
  ],
  [
    {
      type: 'image',
      imageKey: 'taltek',
      width: 290,
      height: 170,
      alt: 'Вагон ТалТЭК Транс',
    },
    { type: 'text', stepId: '03', width: 440, height: 170 },
    { type: 'icon', iconId: 'crane', width: 170, height: 170 },
  ],
];

export const DELIVERY_SIDE_IMAGE = {
  imageKey: 'train',
  width: 410,
  height: 370,
  alt: 'Грузовой поезд на ж/д путях',
} as const;

export const DELIVERY_BOTTOM_ROW: DeliveryRowItem[] = [
  { type: 'icon', iconId: 'documents', width: 170, height: 170 },
  { type: 'text', stepId: '04', width: 390, height: 170 },
  {
    type: 'image',
    imageKey: 'train2',
    width: 340,
    height: 170,
    alt: 'Колёсная пара грузового вагона',
  },
  { type: 'text', stepId: '05', width: 410, height: 170 },
];

const stepsById = Object.fromEntries(DELIVERY_STEPS.map(step => [step.id, step])) as Record<
  DeliveryStep['id'],
  DeliveryStep
>;

export function getDeliveryStep(id: DeliveryStep['id']): DeliveryStep {
  return stepsById[id];
}
