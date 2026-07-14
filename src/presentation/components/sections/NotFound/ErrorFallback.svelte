<script lang="ts">
  import { page } from '$app/state';
</script>

<style lang="scss">
  @use './_error-fallback.scss';
</style>

<section class="error-fallback">
  <div class="container error-fallback__body">
    <h1 class="error-fallback__title">Что-то пошло не так</h1>
    <p class="error-fallback__text">
      {page.error?.message ?? 'Попробуйте обновить страницу или вернуться позже.'}
    </p>
  </div>
</section>
