# Database Setup - Quick Guide

## Быстрая настройка базы данных

### 1. Настройте DATABASE_URL

В файле `.env`:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/kino_db"
```

Или для других БД:

```env
# SQLite (для разработки)
DATABASE_URL="file:./dev.db"

# MySQL
DATABASE_URL="mysql://user:password@localhost:3306/kino_db"
```

### 2. Примените миграции

```bash
# Создать и применить миграцию
npx prisma migrate dev --name init

# Сгенерировать Prisma Client
npx prisma generate
```

### 3. Проверьте подключение

```bash
# Открыть Prisma Studio для просмотра данных
npx prisma studio
```

## Что было добавлено

✅ **Схема Prisma** - `prisma/schema.prisma`

- User с полем `language` для хранения предпочитаемого языка
- Movie для кеширования данных о фильмах
- UserFavorite для избранного
- UserHistory для истории просмотров
- UserRating для пользовательских оценок

✅ **Утилиты для работы с БД**

- `src/lib/db-user.ts` - работа с пользователями
- `src/lib/actions/favorites.ts` - избранное
- `src/lib/actions/history.ts` - история просмотров

✅ **Интеграция со Stack Auth**

- Автоматическое создание пользователя при первом действии
- ID пользователя берется из Stack Auth
- Синхронизация email и имени

## Использование

### Добавить в избранное

```typescript
import { toggleFavorite } from "@/lib/actions/favorites";

await toggleFavorite({
  id: 123,
  name: "Название фильма",
  poster: "https://...",
});
```

### Добавить в историю

```typescript
import { addToHistory } from "@/lib/actions/history";

await addToHistory({
  id: 123,
  name: "Название фильма",
  poster: "https://...",
});
```

### Получить избранное

```typescript
import { getFavorites } from "@/lib/actions/favorites";

const favorites = await getFavorites();
```

## Если что-то не работает

1. **Проверьте DATABASE_URL** в `.env`
2. **Запустите миграции**: `npx prisma migrate dev`
3. **Сгенерируйте клиент**: `npx prisma generate`
4. **Перезапустите dev сервер**: `npm run dev`

## Полная документация

См. `docs/DATABASE_INTEGRATION.md` для подробной информации.

---

**После настройки удалите этот файл (DATABASE_SETUP.md)**
