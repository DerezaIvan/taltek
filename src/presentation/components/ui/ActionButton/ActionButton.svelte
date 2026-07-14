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
    {#if icons}
      <span class="action-button__content">
        <span class="action-button__runway" aria-hidden="true">
          {@render icons()}
        </span>
        <span class="action-button__label">
          {@render children?.()}
        </span>
      </span>
    {:else}
      {@render children?.()}
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
    {#if icons}
      <span class="action-button__content">
        <span class="action-button__runway" aria-hidden="true">
          {@render icons()}
        </span>
        <span class="action-button__label">
          {@render children?.()}
        </span>
      </span>
    {:else}
      {@render children?.()}
    {/if}
  </button>
{/if}
