<script lang="ts">
  import { SITE_NAME } from '$shared/constants/seo';

  const year = new Date().getFullYear();
</script>

<style lang="scss">
  @use './_footer.scss';
</style>

<footer class="footer">
  <div class="container footer__inner">
    <p class="footer__text">© {year} {SITE_NAME}</p>
    <p class="footer__text">Заготовка лендинга</p>
  </div>
</footer>
