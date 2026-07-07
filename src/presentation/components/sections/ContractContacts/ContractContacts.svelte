<script lang="ts">
  import { asset } from '$app/paths';
  import {
    CONTRACT_CONTACTS_BACKGROUND,
    CONTRACT_CONTACTS_BACKGROUND_HEIGHT,
    CONTRACT_CONTACTS_BACKGROUND_WIDTH,
    CONTRACT_CONTACTS_CARDS,
    CONTRACT_CONTACTS_TITLE,
  } from '$shared/constants/contract-contacts';
  import ContractContactCard from './ContractContactCard.svelte';
</script>

<style lang="scss">
  @use './_contract-contacts.scss';
</style>

<section class="contract-contacts" aria-labelledby="contract-contacts-title">
  <div class="contract-contacts__bg" aria-hidden="true">
    <img
      class="contract-contacts__bg-image"
      src={asset(CONTRACT_CONTACTS_BACKGROUND)}
      alt=""
      width={CONTRACT_CONTACTS_BACKGROUND_WIDTH}
      height={CONTRACT_CONTACTS_BACKGROUND_HEIGHT}
      loading="lazy"
      decoding="async"
    />
    <div class="contract-contacts__overlay"></div>
  </div>

  <div class="container-wide contract-contacts__inner">
    <h2 id="contract-contacts-title" class="contract-contacts__title">
      {CONTRACT_CONTACTS_TITLE}
    </h2>

    <ul class="contract-contacts__cards">
      {#each CONTRACT_CONTACTS_CARDS as card (card.id)}
        <li class="contract-contacts__card-item">
          <ContractContactCard {card} />
        </li>
      {/each}
    </ul>
  </div>
</section>
