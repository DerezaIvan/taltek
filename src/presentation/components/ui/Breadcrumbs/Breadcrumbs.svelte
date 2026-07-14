<script lang="ts">
  import { resolve } from '$app/paths';
  import type { BreadcrumbsProps } from '$shared/interfaces';

  let { items }: BreadcrumbsProps = $props();
</script>

<style lang="scss">
  @use './_breadcrumbs.scss';
</style>

<nav class="breadcrumbs" aria-label="Хлебные крошки">
  <ol class="breadcrumbs__list">
    {#each items as item, index (item.label)}
      <li class="breadcrumbs__item">
        {#if index > 0}
          <span class="breadcrumbs__separator" aria-hidden="true">—</span>
        {/if}

        {#if item.href}
          <a class="breadcrumbs__link text-md" href={resolve(item.href as '/')}>{item.label}</a>
        {:else}
          <span class="breadcrumbs__current text-md" aria-current="page">{item.label}</span>
        {/if}
      </li>
    {/each}
  </ol>
</nav>
