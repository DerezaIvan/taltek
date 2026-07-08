<script lang="ts">
  import { resolve } from '$app/paths';
  import { ActionButton } from '$presentation/components/ui';
  import { IconWagonBox, IconWagonFlat, IconWagonHopper } from '$presentation/components/icons';
  import { CONTACTS_FORM_ANCHOR } from '$shared/constants/navigation';
  import { REQUEST_BUTTON_LABEL } from '$shared/constants/request';
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

<ActionButton {variant} href={requestHref} {type} {disabled} {...rest}>
  {REQUEST_BUTTON_LABEL}
  {#snippet icons()}
    <span class="action-button__icons-set action-button__icons-set--clone">
      <IconWagonHopper />
      <IconWagonFlat />
      <IconWagonBox />
    </span>
    <span class="action-button__icons-set action-button__icons-set--active">
      <IconWagonHopper />
      <IconWagonFlat />
      <IconWagonBox />
    </span>
  {/snippet}
</ActionButton>
