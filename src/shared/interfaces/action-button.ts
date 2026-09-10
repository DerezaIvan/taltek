import type { Snippet } from 'svelte';
import type { HTMLAnchorAttributes, HTMLButtonAttributes } from 'svelte/elements';

export type ActionButtonVariant = 'glass' | 'ghost' | 'solid' | 'navy';

export type ActionButtonProps = {
  variant?: ActionButtonVariant;
  href?: string;
  type?: HTMLButtonAttributes['type'];
  disabled?: boolean;
  pulse?: boolean;
  children?: Snippet;
  icons?: Snippet;
} & Omit<HTMLAnchorAttributes, 'href'> &
  Omit<HTMLButtonAttributes, 'type' | 'disabled'>;
