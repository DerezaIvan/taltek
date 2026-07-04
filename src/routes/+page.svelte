<script lang="ts">
  import { Main } from '$presentation/components/sections';
  import { JSON_LD_ORGANIZATION } from '$shared/constants/seo';
  import type { PageData } from './$types';

  let { data }: { data: PageData } = $props();
</script>

<svelte:head>
  <title>{data.page.title}</title>
  <meta name="description" content={data.page.description} />
  <meta name="robots" content="index, follow" />
  <link rel="canonical" href={data.page.url} />
  {@html `<script type="application/ld+json">${JSON.stringify(JSON_LD_ORGANIZATION)}</script>`}
</svelte:head>

<Main heroTitle={data.page.heroTitle} heroSubtitle={data.page.heroSubtitle} />
