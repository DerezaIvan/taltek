<script lang="ts">
  import { SeoHead } from '$presentation/components/SeoHead';
  import { NotFoundPage } from '$presentation/components/sections';
  import { getPageSeo } from '$shared/constants/seo';

  const seo = getPageSeo('notFound');
</script>

<SeoHead
  title={seo.title}
  description={seo.description}
  url={seo.url}
  robots="noindex, nofollow"
  ogImage={seo.ogImage}
/>

<NotFoundPage />
