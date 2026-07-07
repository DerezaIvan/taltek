<script lang="ts">
  import { ActionButton } from '$presentation/components/ui';
  import { IconWagonBox, IconWagonFlat, IconWagonHopper } from '$presentation/components/icons';
  import { REQUEST_BUTTON_LABEL } from '$shared/constants/request';
  import type { RequestButtonProps } from '$shared/interfaces';

  let {
    variant = 'glass',
    href,
    type = 'button',
    disabled = false,
    ...rest
  }: RequestButtonProps = $props();
</script>

<ActionButton {variant} {href} {type} {disabled} {...rest}>
  {REQUEST_BUTTON_LABEL}
  {#snippet icons()}
    <IconWagonHopper />
    <IconWagonFlat />
    <IconWagonBox />
  {/snippet}
</ActionButton>
