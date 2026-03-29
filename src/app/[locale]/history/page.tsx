"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLocale } from "next-intl";
import { Link } from "@/i18n/routing";
import { Clock } from "lucide-react";

interface HistoryEntry {
  id: string;
  movieId: number;
  watchedAt: string;
  movie: {
    id: number;
    nameRu: string | null;
    nameOriginal: string | null;
    posterUrlPreview: string | null;
  };
}

export default function HistoryPage() {
  const locale = useLocale();
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [unauthorized, setUnauthorized] = useState(false);

  useEffect(() => {
    fetch("/api/history")
      .then((res) => {
        if (res.status === 401) {
          setUnauthorized(true);
          return [];
        }
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data)) setHistory(data);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 mt-16 mb-24">
        <h1 className="text-2xl font-bold mb-6">
          {locale === "ru" ? "История просмотров" : "Watch History"}
        </h1>
        <div className="flex justify-center items-center min-h-[40vh]">
          <Clock className="w-8 h-8 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 mt-16 mb-24">
      <h1 className="text-2xl font-bold mb-6">
        {locale === "ru" ? "История просмотров" : "Watch History"}
      </h1>

      {unauthorized ? (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
          <Clock className="w-16 h-16 text-muted-foreground mb-4" />
          <p className="text-xl font-medium mb-2">
            {locale === "ru"
              ? "Войдите в аккаунт чтобы видеть историю"
              : "Sign in to see your watch history"}
          </p>
          <Link
            href="/handler/sign-in"
            className="mt-4 px-6 py-3 rounded-2xl bg-black/40 backdrop-blur-xs backdrop-saturate-150 border border-white/10 text-white hover:bg-black/50 transition-all shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1),0_8px_32px_0_rgba(0,0,0,0.2)]"
          >
            {locale === "ru" ? "Войти" : "Sign in"}
          </Link>
        </div>
      ) : history.length === 0 ? (
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
            <Card
              key={item.id}
              className="bg-white/5 backdrop-blur-[0.0px] backdrop-saturate-150 border border-white/10 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1),0_8px_32px_0_rgba(0,0,0,0.2)] hover:bg-white/10 hover:border-white/20 transition-all duration-300 overflow-hidden group"
            >
              <CardContent className="p-0">
                <Link href={`/about/${item.movieId}`}>
                  <div className="relative overflow-hidden rounded-lg">
                    {item.movie.posterUrlPreview ? (
                      <img
                        src={item.movie.posterUrlPreview}
                        alt={item.movie.nameRu || item.movie.nameOriginal || ""}
                        className="w-full h-75 object-cover rounded-lg transition-transform group-hover:scale-110 duration-300"
                      />
                    ) : (
                      <div className="w-full h-75 bg-gray-800 rounded-lg flex items-center justify-center">
                        <span className="text-gray-500">No Image</span>
                      </div>
                    )}
                    <div className="absolute top-2 left-2">
                      <Badge className="bg-black/70 text-white">
                        <Clock className="w-3 h-3 mr-1" />
                        {new Date(item.watchedAt).toLocaleDateString(locale)}
                      </Badge>
                    </div>
                  </div>
                  <div className="mt-2 px-2 pb-2">
                    <h3 className="font-medium text-sm line-clamp-2">
                      {item.movie.nameRu || item.movie.nameOriginal}
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
