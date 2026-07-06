<script lang="ts">
  import { asset } from '$app/paths';
  import {
    IconDeliveryCrane,
    IconDeliveryDocuments,
    IconDeliveryRoute,
  } from '$presentation/components/icons';
  import {
    DELIVERY_BOTTOM_ROW,
    DELIVERY_IMAGES,
    DELIVERY_SECTION_TITLE,
    DELIVERY_SIDE_IMAGE,
    DELIVERY_TOP_ROWS,
    getDeliveryStep,
    type DeliveryIconId,
    type DeliveryImageKey,
    type DeliveryRowItem,
  } from '$shared/constants/delivery';
  import type { Component } from 'svelte';

  const deliveryIcons: Record<DeliveryIconId, Component> = {
    route: IconDeliveryRoute,
    crane: IconDeliveryCrane,
    documents: IconDeliveryDocuments,
  };

  function itemSizeStyle(width: number, height: number): string {
    return `flex: 0 0 ${width}px; width: ${width}px; min-width: ${width}px; max-width: ${width}px; height: ${height}px;`;
  }
</script>

<style lang="scss">
  @use './_delivery.scss';
</style>

{#snippet deliveryImage(
  imageKey: DeliveryImageKey,
  alt: string,
  width: number,
  height: number,
  modifier = ''
)}
  {@const images = DELIVERY_IMAGES[imageKey]}
  <picture
    class="delivery__image{modifier ? ` delivery__image${modifier}` : ''}"
    style={itemSizeStyle(width, height)}
  >
    <source srcset={asset(images.webp)} type="image/webp" />
    <img loading="lazy" decoding="async" src={asset(images.png)} {alt} {width} {height} />
  </picture>
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
</section>
