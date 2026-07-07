<script lang="ts">
  import { page } from '$app/state';
  import { ErrorFallback, Main, NotFoundPage } from '$presentation/components/sections';
  import { getPageSeo } from '$shared/constants/seo';

  const isNotFound = $derived(page.status === 404);
  const notFoundSeo = getPageSeo('notFound');
  const pageTitle = $derived(isNotFound ? notFoundSeo.title : 'Ошибка — Taltek');
  const pageDescription = $derived(isNotFound ? notFoundSeo.description : undefined);
</script>

<svelte:head>
  <title>{pageTitle}</title>
  {#if pageDescription}
    <meta name="description" content={pageDescription} />
  {/if}
  <meta name="robots" content="noindex, nofollow" />
</svelte:head>

{#if isNotFound}
  <NotFoundPage />
{:else}
  <Main>
    {#snippet pageHero()}
      <ErrorFallback />
    {/snippet}
  </Main>
{/if}
