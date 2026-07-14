<script lang="ts">
  import { asset } from '$app/paths';
  import { OUR_MISSION_IMAGES } from '$shared/constants/our-mission';
</script>

<style lang="scss">
  @use './_our-mission.scss';
</style>

<section class="our-mission">
  <div class="our-mission__inner">
    {#each OUR_MISSION_IMAGES as image (image.src)}
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
  </div>
</section>
