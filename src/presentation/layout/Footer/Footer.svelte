<script lang="ts">
  import { page } from '$app/state';
  import { asset, resolve } from '$app/paths';
  import { RequestButton } from '$presentation/components/ui';
  import { getFooterNavigation } from '$shared/constants/navigation';
  import { isActiveRoute } from '$shared/utils/is-active-route';

  const year = new Date().getFullYear();
  const footerNavigation = $derived(getFooterNavigation(page.data.navigation));
</script>

<style lang="scss">
  @use './_footer.scss';
</style>

<footer class="footer">
  <div class="footer__media" aria-hidden="true">
    <img
      class="footer__image"
      src={asset('/images/footer-bckg.webp')}
      alt=""
      loading="lazy"
      decoding="async"
    />
    <div class="footer__overlay"></div>
  </div>

  <div class="footer__content">
    <div class="container-wide footer__top">
      <div class="footer__brand">
        <a class="footer__logo-link" href={resolve('/')} aria-label="На главную">
          <img class="footer__logo" src={asset('/images/logo.svg')} alt="ТалТЭК Транс" />
        </a>

        <p class="footer__description text-sm">
          Наши подтверждённые компетенции гарантируют точность, скорость и индивидуальный подход к
          каждому клиенту.
        </p>

        <div class="footer__legal">
          <a class="footer__privacy" href={resolve('/privacy/')}>Политика конфиденциальности</a>
          <p class="footer__copyright text-sm">© {year} АО «ТалТЭК Транс»</p>
        </div>
      </div>

      <nav class="footer__nav" aria-label="Навигация по сайту">
        <p class="footer__section-title">Навигация по сайту</p>
        <ul class="footer__nav-list">
          {#each footerNavigation as item ('href' in item ? item.href : item.label)}
            <li>
              {#if 'muted' in item}
                <span class="footer__nav-link footer__nav-link--muted">{item.label}</span>
              {:else}
                <a
                  class="footer__nav-link"
                  class:footer__nav-link--active={isActiveRoute(item.href, page.url.pathname)}
                  href={resolve(item.href)}
                >
                  {item.label}
                </a>
              {/if}
            </li>
          {/each}
        </ul>
      </nav>

      <div class="footer__contacts">
        <p class="footer__section-title">Контакты</p>
        <ul class="footer__contacts-list">
          <li>
            <a class="footer__contact-link" href="tel:+74959001095">+7 (495) 900 10 95</a>
          </li>
          <li>
            <span class="footer__contact-text"
              >Главный офис: Россия, г. Москва, Дукат Плейс 3, Гашека 6, офис 1210</span
            >
          </li>
          <li>
            <a class="footer__contact-link" href="mailto:infor@taltektrans.pro">
              infor@taltektrans.pro
            </a>
          </li>
        </ul>
      </div>

      <div class="footer__cta">
        <RequestButton variant="glass" />
      </div>
    </div>

    <div class="container-wide footer__bottom">
      <p class="footer__brand-name" aria-hidden="true">ТалТЭК Транс</p>
    </div>
  </div>
</footer>
