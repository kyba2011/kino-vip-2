"use client";

import { memo } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Search, LogIn, Film, Languages } from "lucide-react";
import { UserButton, useUser, useStackApp } from "@stackframe/stack";
import { useLocale, useTranslations } from "next-intl";
import { useRouter, usePathname } from "@/i18n/routing";
import { Link } from "@/i18n/routing";

function Header() {
  const user = useUser();
  const app = useStackApp();
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations("header");

  const languages = [
    { code: "ru", name: "Русский", flag: "🇷🇺" },
    { code: "en", name: "English", flag: "🇺🇸" },
  ];

  const changeLanguage = (newLocale: "ru" | "en") => {
    router.push(pathname, { locale: newLocale });
  };

  return (
    <header className="fixed top-0 w-full z-50 pt-2">
      <div className="w-full mx-auto px-2 sm:px-4">
        <div className="flex items-center justify-between h-16 gap-2">
          {/* Логотип - liquid glass bubble */}
          <div className="hidden md:flex items-center shrink-0">
            <Link
              href="/"
              className="flex items-center space-x-1 sm:space-x-2 px-3 py-2 rounded-2xl bg-black/40 backdrop-blur-[0.0px] backdrop-saturate-150 border border-white/10 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1),0_8px_32px_0_rgba(0,0,0,0.2)] hover:bg-black/50 transition-all"
            >
              <Film className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
              <span className="inline text-lg sm:text-2xl font-bold text-white font-mono tracking-wider">
                KINO.VIP
              </span>
            </Link>
          </div>

          {/* Поиск - liquid glass bubble */}
          <div className="flex-1 max-w-md mx-2 sm:mx-8">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const query = formData.get("search") as string;
                if (query.trim()) {
                  router.push(`/search?q=${encodeURIComponent(query)}`);
                }
              }}
            >
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/70 w-4 h-4 z-10" />
                <Input
                  name="search"
                  type="text"
                  placeholder={t("search")}
                  className="pl-10 rounded-full overflow-hidden bg-black/40 backdrop-blur-[0.0px] backdrop-saturate-150 border border-white/10 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1),0_8px_32px_0_rgba(0,0,0,0.2)] text-white placeholder:text-white/50 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-white/30 focus-visible:bg-black/50 hover:border-white/20 hover:bg-black/45 transition-all"
                />
              </div>
            </form>
          </div>

          {/* Авторизация / Профиль - liquid glass bubbles */}
          <div className="flex items-center gap-2">
            {/* Языки - liquid glass bubble */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center gap-0.5 px-6 py-4 rounded-full bg-black/40 backdrop-blur-[0.0px] backdrop-saturate-150 border border-white/10 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1),0_8px_32px_0_rgba(0,0,0,0.2)] hover:bg-black/50 text-white transition-all"
                >
                  <Languages className="w-4 h-4" />
                  <span className="text-sm">
                    {languages.find((lang) => lang.code === locale)?.flag}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                {languages.map((lang) => (
                  <DropdownMenuItem
                    key={lang.code}
                    onClick={() => changeLanguage(lang.code as "ru" | "en")}
                    className={locale === lang.code ? "bg-accent" : ""}
                  >
                    <span className="mr-2">{lang.flag}</span>
                    <span>{lang.name}</span>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {user ? (
              <div className="rounded-full overflow-hidden bg-black/40 backdrop-blur-[0.0px] backdrop-saturate-150 border border-white/10 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1),0_8px_32px_0_rgba(0,0,0,0.2)]">
                <UserButton />
              </div>
            ) : (
              <Button
                variant="ghost"
                className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-black/40 backdrop-blur-[0.0px] backdrop-saturate-150 border border-white/10 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1),0_8px_32px_0_rgba(0,0,0,0.2)] hover:bg-black/50 text-white transition-all"
                asChild
              >
                <a href="/handler/sign-in">
                  <LogIn className="w-4 h-4" />
                  <span className="hidden sm:inline">{t("signIn")}</span>
                </a>
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export default memo(Header);
