<script lang="ts">
  import type { ButtonProps } from '$shared/interfaces';

  let {
    variant = 'secondary',
    size = 'sm',
    type = 'button',
    disabled,
    children,
    ...rest
  }: ButtonProps = $props();
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
