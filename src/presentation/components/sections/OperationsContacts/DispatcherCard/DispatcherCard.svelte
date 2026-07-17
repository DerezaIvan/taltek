<script lang="ts">
  import type { DispatcherCardData } from '$shared/constants/operations-contacts';
  import { EmailContactRow, PhoneContactRow } from '$presentation/components/sections/OperationsContacts';

  let { card }: { card: DispatcherCardData } = $props();
</script>

<style lang="scss">
  @use './_dispatcher-card.scss';
</style>

<article class="dispatcher-card">
  <h3 class="dispatcher-card__title">{card.title}</h3>

  <div class="dispatcher-card__contacts">
    <div class="dispatcher-card__phone">
      <PhoneContactRow phone={card.phone} phoneHref={card.phoneHref} badge={card.badge} />
    </div>

    {#if card.phone2 && card.phoneHref2}
      <div class="dispatcher-card__phone">
        <PhoneContactRow phone={card.phone2} phoneHref={card.phoneHref2} badge={card.badge2} />
      </div>
    {/if}

    {#if card.email}
      <div class="dispatcher-card__email">
        <EmailContactRow email={card.email} />
      </div>
    {/if}
  </div>
</article>
