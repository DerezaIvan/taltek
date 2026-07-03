<script lang="ts">
  import type { Snippet } from 'svelte';
  import { Footer, Header } from '$presentation/layout';
  import { Hero } from '$presentation/components/sections';

  interface Props {
    heroTitle?: string;
    heroSubtitle?: string;
    children?: Snippet;
  }

  let { heroTitle, heroSubtitle, children }: Props = $props();
</script>

<style lang="scss">
  @use './_main.scss';
</style>

<main class="main">
  <Header />

  {#if children}
    {@render children()}
  {:else}
    <div class="main__intro">
      <Hero title={heroTitle} subtitle={heroSubtitle} />
    </div>
  {/if}

  <Footer />
</main>
