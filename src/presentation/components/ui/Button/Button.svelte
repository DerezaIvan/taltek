<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLButtonAttributes } from 'svelte/elements';

  type Variant = 'secondary' | 'primary';
  type Size = 'sm' | 'lg';

  type Props = {
    variant?: Variant;
    size?: Size;
    children?: Snippet;
  } & HTMLButtonAttributes;

  let {
    variant = 'secondary',
    size = 'sm',
    type = 'button',
    disabled,
    children,
    ...rest
  }: Props = $props();
</script>

<style lang="scss">
  @use './_button.scss';
</style>

<button
  {type}
  {disabled}
  class="button"
  class:button--sm={size === 'sm'}
  class:button--lg={size === 'lg'}
  class:button--primary={variant === 'primary'}
  class:button--secondary={variant === 'secondary'}
  {...rest}
>
  {@render children?.()}
</button>
