<script lang="ts">
  import { asset } from '$app/paths';
  import {
    ABOUT_INTRO_IMAGE,
    ABOUT_INTRO_IMAGE_ALT,
    ABOUT_INTRO_LEAD,
    ABOUT_INTRO_PARAGRAPHS,
    ABOUT_INTRO_TITLE,
  } from '$shared/constants/about-intro';
</script>

<style lang="scss">
  @use './_about-intro.scss';
</style>

<section class="about-intro" aria-labelledby="about-intro-title">
  <div class="container about-intro__inner">
    <div class="about-intro__content">
      <h2 id="about-intro-title" class="about-intro__title">
        {ABOUT_INTRO_TITLE}
      </h2>

      <p class="about-intro__lead">
        {ABOUT_INTRO_LEAD}
      </p>

      <div class="about-intro__body">
        {#each ABOUT_INTRO_PARAGRAPHS as paragraph (paragraph)}
          <p class="about-intro__paragraph">{paragraph}</p>
        {/each}
      </div>
    </div>

    <figure class="about-intro__media">
      <img
        class="about-intro__image"
        src={asset(ABOUT_INTRO_IMAGE)}
        alt={ABOUT_INTRO_IMAGE_ALT}
        width="692"
        height="461"
        loading="lazy"
        decoding="async"
      />
    </figure>
  </div>
</section>
