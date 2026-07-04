<script lang="ts">
  import { Footer, Header } from '$presentation/layout';
  import { Hero } from '$presentation/components/sections';
  import type { MainProps } from '$shared/interfaces';

  let { heroTitle, heroSubtitle, children }: MainProps = $props();
</script>

<style lang="scss">
  @use './_main.scss';
</style>

<main class="main">
  {#if children}
    <Header />
    {@render children()}
  {:else}
    <div class="main__hero">
      <Header overlay />
      <Hero
        {...heroTitle?.trim() ? { title: heroTitle } : {}}
        {...heroSubtitle?.trim() ? { subtitle: heroSubtitle } : {}}
      />
    </div>
  {/if}

  <Footer />
</main>
