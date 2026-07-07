<script lang="ts">
  import { Main, PageHero, PrivacyContent } from '$presentation/components/sections';
  import { PAGE_HERO_IMAGE, PAGE_HERO_IMAGE_POSITION } from '$shared/constants/page-hero';
  import { getPageSeo } from '$shared/constants/seo';

  const seo = getPageSeo('privacy');

  const breadcrumbs = [{ label: 'Главная', href: '/' }, { label: 'Политика конфиденциальности' }];

  const titleLines = ['Политика конфиденциальности'];
</script>

<svelte:head>
  <title>{seo.title}</title>
  <meta name="description" content={seo.description} />
  <meta name="robots" content="index, follow" />
  <link rel="canonical" href={seo.url} />
</svelte:head>

<Main>
  {#snippet pageHero()}
    <PageHero
      imageSrc={PAGE_HERO_IMAGE}
      imagePosition={PAGE_HERO_IMAGE_POSITION}
      {breadcrumbs}
      {titleLines}
    />
  {/snippet}

  <PrivacyContent />
</Main>
