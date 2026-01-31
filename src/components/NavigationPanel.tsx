"use client";

import { memo } from "react";
import { usePathname, useRouter } from "@/i18n/routing";
import { useUser } from "@stackframe/stack";
import { useTranslations } from "next-intl";
import { Home, Search, History, Heart, Star } from "lucide-react";
import { GlassDock } from "./ui/glass-dock";
import type { DockItem } from "./ui/glass-dock";

function NavigationPanel() {
  const t = useTranslations("navigation");
  const pathname = usePathname();
  const user = useUser();
  const router = useRouter();

  const navigationItems: DockItem[] = [
    {
      id: "home",
      icon: <Home className="w-6 h-6" />,
      label: t("home"),
      href: "/",
      active: pathname === "/",
      onClick: () => router.push("/"),
    },
    {
      id: "search",
      icon: <Search className="w-6 h-6" />,
      label: t("search"),
      href: "/search",
      active: pathname === "/search",
      onClick: () => router.push("/search"),
    },
    {
      id: "top",
      icon: <Star className="w-6 h-6" />,
      label: t("top"),
      href: "/top",
      active: pathname === "/top",
      onClick: () => router.push("/top"),
    },
    {
      id: "history",
      icon: <History className="w-6 h-6" />,
      label: t("history"),
      href: user ? "/history" : "/handler/sign-in",
      active: pathname === "/history",
      onClick: () => router.push(user ? "/history" : "/handler/sign-in"),
    },
    {
      id: "favorites",
      icon: <Heart className="w-6 h-6" />,
      label: t("favorites"),
      href: user ? "/favorites" : "/handler/sign-in",
      active: pathname === "/favorites",
      onClick: () => router.push(user ? "/favorites" : "/handler/sign-in"),
    },
  ];

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40">
      <GlassDock
        items={navigationItems}
        magnification={
          typeof window !== "undefined" && window.innerWidth < 768 ? 1 : 1.3
        }
        baseSize={48}
        maxSize={56}
        glassIntensity="low"
      />
    </div>
  );
}

export default memo(NavigationPanel);
