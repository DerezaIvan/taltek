<script lang="ts">
  import { RequestButton } from '$presentation/components/ui';
  import type { CtaProps } from '$shared/interfaces';

  let { title, subtitle }: CtaProps = $props();
</script>

<style lang="scss">
  @use './_cta.scss';
</style>

<section class="cta" aria-labelledby="cta-title">
  <div class="container cta__inner">
    <div class="cta__text">
      <h2 id="cta-title" class="cta__title">
        {title}
      </h2>

      <p class="cta__subtitle">
        {subtitle}
      </p>
    </div>

    <RequestButton variant="solid" />
  </div>
</section>
