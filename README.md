# Taltek Landing

SvelteKit 5 лендинг со static export, Docker и опциональной Headless CMS (Directus).

## Быстрый старт

```bash
npm install
npm start
```

## Docker

Только фронтенд (nginx, порт 8080):

```bash
docker compose up --build frontend
```

Фронтенд + Directus + Postgres:

```bash
cp .env.example .env
docker compose --profile cms up --build
```

- Сайт: http://localhost:8080
- Directus admin: http://localhost:8055

## Переменные окружения

Скопируйте `.env.example` в `.env`.

| Переменная                 | Описание                                     |
| -------------------------- | -------------------------------------------- |
| `PUBLIC_DIRECTUS_URL`      | URL Directus API                             |
| `DIRECTUS_TOKEN`           | Read-only token для fetch на этапе build     |
| `DIRECTUS_*`, `POSTGRES_*` | Настройки Directus/Postgres в docker-compose |

Без Directus сайт собирается и работает на fallback-константах из `src/shared/constants/`.

## Directus — схема коллекций

Создайте в Directus Admin две коллекции:

### `navigation_items`

| Поле     | Тип     | Примечание            |
| -------- | ------- | --------------------- |
| `label`  | String  | Текст ссылки          |
| `href`   | String  | Путь, напр. `/about/` |
| `sort`   | Integer | Порядок               |
| `status` | String  | `published` / `draft` |

### `pages`

| Поле            | Тип    | Примечание                              |
| --------------- | ------ | --------------------------------------- |
| `slug`          | String | `home`, `about`, `services`, `contacts` |
| `title`         | String | SEO title                               |
| `description`   | Text   | SEO description                         |
| `hero_title`    | String | опционально                             |
| `hero_subtitle` | Text   | опционально                             |
| `status`        | String | `published` / `draft`                   |

Public read: включите read-доступ для роли Public или используйте static token в `DIRECTUS_TOKEN`.

PoC: navigation и SEO главной страницы подтягиваются из CMS при сборке; остальные страницы пока на constants.

## CI

GitHub Actions (`.github/workflows/ci.yml`): `npm run check`, `npm run build`, `docker build` на push/PR в `main` и `develop`.

## GitHub Pages (preview из develop)

При push в ветку `develop` workflow `.github/workflows/deploy-pages.yml` собирает сайт с `BASE_PATH=/taltek` и публикует на GitHub Pages.

**URL:** https://derezaivan.github.io/taltek/

### Однократная настройка в репозитории

1. GitHub → **Settings** → **Pages**
2. **Build and deployment** → Source: **GitHub Actions**
3. Запушить ветку `develop`:
   ```bash
   git push -u origin develop
   ```

Локальная проверка сборки под Pages:

```bash
BASE_PATH=/taltek npm run build:pages
BASE_PATH=/taltek npm run preview
```

```
src/infrastructure/cms/
  directus-client.ts  # fetch REST
  content.ts          # getLayoutContent, getPageContent + fallback
  types.ts
```

Контент подгружается в `+layout.server.ts` и `+page.server.ts` на этапе prerender.

## GitHub

```bash
git remote add origin https://github.com/DerezaIvan/taltek.git
git branch -M main
git push -u origin main
```
