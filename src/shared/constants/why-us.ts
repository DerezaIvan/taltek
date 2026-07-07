export const WHY_US_TITLE = 'Почему мы';

export const WHY_US_ITEMS = [
  {
    id: 'own-fleet',
    title: 'Собственный парк',
    description: 'Грузовые вагоны различной модификации в управлении.',
  },
  {
    id: 'geography',
    title: 'Широкая география',
    description: 'Логистика на всём пространстве колеи 1520.',
  },
  {
    id: 'automation',
    title: 'Автоматизация рабочих процессов',
    description: 'Обширный инструментарий планирования и оптимизации логистических цепей.',
  },
  {
    id: 'speed',
    title: 'Скорость решений',
    description: 'Быстрый отклик на запросы и потребности заказчика.',
  },
  {
    id: 'competencies',
    title: 'Профессиональные компетенции',
    description: '15+ лет на рынке транспортно-логистических услуг.',
  },
  {
    id: 'team',
    title: 'Команда единомышленников',
    description: '100+ профессионалов своего дела.',
  },
] as const;

export type WhyUsItem = (typeof WHY_US_ITEMS)[number];
export type WhyUsIconId = WhyUsItem['id'];
