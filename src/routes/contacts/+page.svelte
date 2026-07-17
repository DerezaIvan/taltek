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

  const { data } = $props();

  const breadcrumbs = [{ label: 'Главная', href: '/' }, { label: CONTACTS_TITLE }];

  const titleLines = [CONTACTS_TITLE];
</script>

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
  <OperationsContacts content={data.contacts} />
</Main>
