# Taltek Landing

SvelteKit 5 лендинг со static export, Docker, SSL и опциональной Headless CMS (Directus).

## Содержание

- [Быстрый старт](#быстрый-старт)
- [Docker](#docker)
- [Переменные окружения](#переменные-окружения)
- [SSL / HTTPS](#ssl--https)
- [Отправка заявок из контактной формы](#отправка-заявок-из-контактной-формы)
- [Directus CMS](#directus-cms)
- [CI и GitHub Pages](#ci-и-github-pages)
- [GitHub](#github)

## Быстрый старт

```bash
npm install
npm start
```

## Docker

Только фронтенд (nginx, порты 80 и 443):

```bash
docker compose up --build frontend
```

Фронтенд + Directus + Postgres:

```bash
cp .env.example .env
# заполнить PUBLIC_DIRECTUS_URL, DIRECTUS_TOKEN, DIRECTUS_*, POSTGRES_*
docker compose --profile cms up --build
```

- Сайт: http://localhost:8080
- Directus admin: http://localhost:8055/admin

## Переменные окружения

Скопируйте `.env.example` в `.env`.

| Переменная | Описание |
|------------|----------|
| `PUBLIC_DIRECTUS_URL` | URL Directus API |
| `DIRECTUS_TOKEN` | Read-only token для сборки фронтенда |
| `DIRECTUS_API_TOKEN` | Static token для сохранения заявок в Directus |
| `PUBLIC_API_URL` | URL API для отправки заявок |
| `CORS_ORIGIN` | Разрешённый origin для API |
| `SMTP_HOST` | SMTP сервер для отправки заявок |
| `SMTP_PORT` | Порт SMTP (по умолч. 587) |
| `SMTP_USER` | Пользователь SMTP |
| `SMTP_PASS` | Пароль SMTP |
| `FROM_EMAIL` | Отправитель писем |
| `TO_EMAIL` | Получатель заявок |
| `DIRECTUS_*`, `POSTGRES_*` | Настройки Directus/Postgres в docker-compose |

Без Directus сайт собирается и работает на fallback-константах из `src/shared/constants/`.

## SSL / HTTPS

Сайт работает по HTTPS. HTTP-запросы автоматически редиректятся на HTTPS. SSL-сертификат и приватный ключ монтируются в контейнер `frontend` из папки `ssl/`.

Для обновления сертификата замените файлы в `ssl/` и перезапустите контейнер:

```bash
cd /root/taltek && docker compose restart frontend
```

Сертификат действителен до даты, указанной в файле сертификата. Перед окончанием срока загрузите новый сертификат и ключ в `ssl/`.

## Отправка заявок из контактной формы

Заявки отправляются через собственный минимальный Node.js API (`api/`), который работает в Docker Compose рядом с фронтендом. API:

1. Валидирует данные.
2. Отправляет письмо на настроенный SMTP.
3. Сохраняет заявку в Directus (коллекция `submissions`).
4. Если Directus недоступен — сохраняет заявку в файлы (`api/data/`) как fallback.

### Архитектура

```
Фронтенд → POST /api/contact → Nginx → API → Directus / SMTP / файлы
```

Rate limit: не более 10 запросов за 15 минут с одного IP.

### Настройка

1. Скопировать `.env.example` в `.env` и заполнить SMTP:
   ```
   SMTP_HOST=smtp.example.com
   SMTP_PORT=587
   SMTP_USER=noreply@example.com
   SMTP_PASS=your_password
   FROM_EMAIL=noreply@example.com
   TO_EMAIL=info@taltektrans.pro
   ```
2. Указать `PUBLIC_API_URL`:
   - локально: `http://localhost:8080/api`
   - прод: `https://taltektrans.pro/api`
3. Запустить:
   ```bash
   docker compose up --build frontend
   ```

### Локальная разработка API

```bash
cd api
npm install
DIRECTUS_API_TOKEN=... SMTP_HOST=... SMTP_USER=... SMTP_PASS=... FROM_EMAIL=... TO_EMAIL=... npm run dev
```

API будет доступен на http://localhost:3001, health-check — http://localhost:3001/health.

## Directus CMS

Полная схема коллекций описана в [`directus/schema.md`](directus/schema.md). Краткая инструкция для заказчика — в [`DIRECTUS_GUIDE.md`](DIRECTUS_GUIDE.md).

### Быстрый старт

```bash
cp .env.example .env
# заполнить PUBLIC_DIRECTUS_URL, DIRECTUS_TOKEN, DIRECTUS_*, POSTGRES_*
docker compose --profile cms up --build
```

- Сайт: http://localhost:8080
- Directus admin: http://localhost:8055/admin

### Создание коллекций

Схема коллекций описана в [`directus/schema.md`](directus/schema.md). Чтобы не создавать их вручную, запусти seed-скрипт:

```bash
node directus/seed-schema.mjs
```

Скрипт авторизуется в Directus под администратором (берёт `DIRECTUS_ADMIN_EMAIL` и `DIRECTUS_ADMIN_PASSWORD` из `.env`) и создаёт все коллекции с полями. Если коллекции уже есть, он пропустит их.

### Русификация админки

После seed-скрипта запусти:

```bash
node directus/update-ui.mjs
```

Этот скрипт:
- устанавливает русский язык проекта и текущего администратора;
- добавляет понятные русские названия коллекций и полей;
- добавляет подсказки, иконки и шаблоны отображения.

После запуска перезагрузи страницу админки.

### Что можно управлять через Directus

- Глобальные настройки: `site_settings`
- Навигация: `navigation_items`
- SEO страниц: `pages`
- Контент главной: `home_hero`, `key_services`, `why_us_items`, `stats_items`, `fleet_models` и др.
- Контент страниц «О компании», «Услуги», «Контакты», «Политика конфиденциальности»
- Контактные лица: `contract_contacts_cards`, `operations_dispatchers`, `operations_territories`
- Заявки из формы: `submissions`

### Права доступа

- Для сборки сайта достаточно read-only static token (`DIRECTUS_TOKEN`).
- Для сохранения заявок API использует отдельный static token (`DIRECTUS_API_TOKEN`) с правом `create` только на `submissions`.

### Workflow

1. Редактируйте контент в Directus Admin.
2. Пересобирайте сайт вручную или настройте автоматический rebuild через Directus Flow → GitHub `repository_dispatch`.
3. Фронтенд забирает данные на этапе сборки и prerender в статику.

Без Directus сайт собирается и работает на fallback-константах из `src/shared/constants/`.

## CI и GitHub Pages

GitHub Actions (`.github/workflows/ci.yml`): `npm run check`, `npm run build`, `docker build` на push/PR в `main` и `develop`.

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

## GitHub

```bash
git remote add origin https://github.com/DerezaIvan/taltek.git
git branch -M main
git push -u origin main
```
