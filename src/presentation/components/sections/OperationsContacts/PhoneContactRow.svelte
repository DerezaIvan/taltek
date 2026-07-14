<script lang="ts">
  import { IconPhone } from '$presentation/components/icons';

  let {
    phone,
    phoneHref,
    badge,
  }: {
    phone: string;
    phoneHref: string;
    badge?: string;
  } = $props();
</script>

<style lang="scss">
  @use './_phone-contact-row.scss';
</style>

<div class="phone-contact-row">
  <span class="phone-contact-row__icon" aria-hidden="true">
    <IconPhone />
  </span>

  <a class="phone-contact-row__phone" href={phoneHref}>{phone}</a>

  {#if badge}
    <span class="phone-contact-row__badge">{badge}</span>
  {/if}
</div>
