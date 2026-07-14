<script lang="ts">
  import type { DispatcherCardData } from '$shared/constants/operations-contacts';
  import PhoneContactRow from './PhoneContactRow.svelte';

  let { card }: { card: DispatcherCardData } = $props();
</script>

<style lang="scss">
  @use './_dispatcher-card.scss';
</style>

<article class="dispatcher-card">
  <h3 class="dispatcher-card__title">{card.title}</h3>

  <div class="dispatcher-card__phone">
    <PhoneContactRow phone={card.phone} phoneHref={card.phoneHref} badge={card.badge} />
  </div>
</article>
