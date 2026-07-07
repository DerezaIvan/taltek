<script lang="ts">
  import { NotFoundPage } from '$presentation/components/sections';
  import { getPageSeo } from '$shared/constants/seo';

  const seo = getPageSeo('notFound');
</script>

<svelte:head>
  <title>{seo.title}</title>
  <meta name="description" content={seo.description} />
  <meta name="robots" content="noindex, nofollow" />
</svelte:head>

<NotFoundPage />
