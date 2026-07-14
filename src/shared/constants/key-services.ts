export const KEY_SERVICES_TITLE = 'Три ключевые услуги —\nодна точка ответственности';

export const KEY_SERVICES_ITEMS = [
  {
    id: 'wagon-supply',
    title: 'Подбор и подача вагонов под погрузку',
    description:
      'Подбор подвижного состава под нужды заказчика и взаимодействие с владельцами путей общего и необщего пользования по подаче и уборке вагонов.',
  },
  {
    id: 'tariff-payment',
    title: 'Расчёт, оформление и оплата железнодорожного тарифа и сборов',
    description: 'Платёжно-финансовые услуги.',
  },
  {
    id: 'dispatch-support',
    title: 'Диспетчерское сопровождение на всех этапах перевозки',
    description: 'Контроль и сопровождение груза на всём пути следования.',
  },
] as const;

export type KeyServicesItem = (typeof KEY_SERVICES_ITEMS)[number];
export type KeyServicesIconId = KeyServicesItem['id'];
