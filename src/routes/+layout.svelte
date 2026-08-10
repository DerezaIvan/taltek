<script lang="ts">
  import '$presentation/styles/global.scss';
  import type { Snippet } from 'svelte';
  import { page } from '$app/state';
  import { afterNavigate, onNavigate } from '$app/navigation';

  let { children }: { children: Snippet } = $props();

  afterNavigate(navigation => {
    if (navigation.type === 'enter') return;

    const url = page.url;
    const ym = (window as unknown as { ym?: (...args: unknown[]) => void }).ym;
    ym?.(111451644, 'hit', url.href, {
      title: document.title,
      referer: navigation.from?.url.href ?? document.referrer,
    });
  });

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
