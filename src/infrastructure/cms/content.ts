import { directusFetch, getAssetUrl } from './directus-client';
import type {
  DirectusAboutIntroRecord,
  DirectusContractContactsCardRecord,
  DirectusCtaBlockRecord,
  DirectusDeliveryStepRecord,
  DirectusFleetModelRecord,
  DirectusFleetParkCardRecord,
  DirectusHomeHeroRecord,
  DirectusKeyServiceRecord,
  DirectusListResponse,
  DirectusNavigationItemRecord,
  DirectusOperationsDispatcherRecord,
  DirectusOperationsTerritoryRecord,
  DirectusOurMissionRecord,
  DirectusPageHeroRecord,
  DirectusPageRecord,
  DirectusPrivacySectionRecord,
  DirectusSingleResponse,
  DirectusSiteSettingsRecord,
  DirectusStatsItemRecord,
  DirectusWhatYouGetItemRecord,
  DirectusWhyUsItemRecord,
  LayoutContent,
  NavItem,
  PageContent,
  SiteSettings,
  HomePageContent,
  AboutPageContent,
  ServicesPageContent,
  ContactsPageContent,
  PrivacyPageContent,
  DirectusSubmissionRecord,
} from './types';
import { NAV_ITEMS } from '$shared/constants/navigation';
import { DEFAULT_SEO, getPageSeo, SITE_NAME, type PageSeoKey } from '$shared/constants/seo';
import type { DispatcherCardData, TerritoryCardData } from '$shared/constants/operations-contacts';

const SITE_URL = DEFAULT_SEO.url.replace(/\/$/, '');
const OG_IMAGE_URL = DEFAULT_SEO.ogImage;

function publishedFilter(collection: string): string {
  return `/items/${collection}?filter[status][_eq]=published&sort[]=sort`;
}

function extractFileId(file: unknown): string | undefined {
  if (!file) return undefined;
  if (typeof file === 'string') return file;
  if (typeof file === 'object' && file !== null && 'id' in file) {
    return (file as { id?: string }).id;
  }
  return undefined;
}

function extractFileIds(files: unknown): string[] | undefined {
  if (!Array.isArray(files)) return undefined;
  return files.map(extractFileId).filter(Boolean) as string[];
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
    ogImage: getAssetUrl(extractFileId(record.og_image)) ?? OG_IMAGE_URL,
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
    ogImage: fallback.ogImage,
  };

  const response = await directusFetch<DirectusListResponse<DirectusPageRecord>>(
    `/items/pages?filter[slug][_eq]=${slug}&filter[status][_eq]=published&limit=1&fields=id,slug,title,description,og_image,hero_title,hero_subtitle,status`
  );

  const record = response?.data?.[0];
  if (!record) {
    return fallbackContent;
  }

  return mapPage(record, fallback.path);
}

export async function getSiteSettings(): Promise<SiteSettings | null> {
  const response = await directusFetch<DirectusSingleResponse<DirectusSiteSettingsRecord>>(
    '/items/site_settings?limit=1&fields=id,site_name,site_url,logo,hotline_phone_display,hotline_phone_href,main_address,contact_emails'
  );

  const record = response?.data;
  if (!record) return null;

  return {
    siteName: record.site_name,
    siteUrl: record.site_url,
    logo: getAssetUrl(extractFileId(record.logo)),
    hotlinePhoneDisplay: record.hotline_phone_display,
    hotlinePhoneHref: record.hotline_phone_href,
    mainAddress: record.main_address,
    contactEmails: record.contact_emails ?? [],
  };
}

async function fetchSingleton<T>(collection: string, fields: string): Promise<T | null> {
  const response = await directusFetch<DirectusSingleResponse<T>>(
    `/items/${collection}?limit=1&fields=${fields}`
  );
  return response?.data ?? null;
}

async function fetchList<T>(collection: string, fields: string): Promise<T[]> {
  const response = await directusFetch<DirectusListResponse<T>>(
    `${publishedFilter(collection)}&fields=${fields}`
  );
  return response?.data ?? [];
}

function mapHero(record: DirectusHomeHeroRecord | null): HomePageContent['hero'] {
  if (!record) return undefined;
  return {
    title: record.title,
    subtitle: record.subtitle,
    background: getAssetUrl(extractFileId(record.background)),
  };
}

function mapOurMission(record: DirectusOurMissionRecord | null): HomePageContent['ourMission'] {
  if (!record) return undefined;
  return {
    title: record.title,
    subtitle: record.subtitle,
    gallery: record.gallery ?? undefined,
  };
}

