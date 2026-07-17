<script lang="ts">
  import {
    DISPATCHER_CARDS,
    DISPATCHERS_SUBTITLE_LINES,
    DISPATCHERS_TITLE,
    TERRITORIES_TITLE,
    TERRITORY_CARDS,
  } from '$shared/constants/operations-contacts';
  import type { ContactsPageContent } from '$infrastructure/cms/types';
  import { DispatcherCard, TerritoryCard } from '$presentation/components/sections/OperationsContacts';

  let { content }: { content?: ContactsPageContent } = $props();

  const dispatchersTitle = $derived(content?.operationsSection?.dispatchersTitle ?? DISPATCHERS_TITLE);
  const dispatchersSubtitle = $derived(
    content?.operationsSection?.dispatchersSubtitle ?? DISPATCHERS_SUBTITLE_LINES.join('\n')
  );
  const territoriesTitle = $derived(
    content?.operationsSection?.territoriesTitle ?? TERRITORIES_TITLE
  );
  const dispatchers = $derived(content?.dispatchers ?? DISPATCHER_CARDS);
  const territories = $derived(content?.territories ?? TERRITORY_CARDS);

  const dispatchersSubtitleLines = $derived(dispatchersSubtitle.split('\n'));
</script>

<style lang="scss">
  @use './_operations-contacts.scss';
</style>

<section class="operations-contacts" aria-label="Диспетчеры и региональные контакты">
  <div class="container operations-contacts__inner">
    <div class="operations-contacts__block" aria-labelledby="dispatchers-title">
      <div class="operations-contacts__header">
        <h2 id="dispatchers-title" class="operations-contacts__title">
          {dispatchersTitle}
        </h2>

        <p class="operations-contacts__subtitle">
          {dispatchersSubtitleLines[0]}<br />
          {dispatchersSubtitleLines[1] ?? ''}
        </p>
      </div>

      <ul class="operations-contacts__dispatchers">
        {#each dispatchers as card (card.id)}
          <li class="operations-contacts__dispatcher-item">
            <DispatcherCard {card} />
          </li>
        {/each}
      </ul>
    </div>

    <div
      class="operations-contacts__block operations-contacts__block--territories"
      aria-labelledby="territories-title"
    >
      <h2 id="territories-title" class="operations-contacts__title">
        {territoriesTitle}
      </h2>

      <ul class="operations-contacts__territories">
        {#each territories as card (card.id)}
          <li class="operations-contacts__territory-item">
            <TerritoryCard {card} />
          </li>
        {/each}
      </ul>
    </div>
  </div>
</section>
