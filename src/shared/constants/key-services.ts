export const KEY_SERVICES_TITLE = 'Три ключевые услуги — одна точка ответственности';

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
    description: 'Платёжно-финансовые услуги: оформление и оплата ж/д тарифов и сборов.',
  },
  {
    id: 'dispatch-support',
    title: 'Круглосуточное диспетчерское сопровождение на всех этапах перевозки',
    description: 'Контроль и сопровождение груза 24/7 на всём пути следования.',
  },
] as const;

export type KeyServicesItem = (typeof KEY_SERVICES_ITEMS)[number];
export type KeyServicesIconId = KeyServicesItem['id'];
