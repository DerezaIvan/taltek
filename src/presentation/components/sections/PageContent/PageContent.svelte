<script lang="ts">
  import type { Snippet } from 'svelte';

  interface Props {
    title: string;
    description?: string;
    children?: Snippet;
  }

  let { title, description, children }: Props = $props();
</script>

<style lang="scss">
  @use './_page-content.scss';
</style>

<section class="page-content">
  <div class="container">
    <h1 class="h3 page-content__title" data-anim="fade-up">{title}</h1>

    {#if description}
      <p class="body1 page-content__text" data-anim="fade-up" data-anim-delay="1">
        {description}
      </p>
    {/if}

    {#if children}
      <div data-anim="fade-up" data-anim-delay="2">
        {@render children()}
      </div>
    {/if}
  </div>
</section>
