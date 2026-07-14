<script lang="ts">
  import { WHY_US_ITEMS, WHY_US_TITLE } from '$shared/constants/why-us';
  import { whyUsIcons } from './why-us-icons';
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
      {#each WHY_US_ITEMS as item (item.id)}
        {@const Icon = whyUsIcons[item.id]}
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
