import { definePanel } from '@directus/extensions-sdk';
import PanelComponent from './panel.vue';

export default definePanel({
  id: 'taltek-submissions',
  name: 'Заявки - список с просмотром',
  icon: 'inbox',
  description: 'Последние заявки из коллекции submissions с предпросмотром деталей по клику',
  component: PanelComponent,
  query: () => ({
    collection: 'submissions',
    query: {
      fields: [
        'id',
        'name',
        'phone',
        'email',
        'company',
        'okpo',
        'wagon_type',
        'direction_from',
        'direction_to',
        'comment',
        'status',
        'created_at',
      ],
      sort: '-id',
      limit: 30,
    },
  }),
  options: null,
  minX: 12,
  minY: 6,
});
