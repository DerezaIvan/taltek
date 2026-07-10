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
  import { getPageSeo } from '$shared/constants/seo';

  const seo = getPageSeo('about');

  const breadcrumbs = [{ label: 'Главная', href: '/' }, { label: 'О компании' }];

  const titleLines = ['[ЭКО]ЛОГИЧНЫЙ', 'ВЫБОР ДЛЯ ВАШИХ', 'ГРУЗОВ'];
</script>

<svelte:head>
  <title>{seo.title}</title>
  <meta name="description" content={seo.description} />
  <meta name="robots" content="index, follow" />
  <link rel="canonical" href={seo.url} />
</svelte:head>

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
