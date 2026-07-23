<script lang="ts">
  import { asset } from '$app/paths';
  import {
    ABOUT_INTRO_IMAGE,
    ABOUT_INTRO_IMAGE_ALT,
    ABOUT_INTRO_LEAD,
    ABOUT_INTRO_PARAGRAPHS,
    ABOUT_INTRO_TITLE,
  } from '$shared/constants/about-intro';
  import { getAssetUrl } from '$infrastructure/cms/assets';
  import type { DirectusAboutIntroRecord } from '$infrastructure/cms/types';

  const { item = null }: { item?: DirectusAboutIntroRecord | null } = $props();

  const title = $derived(item?.title ?? ABOUT_INTRO_TITLE);
  const lead = $derived(item?.lead ?? ABOUT_INTRO_LEAD);
  const paragraphs = $derived(
    item?.paragraphs && item.paragraphs.length > 0 ? item.paragraphs : ABOUT_INTRO_PARAGRAPHS
  );
  const imageFileId = $derived(
    typeof item?.image === 'string' ? item.image : (item?.image?.id ?? undefined)
  );
  const imageSrc = $derived(getAssetUrl(imageFileId) ?? asset(ABOUT_INTRO_IMAGE));
  const imageAlt = $derived(item?.image_alt ?? ABOUT_INTRO_IMAGE_ALT);
</script>

<style lang="scss">
  @use './_about-intro.scss';
</style>

<section class="about-intro" aria-labelledby="about-intro-title">
  <div class="container about-intro__inner">
    <div class="about-intro__content">
      <h2 id="about-intro-title" class="about-intro__title">
        {title}
      </h2>

      <p class="about-intro__lead">
        {lead}
      </p>

      <div class="about-intro__body">
        {#each paragraphs as paragraph (paragraph)}
          <p class="about-intro__paragraph">{paragraph}</p>
        {/each}
      </div>
    </div>

    <figure class="about-intro__media">
      <img
        class="about-intro__image"
        src={imageSrc}
        alt={imageAlt}
        width="692"
        height="461"
        loading="lazy"
        decoding="async"
      />
    </figure>
  </div>
</section>
