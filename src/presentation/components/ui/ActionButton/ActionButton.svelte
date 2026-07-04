<script lang="ts">
  import type { ActionButtonProps } from '$shared/interfaces';

  let {
    variant = 'glass',
    href,
    type = 'button',
    disabled = false,
    children,
    icons,
    ...rest
  }: ActionButtonProps = $props();
</script>

<style lang="scss">
  @use './_action-button.scss';
</style>

{#if href}
  <a
    {href}
    class="action-button"
    class:action-button--glass={variant === 'glass'}
    class:action-button--ghost={variant === 'ghost'}
    class:action-button--solid={variant === 'solid'}
    {...rest}
  >
    {@render children?.()}
    {#if icons}
      <span class="action-button__icons">
        {@render icons()}
      </span>
    {/if}
  </a>
{:else}
  <button
    {type}
    {disabled}
    class="action-button"
    class:action-button--glass={variant === 'glass'}
    class:action-button--ghost={variant === 'ghost'}
    class:action-button--solid={variant === 'solid'}
    {...rest}
  >
    {@render children?.()}
    {#if icons}
      <span class="action-button__icons">
        {@render icons()}
      </span>
    {/if}
  </button>
{/if}
