<script lang="ts">
  import { asset } from '$app/paths';
  import { IconCheckmark } from '$presentation/components/icons';
  import {
    WHAT_YOU_GET_BACKGROUND_IMAGE,
    WHAT_YOU_GET_ITEMS,
    WHAT_YOU_GET_TITLE,
  } from '$shared/constants/what-you-get';
  import type { DirectusWhatYouGetItemRecord } from '$infrastructure/cms/types';

  const { items = null }: { items?: DirectusWhatYouGetItemRecord[] | null } = $props();

  const cards = $derived(items && items.length > 0 ? items : WHAT_YOU_GET_ITEMS);
</script>

<style lang="scss">
  @use './_what-you-get.scss';
</style>

<section class="what-you-get" aria-labelledby="what-you-get-title">
  <div class="what-you-get__bg" aria-hidden="true">
    <img
      class="what-you-get__bg-image"
      src={asset(WHAT_YOU_GET_BACKGROUND_IMAGE)}
      alt=""
      width="5664"
      height="1806"
      loading="lazy"
      decoding="async"
    />
    <div class="what-you-get__overlay"></div>
  </div>

  <div class="container-wide what-you-get__inner">
    <h2 id="what-you-get-title" class="what-you-get__title">
      {WHAT_YOU_GET_TITLE}
    </h2>

    <ul class="what-you-get__grid">
      {#each cards as item (item.id)}
        <li class="what-you-get__card">
          <div class="what-you-get__icon" aria-hidden="true">
            <IconCheckmark />
          </div>
          <p class="what-you-get__card-title">{item.title}</p>
        </li>
      {/each}
    </ul>
  </div>
</section>
