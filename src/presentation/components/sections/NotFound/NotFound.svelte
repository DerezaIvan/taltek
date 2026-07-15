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
  import type { NotFoundProps } from '$shared/interfaces';

  let {
    code = NOT_FOUND_CODE,
    title = NOT_FOUND_TITLE,
    description = NOT_FOUND_DESCRIPTION,
    homeLabel = NOT_FOUND_HOME_LABEL,
    homeHref = resolve('/'),
    showRequestButton = true,
  }: NotFoundProps = $props();
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
      <p class="not-found__code" aria-hidden="true">{code}</p>

      <h1 id="not-found-title" class="not-found__title">{title}</h1>

      <p class="not-found__description">{description}</p>

      <div class="not-found__actions">
        {#if showRequestButton}
          <RequestButton variant="glass" />
        {/if}

        <ActionButton variant="ghost" href={homeHref}>
          {homeLabel}
          <IconArrowUpRight />
        </ActionButton>
      </div>
    </div>
  </div>
</section>
