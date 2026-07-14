<script lang="ts">
  import { asset } from '$app/paths';
  import type { ContractContactCardData } from '$shared/constants/contract-contacts';

  let { card }: { card: ContractContactCardData } = $props();
</script>

<style lang="scss">
  @use './_contract-contact-card.scss';
</style>

<article class="contract-contact-card">
  <img
    class="contract-contact-card__photo"
    src={asset(card.photoSrc)}
    alt={card.photoAlt}
    width="130"
    height="142"
    loading="lazy"
    decoding="async"
  />

  <div class="contract-contact-card__body">
    <h3 class="contract-contact-card__name">{card.name}</h3>

    <p class="contract-contact-card__role">
      {card.roleLines[0]}<br />
      {card.roleLines[1]}
    </p>

    <dl class="contract-contact-card__contacts">
      <div class="contract-contact-card__contact-row">
        <dt class="contract-contact-card__contact-label">Телефон</dt>
        <dd class="contract-contact-card__contact-value">
          <a class="contract-contact-card__contact-link" href={card.phoneHref}>{card.phone}</a>
        </dd>
      </div>

      <div class="contract-contact-card__contact-row">
        <dt class="contract-contact-card__contact-label">Почта</dt>
        <dd class="contract-contact-card__contact-value">
          <a class="contract-contact-card__contact-link" href={card.emailHref}>{card.email}</a>
        </dd>
      </div>
    </dl>
  </div>
</article>
