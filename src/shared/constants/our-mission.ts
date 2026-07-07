export const OUR_MISSION_TITLE = 'Наша миссия';

export const OUR_MISSION_TEXT =
  'Делать совместный бизнес во благо всех заинтересованных сторон.';

export const OUR_MISSION_IMAGES = [
  {
    id: 'railway',
    src: '/images/our-mission-73.webp',
    alt: 'Вагоны с углём на железнодорожных путях',
  },
  {
    id: 'structure',
    src: '/images/our-mission-69.webp',
    alt: 'Промышленная конструкция на грузовой площадке',
  },
  {
    id: 'coal-train',
    src: '/images/our-mission-72.webp',
    alt: 'Угольный склад и грузовой поезд',
  },
  {
    id: 'crane',
    src: '/images/our-mission-71.webp',
    alt: 'Кран между железнодорожными вагонами',
  },
] as const;

export type OurMissionImage = (typeof OUR_MISSION_IMAGES)[number];
