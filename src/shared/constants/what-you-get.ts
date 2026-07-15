export const WHAT_YOU_GET_TITLE = 'Что вы получаете, работая с нами';

export const WHAT_YOU_GET_BACKGROUND_IMAGE = '/images/what-you-get.webp';

export const WHAT_YOU_GET_ITEMS = [
  { id: 'reliability', title: 'Надёжность перевозки' },
  { id: 'route-planning', title: 'Эффективное планирование маршрутов' },
  { id: 'support', title: 'Квалифицированная техническая поддержка' },
  { id: 'deal-speed', title: 'Оперативность сделки' },
  { id: 'fleet-selection', title: 'Высокая скорость подбора подвижного состава' },
  { id: 'rates', title: 'Оптимальный расчёт ставок' },
] as const;

export type WhatYouGetItem = (typeof WHAT_YOU_GET_ITEMS)[number];
