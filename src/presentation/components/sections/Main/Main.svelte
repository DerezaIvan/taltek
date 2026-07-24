<script lang="ts">
  import { Footer, Header } from '$presentation/layout';
  import { Hero } from '$presentation/components/sections';
  import type { MainProps } from '$shared/interfaces';

  let { heroTitle, heroSubtitle, heroBackground, children, afterHero, pageHero }: MainProps =
    $props();
</script>

<style lang="scss">
  @use './_main.scss';
</style>

<main class="main">
  {#if pageHero}
    <div class="main__hero">
      <Header overlay />
      {@render pageHero()}
    </div>

    {#if children}
      {@render children()}
    {/if}
  {:else if children}
    <Header />
    {@render children()}
  {:else}
    <div class="main__hero">
      <Header overlay />
      <Hero
        {...heroTitle?.trim() ? { title: heroTitle } : {}}
        {...heroSubtitle?.trim() ? { subtitle: heroSubtitle } : {}}
        {...heroBackground?.trim() ? { background: heroBackground } : {}}
      />
    </div>

    {#if afterHero}
      {@render afterHero()}
    {/if}
  {/if}

  <Footer />
</main>
