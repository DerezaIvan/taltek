<script lang="ts">
  import '$presentation/styles/global.scss';
  import type { Snippet } from 'svelte';
  import { page } from '$app/state';

  let { children }: { children: Snippet } = $props();
</script>

{#key page.url.pathname}
  <div class="page-enter">
    {@render children()}
  </div>
{/key}
