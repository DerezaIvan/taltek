<script lang="ts">
  import type { TerritoryCardData } from '$shared/constants/operations-contacts';
  import PhoneContactRow from './PhoneContactRow.svelte';

  let { card }: { card: TerritoryCardData } = $props();
</script>

<style lang="scss">
  @use './_territory-card.scss';
</style>

<article class="territory-card">
  <h3 class="territory-card__title">{card.city}</h3>

  <div class="territory-card__phone">
    <PhoneContactRow phone={card.phone} phoneHref={card.phoneHref} />
  </div>
</article>
