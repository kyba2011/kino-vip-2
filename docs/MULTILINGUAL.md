# Многоязычная поддержка / Multilingual Support

## Обзор / Overview

Проект поддерживает два языка:

- 🇷🇺 Русский (по умолчанию)
- 🇺🇸 English

The project supports two languages:

- 🇷🇺 Russian (default)
- 🇺🇸 English

## Структура URL / URL Structure

Все страницы теперь имеют префикс языка:

- `/ru/` - русская версия
- `/en/` - английская версия

All pages now have a language prefix:

- `/ru/` - Russian version
- `/en/` - English version

### Примеры / Examples:

- Главная: `/ru/` или `/en/`
- О фильме: `/ru/about/123` или `/en/about/123`
- Поиск: `/ru/search?q=matrix` или `/en/search?q=matrix`

## Автоматический перевод / Automatic Translation

Контент с API Kinopoisk (только на русском) автоматически переводится на английский через Google Translate API:

Content from Kinopoisk API (Russian only) is automatically translated to English via Google Translate API:

- Названия фильмов / Movie titles
- Описания / Descriptions
- Жанры / Genres
- Страны / Countries
- Слоганы / Slogans

### Кеширование переводов / Translation Caching

Система использует двухуровневое кеширование для оптимизации производительности:

The system uses two-level caching for performance optimization:

1. **Кеш в памяти (Memory Cache)** - быстрый доступ к переводам во время сессии
2. **localStorage** - сохранение переводов между сессиями браузера

**Преимущества / Benefits:**

- Переводы кешируются и не запрашиваются повторно
- Ускорение загрузки страниц при повторном посещении
- Экономия запросов к Google Translate API
- Автоматическая очистка при переполнении (макс. 1000 записей)

**Translations are cached and not requested again**

- Faster page loading on repeat visits
- Saves requests to Google Translate API
- Automatic cleanup when full (max 1000 entries)

## Автоматический редирект / Automatic Redirect

При заходе на корневую страницу `/` пользователь автоматически перенаправляется на `/ru/` (русская версия по умолчанию).

When accessing the root page `/`, users are automatically redirected to `/ru/` (Russian version by default).

## Переключение языка / Language Switching

Пользователи могут переключать язык через выпадающее меню в Header:

1. Нажмите на иконку языка (🌐)
2. Выберите нужный язык
3. Страница автоматически перезагрузится с новым языком

Users can switch languages via the dropdown menu in the Header:

1. Click on the language icon (🌐)
2. Select desired language
3. Page will automatically reload with the new language

## Технические детали / Technical Details

### Используемые библиотеки / Used Libraries:

- `next-intl` - для интернационализации Next.js
- Google Translate API - для автоматического перевода контента

### Файлы переводов / Translation Files:

- `messages/ru.json` - русские переводы UI
- `messages/en.json` - английские переводы UI

### Утилиты перевода / Translation Utilities:

- `src/lib/translate.ts` - функции для автоматического перевода контента с API

### Middleware:

- `src/middleware.ts` - обрабатывает роутинг с префиксами языков

## Добавление нового языка / Adding a New Language

1. Добавьте код языка в `src/i18n/routing.ts`:

```typescript
export const routing = defineRouting({
  locales: ["ru", "en", "de"], // добавьте новый язык
  defaultLocale: "ru",
  localePrefix: "always",
});
```

2. Создайте файл переводов `messages/{locale}.json`

3. Обновите компонент Header для отображения нового языка

4. Добавьте поддержку перевода в `src/lib/translate.ts` (если нужно)

## Примечания / Notes

- Переводы кешируются в localStorage для улучшения производительности
- Кеш автоматически загружается при следующем посещении сайта
- При ошибке перевода отображается оригинальный текст на русском
- Рейтинги, годы и числовые данные не переводятся
- Максимальный размер кеша: 1000 записей
- Кеш автоматически очищается при переполнении

- Translations are cached in localStorage for better performance
- Cache is automatically loaded on next site visit
- On translation error, original Russian text is displayed
- Ratings, years, and numeric data are not translated
- Maximum cache size: 1000 entries
- Cache is automatically cleaned up when full
