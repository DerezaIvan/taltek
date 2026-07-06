<script lang="ts">
  import { RequestButton } from '$presentation/components/ui';
  import { CTA_SECTION_SUBTITLE, CTA_SECTION_TITLE } from '$shared/constants/cta';
</script>

<style lang="scss">
  @use './_cta.scss';
</style>

<section class="cta" aria-labelledby="cta-title">
  <div class="container cta__inner">
    <div class="cta__text">
      <h2 id="cta-title" class="cta__title">
        {CTA_SECTION_TITLE}
      </h2>

      <p class="cta__subtitle">
        {CTA_SECTION_SUBTITLE}
      </p>
    </div>

    <RequestButton variant="solid" />
  </div>
</section>
