<script lang="ts">
  import { SeoHead } from '$presentation/components/SeoHead';
  import { Cta, Delivery, Main, Stats } from '$presentation/components/sections';
  import { CTA_SECTION_SUBTITLE, CTA_SECTION_TITLE } from '$shared/constants/cta';
  import { JSON_LD_ORGANIZATION } from '$shared/constants/seo';
  import type { PageData } from './$types';

  let { data }: { data: PageData } = $props();
</script>

<SeoHead
  title={data.page.title}
  description={data.page.description}
  url={data.page.url}
  ogImage={data.page.ogImage}
/>

{@html `\u003cscript type="application/ld+json"\u003e${JSON.stringify(JSON_LD_ORGANIZATION)}\u003c/script\u003e`}

<Main heroTitle={data.page.heroTitle} heroSubtitle={data.page.heroSubtitle}>
  {#snippet afterHero()}
    <Delivery />
    <Stats />
    <Cta title={CTA_SECTION_TITLE} subtitle={CTA_SECTION_SUBTITLE} />
  {/snippet}
</Main>
