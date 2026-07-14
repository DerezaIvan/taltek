<script lang="ts">
  import '$presentation/styles/global.scss';
  import type { Snippet } from 'svelte';
  import { page } from '$app/state';
  import { onNavigate } from '$app/navigation';

  let { children }: { children: Snippet } = $props();

  onNavigate(navigation => {
    if (!document.startViewTransition) return;

    return new Promise<void>(resolve => {
      document.startViewTransition(async () => {
        resolve();
        await navigation.complete;
      });
    });
  });
</script>

{#key page.url.pathname}
  <div class="page-enter">
    {@render children()}
  </div>
{/key}
