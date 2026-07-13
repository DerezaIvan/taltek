<script lang="ts">
  import { page } from '$app/state';
  import { SeoHead } from '$presentation/components/SeoHead';
  import { ErrorFallback, Main, NotFoundPage } from '$presentation/components/sections';
  import { getPageSeo } from '$shared/constants/seo';

  const isNotFound = $derived(page.status === 404);
  const notFoundSeo = getPageSeo('notFound');
  const pageTitle = $derived(isNotFound ? notFoundSeo.title : 'Ошибка — АО «ТалТЭК Транс»');
  const pageDescription = $derived(
    isNotFound ? notFoundSeo.description : 'Произошла ошибка при загрузке страницы.'
  );
  const pageUrl = $derived(`${notFoundSeo.url.replace(/404\/$/, '')}${page.url.pathname}`);
</script>

<SeoHead
  title={pageTitle}
  description={pageDescription}
  url={pageUrl}
  robots="noindex, nofollow"
  ogImage={notFoundSeo.ogImage}
/>

{#if isNotFound}
  <NotFoundPage />
{:else}
  <Main>
    {#snippet pageHero()}
      <ErrorFallback />
    {/snippet}
  </Main>
{/if}
