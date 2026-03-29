import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { NextRequest, NextResponse } from "next/server";

// Создаем основной middleware для локализации
const intlMiddleware = createMiddleware({
  ...routing,
  localeDetection: false, // Отключаем автоопределение для стабильности билда
});

export default function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // 1. Исключаем все системные пути Next.js и API
  if (
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/_vercel") ||
    pathname.startsWith("/handler") || // Твой Stack Auth путь
    pathname.includes(".") // Пропускает файлы (favicon.ico, картинки и т.д.)
  ) {
    return NextResponse.next();
  }

  // 2. Для всех остальных страниц применяем локализацию
  return intlMiddleware(request);
}

// 3. НАСТРОЙКА МАТЧЕРА (Самая важная часть для Vercel)
export const config = {
  // Этот матчер говорит Next.js: "Запускай этот файл ТОЛЬКО для страниц"
  matcher: [
    // Обрабатываем корень
    "/",
    // Обрабатываем пути с локалями
    "/(ru|en)/:path*",
    // Магия исключений: не трогаем api, _next, статику и файлы с расширениями
    "/((?!api|_next/static|_next/image|handler|favicon.ico|.*\\..*).*)",
  ],
};