export async function getHomePageContent(): Promise<HomePageContent> {
  const [
    hero,
    aboutIntro,
    ourMission,
    keyServices,
    deliverySection,
    deliverySteps,
    whyUsItems,
    whatYouGetItems,
    statsItems,
    fleetParkSection,
    fleetParkCards,
    fleetModels,
    cta,
  ] = await Promise.all([
    fetchSingleton<DirectusHomeHeroRecord>('home_hero', 'id,title,subtitle,background').then(
      mapHero
    ),
    fetchList<DirectusAboutIntroRecord>(
      'about_intro',
      'id,title,lead,paragraphs,image,image_alt,sort,status'
    ),
    fetchSingleton<DirectusOurMissionRecord>('our_mission', 'id,title,subtitle,gallery').then(
      mapOurMission
    ),
    fetchList<DirectusKeyServiceRecord>('key_services', 'id,title,description,sort,status'),
    fetchSingleton<{ id: number; title: string }>('delivery_section', 'id,title'),
    fetchList<DirectusDeliveryStepRecord>(
      'delivery_steps',
      'id,step_id,title,description,sort,status'
    ),
    fetchList<DirectusWhyUsItemRecord>('why_us_items', 'id,title,description,sort,status'),
    fetchList<DirectusWhatYouGetItemRecord>('what_you_get_items', 'id,title,sort,status'),
    fetchList<DirectusStatsItemRecord>('stats_items', 'id,label,value,description,sort,status'),
    fetchSingleton<{ id: number; title: string }>('fleet_park_section', 'id,title'),
    fetchList<DirectusFleetParkCardRecord>('fleet_park_cards', 'id,value,label,badge,sort,status'),
    fetchList<DirectusFleetModelRecord>(
      'fleet_models',
      'id,variant,badge,title,description,image,image_alt,specs,sort,status'
    ),
    fetchSingleton<DirectusCtaBlockRecord>('cta_blocks', 'id,title,subtitle,status').then(record =>
      record?.id === 'home' ? record : undefined
    ),
  ]);

  return {
    hero,
    aboutIntro,
    ourMission,
    keyServices,
    deliveryTitle: deliverySection?.title,
    deliverySteps,
    whyUsItems,
    whatYouGetItems,
    statsItems,
    fleetParkTitle: fleetParkSection?.title,
    fleetParkCards,
    fleetModels: fleetModels.map(model => ({
      ...model,
      image: getAssetUrl(extractFileId(model.image)),
    })),
    cta,
  };
}

function mapPageHero(
  record: DirectusPageHeroRecord | null
): { image?: string; imagePosition?: string } | undefined {
  if (!record) return undefined;
  return {
    image: getAssetUrl(extractFileId(record.image)),
    imagePosition: record.image_position ?? undefined,
  };
}

export async function getAboutPageContent(): Promise<AboutPageContent> {
  const [hero, aboutIntro, ourMission, statsItems, cta] = await Promise.all([
    fetchSingleton<DirectusPageHeroRecord>('about_page_hero', 'id,image,image_position').then(
      mapPageHero
    ),
    fetchList<DirectusAboutIntroRecord>(
      'about_intro',
      'id,title,lead,paragraphs,image,image_alt,sort,status'
    ),
    fetchSingleton<DirectusOurMissionRecord>('our_mission', 'id,title,subtitle,gallery').then(
      mapOurMission
    ),
    fetchList<DirectusStatsItemRecord>('stats_items', 'id,label,value,description,sort,status'),
    fetchSingleton<DirectusCtaBlockRecord>('cta_blocks', 'id,title,subtitle,status').then(record =>
      record?.id === 'about' ? record : undefined
    ),
  ]);

  return {
    hero,
    aboutIntro,
    ourMission,
    statsItems,
    cta,
  };
}

export async function getServicesPageContent(): Promise<ServicesPageContent> {
  const [hero, keyServices, fleetModels, deliverySection, deliverySteps, whatYouGetItems, cta] =
    await Promise.all([
      fetchSingleton<DirectusPageHeroRecord>('services_page_hero', 'id,image,image_position').then(
        mapPageHero
      ),
      fetchList<DirectusKeyServiceRecord>('key_services', 'id,title,description,sort,status'),
      fetchList<DirectusFleetModelRecord>(
        'fleet_models',
        'id,variant,badge,title,description,image,image_alt,specs,sort,status'
      ),
      fetchSingleton<{ id: number; title: string }>('delivery_section', 'id,title'),
      fetchList<DirectusDeliveryStepRecord>(
        'delivery_steps',
        'id,step_id,title,description,sort,status'
      ),
      fetchList<DirectusWhatYouGetItemRecord>('what_you_get_items', 'id,title,sort,status'),
      fetchSingleton<DirectusCtaBlockRecord>('cta_blocks', 'id,title,subtitle,status').then(
        record => (record?.id === 'services' ? record : undefined)
      ),
    ]);

  return {
    hero,
    keyServices,
    fleetModels: fleetModels.map(model => ({
      ...model,
      image: getAssetUrl(extractFileId(model.image)),
    })),
    deliveryTitle: deliverySection?.title,
    deliverySteps,
    whatYouGetItems,
    cta,
  };
}

