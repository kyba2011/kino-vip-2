import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { NextRequest, NextResponse } from "next/server";

const intlMiddleware = createMiddleware({
  ...routing,
  localeDetection: false, // Отключаем автоопределение языка браузера
});

export default function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Пропускаем /handler пути без редиректа на локаль
  if (pathname.startsWith("/handler")) {
    return NextResponse.next();
  }

  // Для всех остальных путей применяем intl middleware
  return intlMiddleware(request);
}

export const config = {
  // Match only internationalized pathnames
  matcher: ["/", "/(ru|en)/:path*", "/((?!api|_next|_vercel|.*\\..*).*)"],
};
