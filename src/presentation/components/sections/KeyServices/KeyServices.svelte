<script lang="ts">
  import { KEY_SERVICES_ITEMS, KEY_SERVICES_TITLE } from '$shared/constants/key-services';
  import type { DirectusKeyServiceRecord } from '$infrastructure/cms/types';
  import { keyServicesIcons } from './key-services-icons';

  const { items = null }: { items?: DirectusKeyServiceRecord[] | null } = $props();

  const cards = $derived(
    (items && items.length > 0 ? items : KEY_SERVICES_ITEMS).map((item, index) => ({
      id: item.id,
      title: item.title,
      description: item.description,
      icon:
        keyServicesIcons[item.id as keyof typeof keyServicesIcons] ??
        keyServicesIcons[KEY_SERVICES_ITEMS[index % KEY_SERVICES_ITEMS.length].id],
    }))
  );
</script>

<style lang="scss">
  @use './_key-services.scss';
</style>

<section class="key-services" aria-labelledby="key-services-title">
  <div class="container">
    <h2 id="key-services-title" class="key-services__title">
      {KEY_SERVICES_TITLE}
    </h2>

    <ul class="key-services__list">
      {#each cards as item (item.id)}
        {@const Icon = item.icon}
        <li class="key-services__card">
          <div class="key-services__icon" aria-hidden="true">
            <Icon />
          </div>

          <div class="key-services__content">
            <h3 class="key-services__card-title">{item.title}</h3>
            <p class="key-services__card-desc">{item.description}</p>
          </div>
        </li>
      {/each}
    </ul>
  </div>
</section>
