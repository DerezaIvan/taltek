<script lang="ts">
  import { page } from '$app/state';
  import { ErrorFallback, Main, NotFoundPage } from '$presentation/components/sections';

  const isNotFound = $derived(page.status === 404);
</script>

{#if isNotFound}
  <NotFoundPage />
{:else}
  <Main>
    {#snippet pageHero()}
      <ErrorFallback />
    {/snippet}
  </Main>
{/if}
