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
    type === 'submit' ? href : (href ?? `${resolve('/contacts/')}#${CONTACTS_FORM_ANCHOR}`),
  );
</script>

<ActionButton {variant} href={requestHref} {type} {disabled} {...rest}>
  {REQUEST_BUTTON_LABEL}
  {#snippet icons()}
    <IconWagonHopper />
    <IconWagonFlat />
    <IconWagonBox />
  {/snippet}
</ActionButton>
