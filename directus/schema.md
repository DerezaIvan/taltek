# Directus schema

Коллекции для PoC. Создайте вручную в Directus Admin или через Data Model.

## navigation_items

- `label` (Input, required)
- `href` (Input, required)
- `sort` (Input, integer)
- `status` (Dropdown: published, draft)

Пример записей:

| label      | href       | sort |
| ---------- | ---------- | ---- |
| Главная    | /          | 1    |
| О компании | /about/    | 2    |
| Услуги     | /services/ | 3    |
| Контакты   | /contacts/ | 4    |

## pages

- `slug` (Input, unique, required)
- `title` (Input, required)
- `description` (Textarea)
- `hero_title` (Input)
- `hero_subtitle` (Textarea)
- `status` (Dropdown: published, draft)

Пример для главной (`slug: home`):

- title: `Taltek — Главная`
- description: текст для meta
- hero_title / hero_subtitle: контент Hero-секции

## Permissions

Для build-time fetch без публичного API:

1. Settings → Access Tokens → создать static token (read-only)
2. Положить в `DIRECTUS_TOKEN`

Или Public role: read на `navigation_items` и `pages` где `status = published`.

## Webhook (будущее)

Directus Flow → HTTP POST → GitHub `repository_dispatch` → CI rebuild.
