<script lang="ts">
  import { SeoHead } from '$presentation/components/SeoHead';
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
  import { getPageSeo } from '$shared/constants/seo';

  const seo = getPageSeo('about');

  const breadcrumbs = [{ label: 'Главная', href: '/' }, { label: 'О компании' }];

  const titleLines = ['[ЭКО]ЛОГИЧНЫЙ', 'ВЫБОР ДЛЯ ВАШИХ', 'ГРУЗОВ'];
</script>

<SeoHead title={seo.title} description={seo.description} url={seo.url} ogImage={seo.ogImage} />

<Main>
  {#snippet pageHero()}
    <PageHero imageSrc="/images/about-hero.webp" {breadcrumbs} {titleLines} />
  {/snippet}

  <AboutIntro />
  <WhyUs />
  <WhatYouGet />
  <OurMission />
  <Cta title={ABOUT_CTA_TITLE} subtitle={ABOUT_CTA_SUBTITLE} />
</Main>
