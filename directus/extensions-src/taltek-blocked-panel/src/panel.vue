<template>
  <div class="blk">
    <div class="blk__toolbar">
      <div class="blk__counts">Всего заблокировано: <b>{{ total ?? '...' }}</b></div>
      <div class="blk__toolbar-actions">
        <button
          type="button"
          class="blk__tool blk__tool--danger"
          :disabled="busy || !total"
          @click="askConfirm({ type: 'delete-all' })"
        >
          Удалить все
        </button>
      </div>
    </div>

    <div v-if="items === null" class="blk__empty">Загрузка...</div>
    <div v-else-if="items.length === 0" class="blk__empty">Заблокированных заявок нет</div>

    <ul v-else class="blk__list">
      <li v-for="item in items" :key="item.id">
        <div
          class="blk__row"
          role="button"
          tabindex="0"
          @click="selected = item"
          @keydown.enter="selected = item"
        >
          <span class="blk__name">{{ item.name || 'Без имени' }}</span>
          <span class="blk__phone">{{ item.phone || '-' }}</span>
          <span class="blk__date">{{ formatShortDate(item.created_at) }}</span>
          <span class="blk__delete" title="Удалить запись" @click.stop="askConfirm({ type: 'delete-one', item })">×</span>
        </div>
      </li>
    </ul>

    <div v-if="selected" class="blk__overlay" @click.self="close">
      <div class="blk__card">
        <div class="blk__card-header">
          <div class="blk__card-title">
            <span class="blk__card-name">{{ selected.name || 'Без имени' }}</span>
            <span class="blk__reason">{{ reasonLabel(selected.reason) }}</span>
          </div>
          <button type="button" class="blk__close" title="Закрыть" @click="close">×</button>
        </div>

        <dl class="blk__details">
          <template v-for="row in details" :key="row.label">
            <dt>{{ row.label }}</dt>
            <dd>
              <a v-if="row.href" :href="row.href">{{ row.value }}</a>
              <template v-else>{{ row.value }}</template>
            </dd>
          </template>
        </dl>

        <div class="blk__actions">
          <div v-if="error" class="blk__error">{{ error }}</div>
        </div>
      </div>
    </div>

    <div v-if="confirm" class="blk__overlay blk__overlay--confirm" @click.self="cancelConfirm">
      <div class="blk__confirm">
        <div class="blk__confirm-text">
          {{
            confirm.type === 'delete-all'
              ? 'Вы действительно хотите удалить все заблокированные заявки?'
              : `Вы действительно хотите удалить запись${confirm.item?.name ? ` от ${confirm.item.name}` : ''}?`
          }}
        </div>
        <div class="blk__confirm-actions">
          <button type="button" class="blk__tool blk__tool--danger" :disabled="busy" @click="confirmDelete">
            {{ busy ? 'Удаляю...' : 'Да' }}
          </button>
          <button type="button" class="blk__tool" :disabled="busy" @click="cancelConfirm">Нет</button>
        </div>
        <div v-if="error" class="blk__error">{{ error }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue';

const props = defineProps({
  data: { type: [Array, Object], default: null },
});

const selected = ref(null);
const confirm = ref(null);
const busy = ref(false);
const error = ref('');

// Локальные удаления этой сессии: список и счётчик обновляются сразу, без перезагрузки
const removedIds = ref(new Set());
const total = ref(null);

// Стор может вернуть массив записей или объект { data: [...] }
const items = computed(() => {
  let base;
  if (Array.isArray(props.data)) base = props.data;
  else if (Array.isArray(props.data?.data)) base = props.data.data;
  else if (props.data === null) return null;
  else return [];
  return base.filter(item => !removedIds.value.has(item.id));
});

const REASON_LABELS = {
  no_token: 'Нет токена',
  invalid_token: 'Неверный токен',
};

function reasonLabel(reason) {
  return REASON_LABELS[reason] || reason || '-';
}

function formatShortDate(value) {
  if (!value) return '';
  return new Intl.DateTimeFormat('ru-RU', {
    timeZone: 'Europe/Moscow',
    day: '2-digit',
    month: '2-digit',
  }).format(new Date(value));
}

function formatFullDate(value) {
  if (!value) return '-';
  return (
    new Intl.DateTimeFormat('ru-RU', {
      timeZone: 'Europe/Moscow',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(value)) + ' МСК'
  );
}

async function api(path, options = {}) {
  const response = await fetch(path, {
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!response.ok) {
    throw new Error(`ошибка ${response.status}`);
  }
  return response.json().catch(() => null);
}

async function loadTotal() {
  try {
    const json = await api('/items/blocked_submissions?aggregate[count]=id');
    const value = json?.data?.[0]?.count?.id;
    total.value = value === undefined ? 0 : Number(value);
  } catch {
    // счётчик не критичен, список продолжает работать
  }
}

onMounted(loadTotal);

function close() {
  selected.value = null;
  error.value = '';
}

function askConfirm(value) {
  error.value = '';
  confirm.value = value;
}

function cancelConfirm() {
  confirm.value = null;
  error.value = '';
}

async function confirmDelete() {
  if (!confirm.value || busy.value) return;
  busy.value = true;
  error.value = '';
  try {
    if (confirm.value.type === 'delete-one') {
      const id = confirm.value.item.id;
      await api(`/items/blocked_submissions/${id}`, { method: 'DELETE' });
      removedIds.value = new Set(removedIds.value).add(id);
      if (selected.value?.id === id) close();
    } else {
      await api('/items/blocked_submissions', { method: 'DELETE', body: JSON.stringify({ query: {} }) });
      removedIds.value = new Set([...removedIds.value, ...(items.value ?? []).map(i => i.id)]);
      selected.value = null;
    }
    confirm.value = null;
    await loadTotal();
  } catch (e) {
    error.value = `Не удалось удалить: ${e.message}`;
  } finally {
    busy.value = false;
  }
}

const details = computed(() => {
  if (!selected.value) return [];
  const s = selected.value;
  const direction =
    s.direction_from || s.direction_to ? `${s.direction_from || '-'} → ${s.direction_to || '-'}` : '';
  return [
    { label: 'Причина блокировки', value: reasonLabel(s.reason) },
    { label: 'IP', value: s.ip || '-' },
    { label: 'Телефон', value: s.phone || '-', href: s.phone ? `tel:${s.phone.replace(/[^\d+]/g, '')}` : null },
    { label: 'Email', value: s.email || '-', href: s.email ? `mailto:${s.email}` : null },
    { label: 'Компания', value: s.company || '-' },
    { label: 'Тип вагона', value: s.wagon_type || '-' },
    { label: 'Направление', value: direction || '-' },
    { label: 'Комментарий', value: s.comment || '-' },
    { label: 'User-Agent', value: s.user_agent || '-' },
    { label: 'Дата попытки', value: formatFullDate(s.created_at) },
    { label: 'ID', value: String(s.id) },
  ];
});
</script>

<style scoped>
.blk {
  position: relative;
  height: 100%;
  display: flex;
  flex-direction: column;
  font-family: inherit;
  color: inherit;
}

.blk__toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  flex-wrap: wrap;
  padding-bottom: 8px;
  border-bottom: 1px solid var(--theme--border-color-subdued, #e4eaf1);
  padding: 5px;
}

.blk__counts {
  font-size: 13px;
  opacity: 0.85;
}

.blk__toolbar-actions {
  display: flex;
  gap: 8px;
}

.blk__tool {
  border: 1px solid var(--theme--border-color, #d3dce4);
  border-radius: 6px;
  padding: 5px 12px;
  background: var(--theme--background, #fff);
  color: inherit;
  font: inherit;
  font-size: 13px;
  cursor: pointer;
}

.blk__tool:hover:not(:disabled) {
  background: var(--theme--background-accent, #f0f4f9);
}

.blk__tool:disabled {
  opacity: 0.5;
  cursor: default;
}

.blk__tool--danger {
  color: #e35169;
  border-color: #e35169;
}

.blk__tool--danger:hover:not(:disabled) {
  background: #e35169;
  color: #fff;
}

.blk__empty {
  opacity: 0.6;
  padding: 8px 0;
}

.blk__list {
  list-style: none;
  margin: 0;
  padding: 5px;
  overflow-y: auto;
  flex: 1;
}

.blk__row {
  position: relative;
  display: flex;
  align-items: baseline;
  gap: 10px;
  width: 100%;
  padding: 9px 4px;
  border-bottom: 1px solid var(--theme--border-color-subdued, #e4eaf1);
  text-align: left;
  cursor: pointer;
}

.blk__row:hover {
  background: var(--theme--background-accent, #f0f4f9);
}

.blk__name {
  font-weight: 600;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.blk__phone {
  opacity: 0.75;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.blk__date {
  margin-left: auto;
  opacity: 0.5;
  font-size: 12px;
  flex-shrink: 0;
}

.blk__delete {
  position: absolute;
  right: 6px;
  top: 50%;
  transform: translateY(-50%);
  width: 22px;
  height: 22px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  font-size: 16px;
  line-height: 1;
  color: #e35169;
  background: var(--theme--background, #fff);
  border: 1px solid var(--theme--border-color, #d3dce4);
  opacity: 0;
  transition: opacity 0.15s;
}

.blk__row:hover .blk__delete {
  opacity: 1;
}

.blk__delete:hover {
  background: #e35169;
  color: #fff;
}

.blk__overlay {
  position: absolute;
  inset: 0;
  z-index: 10;
  background: var(--theme--background, #fff);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  padding: 5px;
}

.blk__overlay--confirm {
  z-index: 20;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.35);
}

.blk__confirm {
  background: var(--theme--background, #fff);
  border-radius: 10px;
  padding: 20px;
  max-width: 340px;
  width: 100%;
}

.blk__confirm-text {
  font-weight: 600;
  margin-bottom: 16px;
  line-height: 1.4;
}

.blk__confirm-actions {
  display: flex;
  gap: 10px;
}

.blk__card {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
}

.blk__card-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  padding-bottom: 10px;
  border-bottom: 1px solid var(--theme--border-color-subdued, #e4eaf1);
}

.blk__card-title {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.blk__card-name {
  font-size: 17px;
  font-weight: 700;
}

.blk__reason {
  font-size: 12px;
  font-weight: 600;
  padding: 2px 10px;
  border-radius: 999px;
  background: #e35169;
  color: #fff;
}

.blk__close {
  border: none;
  background: none;
  font-size: 20px;
  line-height: 1;
  cursor: pointer;
  color: inherit;
  opacity: 0.6;
  padding: 2px 6px;
}

.blk__close:hover {
  opacity: 1;
}

.blk__details {
  margin: 0;
  padding: 12px 0;
  overflow-y: auto;
  display: grid;
  grid-template-columns: 130px 1fr;
  row-gap: 10px;
  column-gap: 12px;
  flex: 1;
}

.blk__details dt {
  opacity: 0.6;
}

.blk__details dd {
  margin: 0;
  word-break: break-word;
  white-space: pre-wrap;
}

.blk__details a {
  color: var(--theme--primary, #6644ff);
}

.blk__actions {
  display: flex;
  align-items: center;
  gap: 14px;
  flex-wrap: wrap;
  padding-top: 10px;
  border-top: 1px solid var(--theme--border-color-subdued, #e4eaf1);
}

.blk__error {
  width: 100%;
  color: #e35169;
  font-size: 13px;
}
</style>
