<script lang="ts">
  import { page } from '$app/stores';
  import { base } from '$app/paths';

  function isActive(href: string, pathname: string): boolean {
    const normalizedHref = `${base}${href}`.replace(/\/+$/, '') || '/';
    const normalizedPath = pathname.replace(/\/+$/, '') || '/';
    return normalizedHref === normalizedPath;
  }
</script>

<style lang="scss">
  @use './_header.scss';
</style>

<header class="header">
  <div class="container header__inner">
    <a class="header__logo" href="{base}/">{$page.data.siteName}</a>

    <nav class="header__nav" aria-label="Основная навигация">
      {#each $page.data.navigation as item (item.href)}
        <a
          class="header__link"
          class:header__link--active={isActive(item.href, $page.url.pathname)}
          href="{base}{item.href}"
        >
          {item.label}
        </a>
      {/each}
    </nav>
  </div>
</header>
