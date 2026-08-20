<script lang="ts">
  import { page } from '$app/state';
  import { ErrorFallback, Main, NotFoundPage } from '$presentation/components/sections';
  import { SeoHead } from '$presentation/components/SeoHead';
  import { getPageSeo } from '$shared/constants/seo';

  const isNotFound = $derived(page.status === 404);
  const seo = getPageSeo('notFound');
</script>

<SeoHead
  title={seo.title}
  description={seo.description}
  url={seo.url}
  ogImage={seo.ogImage}
  robots="noindex, nofollow"
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
