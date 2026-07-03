<script lang="ts">
  import { Button } from '$presentation/components/ui';

  interface Props {
    title?: string;
    subtitle?: string;
  }

  let {
    title = 'Taltek',
    subtitle = 'Заготовка лендинга. Контент секций добавляется отдельно.',
  }: Props = $props();
</script>

<style lang="scss">
  @use './_hero.scss';
</style>

<section id="hero" class="hero">
  <div class="container">
    <h1 class="h2 hero__title" data-anim="hero-line" data-anim-delay="1">{title}</h1>

    <p class="h5 hero__subtitle" data-anim="hero-line" data-anim-delay="2">{subtitle}</p>

    <div class="hero__actions" data-anim="fade-up" data-anim-delay="3">
      <Button variant="primary" size="sm">Действие</Button>
      <Button variant="secondary" size="sm">Подробнее</Button>
    </div>
  </div>
</section>
