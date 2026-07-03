<script lang="ts">
  import { Main, PageContent } from '$presentation/components/sections';
  import { getPageSeo } from '$shared/constants/seo';

  const seo = getPageSeo('contacts');
</script>

<svelte:head>
  <title>{seo.title}</title>
  <meta name="description" content={seo.description} />
  <meta name="robots" content="index, follow" />
  <link rel="canonical" href={seo.url} />
</svelte:head>

<Main>
  <PageContent
    title="Контакты"
    description="Заготовка страницы «Контакты». Контент будет добавлен позже."
  />
</Main>
