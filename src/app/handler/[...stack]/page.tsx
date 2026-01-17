import { StackHandler } from "@stackframe/stack";
import { Film } from "lucide-react";
import Link from "next/link";
import { cookies } from "next/headers";
import { StackProvider, StackTheme } from "@stackframe/stack";
import { stackClientApp } from "@/stack/client";

export default async function Handler() {
  // Получаем текущую локаль из куки (next-intl сохраняет её там)
  const cookieStore = await cookies();
  const locale = cookieStore.get("NEXT_LOCALE")?.value || "ru";

  // Словари переводов
  const t = {
    ru: {
      slogan: "Ваш портал в мир кино",
      terms: "Продолжая, вы соглашаетесь с нашими условиями использования",
      back: "← Вернуться на главную",
    },
    en: {
      slogan: "Your portal to the world of cinema",
      terms: "By continuing, you agree to our terms of use",
      back: "← Back to home",
    },
  }[locale as "ru" | "en"] || {
    // fallback на русский
    slogan: "Ваш портал в мир кино",
    terms: "Продолжая, вы соглашаетесь с нашими условиями использования",
    back: "← Вернуться на главную",
  };

  return (
    <StackProvider app={stackClientApp}>
      <StackTheme>
        <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-background via-background to-muted/20 p-4">
          <div className="w-full max-w-md min-w-[280px] mx-auto">
            {/* Логотип и заголовок */}
            <Link href={`/${locale}`} className="block mb-6 text-center group">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <Film className="w-8 h-8 sm:w-10 sm:h-10 text-primary group-hover:scale-110 transition-transform" />
                <h1 className="text-2xl sm:text-3xl font-bold text-primary font-mono tracking-wider group-hover:text-primary/80 transition-colors ">
                  KINO.VIP
                </h1>
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground">
                {t.slogan}
              </p>
            </Link>

            {/* Форма авторизации */}
            <div className="bg-card border border-border flex items-center justify-center rounded-3xl shadow-xl py-6 px-4 backdrop-blur-xs w-full overflow-hidden text-sm">
              <StackHandler fullPage={false} />
            </div>

            {/* Футер */}
            <div className="mt-6 text-center space-y-2">
              <p className="text-xs sm:text-sm text-muted-foreground">
                {t.terms}
              </p>
              <Link
                href={`/${locale}`}
                className="text-xs sm:text-sm text-primary hover:underline inline-block"
              >
                {t.back}
              </Link>
            </div>
          </div>
        </div>
      </StackTheme>
    </StackProvider>
  );
}
