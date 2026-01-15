# Database Integration with Stack Auth

## Обзор / Overview

Интеграция Prisma + PostgreSQL + Stack Auth для хранения пользовательских данных.

Integration of Prisma + PostgreSQL + Stack Auth for storing user data.

## Схема базы данных / Database Schema

### User (Пользователь)

- `id` - Stack Auth ID (не генерируется автоматически)
- `email` - Email пользователя
- `name` - Имя пользователя
- `language` - Предпочитаемый язык (ru/en)
- `createdAt` - Дата создания
- `updatedAt` - Дата обновления

### Movie (Фильм)

- `id` - Kinopoisk ID
- `nameRu`, `nameEn`, `nameOriginal` - Названия
- `posterUrl`, `posterUrlPreview` - Постеры
- `year`, `filmLength` - Год, длительность
- `description` - Описание
- `ratingKinopoisk`, `ratingImdb` - Рейтинги
- И другие поля...

### UserFavorite (Избранное)

- Связь пользователя и фильма
- Уникальная пара (userId, movieId)

### UserHistory (История)

- История просмотров
- `watchedAt` - Время просмотра

### UserRating (Рейтинги)

- Пользовательские оценки фильмов
- `rating` - Оценка 1-10

## Настройка / Setup

### 1. Установка зависимостей

```bash
npm install @prisma/client
npm install -D prisma
```

### 2. Настройка DATABASE_URL

В `.env` файле:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/kino_db"
```

### 3. Применение миграций

```bash
npx prisma migrate dev --name init
npx prisma generate
```

## Использование / Usage

### Работа с пользователями

```typescript
import {
  getOrCreateDbUser,
  updateUserLanguage,
  getUserLanguage,
} from "@/lib/db-user";

// Получить или создать пользователя
const user = await getOrCreateDbUser();

// Обновить язык
await updateUserLanguage("en");

// Получить язык
const lang = await getUserLanguage();
```

### Работа с избранным

```typescript
import {
  toggleFavorite,
  isFavorite,
  getFavorites,
} from "@/lib/actions/favorites";

// Добавить/удалить из избранного
await toggleFavorite({
  id: 123,
  name: "Название фильма",
  poster: "https://...",
});

// Проверить, в избранном ли
const favorite = await isFavorite(123);

// Получить все избранные
const favorites = await getFavorites();
```

### Работа с историей

```typescript
import { addToHistory, getHistory, clearHistory } from "@/lib/actions/history";

// Добавить в историю
await addToHistory({
  id: 123,
  name: "Название фильма",
  poster: "https://...",
});

// Получить историю
const history = await getHistory();

// Очистить историю
await clearHistory();
```

## Примеры интеграции / Integration Examples

### В компоненте страницы фильма

```tsx
"use client";

import { useState, useEffect } from "react";
import { toggleFavorite, isFavorite } from "@/lib/actions/favorites";
import { addToHistory } from "@/lib/actions/history";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function MoviePage({ movieId }: { movieId: number }) {
  const [favorite, setFavorite] = useState(false);

  useEffect(() => {
    // Проверяем, в избранном ли
    isFavorite(movieId).then(setFavorite);
  }, [movieId]);

  const handleToggleFavorite = async () => {
    const newState = await toggleFavorite({
      id: movieId,
      name: "Название фильма",
      poster: "https://...",
    });
    setFavorite(newState);
  };

  const handleWatch = async () => {
    // Добавляем в историю при просмотре
    await addToHistory({
      id: movieId,
      name: "Название фильма",
      poster: "https://...",
    });
  };

  return (
    <div>
      <Button onClick={handleToggleFavorite}>
        <Heart className={favorite ? "fill-red-500" : ""} />
        {favorite ? "Убрать из избранного" : "Добавить в избранное"}
      </Button>

      <Button onClick={handleWatch}>Смотреть</Button>
    </div>
  );
}
```

### На странице избранного

```tsx
import { getFavorites } from "@/lib/actions/favorites";

export default async function FavoritesPage() {
  const favorites = await getFavorites();

  return (
    <div>
      <h1>Избранное</h1>
      <div className="grid grid-cols-4 gap-4">
        {favorites.map((movie) => (
          <div key={movie.id}>
            <img src={movie.posterUrlPreview || ""} alt={movie.nameRu || ""} />
            <h3>{movie.nameRu}</h3>
          </div>
        ))}
      </div>
    </div>
  );
}
```

## Автоматическое создание пользователя

Пользователь автоматически создается в БД при первом обращении к `getOrCreateDbUser()`:

1. Пользователь авторизуется через Stack Auth
2. При первом действии (добавление в избранное, просмотр и т.д.)
3. Вызывается `getOrCreateDbUser()`
4. Если пользователя нет в БД - создается с данными из Stack Auth
5. Возвращается объект пользователя из БД

## Синхронизация языка

Язык пользователя можно синхронизировать с выбранной локалью:

```typescript
import { updateUserLanguage } from "@/lib/db-user";
import { useLocale } from "next-intl";

export function LanguageSwitcher() {
  const locale = useLocale();

  const handleLanguageChange = async (newLocale: string) => {
    // Обновляем язык в БД
    await updateUserLanguage(newLocale);
    // Переключаем локаль в интерфейсе
    router.push(pathname, { locale: newLocale });
  };

  return (
    // ... компонент переключателя языка
  );
}
```

## Миграции / Migrations

### Создание новой миграции

```bash
npx prisma migrate dev --name add_new_field
```

### Применение миграций в продакшене

```bash
npx prisma migrate deploy
```

### Сброс базы данных (только для разработки!)

```bash
npx prisma migrate reset
```

## Troubleshooting

### Ошибка "User not found"

- Убедитесь, что пользователь авторизован через Stack Auth
- Проверьте, что `stackServerApp.getUser()` возвращает пользователя

### Ошибка подключения к БД

- Проверьте `DATABASE_URL` в `.env`
- Убедитесь, что PostgreSQL запущен
- Проверьте права доступа к БД

### Ошибка "Prisma Client not generated"

```bash
npx prisma generate
```

## Best Practices

1. **Всегда используйте `getOrCreateDbUser()`** перед работой с пользовательскими данными
2. **Используйте `revalidatePath()`** после изменения данных для обновления кеша
3. **Обрабатывайте ошибки** - пользователь может быть не авторизован
4. **Используйте транзакции** для сложных операций
5. **Индексируйте часто используемые поля** для производительности

---

**Version**: 1.0  
**Last Updated**: January 2026
