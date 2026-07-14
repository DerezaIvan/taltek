import type { Snippet } from 'svelte';

export interface PageContentProps {
  title: string;
  description?: string;
  children?: Snippet;
}
