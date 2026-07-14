import type { BreadcrumbItem } from './breadcrumb';

export interface PageHeroProps {
  imageSrc: string;
  breadcrumbs: BreadcrumbItem[];
  titleLines: string[];
  subtitle?: string;
  imagePosition?: string;
}
