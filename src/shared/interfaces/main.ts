import type { Snippet } from 'svelte';

export interface MainProps {
  heroTitle?: string;
  heroSubtitle?: string;
  heroBackground?: string;
  children?: Snippet;
  afterHero?: Snippet;
  pageHero?: Snippet;
}
