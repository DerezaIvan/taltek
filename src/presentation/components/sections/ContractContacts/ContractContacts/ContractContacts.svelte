<script lang="ts">
  import { asset } from '$app/paths';
  import {
    CONTRACT_CONTACTS_BACKGROUND,
    CONTRACT_CONTACTS_BACKGROUND_HEIGHT,
    CONTRACT_CONTACTS_BACKGROUND_WIDTH,
    CONTRACT_CONTACTS_CARDS,
    CONTRACT_CONTACTS_TITLE,
  } from '$shared/constants/contract-contacts';
  import { ContractContactCard } from '$presentation/components/sections/ContractContacts';
  import type { DirectusContractContactsCardRecord } from '$infrastructure/cms/types';

  const {
    title = null,
    background = null,
    cards = null,
  }: {
    title?: string | null;
    background?: string | null;
    cards?: DirectusContractContactsCardRecord[] | null;
  } = $props();

  const sectionTitle = $derived(title?.trim() ? title : CONTRACT_CONTACTS_TITLE);
  const backgroundImage = $derived(background?.trim() ? background : CONTRACT_CONTACTS_BACKGROUND);
  const contactCards = $derived(
    cards && cards.length > 0
      ? cards.map((card, index) => ({
          id: card.id,
          name: card.name,
          roleLines:
            card.role_lines && card.role_lines.length > 0
              ? card.role_lines
              : (CONTRACT_CONTACTS_CARDS[index]?.roleLines ?? []),
          phone: card.phone,
          phoneHref: card.phone_href,
          email: card.email,
          emailHref: `mailto:${card.email}`,
          photoSrc:
            typeof card.photo === 'string'
              ? card.photo
              : (CONTRACT_CONTACTS_CARDS[index]?.photoSrc ?? ''),
          photoAlt: CONTRACT_CONTACTS_CARDS[index]?.photoAlt ?? card.name,
        }))
      : CONTRACT_CONTACTS_CARDS
  );
</script>

<style lang="scss">
  @use './_contract-contacts.scss';
</style>

<section class="contract-contacts" aria-labelledby="contract-contacts-title">
  <div class="contract-contacts__bg" aria-hidden="true">
    <img
      class="contract-contacts__bg-image"
      src={asset(backgroundImage)}
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
      {sectionTitle}
    </h2>

    <ul class="contract-contacts__cards">
      {#each contactCards as card, index (card.id)}
        <li
          class="contract-contacts__card-item"
          class:contract-contacts__card-item--solo={index === contactCards.length - 1 &&
            contactCards.length % 2 === 1}
        >
          <ContractContactCard {card} />
        </li>
      {/each}
    </ul>
  </div>
</section>
