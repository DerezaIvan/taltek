<script lang="ts">
  import { Main, PageHero } from '$presentation/components/sections';
  import { getPageSeo } from '$shared/constants/seo';

  const seo = getPageSeo('services');

  const breadcrumbs = [
    { label: 'Главная', href: '/' },
    { label: 'Услуги и подвижной состав' },
  ];

  const titleLines = [
    'Максимально надёжное и оперативное решение Ваших транспортных задач',
  ];
</script>

<svelte:head>
  <title>{seo.title}</title>
  <meta name="description" content={seo.description} />
  <meta name="robots" content="index, follow" />
  <link rel="canonical" href={seo.url} />
</svelte:head>

<Main>
  {#snippet pageHero()}
    <PageHero imageSrc="/images/services-hero.webp" {breadcrumbs} {titleLines} />
  {/snippet}
</Main>
