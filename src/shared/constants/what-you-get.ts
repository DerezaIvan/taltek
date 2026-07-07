export const WHAT_YOU_GET_TITLE = 'Что вы получаете, работая с нами';

export const WHAT_YOU_GET_BACKGROUND_IMAGE = '/images/what-you-get.webp';

export const WHAT_YOU_GET_ITEMS = [
  { id: 'reliability', title: 'Надёжность перевозки' },
  { id: 'support', title: 'Эффективное планирование маршрутов' },
  { id: 'fleet-selection', title: 'Квалифицированная техническая поддержка' },
  { id: 'route-planning', title: 'Высокая скорость заключения сделки' },
  { id: 'deal-speed', title: 'Высокая скорость подбора подвижного состава' },
  { id: 'rates', title: 'Оптимальный расчёт ставок' },
] as const;

export type WhatYouGetItem = (typeof WHAT_YOU_GET_ITEMS)[number];
