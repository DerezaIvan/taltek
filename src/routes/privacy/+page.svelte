<script lang="ts">
  import { Main, PageHero, PrivacyContent } from '$presentation/components/sections';
  import { PAGE_HERO_IMAGE, PAGE_HERO_IMAGE_POSITION } from '$shared/constants/page-hero';
  import { SeoHead } from '$presentation/components/SeoHead';

  const { data } = $props();

  const breadcrumbs = [{ label: 'Главная', href: '/' }, { label: 'Политика конфиденциальности' }];

  const titleLines = ['Политика конфиденциальности'];
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
      imageSrc={PAGE_HERO_IMAGE}
      imagePosition={PAGE_HERO_IMAGE_POSITION}
      {breadcrumbs}
      {titleLines}
    />
  {/snippet}

  <PrivacyContent content={data.privacy} />
</Main>
