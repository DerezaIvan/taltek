import type { DispatcherCardData, TerritoryCardData } from '$shared/constants/operations-contacts';

export interface DirectusFile {
  id: string;
  filename_download?: string;
  type?: string;
}

export interface DirectusListResponse<T> {
  data: T[];
}

export interface DirectusSingleResponse<T> {
  data: T;
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
  og_image?: DirectusFile | string | null;
  hero_title?: string | null;
  hero_subtitle?: string | null;
  status?: string;
}

export interface DirectusSiteSettingsRecord {
  id: number;
  site_name: string;
  site_url: string;
  logo?: DirectusFile | string | null;
  hotline_phone_display: string;
  hotline_phone_href: string;
  main_address: string;
  contact_emails?: { label: string; href: string }[] | null;
}

export interface DirectusHomeHeroRecord {
  id: number;
  title: string;
  subtitle: string;
  background?: DirectusFile | string | null;
}

export interface DirectusAboutIntroRecord {
  id: number;
  title: string;
  lead: string;
  paragraphs?: string[] | null;
  image?: DirectusFile | string | null;
  image_alt?: string | null;
  sort: number;
  status?: string;
}

export interface DirectusOurMissionRecord {
  id: number;
  title: string;
  subtitle: string;
  gallery?: string[] | null;
}

export interface DirectusKeyServiceRecord {
  id: string;
  title: string;
  description: string;
  sort: number;
  status?: string;
}

export interface DirectusDeliverySectionRecord {
  id: number;
  title: string;
}

export interface DirectusDeliveryStepRecord {
  id: number;
  step_id: string;
  title: string;
  description: string;
  sort: number;
  status?: string;
}

export interface DirectusWhyUsItemRecord {
  id: string;
  title: string;
  description: string;
  sort: number;
  status?: string;
}

export interface DirectusWhatYouGetItemRecord {
  id: string;
  title: string;
  sort: number;
  status?: string;
}

export interface DirectusStatsItemRecord {
  id: string;
  label: string;
  value: string;
  description: string;
  sort: number;
  status?: string;
}

export interface DirectusFleetParkSectionRecord {
  id: number;
  title: string;
}

export interface DirectusFleetParkCardRecord {
  id: string;
  value: string;
  label: string;
  badge: string;
  sort: number;
  status?: string;
}

export interface DirectusFleetModelSpec {
  label: string;
  value: string;
}

export interface DirectusFleetModelRecord {
  id: string;
  variant: 'default' | 'reserve';
  badge: string;
  title: string;
  description: string;
  image?: DirectusFile | string | null;
  image_alt?: string | null;
  specs?: DirectusFleetModelSpec[] | null;
  sort: number;
  status?: string;
}

export interface DirectusCtaBlockRecord {
  id: string;
  title: string;
  subtitle: string;
  status?: string;
}

export interface DirectusPageHeroRecord {
  id: number;
  image?: DirectusFile | string | null;
  image_position?: string | null;
}

export interface DirectusContractContactsSectionRecord {
  id: number;
  title: string;
  background?: DirectusFile | string | null;
}

export interface DirectusContractContactsCardRecord {
  id: string;
  name: string;
  role_lines?: string[] | null;
  phone: string;
  phone_href: string;
  email: string;
  photo?: DirectusFile | string | null;
  sort: number;
  status?: string;
}

export interface DirectusOperationsContactsSectionRecord {
  id: number;
  dispatchers_title: string;
  dispatchers_subtitle: string;
  territories_title: string;
}

export interface DirectusOperationsDispatcherRecord {
  id: string;
  title: string;
  phone: string;
  phone_href: string;
  badge?: string | null;
  phone2?: string | null;
  phone_href2?: string | null;
  badge2?: string | null;
  email?: string | null;
  sort: number;
  status?: string;
}

export interface DirectusOperationsTerritoryRecord {
  id: string;
  city: string;
  phone: string;
  phone_href: string;
  sort: number;
  status?: string;
}

export interface DirectusPrivacyBlock {
  type: 'paragraph' | 'list';
  text?: string;
  items?: string[];
}

export interface DirectusPrivacyPageRecord {
  id: number;
  intro: string;
}

export interface DirectusPrivacySectionRecord {
  id: string;
  title: string;
  blocks?: DirectusPrivacyBlock[] | null;
  sort: number;
  status?: string;
}

export interface DirectusSubmissionRecord {
  id: number;
  name: string;
  phone: string;
  email?: string | null;
  company?: string | null;
  wagon_type?: string | null;
  direction_from?: string | null;
  direction_to?: string | null;
  comment?: string | null;
  created_at?: string;
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
  ogImage?: string;
}

export interface LayoutContent {
  navigation: NavItem[];
  siteName: string;
}

export interface SiteSettings {
  siteName: string;
  siteUrl: string;
  logo?: string;
  hotlinePhoneDisplay: string;
  hotlinePhoneHref: string;
  mainAddress: string;
  contactEmails: { label: string; href: string }[];
}

export interface HomePageContent {
  hero?: {
    title: string;
    subtitle: string;
    background?: string;
  };
  aboutIntro?: DirectusAboutIntroRecord[];
  ourMission?: {
    title: string;
    subtitle: string;
    gallery?: string[];
  };
  keyServices?: DirectusKeyServiceRecord[];
  deliveryTitle?: string;
  deliverySteps?: DirectusDeliveryStepRecord[];
  whyUsItems?: DirectusWhyUsItemRecord[];
  whatYouGetItems?: DirectusWhatYouGetItemRecord[];
  statsItems?: DirectusStatsItemRecord[];
  fleetParkTitle?: string;
  fleetParkCards?: DirectusFleetParkCardRecord[];
  fleetModels?: DirectusFleetModelRecord[];
  cta?: DirectusCtaBlockRecord;
}

export interface AboutPageContent {
  hero?: {
    image?: string;
    imagePosition?: string;
  };
  aboutIntro?: DirectusAboutIntroRecord[];
  ourMission?: {
    title: string;
    subtitle: string;
    gallery?: string[];
  };
  statsItems?: DirectusStatsItemRecord[];
  cta?: DirectusCtaBlockRecord;
}

export interface ServicesPageContent {
  hero?: {
    image?: string;
    imagePosition?: string;
  };
  keyServices?: DirectusKeyServiceRecord[];
  fleetModels?: DirectusFleetModelRecord[];
  deliveryTitle?: string;
  deliverySteps?: DirectusDeliveryStepRecord[];
  whatYouGetItems?: DirectusWhatYouGetItemRecord[];
  cta?: DirectusCtaBlockRecord;
}

export interface ContactsPageContent {
  hero?: {
    image?: string;
    imagePosition?: string;
  };
  contractSection?: {
    title: string;
    background?: string;
  };
  contractCards?: DirectusContractContactsCardRecord[];
  operationsSection?: {
    dispatchersTitle: string;
    dispatchersSubtitle: string;
    territoriesTitle: string;
  };
  dispatchers?: DispatcherCardData[];
  territories?: TerritoryCardData[];
}

export interface PrivacyPageContent {
  intro: string;
  sections: DirectusPrivacySectionRecord[];
}
