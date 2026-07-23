<script lang="ts">
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

  const { data } = $props();

  const breadcrumbs = [{ label: 'Главная', href: '/' }, { label: 'Услуги и подвижной состав' }];

  const titleLines = ['Максимально надёжное и оперативное решение Ваших транспортных задач'];
</script>

<Main>
  {#snippet pageHero()}
    <PageHero
      imageSrc={data.services?.hero?.image ?? '/images/services-hero.webp'}
      {breadcrumbs}
      {titleLines}
    />
  {/snippet}

  <KeyServices items={data.services?.keyServices ?? null} />
  <WhyUs items={data.services?.whyUsItems ?? null} />
  <FleetModels models={data.services?.fleetModels ?? null} />
  <FleetPark title={data.services?.fleetParkTitle ?? null} cards={data.services?.fleetParkCards ?? null} />
  <Cta
    title={data.services?.cta?.title ?? SERVICES_CTA_TITLE}
    subtitle={data.services?.cta?.subtitle ?? SERVICES_CTA_SUBTITLE}
  />
</Main>
