export const FLEET_PARK_TITLE = 'Наш собственный парк —\nгарантия сохранности Вашего груза';

export const FLEET_PARK_BACKGROUND_IMAGE = '/images/what-you-get.webp';

export const FLEET_PARK_SMALL_CARDS = [
  {
    id: 'gondola',
    value: '13 000',
    label: 'Полувагоны разной модификации',
    badge: '45% — инновационная модель 12-2159',
  },
  {
    id: 'covered',
    value: '3 200',
    label: 'Крытые вагоны',
    badge: 'большекубовых вагонов 11-2163',
  },
] as const;

export const FLEET_PARK_FEATURE_CARD = {
  value: '16 000+',
  label: 'Общий парк подвижного состава в управлении',
  illustrationSrc: '/images/subtract.svg',
  illustrationAlt: '',
} as const;
