export const CONTACTS_TITLE = 'Контакты';

export const CONTACTS_SUBTITLE =
  'Оставьте запрос через форму или свяжитесь с коммерческим департаментом.';

export const CONTACTS_FORM_TITLE = 'Оставить запрос';

export const CONTACTS_FORM_FIELDS = {
  name: {
    label: 'Имя',
    placeholder: 'Ваше имя',
    required: true,
  },
  phone: {
    label: 'Телефон',
    placeholder: '+7 (---) --- -- --',
    required: true,
  },
  email: {
    label: 'E-mail для ответа',
    placeholder: 'name@company.ru',
    required: false,
  },
  company: {
    label: 'Компания',
    placeholder: 'Название организации',
    required: false,
  },
  wagonType: {
    label: 'Тип подвижного состава',
    placeholder: 'Выберите тип вагона',
    required: true,
  },
  direction: {
    label: 'Направление',
    fromPlaceholder: 'Откуда',
    toPlaceholder: 'Куда',
    required: false,
  },
  comment: {
    label: 'Комментарий',
    placeholder: 'Груз, объём, желаемые сроки',
    required: false,
  },
} as const;

export const CONTACTS_WAGON_TYPES = [
  { value: 'gondola', label: 'Полувагон' },
  { value: 'covered', label: 'Крытый вагон' },
  { value: 'grain', label: 'Вагон-зерновоз' },
] as const;

export const CONTACTS_CONSENT = {
  prefix: 'Я ознакомлен (а) с ',
  linkLabel: 'Политикой конфиденциальности',
  suffix: ' и даю согласие на обработку моих персональных данных',
} as const;

export const CONTACTS_HOTLINE = {
  title: 'Единный номер',
  phone: '8 800 533 9 888',
  phoneHref: 'tel:+78005339888',
  subtitle: 'Главный офис · Москва',
} as const;

export const CONTACTS_INFO = {
  title: 'Контактная информация',
  address: '125047, Россия, г. Москва, Дукат Плейс 3, Гашека 6, офис 1210',
  emails: [
    { label: 'zayavka@taltektrans.pro', href: 'mailto:zayavka@taltektrans.pro' },
    { label: 'info@taltektrans.pro', href: 'mailto:info@taltektrans.pro' },
  ],
} as const;
