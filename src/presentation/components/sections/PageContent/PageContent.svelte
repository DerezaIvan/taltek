<script lang="ts">
  import type { PageContentProps } from '$shared/interfaces';

  let { title, description, children }: PageContentProps = $props();
</script>

<style lang="scss">
  @use './_page-content.scss';
</style>

<section class="page-content">
  <div class="container">
    <h1 class="heading-lg page-content__title">{title}</h1>

    {#if description}
      <p class="text-md page-content__text">
        {description}
      </p>
    {/if}

    {#if children}
      <div>
        {@render children()}
      </div>
    {/if}
  </div>
</section>
