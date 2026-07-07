<script lang="ts">
  import { asset } from '$app/paths';
  import {
    OUR_MISSION_IMAGES,
    OUR_MISSION_TEXT,
    OUR_MISSION_TITLE,
  } from '$shared/constants/our-mission';

  const [firstImage, secondImage, thirdImage, fourthImage] = OUR_MISSION_IMAGES;
</script>

<style lang="scss">
  @use './_our-mission.scss';
</style>

<section class="our-mission" aria-labelledby="our-mission-title">
  <div class="our-mission__inner">
    {#each [firstImage, secondImage] as image (image.id)}
      <figure class="our-mission__image">
        <img
          src={asset(image.src)}
          alt={image.alt}
          width="340"
          height="405"
          loading="lazy"
          decoding="async"
        />
      </figure>
    {/each}

    <div class="our-mission__group">
      <figure class="our-mission__image">
        <img
          src={asset(thirdImage.src)}
          alt={thirdImage.alt}
          width="340"
          height="405"
          loading="lazy"
          decoding="async"
        />
      </figure>

      <div class="our-mission__content">
        <h2 id="our-mission-title" class="our-mission__title">
          {OUR_MISSION_TITLE}
        </h2>
        <p class="our-mission__text">{OUR_MISSION_TEXT}</p>
      </div>

      <figure class="our-mission__image">
        <img
          src={asset(fourthImage.src)}
          alt={fourthImage.alt}
          width="340"
          height="405"
          loading="lazy"
          decoding="async"
        />
      </figure>
    </div>
  </div>
</section>
