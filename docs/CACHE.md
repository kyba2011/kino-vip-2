# Translation Cache System

## Обзор / Overview

Система кеширования переводов использует двухуровневый подход для максимальной производительности.

The translation caching system uses a two-level approach for maximum performance.

## Архитектура / Architecture

### 1. Memory Cache (Кеш в памяти)

- Хранится в `Map<string, string>`
- Быстрый доступ во время текущей сессии
- Очищается при перезагрузке страницы

### 2. localStorage Cache

- Сохраняется между сессиями браузера
- Автоматически загружается при инициализации
- Версионирование для совместимости

## Ключевые особенности / Key Features

### Автоматическое кеширование

- Каждый перевод сохраняется автоматически
- Ключ кеша: `{targetLang}:{originalText}`
- Для фильмов: `{targetLang}:movie:{movieId}`

### Управление размером

- Максимум: 1000 записей
- Автоматическая очистка старых записей
- Защита от переполнения localStorage

### Производительность

- Мгновенный доступ к кешированным переводам
- Экономия API запросов
- Ускорение загрузки страниц

## Использование / Usage

### Базовое использование

Кеширование работает автоматически при использовании функций перевода:

```typescript
import {
  translateText,
  translateMovie,
  translateMovies,
} from "@/lib/translate";

// Автоматически кешируется
const translated = await translateText("Привет", "en");

// Кешируется весь объект фильма
const movie = await translateMovie(movieData, "en");

// Кешируется массив фильмов
const movies = await translateMovies(moviesArray, "en");
```

### Управление кешем

```typescript
import { getCacheStats, clearTranslationCache } from "@/lib/translate";

// Получить статистику
const stats = getCacheStats();
console.log(stats); // { size: 150, maxSize: 1000, version: 'v1' }

// Очистить кеш
clearTranslationCache();
```

### Компонент отладки

Добавьте компонент `TranslationCacheDebug` на любую страницу для мониторинга:

```tsx
import TranslationCacheDebug from "@/components/TranslationCacheDebug";

export default function DebugPage() {
  return (
    <div>
      <h1>Debug Page</h1>
      <TranslationCacheDebug />
    </div>
  );
}
```

## Структура данных / Data Structure

### localStorage Format

```json
{
  "version": "v1",
  "data": {
    "en:Привет": "Hello",
    "en:Мир": "World",
    "en:movie:123": "{...movieObject...}"
  },
  "timestamp": 1234567890
}
```

### Cache Key Format

- Текст: `{lang}:{text}` → `"en:Привет"`
- Фильм: `{lang}:movie:{id}` → `"en:movie:123"`

## Оптимизация / Optimization

### Периодическое сохранение

Кеш сохраняется в localStorage:

- Каждые 10 новых переводов
- После перевода массива фильмов
- При достижении лимита размера

### Очистка

Автоматическая очистка происходит когда:

- Размер превышает 1000 записей (удаляются первые 200)
- localStorage переполнен (полная очистка)
- Пользователь вручную очищает кеш

## Troubleshooting

### Кеш не работает

1. Проверьте, что localStorage доступен
2. Проверьте версию кеша (должна быть 'v1')
3. Очистите кеш и попробуйте снова

### localStorage переполнен

- Автоматически очищается при ошибке QuotaExceededError
- Можно вручную очистить через `clearTranslationCache()`

### Старые переводы

- Измените `CACHE_VERSION` в `src/lib/translate.ts`
- Старый кеш автоматически игнорируется

## Мониторинг / Monitoring

### Console Logs

```javascript
// При загрузке кеша
"Loaded 150 translations from cache";

// При очистке
"Translation cache cleared";
```

### Статистика в реальном времени

Используйте `getCacheStats()` для получения актуальной информации:

- `size` - текущее количество записей
- `maxSize` - максимальный размер
- `version` - версия кеша

## Best Practices

1. **Не очищайте кеш без необходимости** - это замедлит работу
2. **Используйте версионирование** - при изменении формата данных
3. **Мониторьте размер** - если кеш часто переполняется, увеличьте `MAX_CACHE_SIZE`
4. **Тестируйте переводы** - кеш может сохранить неправильный перевод

## Будущие улучшения / Future Improvements

- [ ] Добавить TTL (время жизни) для записей
- [ ] Реализовать LRU (Least Recently Used) стратегию
- [ ] Добавить сжатие данных в localStorage
- [ ] Синхронизация кеша между вкладками
- [ ] Server-side кеширование с Redis
- [ ] Предзагрузка популярных переводов

---

**Version**: 1.0  
**Last Updated**: January 2026
