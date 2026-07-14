import type { Snippet } from 'svelte';

export interface MainProps {
  heroTitle?: string;
  heroSubtitle?: string;
  children?: Snippet;
  afterHero?: Snippet;
  pageHero?: Snippet;
}
