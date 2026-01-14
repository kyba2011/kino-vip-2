"use client";

import { usePathname } from "@/i18n/routing";
import { Link } from "@/i18n/routing";
import { useState, useEffect } from "react";
import { useUser, useStackApp } from "@stackframe/stack";
import { useTranslations } from "next-intl";
import { Separator } from "./ui/separator";
import { Home, Search, History, Heart, Star, Clock } from "lucide-react";

export default function NavigationPanel() {
  const t = useTranslations("navigation");
  const [isMobile, setIsMobile] = useState(false);
  const pathname = usePathname();
  const [lastWatched, setLastWatched] = useState<string | null>(null);
  const user = useUser();
  const app = useStackApp();

  const navigationItems = [
    { icon: Home, label: t("home"), href: "/" },
    { icon: Search, label: t("search"), href: "/search" },
    { icon: Star, label: t("top"), href: "/top" },
    { icon: History, label: t("history"), href: "/history" },
    { icon: Heart, label: t("favorites"), href: "/favorites" },
  ];

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    // Загружаем последний просмотренный фильм
    const lastMovie = localStorage.getItem("lastWatched");
    if (lastMovie) {
      try {
        const movieData = JSON.parse(lastMovie);
        setLastWatched(movieData.title);
      } catch (e) {
        console.error("Error parsing last watched movie:", e);
      }
    }

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  if (isMobile) {
    // Мобильная навигация внизу - только иконки
    return (
      <nav className="fixed -bottom-0.5 left-0 right-0 z-40 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 border-t border-border/40">
        <div className="flex items-center justify-evenly px-5 sm:px-10 py-3">
          {navigationItems.slice(0, 5).map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            const requiresAuth =
              item.href === "/history" || item.href === "/favorites";
            const linkHref =
              requiresAuth && !user ? app.urls.signIn : item.href;

            return (
              <Link
                key={item.href}
                href={linkHref}
                className={`flex items-center justify-center p-3 rounded-full transition-all duration-200 hover:scale-110 active:scale-95 ${
                  isActive ? "bg-accent/50 text-primary" : "hover:bg-accent/30"
                }`}
                title={item.label}
              >
                <Icon className="w-6 h-6" />
              </Link>
            );
          })}
        </div>
      </nav>
    );
  }

  // Десктопная навигация слева - всегда открыта, только иконки
  return (
    <nav className="fixed left-0 top-16 bottom-0 z-30 w-16 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 border-r border-border/40">
      <div className="flex flex-col h-full">
        {/* Навигационные элементы */}
        <div className="flex-1 p-2 space-y-2 pt-4">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            const requiresAuth =
              item.href === "/history" || item.href === "/favorites";
            const linkHref =
              requiresAuth && !user ? app.urls.signIn : item.href;

            return (
              <Link
                key={item.href}
                href={linkHref}
                className={`flex items-center justify-center p-3 rounded-full transition-all duration-200 hover:scale-110 group relative ${
                  isActive ? "bg-accent/50 text-primary" : "hover:bg-accent/30"
                }`}
                title={item.label}
              >
                <Icon className="w-6 h-6" />

                {/* Tooltip при наведении */}
                <div className="absolute left-full ml-2 px-2 py-1 bg-popover text-popover-foreground text-sm rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50">
                  {item.label}
                </div>
              </Link>
            );
          })}
        </div>

        <Separator />

        {/* Дополнительная информация - только иконка */}
        <div className="p-2 pb-4">
          <div
            className="flex items-center justify-center p-3 rounded-full group relative cursor-pointer hover:bg-accent/30 transition-all duration-200"
            title={
              lastWatched ? `${t("lastWatched")}: ${lastWatched}` : t("noViews")
            }
          >
            <Clock className="w-6 h-6 text-muted-foreground" />

            {/* Tooltip с информацией */}
            <div className="absolute left-full ml-2 px-2 py-1 bg-popover text-popover-foreground text-sm rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50">
              {lastWatched
                ? `${t("lastWatched")}: ${lastWatched}`
                : t("noViews")}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
