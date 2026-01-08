"use client";

import Link from "next/link";
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

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  if (isMobile) {
    // Мобильная навигация внизу - только иконки
    return (
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-background/95 backdrop-blur border-t border-border">
        <div className="flex items-center justify-around px-2 py-3">
          {navigationItems.slice(0, 5).map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center justify-center p-3 rounded-lg hover:bg-accent transition-colors"
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
    <nav className="fixed left-0 top-16 bottom-0 z-30 w-16 bg-background/95 backdrop-blur border-r border-border">
      <div className="flex flex-col h-full">
        {/* Навигационные элементы */}
        <div className="flex-1 p-2 space-y-2 pt-4">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center justify-center p-3 rounded-lg hover:bg-accent transition-colors group relative"
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
            className="flex items-center justify-center p-3 rounded-lg group relative"
            title="Последний просмотр"
          >
            <Clock className="w-6 h-6 text-muted-foreground" />

            {/* Tooltip с информацией */}
            <div className="absolute left-full ml-2 px-2 py-1 bg-popover text-popover-foreground text-sm rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50">
              Последний: Мстители
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
