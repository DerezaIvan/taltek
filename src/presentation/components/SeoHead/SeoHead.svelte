<script lang="ts">
  interface Props {
    title: string;
    description: string;
    url: string;
    robots?: string;
    ogImage?: string;
    ogType?: string;
    siteName?: string;
  }

  let {
    title,
    description,
    url,
    robots = 'index, follow',
    ogImage,
    ogType = 'website',
    siteName = 'АО «ТалТЭК Транс»',
  }: Props = $props();
</script>

<svelte:head>
  <title>{title}</title>
  <meta name="description" content={description} />
  <meta name="robots" content={robots} />
  <link rel="canonical" href={url} />

  <meta property="og:title" content={title} />
  <meta property="og:description" content={description} />
  <meta property="og:type" content={ogType} />
  <meta property="og:url" content={url} />
  <meta property="og:site_name" content={siteName} />
  {#if ogImage}
    <meta property="og:image" content={ogImage} />
  {/if}

  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content={title} />
  <meta name="twitter:description" content={description} />
  {#if ogImage}
    <meta name="twitter:image" content={ogImage} />
  {/if}
</svelte:head>
