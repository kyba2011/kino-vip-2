"use client";

import { useEffect, useState } from "react";

interface Orb {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
}

export default function BreathingOrbs() {
  const [orbs, setOrbs] = useState<Orb[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    const generateOrbs = () => {
      const newOrbs: Orb[] = [];
      const minDistance = 250;

      const isValidPosition = (x: number, y: number) => {
        return newOrbs.every((orb) => {
          const distance = Math.sqrt(
            Math.pow(x - orb.x, 2) + Math.pow(y - orb.y, 2),
          );
          return distance >= minDistance;
        });
      };

      for (let i = 0; i < 3; i++) {
        let x, y;
        let attempts = 0;

        do {
          x = Math.random() * 100;
          y = Math.random() * 100;
          attempts++;
        } while (!isValidPosition(x, y) && attempts < 50);

        if (attempts < 50) {
          newOrbs.push({
            id: Date.now() + i,
            x,
            y,
            size: 120 + Math.random() * 80,
            duration: 2.5 + Math.random() * 1.5,
          });
        }
      }

      setOrbs(newOrbs);
    };

    generateOrbs();
    const interval = setInterval(generateOrbs, 4000);

    return () => clearInterval(interval);
  }, []);

  if (!mounted) return null;

  return (
    <>
      <style jsx global>{`
        @keyframes breatheBlur {
          0% {
            opacity: 0;
            filter: blur(40px);
          }
          50% {
            opacity: 0.4;
            filter: blur(60px);
          }
          100% {
            opacity: 0;
            filter: blur(40px);
          }
        }
      `}</style>
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        {orbs.map((orb) => (
          <div
            key={orb.id}
            className="absolute rounded-full"
            style={{
              left: `${orb.x}%`,
              top: `${orb.y}%`,
              width: `${orb.size}px`,
              height: `${orb.size}px`,
              background:
                "radial-gradient(circle, rgba(59, 130, 246, 0.6), rgba(147, 51, 234, 0.4))",
              animation: `breatheBlur ${orb.duration}s ease-in-out forwards`,
              transform: "translate(-50%, -50%)",
            }}
          />
        ))}
      </div>
    </>
  );
}
