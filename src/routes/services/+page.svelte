<script lang="ts">
  import {
    FleetModels,
    FleetPark,
    KeyServices,
    Main,
    PageHero,
    Cta,
  } from '$presentation/components/sections';
  import { SERVICES_CTA_SUBTITLE, SERVICES_CTA_TITLE } from '$shared/constants/cta';
  import { SeoHead } from '$presentation/components/SeoHead';

  const { data } = $props();

  const breadcrumbs = [{ label: 'Главная', href: '/' }, { label: 'Услуги и подвижной состав' }];

  const titleLines = ['Максимально надёжное и оперативное решение Ваших транспортных задач'];
</script>

<SeoHead
  title={data.page.title}
  description={data.page.description}
  url={data.page.url}
  ogImage={data.page.ogImage}
/>

<Main>
  {#snippet pageHero()}
    <PageHero
      imageSrc={data.services?.hero?.image ?? '/images/services-hero.webp'}
      {breadcrumbs}
      {titleLines} />
  {/snippet}

  <KeyServices items={data.services?.keyServices ?? null} />
  <FleetModels models={data.services?.fleetModels ?? null} />
  <FleetPark
    title={data.services?.fleetParkTitle ?? null}
    cards={data.services?.fleetParkCards ?? null} />
  <Cta
    title={data.services?.cta?.title ?? SERVICES_CTA_TITLE}
    subtitle={data.services?.cta?.subtitle ?? SERVICES_CTA_SUBTITLE} />
</Main>
