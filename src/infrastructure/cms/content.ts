import { directusFetch } from './directus-client';
import type {
  DirectusListResponse,
  DirectusNavigationItemRecord,
  DirectusPageRecord,
  LayoutContent,
  NavItem,
  PageContent,
} from './types';
import { NAV_ITEMS } from '$shared/constants/navigation';
import { DEFAULT_SEO, getPageSeo, SITE_NAME, type PageSeoKey } from '$shared/constants/seo';

const SITE_URL = DEFAULT_SEO.url.replace(/\/$/, '');

function publishedFilter(collection: string): string {
  return `/items/${collection}?filter[status][_eq]=published&sort[]=sort`;
}

function mapNavigation(items: DirectusNavigationItemRecord[]): NavItem[] {
  return items.map(item => ({
    label: item.label,
    href: item.href,
  }));
}

function mapPage(record: DirectusPageRecord, path: string): PageContent {
  return {
    slug: record.slug,
    title: record.title,
    description: record.description,
    heroTitle: record.hero_title ?? undefined,
    heroSubtitle: record.hero_subtitle ?? undefined,
    url: `${SITE_URL}${path}`,
  };
}

export async function getLayoutContent(): Promise<LayoutContent> {
  const response = await directusFetch<DirectusListResponse<DirectusNavigationItemRecord>>(
    `${publishedFilter('navigation_items')}&fields=id,label,href,sort,status`
  );

  if (!response?.data?.length) {
    return {
      navigation: [...NAV_ITEMS],
      siteName: SITE_NAME,
    };
  }

  return {
    navigation: mapNavigation(response.data),
    siteName: SITE_NAME,
  };
}

export async function getPageContent(slug: PageSeoKey): Promise<PageContent> {
  const fallback = getPageSeo(slug);
  const fallbackContent: PageContent = {
    slug,
    title: fallback.title,
    description: fallback.description,
    url: fallback.url,
  };

  const response = await directusFetch<DirectusListResponse<DirectusPageRecord>>(
    `/items/pages?filter[slug][_eq]=${slug}&filter[status][_eq]=published&limit=1&fields=id,slug,title,description,hero_title,hero_subtitle,status`
  );

  const record = response?.data?.[0];
  if (!record) {
    return fallbackContent;
  }

  return {
    ...mapPage(record, fallback.path),
    heroTitle: record.hero_title ?? fallbackContent.title,
    heroSubtitle: record.hero_subtitle ?? undefined,
  };
}
