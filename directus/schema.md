# Схема Directus для проекта Taltek

Этот документ описывает полную схему данных Directus под сайт. Все коллекции создаются вручную в админке Directus (`Settings → Data Model`) или через Snapshot/API.

## Быстрый старт

1. Скопировать `.env.example` в `.env` и заполнить `PUBLIC_DIRECTUS_URL`, `DIRECTUS_TOKEN` и данные для Directus.
2. Запустить стек: `docker compose --profile cms up --build`.
3. Открыть Directus Admin: http://localhost:8055/admin.
4. Создать коллекции автоматически через [`directus/seed-schema.mjs`](../directus/seed-schema.mjs).
5. (Опционально) Сделать админку понятной на русском через [`directus/update-ui.mjs`](../directus/update-ui.mjs).
6. Заполнить контент через [`directus/seed-content.mjs`](../directus/seed-content.mjs) или вручную.
7. Настроить права доступа (см. [Права доступа](#права-доступа)).
8. Пересобрать фронтенд: `npm run build`.

## Особенности схемы

- Большинство коллекций используют стандартный автоинкрементный числовой primary key `id`.
- Коллекции, где элементы имеют осмысленные человекочитаемые коды, используют **строковый primary key `id`**. В админке поле `id` заполняется вручную латиницей, например `wagon-supply`. К таким коллекциям относятся:
  `key_services`, `why_us_items`, `what_you_get_items`, `stats_items`, `fleet_park_cards`, `fleet_models`, `cta_blocks`, `contract_contacts_cards`, `operations_dispatchers`, `operations_territories`, `privacy_sections`.
- Singleton-коллекции (`site_settings`, `home_hero` и др.) содержат ровно одну запись.
- Поля типа `JSON` редактируются как код в админке Directus.

## Глобальные настройки

### `site_settings` (singleton)

Одна запись. Хранит глобальные параметры сайта.

| Поле                    | Тип            | Описание                                            |
| ----------------------- | -------------- | --------------------------------------------------- |
| `site_name`             | Input (string) | Название сайта, например `Taltek`                   |
| `site_url`              | Input (string) | URL сайта, например `https://taltek.ru/`            |
| `logo`                  | Image          | Логотип                                             |
| `hotline_phone_display` | Input          | Телефон для отображения, например `8 800 533 9 888` |
| `hotline_phone_href`    | Input          | Ссылка tel:, например `tel:+78005339888`            |
| `main_address`          | Text           | Адрес главного офиса                                |
| `contact_emails`        | JSON           | Массив объектов `{ label, href }`                   |

### `navigation_items`

| Поле     | Тип             | Описание                 |
| -------- | --------------- | ------------------------ |
| `label`  | Input (string)  | Текст ссылки             |
| `href`   | Input (string)  | Путь, например `/about/` |
| `sort`   | Input (integer) | Порядок сортировки       |
| `status` | Dropdown        | `published` / `draft`    |

Пример записей:

| label                     | href         | sort |
| ------------------------- | ------------ | ---- |
| Главная                   | `/`          | 1    |
| О компании                | `/about/`    | 2    |
| Услуги и подвижной состав | `/services/` | 3    |
| Контакты                  | `/contacts/` | 4    |

## SEO и страницы

### `pages`

| Поле            | Тип                              | Описание                                                        |
| --------------- | -------------------------------- | --------------------------------------------------------------- |
| `slug`          | Input (string, unique, required) | `home`, `about`, `services`, `contacts`, `privacy`, `not_found` |
| `title`         | Input (string)                   | SEO title                                                       |
| `description`   | Textarea                         | SEO description                                                 |
| `og_image`      | Image                            | Open Graph изображение                                          |
| `hero_title`    | Input                            | Fallback-заголовок Hero (опционально)                           |
| `hero_subtitle` | Textarea                         | Fallback-подзаголовок Hero (опционально)                        |
| `status`        | Dropdown                         | `published` / `draft`                                           |

Каждая запись соответствует странице сайта. Если для страницы данных нет, используется fallback из `src/shared/constants/seo.ts`.

## Главная страница (`slug = home`)

### `home_hero` (singleton)

| Поле         | Тип      | Описание                 |
| ------------ | -------- | ------------------------ |
| `title`      | Textarea | Заголовок Hero           |
| `subtitle`   | Textarea | Подзаголовок Hero        |
| `background` | Image    | Фоновое изображение Hero |

### `about_intro`

| Поле         | Тип                      | Описание              |
| ------------ | ------------------------ | --------------------- |
| `title`      | Input                    | Заголовок блока       |
| `lead`       | Textarea                 | Лид-абзац             |
| `paragraphs` | Textarea (Repeater/JSON) | Массив абзацев        |
| `image`      | Image                    | Изображение           |
| `image_alt`  | Input                    | Alt для изображения   |
| `sort`       | Input                    | Порядок               |
| `status`     | Dropdown                 | `published` / `draft` |

### `our_mission` (singleton)

| Поле       | Тип      | Описание                    |
| ---------- | -------- | --------------------------- |
| `title`    | Input    | Заголовок                   |
| `subtitle` | Textarea | Подзаголовок                |
| `gallery`  | JSON     | Массив путей к изображениям |

### `key_services`

| Поле          | Тип      | Описание                               |
| ------------- | -------- | -------------------------------------- |
| `id`          | Input    | Идентификатор, например `wagon-supply` |
| `title`       | Input    | Заголовок услуги                       |
| `description` | Textarea | Описание                               |
| `sort`        | Input    | Порядок                                |
| `status`      | Dropdown | `published` / `draft`                  |

### `delivery_section` (singleton)

| Поле    | Тип      | Описание         |
| ------- | -------- | ---------------- |
| `title` | Textarea | Заголовок секции |

### `delivery_steps`

| Поле          | Тип      | Описание                 |
| ------------- | -------- | ------------------------ |
| `step_id`     | Input    | Идентификатор `01`..`05` |
| `title`       | Input    | Заголовок шага           |
| `description` | Textarea | Описание шага            |
| `sort`        | Input    | Порядок                  |
| `status`      | Dropdown | `published` / `draft`    |

### `why_us_items`

| Поле          | Тип      | Описание                            |
| ------------- | -------- | ----------------------------------- |
| `id`          | Input    | Идентификатор, например `own-fleet` |
| `title`       | Input    | Заголовок                           |
| `description` | Textarea | Описание                            |
| `sort`        | Input    | Порядок                             |
| `status`      | Dropdown | `published` / `draft`               |

### `what_you_get_items`

| Поле     | Тип      | Описание              |
| -------- | -------- | --------------------- |
| `id`     | Input    | Идентификатор         |
| `title`  | Input    | Заголовок             |
| `sort`   | Input    | Порядок               |
| `status` | Dropdown | `published` / `draft` |

### `stats_items`

| Поле          | Тип      | Описание                    |
| ------------- | -------- | --------------------------- |
| `id`          | Input    | Идентификатор               |
| `label`       | Input    | Подпись                     |
| `value`       | Input    | Значение, например `16 000` |
| `description` | Input    | Описание значения           |
| `sort`        | Input    | Порядок                     |
| `status`      | Dropdown | `published` / `draft`       |

### `fleet_park_section` (singleton)

| Поле    | Тип      | Описание         |
| ------- | -------- | ---------------- |
| `title` | Textarea | Заголовок секции |

### `fleet_park_cards`

| Поле     | Тип      | Описание              |
| -------- | -------- | --------------------- |
| `id`     | Input    | Идентификатор         |
| `value`  | Input    | Значение              |
| `label`  | Input    | Подпись               |
| `badge`  | Input    | Бейдж                 |
| `sort`   | Input    | Порядок               |
| `status` | Dropdown | `published` / `draft` |

### `fleet_models`

| Поле          | Тип      | Описание                  |
| ------------- | -------- | ------------------------- |
| `id`          | Input    | Идентификатор модели      |
| `variant`     | Dropdown | `default` / `reserve`     |
| `badge`       | Input    | Бейдж типа вагона         |
| `title`       | Input    | Название модели           |
| `description` | Textarea | Описание                  |
| `image`       | Image    | Изображение               |
| `image_alt`   | Input    | Alt                       |
| `specs`       | JSON     | Массив `{ label, value }` |
| `sort`        | Input    | Порядок                   |
| `status`      | Dropdown | `published` / `draft`     |

## CTA-блоки

### `cta_blocks`

| Поле       | Тип      | Описание                                   |
| ---------- | -------- | ------------------------------------------ |
| `id`       | Input    | Идентификатор: `home`, `about`, `services` |
| `title`    | Textarea | Заголовок                                  |
| `subtitle` | Textarea | Подзаголовок                               |
| `status`   | Dropdown | `published` / `draft`                      |

## Страница "О компании"

### `about_page_hero` (singleton)

| Поле             | Тип   | Описание            |
| ---------------- | ----- | ------------------- |
| `image`          | Image | Фоновое изображение |
| `image_position` | Input | CSS object-position |

## Страница "Услуги"

### `services_page_hero` (singleton)

| Поле             | Тип   | Описание            |
| ---------------- | ----- | ------------------- |
| `image`          | Image | Фоновое изображение |
| `image_position` | Input | CSS object-position |

## Страница "Контакты"

### `contacts_page_hero` (singleton)

| Поле             | Тип   | Описание            |
| ---------------- | ----- | ------------------- |
| `image`          | Image | Фоновое изображение |
| `image_position` | Input | CSS object-position |

### `contract_contacts_section` (singleton)

| Поле         | Тип   | Описание            |
| ------------ | ----- | ------------------- |
| `title`      | Input | Заголовок секции    |
| `background` | Image | Фоновое изображение |

### `contract_contacts_cards`

| Поле         | Тип      | Описание                |
| ------------ | -------- | ----------------------- |
| `id`         | Input    | Идентификатор           |
| `name`       | Input    | Имя                     |
| `role_lines` | JSON     | Массив строк должности  |
| `phone`      | Input    | Телефон для отображения |
| `phone_href` | Input    | Ссылка tel:             |
| `email`      | Input    | Email                   |
| `photo`      | Image    | Фото                    |
| `sort`       | Input    | Порядок                 |
| `status`     | Dropdown | `published` / `draft`   |

### `operations_contacts_section` (singleton)

| Поле                   | Тип      | Описание                    |
| ---------------------- | -------- | --------------------------- |
| `dispatchers_title`    | Input    | Заголовок блока диспетчеров |
| `dispatchers_subtitle` | Textarea | Подзаголовок                |
| `territories_title`    | Input    | Заголовок блока территорий  |

### `operations_dispatchers`

| Поле          | Тип      | Описание                          |
| ------------- | -------- | --------------------------------- |
| `id`          | Input    | Идентификатор                     |
| `title`       | Input    | Название направления              |
| `phone`       | Input    | Основной телефон для отображения  |
| `phone_href`  | Input    | Ссылка tel:                       |
| `badge`       | Input    | Режим работы                      |
| `phone2`      | Input    | Дополнительный телефон            |
| `phone_href2` | Input    | Ссылка tel: для доп. телефона     |
| `badge2`      | Input    | Режим работы для доп. телефона    |
| `email`       | Input    | Email диспетчера                  |
| `sort`        | Input    | Порядок                           |
| `status`      | Dropdown | `published` / `draft`             |

### `operations_territories`

| Поле         | Тип      | Описание                |
| ------------ | -------- | ----------------------- |
| `id`         | Input    | Идентификатор города    |
| `city`       | Input    | Город                   |
| `phone`      | Input    | Телефон для отображения |
| `phone_href` | Input    | Ссылка tel:             |
| `sort`       | Input    | Порядок                 |
| `status`     | Dropdown | `published` / `draft`   |

## Страница "Политика конфиденциальности"

### `privacy_page` (singleton)

| Поле    | Тип      | Описание            |
| ------- | -------- | ------------------- |
| `intro` | Textarea | Вступительный абзац |

### `privacy_sections`

| Поле     | Тип      | Описание                                                                         |
| -------- | -------- | -------------------------------------------------------------------------------- |
| `id`     | Input    | Идентификатор раздела                                                            |
| `title`  | Input    | Заголовок раздела                                                                |
| `blocks` | JSON     | Массив блоков `{ type: 'paragraph' \| 'list', text?: string, items?: string[] }` |
| `sort`   | Input    | Порядок                                                                          |
| `status` | Dropdown | `published` / `draft`                                                            |

## Заявки из контактной формы

### `submissions`

| Поле             | Тип      | Описание                         |
| ---------------- | -------- | -------------------------------- |
| `name`           | Input    | Имя                              |
| `phone`          | Input    | Телефон                          |
| `email`          | Input    | Email                            |
| `company`        | Input    | Компания                         |
| `wagon_type`     | Input    | Тип вагона                       |
| `direction_from` | Input    | Откуда                           |
| `direction_to`   | Input    | Куда                             |
| `comment`        | Textarea | Комментарий                      |
| `created_at`     | DateTime | Дата создания                    |
| `status`         | Dropdown | `new` / `processed` / `archived` |

## Права доступа

### Для сборки (read-only)

Создать static token:

1. Directus Admin → Settings → Access Tokens → Create Token.
2. Выбрать пользователя с правами администратора или настроить роль.
3. Скопировать токен в `DIRECTUS_TOKEN`.

### Публичный доступ (для runtime, если нужно)

Public role:

- `navigation_items`: read, filter `status = published`.
- `pages`: read, filter `status = published`.
- `site_settings`: read.
- Остальные коллекции: read с фильтром `status = published`.
- `submissions`: create (если форма отправляет заявки напрямую в Directus).

## Fallback

Если Directus недоступен или коллекция пуста, фронтенд использует константы из `src/shared/constants/`. Это позволяет собирать сайт без запущенного Directus.

## Workflow

1. Контент-менеджер правит данные в Directus Admin.
2. После значимых изменений запускается CI rebuild:
   - вручную через GitHub Actions;
   - или автоматически через Directus Flow → HTTP POST → GitHub `repository_dispatch`.
3. Фронтенд забирает данные на этапе сборки (`+layout.server.ts`, `+page.server.ts`) и prerender в статику.

## Связь коллекций со страницами

| Страница     | Используемые коллекции                                                                                                                                                                                                       |
| ------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `/`          | `home_hero`, `about_intro`, `our_mission`, `key_services`, `delivery_section`, `delivery_steps`, `why_us_items`, `what_you_get_items`, `stats_items`, `fleet_park_section`, `fleet_park_cards`, `fleet_models`, `cta_blocks` |
| `/about/`    | `about_page_hero`, `about_intro`, `our_mission`, `stats_items`, `cta_blocks`                                                                                                                                                 |
| `/services/` | `services_page_hero`, `key_services`, `fleet_models`, `delivery_section`, `delivery_steps`, `what_you_get_items`, `cta_blocks`                                                                                               |
| `/contacts/` | `contacts_page_hero`, `site_settings`, `contract_contacts_section`, `contract_contacts_cards`, `operations_contacts_section`, `operations_dispatchers`, `operations_territories`                                             |
| `/privacy/`  | `privacy_page`, `privacy_sections`                                                                                                                                                                                           |
| 404          | `pages` (`slug = not_found`)                                                                                                                                                                                                 |
