<script lang="ts">
  import { resolve } from '$app/paths';
  import { ActionButton } from '$presentation/components/ui';
  import { IconWagonBox, IconWagonFlat, IconWagonHopper } from '$presentation/components/icons';
  import { CONTACTS_FORM_ANCHOR } from '$shared/constants/navigation';
  import { REQUEST_BUTTON_CAPTION, REQUEST_BUTTON_LABEL } from '$shared/constants/request';
  import type { RequestButtonProps } from '$shared/interfaces';

  let {
    variant = 'glass',
    href,
    type = 'button',
    disabled = false,
    ...rest
  }: RequestButtonProps = $props();

  const requestHref = $derived(
    type === 'submit' ? href : (href ?? `${resolve('/contacts/')}#${CONTACTS_FORM_ANCHOR}`)
  );
</script>

<style lang="scss">
  .request-button {
    display: inline-flex;
    flex-direction: column;
    align-items: center;
    width: min(280px, 100%);
    max-width: 320px;

    :global(.action-button) {
      width: 100%;
      min-width: 0;
      height: 50px;
    }

    &__title {
      font-family: var(--font-family-uncage);
      font-size: 17px;
      font-weight: 700;
      line-height: 1;
      letter-spacing: 1.4px;
    }

    &__details,
    &__wagons {
      display: inline-flex;
      align-items: center;
    }

    &__details {
      gap: 9px;
      margin-top: 10px;
      color: var(--brand-navy-80);
      font-family: var(--font-family-ubuntu);
      font-size: 11px;
      font-weight: 400;
      line-height: 1;
      letter-spacing: 0.45px;
      text-transform: uppercase;
    }

    &--glass &__details {
      color: rgba(255, 255, 255, 0.82);
    }

    &__wagons {
      gap: 5px;
    }

    &__wagons :global(svg) {
      width: 21px;
      height: auto;
    }

    @media (max-width: 480px) {
      &__title {
        font-size: 15px;
      }

      &__details {
        gap: 8px;
        font-size: 10px;
      }

      &__wagons {
        gap: 4px;
      }

      &__wagons :global(svg) {
        width: 18px;
      }
    }
  }
</style>

<span class="request-button" class:request-button--glass={variant === 'glass'}>
  <ActionButton {variant} href={requestHref} {type} {disabled} pulse {...rest}>
    <span class="request-button__title">{REQUEST_BUTTON_LABEL}</span>
  </ActionButton>
  <span class="request-button__details">
    <span>{REQUEST_BUTTON_CAPTION}</span>
    <span class="request-button__wagons" aria-hidden="true">
      <IconWagonHopper />
      <IconWagonFlat />
      <IconWagonBox />
    </span>
  </span>
</span>
