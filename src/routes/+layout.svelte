<script lang="ts">
  import '$presentation/styles/global.scss';
  import type { Snippet } from 'svelte';
  import { onMount, tick } from 'svelte';
  import { afterNavigate } from '$app/navigation';
  import {
    destroyScrollAnimations,
    initScrollAnimations,
    restartScrollAnimations,
  } from '$shared/animations/scroll-animations';

  let { children }: { children: Snippet } = $props();

  onMount(() => {
    initScrollAnimations();
    return () => destroyScrollAnimations();
  });

  afterNavigate(async () => {
    await tick();
    restartScrollAnimations();
  });
</script>

{@render children()}
