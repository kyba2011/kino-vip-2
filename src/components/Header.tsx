"use client";

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
    <header className="sticky top-0 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 z-50">
      <div className="w-full mx-auto px-2 sm:px-4">
        <div className="flex items-center justify-between h-16 gap-2">
          {/* Логотип */}
          <div className="flex items-center shrink-0">
            <Link
              href="/"
              className="flex items-center space-x-1 sm:space-x-2 text-lg sm:text-2xl font-bold text-primary font-mono tracking-wider hover:text-primary/80 transition-colors"
            >
              <Film className="w-6 h-6 sm:w-8 sm:h-8" />
              <span className="hidden md:inline">KINO.VIP</span>
            </Link>
          </div>

          {/* Поиск */}
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
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  name="search"
                  type="text"
                  placeholder={t("search")}
                  className="pl-10 bg-background/20 backdrop-blur-md border-white/10 rounded-lg focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-white/20 hover:border-white/20 transition-colors"
                />
              </div>
            </form>
          </div>

          {/* Авторизация / Профиль */}
          <div className="flex items-center space-x-3">
            {/* Языки */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center gap-1"
                >
                  <Languages className="w-4 h-4" />
                  <span className="hidden sm:inline">
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
              <UserButton />
            ) : (
              <Button
                variant="outline"
                className="flex items-center gap-2 rounded-lg"
                asChild
              >
                <a href="/handler/sign-in">
                  <LogIn />
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

export default Header;
