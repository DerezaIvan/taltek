import { definePanel } from '@directus/extensions-sdk';
import PanelComponent from './panel.vue';

export default definePanel({
  id: 'taltek-export',
  name: 'Выгрузка заявок (Excel)',
  icon: 'download',
  description: 'Скачивание заявок из коллекции submissions в Excel-файл',
  component: PanelComponent,
  options: null,
  minX: 6,
  minY: 5,
});
