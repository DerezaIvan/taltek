<script lang="ts">
  import { IconAt } from '$presentation/components/icons';

  let {
    email,
  }: {
    email: string;
  } = $props();
</script>

<style lang="scss">
  @use './_email-contact-row.scss';
</style>

<div class="email-contact-row">
  <span class="email-contact-row__icon" aria-hidden="true">
    <IconAt />
  </span>

  <a class="email-contact-row__email" href="mailto:{email}">{email}</a>
</div>
