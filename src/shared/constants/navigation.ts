export const NAV_ITEMS = [
  { label: 'Главная', href: '/' },
  { label: 'О компании', href: '/about/' },
  { label: 'Услуги и подвижной состав', href: '/services/' },
  { label: 'Контакты', href: '/contacts/' },
] as const;

export type NavItem = (typeof NAV_ITEMS)[number];

export type FooterNavItem =
  | NavItem
  | {
      label: 'Личный кабинет - скоро';
      muted: true;
    };

export function getFooterNavigation(navigation: readonly NavItem[]): FooterNavItem[] {
  if (!navigation.length) {
    return [{ label: 'Личный кабинет - скоро', muted: true }];
  }

  return [navigation[0], { label: 'Личный кабинет - скоро', muted: true }, ...navigation.slice(1)];
}
