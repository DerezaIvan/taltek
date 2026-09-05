<template>
  <div class="subs">
    <div class="subs__toolbar">
      <div class="subs__counts">
        Новых: <b>{{ counts.new ?? '...' }}</b> · Всего: <b>{{ counts.total ?? '...' }}</b>
      </div>
      <div class="subs__toolbar-actions">
        <button type="button" class="subs__tool" :disabled="busy || !counts.new" @click="markAll">
          Прочитать все
        </button>
        <button
          type="button"
          class="subs__tool subs__tool--danger"
          :disabled="busy || !counts.total"
          @click="askConfirm({ type: 'delete-all' })"
        >
          Удалить все
        </button>
      </div>
    </div>

    <div v-if="items === null" class="subs__empty">Загрузка...</div>
    <div v-else-if="items.length === 0" class="subs__empty">Заявок пока нет</div>

    <ul v-else class="subs__list">
      <li v-for="item in items" :key="item.id">
        <div
          class="subs__row"
          :class="{ 'subs__row--new': rowStatus(item) === 'new' }"
          role="button"
          tabindex="0"
          @click="selected = item"
          @keydown.enter="selected = item"
        >
          <span v-if="rowStatus(item) === 'new'" class="subs__dot" title="Новая заявка"></span>
          <span class="subs__name">{{ item.name }}</span>
          <span class="subs__phone">{{ item.phone }}</span>
          <span class="subs__date">{{ formatShortDate(item.created_at) }}</span>
          <span class="subs__delete" title="Удалить заявку" @click.stop="askConfirm({ type: 'delete-one', item })">×</span>
        </div>
      </li>
    </ul>

    <div v-if="selected" class="subs__overlay" @click.self="close">
      <div class="subs__card">
        <div class="subs__card-header">
          <div class="subs__card-title">
            <span class="subs__card-name">{{ selected.name }}</span>
            <span class="subs__status" :data-status="rowStatus(selected)">
              {{ statusLabel(rowStatus(selected)) }}
            </span>
          </div>
          <button type="button" class="subs__close" title="Закрыть" @click="close">×</button>
        </div>

        <dl class="subs__details">
          <template v-for="row in details" :key="row.label">
            <dt>{{ row.label }}</dt>
            <dd>
              <a v-if="row.href" :href="row.href">{{ row.value }}</a>
              <template v-else>{{ row.value }}</template>
            </dd>
          </template>
        </dl>

        <div class="subs__actions">
          <button
            v-if="rowStatus(selected) === 'new'"
            type="button"
            class="subs__mark"
            :disabled="busy"
            @click="markProcessed(selected)"
          >
            {{ busy ? 'Сохраняю...' : 'Отметить просмотренной' }}
          </button>
          <div v-if="error" class="subs__error">{{ error }}</div>
        </div>
      </div>
    </div>

    <div v-if="confirm" class="subs__overlay subs__overlay--confirm" @click.self="cancelConfirm">
      <div class="subs__confirm">
        <div class="subs__confirm-text">
          {{
            confirm.type === 'delete-all'
              ? 'Вы действительно хотите удалить все заявки?'
              : `Вы действительно хотите удалить заявку${confirm.item ? ` от ${confirm.item.name}` : ''}?`
          }}
        </div>
        <div class="subs__confirm-actions">
          <button type="button" class="subs__tool subs__tool--danger" :disabled="busy" @click="confirmDelete">
            {{ busy ? 'Удаляю...' : 'Да' }}
          </button>
          <button type="button" class="subs__tool" :disabled="busy" @click="cancelConfirm">Нет</button>
        </div>
        <div v-if="error" class="subs__error">{{ error }}</div>
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

// Локальные изменения этой сессии: список и счётчики обновляются сразу, без перезагрузки
const processedIds = ref(new Set());
const removedIds = ref(new Set());
const counts = ref({ new: null, total: null });

// Стор может вернуть массив записей или объект { data: [...] }
const items = computed(() => {
  let base;
  if (Array.isArray(props.data)) base = props.data;
  else if (Array.isArray(props.data?.data)) base = props.data.data;
  else if (props.data === null) return null;
  else return [];
  return base.filter(item => !removedIds.value.has(item.id));
});

