<script lang="ts">
  import { page } from '$app/state';
  import { asset, resolve } from '$app/paths';
  import { IconUser } from '$presentation/components/icons';
  import type { HeaderProps } from '$shared/interfaces';
  import { isActiveRoute } from '$shared/utils/is-active-route';

  let { overlay = false }: HeaderProps = $props();
</script>

<style lang="scss">
  @use './_header.scss';
</style>

<header class="header" class:header--overlay={overlay}>
  <div class="container-wide header__inner">
    <a class="header__logo-link" href={resolve('/')} aria-label="На главную">
      <img class="header__logo" src={asset('/images/logo.svg')} alt="ТалТЭК Транс" />
    </a>

    <nav class="header__nav" aria-label="Основная навигация">
      {#each page.data.navigation as item (item.href)}
        <a
          class="header__link"
          class:header__link--active={isActiveRoute(item.href, page.url.pathname)}
          href={resolve(item.href as '/')}
        >
          {item.label}
        </a>
      {/each}
    </nav>

    <span class="header__account">
      <span class="header__account-icon" aria-hidden="true">
        <IconUser />
      </span>
      <span class="header__account-label">Личный кабинет</span>
      <span class="header__account-badge">В разработке</span>
    </span>
  </div>
</header>