function mapContractSection(
  record: { id: number; title: string; background?: unknown } | null
): { title: string; background?: string } | undefined {
  if (!record) return undefined;
  return {
    title: record.title,
    background: getAssetUrl(extractFileId(record.background)),
  };
}

export async function getContactsPageContent(): Promise<ContactsPageContent> {
  const [hero, contractSection, contractCards, operationsSection, dispatchers, territories] =
    await Promise.all([
      fetchSingleton<DirectusPageHeroRecord>('contacts_page_hero', 'id,image,image_position').then(
        mapPageHero
      ),
      fetchSingleton<{ id: number; title: string; background?: unknown }>(
        'contract_contacts_section',
        'id,title,background'
      ).then(mapContractSection),
      fetchList<DirectusContractContactsCardRecord>(
        'contract_contacts_cards',
        'id,name,role_lines,phone,phone_href,email,photo,sort,status'
      ),
      fetchSingleton<{
        id: number;
        dispatchers_title: string;
        dispatchers_subtitle: string;
        territories_title: string;
      }>(
        'operations_contacts_section',
        'id,dispatchers_title,dispatchers_subtitle,territories_title'
      ),
      fetchList<DirectusOperationsDispatcherRecord>(
        'operations_dispatchers',
        'id,title,phone,phone_href,badge,phone2,phone_href2,badge2,email,sort,status'
      ).then(items =>
        items.map(
          (item): DispatcherCardData => ({
            id: item.id,
            title: item.title,
            phone: item.phone,
            phoneHref: item.phone_href,
            badge: item.badge ?? undefined,
            phone2: item.phone2 ?? undefined,
            phoneHref2: item.phone_href2 ?? undefined,
            badge2: item.badge2 ?? undefined,
            email: item.email ?? undefined,
          })
        )
      ),
      fetchList<DirectusOperationsTerritoryRecord>(
        'operations_territories',
        'id,city,phone,phone_href,sort,status'
      ).then(items =>
        items.map(
          (item): TerritoryCardData => ({
            id: item.id,
            city: item.city,
            phone: item.phone,
            phoneHref: item.phone_href,
          })
        )
      ),
    ]);

  return {
    hero,
    contractSection,
    contractCards: contractCards.map(card => ({
      ...card,
      photo: getAssetUrl(extractFileId(card.photo)),
    })),
    operationsSection: operationsSection
      ? {
          dispatchersTitle: operationsSection.dispatchers_title,
          dispatchersSubtitle: operationsSection.dispatchers_subtitle,
          territoriesTitle: operationsSection.territories_title,
        }
      : undefined,
    dispatchers,
    territories,
  };
}

export async function getPrivacyPageContent(): Promise<PrivacyPageContent | null> {
  const [page, sections] = await Promise.all([
    fetchSingleton<{ id: number; intro: string }>('privacy_page', 'id,intro'),
    fetchList<DirectusPrivacySectionRecord>('privacy_sections', 'id,title,blocks,sort,status'),
  ]);

  if (!page) return null;

  return {
    intro: page.intro,
    sections,
  };
}

export async function createSubmission(
  payload: Omit<DirectusSubmissionRecord, 'id' | 'created_at' | 'status'>
): Promise<void> {
  const baseUrl = process.env.PUBLIC_DIRECTUS_URL;
  if (!baseUrl) {
    throw new Error('Directus не настроен');
  }

  const response = await fetch(`${baseUrl.replace(/\/$/, '')}/items/submissions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: payload.name,
      phone: payload.phone,
      email: payload.email,
      company: payload.company,
      wagon_type: payload.wagon_type,
      direction_from: payload.direction_from,
      direction_to: payload.direction_to,
      comment: payload.comment,
      status: 'new',
    }),
  });

  if (!response.ok) {
    throw new Error('Не удалось сохранить заявку');
  }
}
