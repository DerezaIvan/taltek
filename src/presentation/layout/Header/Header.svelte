<script lang="ts">
  import { page } from '$app/state';
  import { beforeNavigate } from '$app/navigation';
  import { asset, resolve } from '$app/paths';
  import { fade } from 'svelte/transition';
  import type { TransitionConfig } from 'svelte/transition';
  import { IconMenuBurger, IconMenuClose, IconUser } from '$presentation/components/icons';
  import type { HeaderProps } from '$shared/interfaces';
  import { isActiveRoute } from '$shared/utils/is-active-route';

  let { overlay = false }: HeaderProps = $props();

  let scrolled = $state(false);

  $effect(() => {
    const handleScroll = () => {
      scrolled = window.scrollY > 10;
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  });
  let menuOpen = $state(false);
  let burgerButton = $state<HTMLButtonElement | null>(null);
  let menuElement = $state<HTMLDivElement | null>(null);

  function toggleMenu() {
    menuOpen = !menuOpen;
  }

  function closeMenu() {
    menuOpen = false;
    burgerButton?.focus();
  }

  function slideFromTop(
    node: Element,
    { duration = 300 }: { duration?: number } = {}
  ): TransitionConfig {
    return {
      duration,
      css: t => `transform: translateY(${(t - 1) * 100}%);`,
    };
  }

  function getFocusableElements(container: HTMLElement): HTMLElement[] {
    return Array.from(
      container.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
      )
    ).filter(element => !element.hasAttribute('disabled'));
  }

  beforeNavigate(() => {
    menuOpen = false;
  });

  $effect(() => {
    if (!menuOpen || !menuElement) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const focusable = getFocusableElements(menuElement);
    focusable[0]?.focus();

    function onKeydown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        closeMenu();
        return;
      }

      if (event.key !== 'Tab' || !menuElement) return;

      const items = getFocusableElements(menuElement);
      if (!items.length) return;

      const first = items[0];
      const last = items[items.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    window.addEventListener('keydown', onKeydown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKeydown);
    };
  });
</script>

<style lang="scss">
  @use './_header.scss';
</style>

<header class="header" class:header--overlay={overlay} class:header--scrolled={scrolled}>
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

    <button
      bind:this={burgerButton}
      type="button"
      class="header__burger"
      aria-label="Открыть меню"
      aria-expanded={menuOpen}
      aria-controls="header-menu"
      aria-hidden={menuOpen}
      tabindex={menuOpen ? -1 : undefined}
      onclick={toggleMenu}
    >
      <IconMenuBurger />
    </button>
  </div>
</header>

{#if menuOpen}
  <button
    type="button"
    class="header__backdrop"
    aria-label="Закрыть меню"
    transition:fade={{ duration: 200 }}
    onclick={closeMenu}
  ></button>

  <div
    bind:this={menuElement}
    class="header__menu"
    id="header-menu"
    role="dialog"
    aria-modal="true"
    aria-label="Меню"
    transition:slideFromTop={{ duration: 300 }}
  >
    <div class="header__menu-top">
      <div class="container-wide header__inner">
        <a
          class="header__logo-link"
          href={resolve('/')}
          aria-label="На главную"
          onclick={closeMenu}
        >
          <img class="header__logo" src={asset('/images/logo.svg')} alt="ТалТЭК Транс" />
        </a>

        <button
          type="button"
          class="header__burger header__menu-close"
          aria-label="Закрыть меню"
          onclick={closeMenu}
        >
          <IconMenuClose />
        </button>
      </div>
    </div>

    <div class="container-wide header__menu-inner">
      <nav class="header__menu-nav" aria-label="Мобильная навигация">
        {#each page.data.navigation as item (item.href)}
          <a
            class="header__menu-link"
            class:header__menu-link--active={isActiveRoute(item.href, page.url.pathname)}
            href={resolve(item.href as '/')}
            onclick={closeMenu}
          >
            {item.label}
          </a>
        {/each}
      </nav>

      <div class="header__menu-account">
        <span class="header__account-icon" aria-hidden="true">
          <IconUser />
        </span>
        <span class="header__account-label">Личный кабинет</span>
        <span class="header__account-badge">В разработке</span>
      </div>
    </div>
  </div>
{/if}
