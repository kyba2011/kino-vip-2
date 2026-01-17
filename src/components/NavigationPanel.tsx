"use client";

import { usePathname } from "@/i18n/routing";
import { Link } from "@/i18n/routing";
import { useState, useEffect, useRef } from "react";
import { useUser } from "@stackframe/stack";
import { useTranslations } from "next-intl";
import { Home, Search, History, Heart, Star } from "lucide-react";

export default function NavigationPanel() {
  const t = useTranslations("navigation");
  const pathname = usePathname();
  const user = useUser();
  const [bubblePosition, setBubblePosition] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);
  const initializedRef = useRef(false);

  const navigationItems = [
    { icon: Home, label: t("home"), href: "/" },
    { icon: Search, label: t("search"), href: "/search" },
    { icon: Star, label: t("top"), href: "/top" },
    { icon: History, label: t("history"), href: "/history" },
    { icon: Heart, label: t("favorites"), href: "/favorites" },
  ];

  useEffect(() => {
    const updateBubblePosition = (animate = false) => {
      if (!navRef.current) return;

      const activeIndex = navigationItems.findIndex(
        (item) => item.href === pathname
      );
      if (activeIndex === -1) return;

      const buttons = navRef.current.querySelectorAll("a");
      const activeButton = buttons[activeIndex] as HTMLElement;

      if (activeButton) {
        const navRect = navRef.current.getBoundingClientRect();
        const buttonRect = activeButton.getBoundingClientRect();

        const x = buttonRect.left - navRect.left + buttonRect.width / 2;
        const y = buttonRect.top - navRect.top + buttonRect.height / 2;

        setBubblePosition({ x, y });

        if (animate && initializedRef.current) {
          setIsAnimating(true);
          setTimeout(() => setIsAnimating(false), 600);
        }

        initializedRef.current = true;
      }
    };

    // Первая инициализация без анимации
    if (!initializedRef.current) {
      updateBubblePosition(false);
    } else {
      // Последующие обновления с анимацией
      updateBubblePosition(true);
    }

    window.addEventListener("resize", () => updateBubblePosition(false));

    return () =>
      window.removeEventListener("resize", () => updateBubblePosition(false));
  }, [pathname]);

  const handleClick = () => {
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 1000);
  };

  const handleTouchStart = () => {
    setIsDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || !navRef.current) return;

    const touch = e.touches[0];
    const navRect = navRef.current.getBoundingClientRect();

    let x = touch.clientX - navRect.left;
    const y = navRect.height / 2;

    const bubbleRadius = 40;
    x = Math.max(bubbleRadius, Math.min(x, navRect.width - bubbleRadius));

    setBubblePosition({ x, y });
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!isDragging || !navRef.current) return;

    setIsDragging(false);

    const touch = e.changedTouches[0];
    const navRect = navRef.current.getBoundingClientRect();
    const touchX = touch.clientX - navRect.left;

    // Найти ближайшую кнопку
    const buttons = navRef.current.querySelectorAll("a");
    let closestIndex = 0;
    let minDistance = Infinity;

    buttons.forEach((button, index) => {
      const buttonRect = button.getBoundingClientRect();
      const buttonCenterX =
        buttonRect.left - navRect.left + buttonRect.width / 2;
      const distance = Math.abs(touchX - buttonCenterX);

      if (distance < minDistance) {
        minDistance = distance;
        closestIndex = index;
      }
    });

    // Переместить bubble к ближайшей кнопке
    const closestButton = buttons[closestIndex] as HTMLElement;
    const buttonRect = closestButton.getBoundingClientRect();
    const x = buttonRect.left - navRect.left + buttonRect.width / 2;
    const y = navRect.height / 2;

    setBubblePosition({ x, y });
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 600);

    // Перейти на страницу
    setTimeout(() => {
      closestButton.click();
    }, 300);
  };

  return (
    <nav ref={navRef} className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40">
      <div className="relative flex items-center justify-center gap-3 px-4 py-3 rounded-[2rem] bg-black/40 backdrop-blur-[0.0px] backdrop-saturate-150 border border-white/10 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1),0_8px_32px_0_rgba(0,0,0,0.2)]">
        {/* Animated Liquid Glass Bubble */}
        {bubblePosition && (
          <div
            className="absolute pointer-events-none"
            style={{
              left: `${bubblePosition.x}px`,
              top: `${bubblePosition.y}px`,
              transform: "translate(-50%, -50%)",
              transition: initializedRef.current
                ? "left 0.6s ease-in-out, top 0.6s ease-in-out"
                : "none",
            }}
          >
            <div
              style={{
                transform: `scale(${isAnimating || isDragging ? "1.2" : "1"})`,
                transition: initializedRef.current
                  ? "transform 0.6s ease-in-out"
                  : "none",
              }}
            >
              {/* Outer glow */}

              {/* Main bubble */}
              <div className="relative w-20 h-20">
                {/* Layer 1 - Основная граница */}
                <div
                  className="absolute inset-0 rounded-full border-2"
                  style={{
                    background: "transparent",
                    borderColor: "rgba(255,255,255,0.2)",
                    boxShadow:
                      "inset 0 1px 2px rgba(255,255,255,0.15), 0 0 20px rgba(255,255,255,0.03)",
                  }}
                />

                {/* Layer 2 - Внутренний градиент */}
                <div
                  className="absolute inset-1 rounded-full"
                  style={{
                    background:
                      "radial-gradient(circle at 30% 30%, rgba(255,255,255,0.08), transparent 70%)",
                  }}
                />

                {/* Layer 3 - Specular highlight */}
                <div
                  className="absolute top-2 left-2 w-3 h-3 rounded-full blur"
                  style={{
                    background:
                      "radial-gradient(circle, rgba(255,255,255,0.3), transparent 60%)",
                  }}
                />

                {/* SVG Refraction Filter */}
                <svg
                  className="absolute inset-0 w-full h-full opacity-30"
                  style={{ filter: "url(#glass-refraction)" }}
                >
                  <defs>
                    <filter
                      id="glass-refraction"
                      x="-50%"
                      y="-50%"
                      width="200%"
                      height="200%"
                    >
                      <feTurbulence
                        type="fractalNoise"
                        baseFrequency="0.05"
                        numOctaves="2"
                        result="noise"
                        seed="5"
                      />
                      <feDisplacementMap
                        in="SourceGraphic"
                        in2="noise"
                        scale="2"
                        xChannelSelector="R"
                        yChannelSelector="G"
                        result="distorted"
                      />
                      <feGaussianBlur
                        in="distorted"
                        stdDeviation="0.1"
                        result="blurred"
                      />
                    </filter>
                  </defs>
                  <circle
                    cx="50%"
                    cy="50%"
                    r="38"
                    fill="transparent"
                    stroke="rgba(255,255,255,0.05)"
                    strokeWidth="0.5"
                  />
                </svg>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Items */}
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const requiresAuth =
            item.href === "/history" || item.href === "/favorites";
          const linkHref =
            requiresAuth && !user ? "/handler/sign-in" : item.href;

          return requiresAuth && !user ? (
            <a
              key={item.href}
              href={linkHref}
              onClick={handleClick}
              className="relative flex items-center justify-center p-3 rounded-2xl transition-all duration-200 text-white z-10"
              title={item.label}
            >
              <Icon className="w-6 h-6" />
            </a>
          ) : (
            <Link
              key={item.href}
              href={linkHref}
              onClick={handleClick}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              className="relative flex items-center justify-center p-3 rounded-2xl transition-all duration-200 text-white z-10"
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
