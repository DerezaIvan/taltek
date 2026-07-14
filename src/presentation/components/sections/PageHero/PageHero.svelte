<script lang="ts">
  import { asset } from '$app/paths';
  import { Breadcrumbs } from '$presentation/components/ui';
  import type { PageHeroProps } from '$shared/interfaces';

  let { imageSrc, breadcrumbs, titleLines, subtitle, imagePosition }: PageHeroProps = $props();
</script>

<style lang="scss">
  @use './_page-hero.scss';
</style>

<section class="page-hero">
  <div class="page-hero__media" aria-hidden="true">
    <img
      class="page-hero__image"
      src={asset(imageSrc)}
      alt=""
      style:object-position={imagePosition}
    />
    <div class="page-hero__overlay"></div>
  </div>

  <div class="page-hero__content">
    <div class="container page-hero__body">
      <div class="page-hero__breadcrumbs">
        <Breadcrumbs items={breadcrumbs} />
      </div>

      <h1 class="page-hero__title">
        {#each titleLines as line (line)}
          <span class="page-hero__title-line">{line}</span>
        {/each}
      </h1>

      {#if subtitle}
        <p class="page-hero__subtitle">{subtitle}</p>
      {/if}
    </div>
  </div>
</section>
