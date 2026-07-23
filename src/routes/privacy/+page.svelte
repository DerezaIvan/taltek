<script lang="ts">
  import { Main, PageHero, PrivacyContent } from '$presentation/components/sections';
  import { PAGE_HERO_IMAGE, PAGE_HERO_IMAGE_POSITION } from '$shared/constants/page-hero';

  const { data } = $props();

  const breadcrumbs = [{ label: 'Главная', href: '/' }, { label: 'Политика конфиденциальности' }];

  const titleLines = ['Политика конфиденциальности'];
</script>

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
