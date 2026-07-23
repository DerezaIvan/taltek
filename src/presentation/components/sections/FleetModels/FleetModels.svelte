<script lang="ts">
  import { asset } from '$app/paths';
  import { FLEET_MODELS_ITEMS, FLEET_MODELS_TITLE } from '$shared/constants/fleet-models';
  import type { DirectusFleetModelRecord } from '$infrastructure/cms/types';

  const { models = null }: { models?: DirectusFleetModelRecord[] | null } = $props();

  const items = $derived(
    models && models.length > 0
      ? models.map((model, index) => ({
          id: model.id,
          variant: model.variant,
          badge: model.badge,
          title: model.title,
          description: model.description,
          imageSrc:
            typeof model.image === 'string'
              ? model.image
              : (FLEET_MODELS_ITEMS[index]?.imageSrc ?? ''),
          imageAlt: model.image_alt ?? FLEET_MODELS_ITEMS[index]?.imageAlt ?? model.title,
          specs:
            model.specs && model.specs.length > 0
              ? model.specs
              : (FLEET_MODELS_ITEMS[index]?.specs ?? []),
        }))
      : FLEET_MODELS_ITEMS
  );
</script>

<style lang="scss">
  @use './_fleet-models.scss';
</style>

<section id="fleet-models" class="fleet-models" aria-labelledby="fleet-models-title">
  <div class="container">
    <header class="fleet-models__header">
      <h2 id="fleet-models-title" class="fleet-models__title">
        {FLEET_MODELS_TITLE}
      </h2>
    </header>

    <ul class="fleet-models__grid">
      {#each items as item (item.id)}
        <li
          class="fleet-models__card"
          class:fleet-models__card--reserve={item.variant === 'reserve'}
        >
          <figure class="fleet-models__media">
            <span
              class="fleet-models__badge"
              class:fleet-models__badge--reserve={item.variant === 'reserve'}
            >
              {item.badge}
            </span>
            <img
              class="fleet-models__image"
              src={asset(item.imageSrc)}
              alt={item.imageAlt}
              width="295"
              height="191"
              loading="lazy"
              decoding="async"
            />
          </figure>

          <div class="fleet-models__content">
            <h3 class="fleet-models__card-title">{item.title}</h3>
            {#if item.description}
              <p class="fleet-models__card-desc">{item.description}</p>
            {/if}

            <dl class="fleet-models__specs">
              {#each item.specs as spec (spec.label)}
                <dt class="fleet-models__spec-label">{spec.label}</dt>
                <dd class="fleet-models__spec-value">{spec.value}</dd>
              {/each}
            </dl>
          </div>
        </li>
      {/each}
    </ul>
  </div>
</section>
