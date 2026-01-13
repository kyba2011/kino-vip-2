"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { Separator } from "./ui/separator";
import {
  Home,
  Search,
  History,
  Heart,
  Film,
  Tv,
  Star,
  Clock,
} from "lucide-react";

const navigationItems = [
  { icon: Home, label: "Главная", href: "/" },
  { icon: Search, label: "Поиск", href: "/search" },
  { icon: Star, label: "Топ", href: "/top" },
  { icon: History, label: "История", href: "/history" },
  { icon: Heart, label: "Избранное", href: "/favorites" },
];

export default function NavigationPanel() {
  const [isMobile, setIsMobile] = useState(false);
  const pathname = usePathname();
  const [lastWatched, setLastWatched] = useState<string | null>(null);

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
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 border-t border-border/40">
        <div className="flex items-center justify-evenly px-5 sm:px-10 py-3">
          {navigationItems.slice(0, 5).map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
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
            return (
              <Link
                key={item.href}
                href={item.href}
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
            title={lastWatched ? `Последний: ${lastWatched}` : "Нет просмотров"}
          >
            <Clock className="w-6 h-6 text-muted-foreground" />

            {/* Tooltip с информацией */}
            <div className="absolute left-full ml-2 px-2 py-1 bg-popover text-popover-foreground text-sm rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50">
              {lastWatched ? `Последний: ${lastWatched}` : "Нет просмотров"}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
