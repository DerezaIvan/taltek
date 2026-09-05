import { definePanel } from '@directus/extensions-sdk';
import PanelComponent from './panel.vue';

export default definePanel({
  id: 'taltek-blocked',
  name: 'Заблокированные заявки',
  icon: 'block',
  description: 'Заявки, отклонённые проверкой капчи (попытки спама)',
  component: PanelComponent,
  query: () => ({
    collection: 'blocked_submissions',
    query: {
      fields: [
        'id',
        'reason',
        'ip',
        'user_agent',
        'name',
        'phone',
        'email',
        'company',
        'wagon_type',
        'direction_from',
        'direction_to',
        'comment',
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
