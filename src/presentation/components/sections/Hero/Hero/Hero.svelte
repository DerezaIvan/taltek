<script lang="ts">
  import { onMount } from 'svelte';
  import { asset, resolve } from '$app/paths';
  import { ActionButton, RequestButton } from '$presentation/components/ui';
  import { IconArrowExplore } from '$presentation/components/icons';
  import { FLEET_MODELS_ANCHOR } from '$shared/constants/navigation';
  import {
    DEFAULT_HERO_SUBTITLE,
    DEFAULT_HERO_TITLE,
    DEFAULT_HERO_TITLE_MOBILE,
  } from '$shared/constants/hero';
  import type { HeroProps } from '$shared/interfaces';

  let { title, subtitle }: HeroProps = $props();

  const resolvedTitle = $derived(title?.trim() || DEFAULT_HERO_TITLE);
  const resolvedSubtitle = $derived(subtitle?.trim() || DEFAULT_HERO_SUBTITLE);

  const posterUrl = asset('/images/hero-train-loop-poster.webp');
  let isMobile = $state(false);

  onMount(() => {
    isMobile = window.matchMedia('(max-width: 768px)').matches;
  });
</script>

<style lang="scss">
  @use './_hero.scss';
</style>

<svelte:head>
  <link rel="preload" as="image" href={posterUrl} fetchpriority="high" />
</svelte:head>

<section id="hero" class="hero">
  <div class="hero__media" aria-hidden="true">
    <video
      class="hero__video"
      autoplay
      muted
      loop
      playsinline
      preload="metadata"
      poster={posterUrl}
    >
      {#if isMobile}
        <source src={asset('/video/hero-train-loop-720p.webm')} type="video/webm" />
        <source src={asset('/video/hero-train-loop-720p.mp4')} type="video/mp4" />
      {:else}
        <source src={asset('/video/hero-train-loop-1080p.webm')} type="video/webm" />
        <source src={asset('/video/hero-train-loop-1080p.mp4')} type="video/mp4" />
      {/if}
    </video>
    <div class="hero__overlay"></div>
  </div>

  <div class="hero__content">
    <div class="container hero__body">
      <h1 class="heading-xl hero__title">
        {#if !title?.trim()}
          <span class="hero__title-desktop"
            >{@html DEFAULT_HERO_TITLE.replace(/\n/g, '<br />')}</span
          >
          <span class="hero__title-mobile"
            >{@html DEFAULT_HERO_TITLE_MOBILE.replace(/\n/g, '<br />')}</span
          >
        {:else}
          {resolvedTitle}
        {/if}
      </h1>

      <p class="text-md hero__subtitle">
        {resolvedSubtitle}
      </p>

      <div class="hero__actions">
        <RequestButton variant="glass" />

        <ActionButton variant="ghost" href={`${resolve('/services/')}#${FLEET_MODELS_ANCHOR}`}>
          Услуги и парк вагонов
          <IconArrowExplore />
        </ActionButton>
      </div>
    </div>
  </div>
</section>
