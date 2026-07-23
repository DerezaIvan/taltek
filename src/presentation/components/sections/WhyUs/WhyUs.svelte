<script lang="ts">
  import { WHY_US_ITEMS, WHY_US_TITLE } from '$shared/constants/why-us';
  import type { DirectusWhyUsItemRecord } from '$infrastructure/cms/types';
  import { whyUsIcons } from './why-us-icons';

  const { items = null }: { items?: DirectusWhyUsItemRecord[] | null } = $props();

  const cards = $derived(
    (items && items.length > 0 ? items : WHY_US_ITEMS).map((item, index) => ({
      id: item.id,
      title: item.title,
      description: item.description,
      icon:
        whyUsIcons[item.id as keyof typeof whyUsIcons] ??
        whyUsIcons[WHY_US_ITEMS[index % WHY_US_ITEMS.length].id],
    }))
  );
</script>

<style lang="scss">
  @use './_why-us.scss';
</style>

<section class="why-us" aria-labelledby="why-us-title">
  <div class="container">
    <h2 id="why-us-title" class="why-us__title">
      {WHY_US_TITLE}
    </h2>

    <ul class="why-us__grid">
      {#each cards as item (item.id)}
        {@const Icon = item.icon}
        <li class="why-us__card">
          <div class="why-us__icon" aria-hidden="true">
            <Icon />
          </div>

          <h3 class="why-us__card-title">{item.title}</h3>
          <p class="why-us__card-desc">{item.description}</p>
        </li>
      {/each}
    </ul>
  </div>
</section>
