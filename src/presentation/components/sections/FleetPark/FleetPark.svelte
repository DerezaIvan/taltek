<script lang="ts">
  import { asset } from '$app/paths';
  import {
    FLEET_PARK_BACKGROUND_IMAGE,
    FLEET_PARK_FEATURE_CARD,
    FLEET_PARK_SMALL_CARDS,
    FLEET_PARK_TITLE,
  } from '$shared/constants/fleet-park';
  import type { DirectusFleetParkCardRecord } from '$infrastructure/cms/types';

  const {
    title = null,
    cards = null,
  }: { title?: string | null; cards?: DirectusFleetParkCardRecord[] | null } = $props();

  const sectionTitle = $derived(title?.trim() ? title : FLEET_PARK_TITLE);
  const smallCards = $derived(
    cards && cards.length > 0 ? cards.slice(0, FLEET_PARK_SMALL_CARDS.length) : FLEET_PARK_SMALL_CARDS
  );
  const featureCard = $derived(
    cards && cards.length > FLEET_PARK_SMALL_CARDS.length
      ? {
          ...FLEET_PARK_FEATURE_CARD,
          value: cards[cards.length - 1].value,
          label: cards[cards.length - 1].label,
        }
      : FLEET_PARK_FEATURE_CARD
  );
</script>

<style lang="scss">
  @use './_fleet-park.scss';
</style>

<section class="fleet-park" aria-labelledby="fleet-park-title">
  <div class="fleet-park__bg" aria-hidden="true">
    <img
      class="fleet-park__bg-image"
      src={asset(FLEET_PARK_BACKGROUND_IMAGE)}
      alt=""
      width="5664"
      height="1806"
      loading="lazy"
      decoding="async"
    />
    <div class="fleet-park__overlay"></div>
  </div>

  <div class="container-wide fleet-park__inner">
    <h2 id="fleet-park-title" class="fleet-park__title">
      {sectionTitle}
    </h2>

    <ul class="fleet-park__small-cards">
      {#each smallCards as card (card.id)}
        <li class="fleet-park__card fleet-park__card--small">
          <div class="fleet-park__card-body">
            <p class="fleet-park__value">{card.value}</p>
            <p class="fleet-park__label">{card.label}</p>
          </div>
          <span class="fleet-park__badge">{card.badge}</span>
        </li>
      {/each}
    </ul>

    <article class="fleet-park__card fleet-park__card--feature">
      <div class="fleet-park__card-body">
        <p class="fleet-park__value">{featureCard.value}</p>
        <p class="fleet-park__label">{featureCard.label}</p>
      </div>
      <img
        class="fleet-park__illustration"
        src={asset(featureCard.illustrationSrc)}
        alt={featureCard.illustrationAlt}
        aria-hidden="true"
        width="552"
        height="149"
        loading="lazy"
        decoding="async"
      />
    </article>
  </div>
</section>
