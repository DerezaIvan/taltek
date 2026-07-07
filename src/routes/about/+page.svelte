<script lang="ts">
  import { AboutIntro, Main, OurMission, PageHero, WhatYouGet, WhyUs } from '$presentation/components/sections';
  import { getPageSeo } from '$shared/constants/seo';

  const seo = getPageSeo('about');

  const breadcrumbs = [{ label: 'Главная', href: '/' }, { label: 'О компании' }];

  const titleLines = ['[ЭКО]ЛОГИЧНЫЙ выбор', 'для Ваших грузов'];
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
</Main>
