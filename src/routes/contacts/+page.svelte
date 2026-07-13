<script lang="ts">
  import { SeoHead } from '$presentation/components/SeoHead';
  import {
    ContactsContent,
    ContractContacts,
    Main,
    OperationsContacts,
    PageHero,
  } from '$presentation/components/sections';
  import { CONTACTS_SUBTITLE, CONTACTS_TITLE } from '$shared/constants/contacts';
  import { PAGE_HERO_IMAGE, PAGE_HERO_IMAGE_POSITION } from '$shared/constants/page-hero';
  import { getPageSeo } from '$shared/constants/seo';

  const seo = getPageSeo('contacts');

  const breadcrumbs = [{ label: 'Главная', href: '/' }, { label: CONTACTS_TITLE }];

  const titleLines = [CONTACTS_TITLE];
</script>

<SeoHead title={seo.title} description={seo.description} url={seo.url} ogImage={seo.ogImage} />

<Main>
  {#snippet pageHero()}
    <PageHero
      imageSrc={PAGE_HERO_IMAGE}
      imagePosition={PAGE_HERO_IMAGE_POSITION}
      {breadcrumbs}
      {titleLines}
      subtitle={CONTACTS_SUBTITLE}
    />
  {/snippet}

  <ContactsContent />
  <ContractContacts />
  <OperationsContacts />
</Main>
