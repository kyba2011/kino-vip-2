"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface DockItem {
  id: string;
  icon: React.ReactNode;
  label: string;
  href?: string;
  onClick?: () => void;
  active?: boolean;
}

type DockOrientation = "horizontal" | "vertical";

interface GlassDockProps extends React.HTMLAttributes<HTMLDivElement> {
  items: DockItem[];
  magnification?: number;
  baseSize?: number;
  maxSize?: number;
  orientation?: DockOrientation;
  glassIntensity?: "low" | "medium" | "high";
}

const glassConfig = {
  low: {
    bg: "bg-black/40",
    blur: "backdrop-blur-[0.0px]",
    border: "border-white/10",
    itemBg: "bg-transparent",
    itemHover: "hover:bg-white/5",
  },
  medium: {
    bg: "bg-white/10",
    blur: "backdrop-blur-2xl",
    border: "border-white/20",
    itemBg: "bg-white/10",
    itemHover: "hover:bg-white/20",
  },
  high: {
    bg: "bg-white/15",
    blur: "backdrop-blur-3xl",
    border: "border-white/30",
    itemBg: "bg-white/15",
    itemHover: "hover:bg-white/25",
  },
};

const GlassDock = React.forwardRef<HTMLDivElement, GlassDockProps>(
  (
    {
      className,
      items,
      magnification = 1.5,
      baseSize = 48,
      maxSize = 72,
      orientation = "horizontal",
      glassIntensity = "high",
      ...props
    },
    ref,
  ) => {
    const [hoveredIndex, setHoveredIndex] = React.useState<number | null>(null);
    const [mousePos, setMousePos] = React.useState<number | null>(null);
    const dockRef = React.useRef<HTMLDivElement>(null);
    const glass = glassConfig[glassIntensity];
    const isVertical = orientation === "vertical";
    const activeIndex = items.findIndex((item) => item.active);

    const handleMouseMove = React.useCallback(
      (e: React.MouseEvent) => {
        if (!dockRef.current) return;
        const rect = dockRef.current.getBoundingClientRect();
        setMousePos(isVertical ? e.clientY - rect.top : e.clientX - rect.left);
      },
      [isVertical],
    );

    const handleMouseLeave = React.useCallback(() => {
      setMousePos(null);
      setHoveredIndex(null);
    }, []);

    const getScale = React.useCallback(
      (index: number) => {
        if (mousePos === null) return 1;

        const itemSize = baseSize + 16;
        const itemCenter = index * itemSize + itemSize / 2;
        const distance = Math.abs(mousePos - itemCenter);
        const maxDistance = itemSize * 2;

        if (distance > maxDistance) return 1;

        const scale = 1 + (magnification - 1) * (1 - distance / maxDistance);
        return Math.min(scale, magnification);
      },
      [mousePos, baseSize, magnification],
    );

    // Calculate active indicator position
    const getActivePosition = () => {
      if (activeIndex === -1) return null;
      const itemSize = baseSize + 16; // baseSize + gap
      const padding = 16; // px-4 = 16px
      return {
        [isVertical ? "top" : "left"]: `${padding + activeIndex * itemSize}px`,
        [isVertical ? "height" : "width"]: `${baseSize}px`,
        [isVertical ? "width" : "height"]: `${baseSize}px`,
      };
    };

    const activePosition = getActivePosition();

    return (
      <div ref={ref} className={cn("relative", className)} {...props}>
        <div
          ref={dockRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          role="toolbar"
          aria-label="Application dock"
          className={cn(
            "relative gap-3 px-4 py-3 rounded-full",
            glass.bg,
            glass.blur,
            glass.border,
            "border",
            "shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1),0_8px_32px_0_rgba(0,0,0,0.2)]",
            isVertical ? "flex flex-col items-center" : "flex items-end",
          )}
        >
          {/* Sliding active indicator */}
          {activePosition && (
            <div
              className="absolute rounded-full bg-linear-to-r from-cyan-500/60 to-blue-500/60 blur-lg transition-all duration-500 ease-in-out pointer-events-none animate-glow"
              style={{
                ...activePosition,
                transform: "translate(0, 0)",
              }}
            />
          )}

          <style jsx>{`
            @keyframes glow {
              0%,
              100% {
                opacity: 0.6;
              }
              50% {
                opacity: 1;
              }
            }
            .animate-glow {
              animation: glow 2s ease-in-out infinite;
            }
          `}</style>

          {items.map((item, index) => {
            const scale = getScale(index);
            const isHovered = hoveredIndex === index;
            const size = baseSize * scale;

            const DockItemContent = (
              <div
                key={item.id}
                className={cn(
                  "relative flex items-center",
                  isVertical ? "flex-row" : "flex-col",
                )}
                onMouseEnter={() => setHoveredIndex(index)}
                style={{
                  [isVertical ? "width" : "height"]: maxSize,
                  display: "flex",
                  [isVertical ? "justifyContent" : "alignItems"]: "flex-end",
                }}
              >
                <div
                  className={cn(
                    "absolute px-3 py-1.5 rounded-xl",
                    "bg-black/60 backdrop-blur-2xl border border-white/20",
                    "text-white/70 text-sm font-medium whitespace-nowrap",
                    "shadow-[0_4px_16px_rgba(0,0,0,0.2),inset_0_1px_1px_rgba(255,255,255,0.1)]",
                    "transition-all duration-200",
                    isVertical
                      ? cn(
                          "-right-2 translate-x-full",
                          isHovered
                            ? "opacity-100 translate-x-full"
                            : "opacity-0 translate-x-[calc(100%-8px)]",
                        )
                      : cn(
                          "bottom-full mb-2",
                          isHovered
                            ? "opacity-100 translate-y-0"
                            : "opacity-0 translate-y-2",
                        ),
                    !isHovered && "pointer-events-none",
                  )}
                >
                  <div className="absolute inset-0 rounded-xl bg-linear-to-b from-white/10 to-transparent pointer-events-none" />
                  <span className="relative">{item.label}</span>
                  <div
                    className={cn(
                      "absolute w-2.5 h-2.5 bg-black/60 backdrop-blur-2xl border border-white/20",
                      "transform rotate-45",
                      isVertical
                        ? "left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 border-t-0 border-r-0"
                        : "left-1/2 -bottom-1.5 -translate-x-1/2 border-t-0 border-l-0",
                    )}
                  />
                </div>

                <button
                  onClick={item.onClick}
                  aria-label={item.label}
                  className={cn(
                    "relative flex items-center justify-center rounded-full",
                    glass.itemBg,
                    "backdrop-blur-xl border border-white/20",
                    "transition-all duration-300 ease-out",
                    glass.itemHover,
                    item.active && "bg-white/20 border-white/30",
                  )}
                  style={{
                    width: size,
                    height: size,
                    transform: isVertical
                      ? `translateX(${(maxSize - size) / 2}px)`
                      : `translateY(${(maxSize - size) / 2}px)`,
                  }}
                >
                  <div className="absolute inset-0 rounded-full bg-transparent pointer-events-none" />

                  <span
                    className="relative text-white/70"
                    style={{
                      transform: `scale(${scale})`,
                      transition: "transform 0.2s ease-out",
                    }}
                  >
                    {item.icon}
                  </span>
                </button>
              </div>
            );

            if (item.href) {
              return (
                <a key={item.id} href={item.href} className="contents">
                  {DockItemContent}
                </a>
              );
            }

            return (
              <React.Fragment key={item.id}>{DockItemContent}</React.Fragment>
            );
          })}
        </div>
      </div>
    );
  },
);
GlassDock.displayName = "GlassDock";

export { GlassDock };
export type { DockItem, DockOrientation };
