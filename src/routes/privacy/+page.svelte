<script lang="ts">
  // TODO: SEO временно отключено
  // import { SeoHead } from '$presentation/components/SeoHead';
  import { Main, PageHero, PrivacyContent } from '$presentation/components/sections';
  import { PAGE_HERO_IMAGE, PAGE_HERO_IMAGE_POSITION } from '$shared/constants/page-hero';
  // import { getPageSeo } from '$shared/constants/seo';

  // const seo = getPageSeo('privacy');

  const breadcrumbs = [{ label: 'Главная', href: '/' }, { label: 'Политика конфиденциальности' }];

  const titleLines = ['Политика конфиденциальности'];
</script>

<!-- TODO: SEO временно отключено -->
<!-- <SeoHead title={seo.title} description={seo.description} url={seo.url} ogImage={seo.ogImage} /> -->

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
