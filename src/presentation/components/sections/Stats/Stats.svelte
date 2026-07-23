<script lang="ts">
  import { asset } from '$app/paths';
  import {
    STATS_BACKGROUND_IMAGE,
    STATS_ITEMS,
    STATS_SECTION_TITLE,
  } from '$shared/constants/stats';
  import type { DirectusStatsItemRecord } from '$infrastructure/cms/types';

  const { items = null }: { items?: DirectusStatsItemRecord[] | null } = $props();

  const statsItems = $derived(items && items.length > 0 ? items : STATS_ITEMS);
</script>

<style lang="scss">
  @use './_stats.scss';
</style>

<section class="stats" aria-labelledby="stats-title">
  <div class="stats__bg" aria-hidden="true">
    <img
      class="stats__bg-image"
      src={asset(STATS_BACKGROUND_IMAGE)}
      alt=""
      width="1888"
      height="537"
      loading="eager"
      decoding="async"
    />
    <div class="stats__overlay"></div>
  </div>

  <div class="container-wide stats__inner">
    <h2 id="stats-title" class="stats__title">
      {STATS_SECTION_TITLE}
    </h2>

    <dl class="stats__grid">
      {#each statsItems as item (item.id)}
        <div class="stats__item">
          <dt class="stats__item-label">{item.label}</dt>
          <dd class="stats__item-value">{item.value}</dd>
          <dd class="stats__item-desc">{item.description}</dd>
        </div>
      {/each}
    </dl>
  </div>
</section>
