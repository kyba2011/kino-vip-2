# Stack Auth Migration Guide

## Проблема / Problem

После добавления многоязычности (i18n) с префиксами `/ru/` и `/en/`, Stack Auth handler перестал работать, так как он находился по пути `/handler/...`, а теперь нужен путь `/ru/handler/...` или `/en/handler/...`.

After adding multilingual support (i18n) with `/ru/` and `/en/` prefixes, Stack Auth handler stopped working because it was located at `/handler/...`, but now needs to be at `/ru/handler/...` or `/en/handler/...`.

## Решение / Solution

### 1. Переместить handler в структуру [locale]

**Старый путь / Old path:**

```
src/app/handler/[...stack]/page.tsx
```

**Новый путь / New path:**

```
src/app/[locale]/handler/[...stack]/page.tsx
```

### 2. Обновить handler с поддержкой переводов

```tsx
import { StackHandler } from "@stackframe/stack";
import { Film } from "lucide-react";
import { Link } from "@/i18n/routing";
import { getTranslations } from "next-intl/server";

export default async function Handler() {
  const t = await getTranslations("auth");

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md">
        <Link href="/" className="block mb-6 text-center">
          <Film className="w-10 h-10 text-primary" />
          <h1 className="text-3xl font-bold">KINO.VIP</h1>
          <p className="text-sm text-muted-foreground">{t("subtitle")}</p>
        </Link>

        <div className="bg-card border rounded-3xl shadow-xl p-6">
          <StackHandler fullPage={false} />
        </div>

        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground">{t("terms")}</p>
          <Link href="/" className="text-sm text-primary hover:underline">
            ← {t("backToHome")}
          </Link>
        </div>
      </div>
    </div>
  );
}
```

### 3. Добавить переводы

**messages/ru.json:**

```json
{
  "auth": {
    "subtitle": "Ваш портал в мир кино",
    "terms": "Продолжая, вы соглашаетесь с нашими условиями использования",
    "backToHome": "Вернуться на главную"
  }
}
```

**messages/en.json:**

```json
{
  "auth": {
    "subtitle": "Your portal to the world of cinema",
    "terms": "By continuing, you agree to our terms of use",
    "backToHome": "Back to Home"
  }
}
```

### 4. Удалить старый handler

Вручную удалите папку:

```
src/app/handler/
```

### 5. Обновить ссылки на авторизацию

В компонентах, где используется `app.urls.signIn`, убедитесь, что используется правильный путь с локалью.

**Пример в Header.tsx:**

```tsx
import { Link } from "@/i18n/routing";

// Вместо:
<a href={app.urls.signIn}>Sign In</a>

// Используйте:
<Link href="/handler/sign-in">Sign In</Link>
```

## Новые URL / New URLs

После миграции Stack Auth будет доступен по следующим путям:

- **Русский / Russian:**

  - Sign In: `/ru/handler/sign-in`
  - Sign Up: `/ru/handler/sign-up`
  - Account Settings: `/ru/handler/account-settings`

- **Английский / English:**
  - Sign In: `/en/handler/sign-in`
  - Sign Up: `/en/handler/sign-up`
  - Account Settings: `/en/handler/account-settings`

## Проверка / Testing

1. Откройте `/ru/handler/sign-in` - должна открыться форма входа на русском
2. Откройте `/en/handler/sign-in` - должна открыться форма входа на английском
3. Переключите язык - форма должна обновиться с новыми переводами
4. Попробуйте войти/зарегистрироваться - все должно работать

## Troubleshooting

### 404 на /handler/...

**Проблема:** Старый путь больше не работает  
**Решение:** Используйте новые пути с префиксом локали `/ru/handler/...` или `/en/handler/...`

### Редирект на неправильный URL

**Проблема:** Stack Auth редиректит на путь без локали  
**Решение:** Проверьте конфигурацию Stack в `src/stack/client.tsx` и убедитесь, что используете правильные URL

### Переводы не работают

**Проблема:** Текст на странице авторизации не переводится  
**Решение:** Убедитесь, что добавили переводы в `messages/ru.json` и `messages/en.json`

## Дополнительная конфигурация / Additional Configuration

Если нужно настроить кастомные URL для Stack Auth:

```tsx
// src/stack/client.tsx
import { StackClientApp } from "@stackframe/stack";

export const stackClientApp = new StackClientApp({
  tokenStore: "nextjs-cookie",
  urls: {
    signIn: "/handler/sign-in",
    signUp: "/handler/sign-up",
    afterSignIn: "/",
    afterSignUp: "/",
    afterSignOut: "/",
  },
});
```

---

**Готово!** Stack Auth теперь работает с многоязычной системой 🎉
