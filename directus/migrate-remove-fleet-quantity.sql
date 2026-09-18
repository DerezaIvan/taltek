-- Удаляет устаревшую характеристику «Количество» из JSON-массива характеристик моделей.
-- Миграция идемпотентна: повторный запуск не меняет уже очищенные записи.
UPDATE fleet_models
SET specs = (
  SELECT COALESCE(json_agg(entry ORDER BY position), '[]'::json)
  FROM json_array_elements(COALESCE(specs, '[]'::json)) WITH ORDINALITY AS items(entry, position)
  WHERE entry ->> 'label' <> 'Количество'
)
WHERE EXISTS (
  SELECT 1
  FROM json_array_elements(COALESCE(specs, '[]'::json)) AS items(entry)
  WHERE entry ->> 'label' = 'Количество'
);
