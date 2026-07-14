<script lang="ts">
  import { ContactsForm, ContactsInfo } from '$presentation/components/sections/ContactsContent';
</script>

<style lang="scss">
  @use './_contacts-content.scss';
</style>

<section class="contacts-content" aria-label="Форма обратной связи и контакты">
  <div id="contacts-form" class="container contacts-content__inner">
    <ContactsForm />
    <ContactsInfo />
  </div>
</section>
