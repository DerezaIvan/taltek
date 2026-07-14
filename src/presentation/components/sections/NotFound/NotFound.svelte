<script lang="ts">
  import { asset, resolve } from '$app/paths';
  import { ActionButton, RequestButton } from '$presentation/components/ui';
  import { IconArrowUpRight } from '$presentation/components/icons';
  import {
    NOT_FOUND_CODE,
    NOT_FOUND_DESCRIPTION,
    NOT_FOUND_HOME_LABEL,
    NOT_FOUND_IMAGE,
    NOT_FOUND_TITLE,
  } from '$shared/constants/not-found';
</script>

<style lang="scss">
  @use './_not-found.scss';
</style>

<section class="not-found" aria-labelledby="not-found-title">
  <div class="not-found__media" aria-hidden="true">
    <img class="not-found__image" src={asset(NOT_FOUND_IMAGE)} alt="" />
    <div class="not-found__overlay"></div>
  </div>

  <div class="not-found__content">
    <div class="container not-found__body">
      <p class="not-found__code" aria-hidden="true">{NOT_FOUND_CODE}</p>

      <h1 id="not-found-title" class="not-found__title">{NOT_FOUND_TITLE}</h1>

      <p class="not-found__description">{NOT_FOUND_DESCRIPTION}</p>

      <div class="not-found__actions">
        <RequestButton variant="glass" />

        <ActionButton variant="ghost" href={resolve('/')}>
          {NOT_FOUND_HOME_LABEL}
          <IconArrowUpRight />
        </ActionButton>
      </div>
    </div>
  </div>
</section>
