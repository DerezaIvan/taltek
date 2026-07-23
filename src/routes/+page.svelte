<script lang="ts">
  import { Cta, Delivery, Main, Stats } from '$presentation/components/sections';
  import { CTA_SECTION_SUBTITLE, CTA_SECTION_TITLE } from '$shared/constants/cta';
  import type { PageData } from './$types';

  let { data }: { data: PageData } = $props();
</script>

<Main
  heroTitle={data.page.heroTitle}
  heroSubtitle={data.page.heroSubtitle}
  heroBackground={data.home.hero?.background}
>
  {#snippet afterHero()}
    <Delivery title={data.home.deliveryTitle} steps={data.home.deliverySteps} />
    <Stats items={data.home.statsItems} />
    <Cta
      title={data.home.cta?.title ?? CTA_SECTION_TITLE}
      subtitle={data.home.cta?.subtitle ?? CTA_SECTION_SUBTITLE}
    />
  {/snippet}
</Main>