const STATUS_LABELS = {
  new: 'Новая',
  processed: 'Обработана',
  archived: 'Архив',
};

function rowStatus(item) {
  return processedIds.value.has(item.id) ? 'processed' : item.status;
}

function statusLabel(status) {
  return STATUS_LABELS[status] || status || '-';
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

function readCount(json) {
  const value = json?.data?.[0]?.count?.id;
  return value === undefined ? 0 : Number(value);
}

async function loadCounts() {
  try {
    const [total, fresh] = await Promise.all([
      api('/items/submissions?aggregate[count]=id'),
      api('/items/submissions?aggregate[count]=id&filter[status][_eq]=new'),
    ]);
    counts.value = { total: readCount(total), new: readCount(fresh) };
  } catch {
    // счётчики не критичны, список продолжает работать
  }
}

onMounted(loadCounts);

function close() {
  selected.value = null;
  error.value = '';
}

async function markProcessed(item) {
  if (!item || busy.value) return;
  busy.value = true;
  error.value = '';
  try {
    await api(`/items/submissions/${item.id}`, {
      method: 'PATCH',
      body: JSON.stringify({ status: 'processed' }),
    });
    processedIds.value = new Set(processedIds.value).add(item.id);
    await loadCounts();
  } catch (e) {
    error.value = `Не удалось отметить: ${e.message}. Откройте заявку и смените статус вручную.`;
  } finally {
    busy.value = false;
  }
}

async function markAll() {
  if (busy.value) return;
  busy.value = true;
  error.value = '';
  try {
    await api('/items/submissions', {
      method: 'PATCH',
      body: JSON.stringify({ query: { filter: { status: { _eq: 'new' } } }, data: { status: 'processed' } }),
    });
    const next = new Set(processedIds.value);
    for (const item of items.value ?? []) {
      if (item.status === 'new') next.add(item.id);
    }
    processedIds.value = next;
    await loadCounts();
  } catch (e) {
    error.value = `Не удалось отметить все: ${e.message}`;
  } finally {
    busy.value = false;
  }
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
      await api(`/items/submissions/${id}`, { method: 'DELETE' });
      removedIds.value = new Set(removedIds.value).add(id);
      if (selected.value?.id === id) close();
    } else {
      await api('/items/submissions', { method: 'DELETE', body: JSON.stringify({ query: {} }) });
      removedIds.value = new Set([...removedIds.value, ...(items.value ?? []).map(i => i.id)]);
      selected.value = null;
    }
    confirm.value = null;
    await loadCounts();
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
    { label: 'Телефон', value: s.phone || '-', href: s.phone ? `tel:${s.phone.replace(/[^\d+]/g, '')}` : null },
    { label: 'Email', value: s.email || '-', href: s.email ? `mailto:${s.email}` : null },
    { label: 'Компания', value: s.company || '-' },
    { label: 'Тип вагона', value: s.wagon_type || '-' },
    { label: 'Направление', value: direction || '-' },
    { label: 'Комментарий', value: s.comment || '-' },
    { label: 'Дата заявки', value: formatFullDate(s.created_at) },
    { label: 'ID', value: String(s.id) },
  ];
});
</script>

<style scoped>
.subs {
  position: relative;
  height: 100%;
  display: flex;
  flex-direction: column;
  font-family: inherit;
  color: inherit;
}

.subs__toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  flex-wrap: wrap;
  padding-bottom: 8px;
  border-bottom: 1px solid var(--theme--border-color-subdued, #e4eaf1);
  padding: 5px;
}

.subs__counts {
  font-size: 13px;
  opacity: 0.85;
}

.subs__toolbar-actions {
  display: flex;
  gap: 8px;
}

