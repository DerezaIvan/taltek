<script lang="ts">
  import { Main, PageHero, PrivacyContent } from '$presentation/components/sections';
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
    <PageHero imageSrc="/images/taltek.webp" {breadcrumbs} {titleLines} />
  {/snippet}

  <PrivacyContent />
</Main>
