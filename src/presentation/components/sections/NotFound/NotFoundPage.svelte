<script lang="ts">
  import Main from '$presentation/components/sections/Main/Main.svelte';
  import NotFound from './NotFound.svelte';
</script>

<Main>
  {#snippet pageHero()}
    <NotFound />
  {/snippet}
</Main>
