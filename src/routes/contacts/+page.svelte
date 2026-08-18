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
  import { SeoHead } from '$presentation/components/SeoHead';

  const { data } = $props();

  const breadcrumbs = [{ label: 'Главная', href: '/' }, { label: CONTACTS_TITLE }];

  const titleLines = [CONTACTS_TITLE];
</script>

<SeoHead
  title={data.page.title}
  description={data.page.description}
  url={data.page.url}
  ogImage={data.page.ogImage}
/>

<Main>
  {#snippet pageHero()}
    <PageHero
      imageSrc={data.contacts?.hero?.image ?? PAGE_HERO_IMAGE}
      imagePosition={data.contacts?.hero?.imagePosition ?? PAGE_HERO_IMAGE_POSITION}
      {breadcrumbs}
      {titleLines}
      subtitle={CONTACTS_SUBTITLE}
    />
  {/snippet}

  <ContactsContent settings={data.settings} />
  <ContractContacts
    title={data.contacts?.contractSection?.title}
    background={data.contacts?.contractSection?.background}
    cards={data.contacts?.contractCards}
  />
  <OperationsContacts content={data.contacts} />
</Main>
