<script lang="ts">
  // TODO: SEO временно отключено
  // import { SeoHead } from '$presentation/components/SeoHead';
  import {
    FleetModels,
    FleetPark,
    KeyServices,
    Main,
    PageHero,
    WhyUs,
    Cta,
  } from '$presentation/components/sections';
  import { SERVICES_CTA_SUBTITLE, SERVICES_CTA_TITLE } from '$shared/constants/cta';
  // import { getPageSeo } from '$shared/constants/seo';

  // const seo = getPageSeo('services');

  const breadcrumbs = [{ label: 'Главная', href: '/' }, { label: 'Услуги и подвижной состав' }];

  const titleLines = ['Максимально надёжное и оперативное решение Ваших транспортных задач'];
</script>

<!-- TODO: SEO временно отключено -->
<!-- <SeoHead title={seo.title} description={seo.description} url={seo.url} ogImage={seo.ogImage} /> -->

<Main>
  {#snippet pageHero()}
    <PageHero imageSrc="/images/services-hero.webp" {breadcrumbs} {titleLines} />
  {/snippet}

  <KeyServices />
  <WhyUs />
  <FleetModels />
  <FleetPark />
  <Cta title={SERVICES_CTA_TITLE} subtitle={SERVICES_CTA_SUBTITLE} />
</Main>
