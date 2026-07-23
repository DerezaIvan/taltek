<script lang="ts">
  import { IconAt, IconLocationPin, IconPhone } from '$presentation/components/icons';
  import { CONTACTS_HOTLINE, CONTACTS_INFO } from '$shared/constants/contacts';
  import type { SiteSettings } from '$infrastructure/cms/types';

  const { settings = null }: { settings?: SiteSettings | null } = $props();

  const hotlinePhone = $derived(settings?.hotlinePhoneDisplay || CONTACTS_HOTLINE.phone);
  const hotlinePhoneHref = $derived(settings?.hotlinePhoneHref || CONTACTS_HOTLINE.phoneHref);
  const address = $derived(settings?.mainAddress || CONTACTS_INFO.address);
  const emails = $derived(
    settings?.contactEmails && settings.contactEmails.length > 0
      ? settings.contactEmails
      : CONTACTS_INFO.emails
  );
</script>

<style lang="scss">
  @use './_contacts-info.scss';
</style>

<aside class="contacts-info" aria-label="Контактная информация">
  <article class="contacts-info__card contacts-info__card--hotline">
    <h3 class="contacts-info__title">{CONTACTS_HOTLINE.title}</h3>

    <div class="contacts-info__row">
      <span class="contacts-info__icon" aria-hidden="true">
        <IconPhone />
      </span>

      <div class="contacts-info__content">
        <a class="contacts-info__phone" href={hotlinePhoneHref}>
          {hotlinePhone}
        </a>
        <p class="contacts-info__subtitle">{CONTACTS_HOTLINE.subtitle}</p>
      </div>
    </div>
  </article>

  <article class="contacts-info__card">
    <h3 class="contacts-info__title">{CONTACTS_INFO.title}</h3>

    <div class="contacts-info__row">
      <span class="contacts-info__icon" aria-hidden="true">
        <IconLocationPin />
      </span>

      <p class="contacts-info__text">{address}</p>
    </div>

    <div class="contacts-info__row">
      <span class="contacts-info__icon" aria-hidden="true">
        <IconAt />
      </span>

      <div class="contacts-info__emails">
        {#each emails as email (email.href)}
          <a class="contacts-info__email" href={email.href}>{email.label}</a>
        {/each}
      </div>
    </div>
  </article>
</aside>
