import type { Snippet } from 'svelte';
import type { HTMLButtonAttributes } from 'svelte/elements';

export type ButtonVariant = 'secondary' | 'primary';
export type ButtonSize = 'sm' | 'lg';

export type ButtonProps = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children?: Snippet;
} & HTMLButtonAttributes;
