<script lang="ts">
  import { asset, resolve } from '$app/paths';
  import { ActionButton, RequestButton } from '$presentation/components/ui';
  import { IconArrowUpRight } from '$presentation/components/icons';
  import { FLEET_MODELS_ANCHOR } from '$shared/constants/navigation';
  import { DEFAULT_HERO_SUBTITLE, DEFAULT_HERO_TITLE } from '$shared/constants/hero';
  import type { HeroProps } from '$shared/interfaces';

  let { title, subtitle }: HeroProps = $props();

  const resolvedTitle = $derived(title?.trim() || DEFAULT_HERO_TITLE);
  const resolvedSubtitle = $derived(subtitle?.trim() || DEFAULT_HERO_SUBTITLE);
</script>

<style lang="scss">
  @use './_hero.scss';
</style>

<section id="hero" class="hero">
  <div class="hero__media" aria-hidden="true">
    <video class="hero__video" autoplay muted loop playsinline>
      <source src={asset('/video/5965009_Train_Pass_By_1920x1080.mp4')} type="video/mp4" />
    </video>
    <div class="hero__overlay"></div>
  </div>

  <div class="hero__content">
    <div class="container hero__body">
      <h1 class="heading-xl hero__title">
        {resolvedTitle}
      </h1>

      <p class="text-md hero__subtitle">
        {resolvedSubtitle}
      </p>

      <div class="hero__actions">
        <RequestButton variant="glass" />

        <ActionButton variant="ghost" href={`${resolve('/services/')}#${FLEET_MODELS_ANCHOR}`}>
          Услуги и парк вагонов
          <IconArrowUpRight />
        </ActionButton>
      </div>
    </div>
  </div>
</section>
