export interface DirectusListResponse<T> {
  data: T[];
}

export interface DirectusNavigationItemRecord {
  id: number;
  label: string;
  href: string;
  sort: number;
  status?: string;
}

export interface DirectusPageRecord {
  id: number;
  slug: string;
  title: string;
  description: string;
  hero_title?: string | null;
  hero_subtitle?: string | null;
  status?: string;
}

export interface NavItem {
  label: string;
  href: string;
}

export interface PageContent {
  slug: string;
  title: string;
  description: string;
  heroTitle?: string;
  heroSubtitle?: string;
  url: string;
}

export interface LayoutContent {
  navigation: NavItem[];
  siteName: string;
}
