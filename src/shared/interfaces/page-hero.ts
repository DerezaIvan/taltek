import type { Snippet } from 'svelte';
import type { BreadcrumbItem } from './breadcrumb';

export interface PageHeroProps {
  imageSrc: string;
  breadcrumbs: BreadcrumbItem[];
  title: Snippet;
}
