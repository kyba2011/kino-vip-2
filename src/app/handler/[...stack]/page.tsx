import { StackHandler } from "@stackframe/stack";
import { Film } from "lucide-react";
import Link from "next/link";

export default function Handler() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-background via-background to-muted/20 p-4">
      <div className="w-full max-w-md min-w-[280px] mx-auto">
        {/* Логотип и заголовок */}
        <Link href="/" className="block mb-6 text-center group">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <Film className="w-8 h-8 sm:w-10 sm:h-10 text-primary group-hover:scale-110 transition-transform" />
            <h1 className="text-2xl sm:text-3xl font-bold text-primary font-mono tracking-wider group-hover:text-primary/80 transition-colors ">
              KINO.VIP
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Ваш портал в мир кино
          </p>
        </Link>

        {/* Форма авторизации */}
        <div className="bg-card border border-border flex items-center justify-center rounded-3xl shadow-xl py-6 px-4  backdrop-blur-sm w-full overflow-hidden text-sm">
          <StackHandler fullPage={false} />
        </div>

        {/* Футер */}
        <div className="mt-6 text-center space-y-2">
          <p className="text-xs sm:text-sm text-muted-foreground">
            Продолжая, вы соглашаетесь с нашими условиями использования
          </p>
          <Link
            href="/"
            className="text-xs sm:text-sm text-primary hover:underline inline-block"
          >
            ← Вернуться на главную
          </Link>
        </div>
      </div>
    </div>
  );
}
