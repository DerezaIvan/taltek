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
    <figure class="our-mission__image our-mission__image--slot-1">
      <img
        src={asset(firstImage.src)}
        alt={firstImage.alt}
        width="340"
        height="405"
        loading="lazy"
        decoding="async"
      />
    </figure>

    <figure class="our-mission__image our-mission__image--slot-2">
      <img
        src={asset(secondImage.src)}
        alt={secondImage.alt}
        width="340"
        height="405"
        loading="lazy"
        decoding="async"
      />
    </figure>

    <div class="our-mission__group">
      <figure class="our-mission__image our-mission__image--slot-3">
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

      <figure class="our-mission__image our-mission__image--slot-4">
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
