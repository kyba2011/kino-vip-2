"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Play, Trash2, Clock } from "lucide-react";

interface HistoryItem {
  id: number;
  title: string;
  poster: string;
  watchedAt: string;
}

export default function HistoryPage() {
  const [history, setHistory] = useState<HistoryItem[]>([]);

  useEffect(() => {
    const savedHistory = JSON.parse(localStorage.getItem("history") || "[]");
    setHistory(savedHistory);
  }, []);

  const clearHistory = () => {
    localStorage.removeItem("history");
    setHistory([]);
  };

  const removeFromHistory = (id: number) => {
    const newHistory = history.filter((item) => item.id !== id);
    localStorage.setItem("history", JSON.stringify(newHistory));
    setHistory(newHistory);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ru-RU", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">История просмотров</h1>
          <p className="text-muted-foreground">
            {history.length > 0
              ? `Всего просмотрено: ${history.length} ${
                  history.length === 1 ? "фильм" : "фильмов"
                }`
              : "История просмотров пуста"}
          </p>
        </div>

        {history.length > 0 && (
          <Button variant="destructive" onClick={clearHistory}>
            <Trash2 className="w-4 h-4 mr-2" />
            Очистить историю
          </Button>
        )}
      </div>

      {history.length === 0 ? (
        <div className="text-center py-12">
          <Clock className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
          <h2 className="text-xl font-semibold mb-2">
            История просмотров пуста
          </h2>
          <p className="text-muted-foreground mb-6">
            Начните смотреть фильмы, и они появятся здесь
          </p>
          <Button asChild>
            <Link href="/">Перейти к фильмам</Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {history.map((item) => (
            <Card
              key={`${item.id}-${item.watchedAt}`}
              className="group cursor-pointer hover:scale-105 transition-transform duration-200"
            >
              <CardContent className="p-0">
                <div className="relative">
                  <img
                    src={item.poster}
                    alt={item.title}
                    className="w-full h-[300px] object-cover rounded-t-lg"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src =
                        "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='450'%3E%3Crect width='300' height='450' fill='%231a1a1a'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='18' fill='%23666'%3ENo Image%3C/text%3E%3C/svg%3E";
                    }}
                  />

                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/60 transition-all duration-200 rounded-t-lg flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex gap-2">
                      <Button asChild size="sm">
                        <Link href={`/watch/${item.id}`}>
                          <Play className="w-4 h-4" />
                        </Link>
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={(e) => {
                          e.preventDefault();
                          removeFromHistory(item.id);
                        }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="absolute top-2 right-2">
                    <Badge className="bg-black/70 text-white">
                      <Clock className="w-3 h-3 mr-1" />
                      Просмотрено
                    </Badge>
                  </div>
                </div>

                <div className="p-4">
                  <Link href={`/about/${item.id}`}>
                    <h3 className="font-semibold text-sm mb-2 line-clamp-2 hover:text-primary transition-colors">
                      {item.title}
                    </h3>
                  </Link>

                  <p className="text-xs text-muted-foreground">
                    {formatDate(item.watchedAt)}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
