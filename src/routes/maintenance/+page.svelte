<script lang="ts">
  // TODO: SEO временно отключено
  // import { SeoHead } from '$presentation/components/SeoHead';
  import { NotFound } from '$presentation/components/sections';
  // import { getPageSeo } from '$shared/constants/seo';

  // const seo = getPageSeo('notFound');
</script>

<!-- TODO: SEO временно отключено -->
<!-- <SeoHead
  title="Технические работы — АО «ТалТЭК Транс»"
  description="Сайт временно недоступен в связи с техническими работами."
  url={seo.url}
  robots="noindex, nofollow"
  ogImage={seo.ogImage}
/> -->

<NotFound
  code="404"
  title="Сайт на технических работах"
  description={`В данное время сайт временно недоступен в связи с техническими работами.
Просьба проследовать на старый сайт: taltektrans.biz

Приносим извинения за проявленные неудобства.`}
  homeLabel="Перейти на старый сайт"
  homeHref="https://taltektrans.biz"
  showRequestButton={false}
/>
