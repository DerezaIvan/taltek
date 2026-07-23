<script lang="ts">
  import { asset } from '$app/paths';
  import { OUR_MISSION_IMAGES } from '$shared/constants/our-mission';
  import { getAssetUrl } from '$infrastructure/cms/assets';

  const { gallery = null }: { gallery?: string[] | null } = $props();

  const images = $derived(
    gallery && gallery.length > 0
      ? gallery.map(src => ({ src: getAssetUrl(src) ?? src, alt: '' }))
      : OUR_MISSION_IMAGES.map(image => ({ src: asset(image.src), alt: image.alt }))
  );
</script>

<style lang="scss">
  @use './_our-mission.scss';
</style>

<section class="our-mission">
  <div class="our-mission__inner">
    {#each images as image (image.src)}
      <figure class="our-mission__image">
        <img
          src={image.src}
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
