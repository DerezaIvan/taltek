<script lang="ts">
  import {
    DISPATCHER_CARDS,
    DISPATCHERS_SUBTITLE_LINES,
    DISPATCHERS_TITLE,
    TERRITORIES_TITLE,
    TERRITORY_CARDS,
  } from '$shared/constants/operations-contacts';
  import { DispatcherCard, TerritoryCard } from '$presentation/components/sections/OperationsContacts';
</script>

<style lang="scss">
  @use './_operations-contacts.scss';
</style>

<section class="operations-contacts" aria-label="Диспетчеры и региональные контакты">
  <div class="container operations-contacts__inner">
    <div class="operations-contacts__block" aria-labelledby="dispatchers-title">
      <div class="operations-contacts__header">
        <h2 id="dispatchers-title" class="operations-contacts__title">
          {DISPATCHERS_TITLE}
        </h2>

        <p class="operations-contacts__subtitle">
          {DISPATCHERS_SUBTITLE_LINES[0]}<br />
          {DISPATCHERS_SUBTITLE_LINES[1]}
        </p>
      </div>

      <ul class="operations-contacts__dispatchers">
        {#each DISPATCHER_CARDS as card (card.id)}
          <li class="operations-contacts__dispatcher-item">
            <DispatcherCard {card} />
          </li>
        {/each}
      </ul>
    </div>

    <div class="operations-contacts__block operations-contacts__block--territories" aria-labelledby="territories-title">
      <h2 id="territories-title" class="operations-contacts__title">
        {TERRITORIES_TITLE}
      </h2>

      <ul class="operations-contacts__territories">
        {#each TERRITORY_CARDS as card (card.id)}
          <li class="operations-contacts__territory-item">
            <TerritoryCard {card} />
          </li>
        {/each}
      </ul>
    </div>
  </div>
</section>
