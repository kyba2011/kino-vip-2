"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLocale } from "next-intl";
import { Link } from "@/i18n/routing";
import { Clock } from "lucide-react";

interface HistoryItem {
  id: number;
  title: string;
  poster: string;
  watchedAt: string;
}

export default function HistoryPage() {
  const locale = useLocale();
  const [history, setHistory] = useState<HistoryItem[]>([]);

  useEffect(() => {
    const historyData = JSON.parse(localStorage.getItem("history") || "[]");
    setHistory(historyData);
  }, []);

  return (
    <div className="container mx-auto px-4 py-8 mt-16 mb-24">
      <h1 className="text-2xl font-bold mb-6">
        {locale === "ru" ? "История просмотров" : "Watch History"}
      </h1>

      {history.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
          <Clock className="w-16 h-16 text-muted-foreground mb-4" />
          <p className="text-xl font-medium mb-2">
            {locale === "ru" ? "История пуста" : "No watch history"}
          </p>
          <Link
            href="/"
            className="mt-4 px-6 py-3 rounded-2xl bg-black/40 backdrop-blur-xs backdrop-saturate-150 border border-white/10 text-white hover:bg-black/50 transition-all shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1),0_8px_32px_0_rgba(0,0,0,0.2)]"
          >
            {locale === "ru" ? "Вернуться на главную" : "Back to Home"}
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {history.map((item) => (
            <Card key={item.id} className="border-0 bg-transparent">
              <CardContent className="p-0">
                <Link href={`/about/${item.id}`}>
                  <div className="relative group overflow-hidden rounded-lg">
                    <img
                      src={item.poster || ""}
                      alt={item.title}
                      className="w-full h-75 object-cover rounded-lg transition-transform group-hover:scale-105"
                    />
                    <div className="absolute top-2 left-2">
                      <Badge className="bg-black/70 text-white">
                        <Clock className="w-3 h-3 mr-1" />
                        {new Date(item.watchedAt).toLocaleDateString(locale)}
                      </Badge>
                    </div>
                  </div>
                  <div className="mt-2">
                    <h3 className="font-medium text-sm line-clamp-2">
                      {item.title}
                    </h3>
                  </div>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
