<script lang="ts">
  import { NotFoundPage } from '$presentation/components/sections';
  import { SeoHead } from '$presentation/components/SeoHead';
  import { getPageSeo } from '$shared/constants/seo';

  const seo = getPageSeo('notFound');
</script>

<SeoHead
  title={seo.title}
  description={seo.description}
  url={seo.url}
  ogImage={seo.ogImage}
  robots="noindex, nofollow"
/>

<NotFoundPage />