.subs__tool {
  border: 1px solid var(--theme--border-color, #d3dce4);
  border-radius: 6px;
  padding: 5px 12px;
  background: var(--theme--background, #fff);
  color: inherit;
  font: inherit;
  font-size: 13px;
  cursor: pointer;
}

.subs__tool:hover:not(:disabled) {
  background: var(--theme--background-accent, #f0f4f9);
}

.subs__tool:disabled {
  opacity: 0.5;
  cursor: default;
}

.subs__tool--danger {
  color: #e35169;
  border-color: #e35169;
}

.subs__tool--danger:hover:not(:disabled) {
  background: #e35169;
  color: #fff;
}

.subs__empty {
  opacity: 0.6;
  padding: 8px 0;
}

.subs__list {
  list-style: none;
  margin: 0;
  padding: 5px;
  overflow-y: auto;
  flex: 1;
}

.subs__row {
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

.subs__row:hover {
  background: var(--theme--background-accent, #f0f4f9);
}

.subs__row--new .subs__name,
.subs__row--new .subs__phone {
  font-weight: 700;
  opacity: 1;
}

.subs__dot {
  flex-shrink: 0;
  width: 9px;
  height: 9px;
  border-radius: 50%;
  background: var(--theme--primary, #6644ff);
  align-self: center;
}

.subs__name {
  font-weight: 600;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.subs__phone {
  opacity: 0.75;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.subs__date {
  margin-left: auto;
  opacity: 0.5;
  font-size: 12px;
  flex-shrink: 0;
}

.subs__delete {
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

.subs__row:hover .subs__delete {
  opacity: 1;
}

.subs__delete:hover {
  background: #e35169;
  color: #fff;
}

.subs__overlay {
  position: absolute;
  inset: 0;
  z-index: 10;
  background: var(--theme--background, #fff);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  padding: 5px;
}

.subs__overlay--confirm {
  z-index: 20;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.35);
}

.subs__confirm {
  background: var(--theme--background, #fff);
  border-radius: 10px;
  padding: 20px;
  max-width: 340px;
  width: 100%;
}

.subs__confirm-text {
  font-weight: 600;
  margin-bottom: 16px;
  line-height: 1.4;
}

.subs__confirm-actions {
  display: flex;
  gap: 10px;
}

.subs__card {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
}

.subs__card-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  padding-bottom: 10px;
  border-bottom: 1px solid var(--theme--border-color-subdued, #e4eaf1);
}

.subs__card-title {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.subs__card-name {
  font-size: 17px;
  font-weight: 700;
}

.subs__status {
  font-size: 12px;
  font-weight: 600;
  padding: 2px 10px;
  border-radius: 999px;
  background: var(--theme--background-accent, #f0f4f9);
}

.subs__status[data-status='new'] {
  background: var(--theme--primary, #6644ff);
  color: #fff;
}

.subs__status[data-status='processed'] {
  background: #2ecda7;
  color: #fff;
}

.subs__close {
  border: none;
  background: none;
  font-size: 20px;
  line-height: 1;
  cursor: pointer;
  color: inherit;
  opacity: 0.6;
  padding: 2px 6px;
}

.subs__close:hover {
  opacity: 1;
}

.subs__details {
  margin: 0;
  padding: 12px 0;
  overflow-y: auto;
  display: grid;
  grid-template-columns: 130px 1fr;
  row-gap: 10px;
  column-gap: 12px;
  flex: 1;
}

.subs__details dt {
  opacity: 0.6;
}

.subs__details dd {
  margin: 0;
  word-break: break-word;
  white-space: pre-wrap;
}

.subs__details a {
  color: var(--theme--primary, #6644ff);
}

.subs__actions {
  display: flex;
  align-items: center;
  gap: 14px;
  flex-wrap: wrap;
  padding-top: 10px;
  border-top: 1px solid var(--theme--border-color-subdued, #e4eaf1);
}

.subs__mark {
  border: none;
  border-radius: 6px;
  padding: 9px 18px;
  background: var(--theme--primary, #6644ff);
  color: #fff;
  font: inherit;
  font-weight: 600;
  cursor: pointer;
}

.subs__mark:disabled {
  opacity: 0.6;
  cursor: default;
}

.subs__open {
  color: var(--theme--primary, #6644ff);
  font-size: 13px;
}

.subs__error {
  width: 100%;
  color: #e35169;
  font-size: 13px;
}
</style>
