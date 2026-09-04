import { Readable } from 'node:stream';

const API_URL = (process.env.TALTEK_API_URL || 'http://api:3001').replace(/\/$/, '');
const EXPORT_TOKEN = process.env.EXPORT_TOKEN || '';

/**
 * GET /export-xlsx — выгрузка заявок в Excel для авторизованных
 * пользователей Directus с доступом на чтение submissions.
 * Файл формирует api-сервис (см. api/index.js), здесь только проверка прав и проксирование.
 * Поддерживает query-параметры: from, to (ГГГГ-ММ-ДД), status (new/processed/archived).
 */
export default {
  id: 'export-xlsx',
  handler: (router, { services, getSchema }) => {
    router.get('/', async (req, res) => {
      try {
        if (!req.accountability || (!req.accountability.admin && !req.accountability.user)) {
          return res.status(401).json({ errors: [{ message: 'Требуется вход в Directus' }] });
        }

        if (!EXPORT_TOKEN) {
          return res.status(503).json({ errors: [{ message: 'Выгрузка не настроена (EXPORT_TOKEN)' }] });
        }

        // Для не-админов проверяем право чтения коллекции submissions.
        if (!req.accountability.admin) {
          const submissionsService = new services.ItemsService('submissions', {
            schema: await getSchema(),
            accountability: req.accountability,
          });
          await submissionsService.readByQuery({ limit: 1 });
        }

        const params = new URLSearchParams();
        for (const key of ['from', 'to', 'status']) {
          const value = req.query[key];
          if (typeof value === 'string' && value) params.set(key, value);
        }

        const upstream = await fetch(`${API_URL}/export/submissions.xlsx?${params}`, {
          headers: { 'X-Export-Token': EXPORT_TOKEN },
        });

        if (!upstream.ok) {
          const body = await upstream.text();
          return res.status(upstream.status).send(body);
        }

        res.setHeader(
          'Content-Type',
          upstream.headers.get('content-type') ||
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        );
        res.setHeader(
          'Content-Disposition',
          upstream.headers.get('content-disposition') || 'attachment; filename="submissions.xlsx"'
        );
        Readable.fromWeb(upstream.body).pipe(res);
      } catch (error) {
        const status = error?.code === 'FORBIDDEN' ? 403 : 500;
        res.status(status).json({
          errors: [{ message: status === 403 ? 'Нет доступа к заявкам' : `Ошибка выгрузки: ${error.message}` }],
        });
      }
    });
  },
};
