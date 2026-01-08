"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "./ui/dropdown-menu";
import { Badge } from "./ui/badge";
import {
  Search,
  User,
  Settings,
  LogIn,
  UserPlus,
  Film,
  Bell,
  Languages,
  LogOut,
  UserRoundPlus,
} from "lucide-react";
import { UserButton, useUser } from "@stackframe/stack";

function Header() {
  const user = useUser();
  const [currentLanguage, setCurrentLanguage] = useState("ru");

  const languages = [
    { code: "ru", name: "Русский", flag: "🇷🇺" },
    { code: "en", name: "English", flag: "🇺🇸" },
    { code: "es", name: "Español", flag: "🇪🇸" },
    { code: "fr", name: "Français", flag: "🇫🇷" },
    { code: "de", name: "Deutsch", flag: "🇩🇪" },
  ];

  return (
    <header className="sticky top-0 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Логотип */}
          <div className="flex items-center">
            <Link
              href="/"
              className="flex items-center space-x-2 text-2xl font-bold text-primary font-mono tracking-wider hover:text-primary/80 transition-colors"
            >
              <Film className="w-8 h-8" />
              <span>KINO.VIP</span>
            </Link>
          </div>

          {/* Поиск */}
          <div className="flex-1 max-w-md mx-8">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const query = formData.get("search") as string;
                if (query.trim()) {
                  window.location.href = `/search?q=${encodeURIComponent(
                    query
                  )}`;
                }
              }}
            >
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  name="search"
                  type="text"
                  placeholder="Поиск фильмов, сериалов..."
                  className="pl-10 bg-muted/50 border-border focus:ring-primary/50 focus:border-primary"
                />
              </div>
            </form>
          </div>

          {/* Навигация */}
        

          {/* Авторизация / Профиль */}
          <div className="flex items-center space-x-3">
            {/* Языки */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center"
                >
                  <Languages className="w-4 h-4" />
                  <span className="hidden sm:inline">
                    {
                      languages.find((lang) => lang.code === currentLanguage)
                        ?.flag
                    }
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                {languages.map((lang) => (
                  <DropdownMenuItem
                    key={lang.code}
                    onClick={() => setCurrentLanguage(lang.code)}
                    className={currentLanguage === lang.code ? "bg-accent" : ""}
                  >
                    <span className="mr-2">{lang.flag}</span>
                    <span>{lang.name}</span>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {user ? (
              <>
                {/*Sign out Button*/}
                <UserButton />
              </>
            ) : (
              <>
                {/*Sign Button*/}
                <Button
                  variant="ghost"
                  className="flex items-center gap-2"
                  asChild
                >
                  <Link href="/sign-in">
                    <LogIn className="w-4 h-4" />
                    <span className="inline">Sign In</span>
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  className="flex items-center gap-2"
                  asChild
                >
                    <Link href="/sign-up">
                    <UserRoundPlus className="w-4 h-4" />
                    <span className="inline">Sign Up</span>
                  </Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
