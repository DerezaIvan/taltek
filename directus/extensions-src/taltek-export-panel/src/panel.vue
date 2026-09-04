<template>
  <div class="taltek-export">
    <div class="taltek-export__title">Выгрузка заявок в Excel</div>
    <div class="taltek-export__hint">
      Вы можете применить фильтры по дате и статусу заявок, чтобы скачать только нужные данные.
    </div>
    <div class="taltek-export__row">
      <label>
        <span>С:</span>
        <input v-model="from" type="date" />
      </label>
      <label>
        <span>По:</span>
        <input v-model="to" type="date" />
      </label>
      <label>
        <span>Статус</span>
        <select v-model="status">
          <option value="">Все</option>
          <option value="new">Новые</option>
          <option value="processed">Обработанные</option>
          <option value="archived">В архиве</option>
        </select>
      </label>
    </div>
    <a class="taltek-export__button" :href="href" target="_blank" rel="noopener">Скачать</a>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue';

const from = ref('');
const to = ref('');
const status = ref('');

const href = computed(() => {
  const origin = window.location.ancestorOrigins?.[0] ?? '';
  const params = new URLSearchParams();
  if (from.value) params.set('from', from.value);
  if (to.value) params.set('to', to.value);
  if (status.value) params.set('status', status.value);
  const query = params.toString();
  return `${origin}/export-xlsx${query ? `?${query}` : ''}`;
});
</script>

<style scoped>
.taltek-export {
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 10px;
  font-family: inherit;
  color: inherit;
  padding: 5px;
}

.taltek-export__title {
  font-weight: 700;
  font-size: 16px;
}

.taltek-export__hint {
  opacity: 0.7;
  line-height: 1.4;
}

.taltek-export__row {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  flex-direction: column;
}

.taltek-export__row label {
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-size: 12px;
  opacity: 0.9;
}

.taltek-export__row input,
.taltek-export__row select {
  padding: 6px 8px;
  border: 1px solid var(--theme--border-color, #d3dce4);
  border-radius: 6px;
  font: inherit;
  background: var(--theme--background, #fff);
  color: inherit;
}

.taltek-export__button {
  margin-top: auto;
  align-self: flex-start;
  padding: 10px 20px;
  border-radius: 6px;
  background: var(--theme--primary, #6644ff);
  color: #fff;
  text-decoration: none;
  font-weight: 600;
}
</style>
