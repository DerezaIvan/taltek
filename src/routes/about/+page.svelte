<script lang="ts">
  import {
    AboutIntro,
    Cta,
    Main,
    OurMission,
    PageHero,
    WhatYouGet,
    WhyUs,
  } from '$presentation/components/sections';
  import { ABOUT_CTA_SUBTITLE, ABOUT_CTA_TITLE } from '$shared/constants/cta';

  const { data } = $props();
  const about = $derived(data.about);

  const breadcrumbs = [{ label: 'Главная', href: '/' }, { label: 'О компании' }];

  const titleLines = ['[ЭКО]ЛОГИЧНЫЙ', 'ВЫБОР ДЛЯ ВАШИХ', 'ГРУЗОВ'];
</script>

<Main>
  {#snippet pageHero()}
    <PageHero
      imageSrc={about.hero?.image ?? '/images/about-hero.webp'}
      imagePosition={about.hero?.imagePosition}
      {breadcrumbs}
      {titleLines}
    />
  {/snippet}

  <AboutIntro item={about.aboutIntro?.[0]} />
  <WhyUs items={about.whyUsItems} />
  <WhatYouGet items={about.whatYouGetItems} />
  <OurMission gallery={about.ourMission?.gallery} />
  <Cta
    title={about.cta?.title ?? ABOUT_CTA_TITLE}
    subtitle={about.cta?.subtitle ?? ABOUT_CTA_SUBTITLE}
  />
</Main>
