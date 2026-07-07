<script lang="ts">
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

<svelte:head>
  <title>{seo.title}</title>
  <meta name="description" content={seo.description} />
  <meta name="robots" content="index, follow" />
  <link rel="canonical" href={seo.url} />
</svelte:head>

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
