<script lang="ts">
  import { browser } from '$app/environment';
  import { asset } from '$app/paths';
  import {
    IconDeliveryCrane,
    IconDeliveryDocuments,
    IconDeliveryRoute,
  } from '$presentation/components/icons';
  import {
    DELIVERY_ADAPTIVE_IMAGES,
    DELIVERY_BOTTOM_ROW,
    DELIVERY_IMAGES,
    DELIVERY_SECTION_TITLE,
    DELIVERY_SIDE_IMAGE,
    DELIVERY_STEPS,
    DELIVERY_TOP_ROWS,
    getDeliveryStep,
    type DeliveryIconId,
    type DeliveryImageKey,
    type DeliveryRowItem,
    type DeliveryStep,
  } from '$shared/constants/delivery';
  import type { Component } from 'svelte';

  type DeliveryLayout = 'mosaic' | 'wide' | 'stack';

  const deliveryIcons: Record<DeliveryIconId, Component> = {
    route: IconDeliveryRoute,
    crane: IconDeliveryCrane,
    documents: IconDeliveryDocuments,
  };

  const deliveryStepsFirst = DELIVERY_STEPS.slice(0, 2);
  const deliveryStepsLast = DELIVERY_STEPS.slice(2);
  const taltekAdaptiveImage = DELIVERY_ADAPTIVE_IMAGES[0];
  const train2AdaptiveImage = DELIVERY_ADAPTIVE_IMAGES[1];

  let deliveryLayout = $state<DeliveryLayout>('mosaic');

  function resolveDeliveryLayout(): DeliveryLayout {
    if (window.matchMedia('(max-width: 1023px)').matches) return 'stack';
    if (window.matchMedia('(max-width: 1399px)').matches) return 'wide';
    return 'mosaic';
  }

  function itemSizeStyle(width: number, height: number): string {
    return `flex: 0 0 ${width}px; width: ${width}px; min-width: ${width}px; max-width: ${width}px; height: ${height}px;`;
  }

  if (browser) {
    $effect(() => {
      const updateLayout = () => {
        deliveryLayout = resolveDeliveryLayout();
      };

      updateLayout();

      const stackMedia = window.matchMedia('(max-width: 1023px)');
      const wideMedia = window.matchMedia('(max-width: 1399px)');

      stackMedia.addEventListener('change', updateLayout);
      wideMedia.addEventListener('change', updateLayout);

      return () => {
        stackMedia.removeEventListener('change', updateLayout);
        wideMedia.removeEventListener('change', updateLayout);
      };
    });
  }
</script>

<style lang="scss">
  @use './_delivery.scss';
</style>

{#snippet adaptiveImage(image: (typeof DELIVERY_ADAPTIVE_IMAGES)[number])}
  <img
    class="delivery__image delivery__image--adaptive"
    loading="lazy"
    decoding="async"
    src={asset(DELIVERY_IMAGES[image.imageKey])}
    alt={image.alt}
    width={image.width}
    height={image.height}
  />
{/snippet}

{#snippet deliveryCard(step: DeliveryStep)}
  <article class="delivery__card">
    <h3 class="delivery__card-title">{step.title}</h3>
    <p class="delivery__card-desc">{step.description}</p>
    <span class="delivery__card-num" aria-hidden="true">{step.id}</span>
  </article>
{/snippet}

{#snippet deliveryImage(
  imageKey: DeliveryImageKey,
  alt: string,
  width: number,
  height: number,
  modifier = ''
)}
  {@const src = DELIVERY_IMAGES[imageKey]}
  <img
    class="delivery__image{modifier ? ` delivery__image${modifier}` : ''}"
    style={itemSizeStyle(width, height)}
    loading="lazy"
    decoding="async"
    src={asset(src)}
    {alt}
    {width}
    {height}
  />
{/snippet}

{#snippet rowItem(item: DeliveryRowItem)}
  {#if item.type === 'text'}
    {@const step = getDeliveryStep(item.stepId)}
    <article class="delivery__card" style={itemSizeStyle(item.width, item.height)}>
      <h3 class="delivery__card-title">{step.title}</h3>
      <p class="delivery__card-desc">{step.description}</p>
      <span class="delivery__card-num" aria-hidden="true">{step.id}</span>
    </article>
  {:else if item.type === 'icon'}
    {@const Icon = deliveryIcons[item.iconId]}
    <div class="delivery__icon" style={itemSizeStyle(item.width, item.height)} aria-hidden="true">
      <Icon />
    </div>
  {:else}
    {@render deliveryImage(item.imageKey, item.alt, item.width, item.height)}
  {/if}
{/snippet}

<section class="delivery" aria-labelledby="delivery-title">
  <div class="container">
    <h2 id="delivery-title" class="delivery__title">
      {DELIVERY_SECTION_TITLE}
    </h2>

    {#if deliveryLayout === 'mosaic'}
      <div class="delivery__mosaic">
        <div class="delivery__top">
          <div class="delivery__top-rows">
            {#each DELIVERY_TOP_ROWS as row, rowIndex (rowIndex)}
              <div class="delivery__row">
                {#each row as item, itemIndex (`${rowIndex}-${itemIndex}`)}
                  {@render rowItem(item)}
                {/each}
              </div>
            {/each}
          </div>

          {@render deliveryImage(
            DELIVERY_SIDE_IMAGE.imageKey,
            DELIVERY_SIDE_IMAGE.alt,
            DELIVERY_SIDE_IMAGE.width,
            DELIVERY_SIDE_IMAGE.height,
            '--side'
          )}
        </div>

        <div class="delivery__row delivery__bottom">
          {#each DELIVERY_BOTTOM_ROW as item, index (index)}
            {@render rowItem(item)}
          {/each}
        </div>
      </div>
    {:else if deliveryLayout === 'wide'}
      <div class="delivery__adaptive delivery__adaptive--wide">
        <div class="delivery__media">
          {#each DELIVERY_ADAPTIVE_IMAGES as image (image.imageKey)}
            {@render adaptiveImage(image)}
          {/each}
        </div>

        <div class="delivery__cards">
          {#each DELIVERY_STEPS as step (step.id)}
            {@render deliveryCard(step)}
          {/each}
        </div>
      </div>
    {:else}
      <div class="delivery__adaptive delivery__adaptive--stack">
        {#each deliveryStepsFirst as step (step.id)}
          {@render deliveryCard(step)}
        {/each}

        {@render adaptiveImage(taltekAdaptiveImage)}

        {#each deliveryStepsLast as step (step.id)}
          {@render deliveryCard(step)}
        {/each}

        {@render adaptiveImage(train2AdaptiveImage)}
      </div>
    {/if}
  </div>
</section>
