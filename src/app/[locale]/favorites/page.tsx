"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Star, Play, Heart } from "lucide-react";
import { kinopoiskAPI, getMovieRating } from "@/lib/api";
import { Movie } from "@/types/movie";
import { translateMovies } from "@/lib/translate";
import { useLocale } from "next-intl";
import { Link } from "@/i18n/routing";

export default function FavoritesPage() {
  const locale = useLocale();
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFavorites = async () => {
      try {
        const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");

        if (favorites.length === 0) {
          setLoading(false);
          return;
        }

        // Загружаем детали каждого фильма
        const moviePromises = favorites.map((id: number) =>
          kinopoiskAPI.getMovieDetails(id),
        );
        let results = await Promise.all(moviePromises);

        // Переводим результаты если язык не русский
        if (locale !== "ru") {
          results = await translateMovies(results, locale);
        }

        setMovies(results);
      } catch (error) {
        console.error("Error loading favorites:", error);
      } finally {
        setLoading(false);
      }
    };

    loadFavorites();
  }, [locale]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">
          {locale === "ru" ? "Избранное" : "Favorites"}
        </h1>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-75 w-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 mt-16 mb-24">
      <h1 className="text-2xl font-bold mb-6">
        {locale === "ru" ? "Избранное" : "Favorites"}
      </h1>

      {movies.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
          <Heart className="w-16 h-16 text-muted-foreground mb-4" />
          <p className="text-xl font-medium mb-2">
            {locale === "ru" ? "Нет избранных фильмов" : "No favorite movies"}
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
          {movies.map((movie) => (
            <Card
              key={movie.kinopoiskId}
              className="h-100 bg-white/5 backdrop-blur-[0.0px] backdrop-saturate-150 border border-white/10 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1),0_8px_32px_0_rgba(0,0,0,0.2)] hover:bg-white/10 transition-all duration-300 hover:scale-105"
            >
              <CardContent className="p-0 h-full">
                <Link
                  href={`/about/${movie.kinopoiskId}`}
                  className="block h-full"
                >
                  <div className="relative group rounded-2xl h-full flex flex-col pb-3">
                    <img
                      src={movie.posterUrlPreview || movie.posterUrl || ""}
                      alt={movie.nameRu || movie.nameOriginal || ""}
                      className="w-full h-75 object-cover rounded-2xl transition-transform group-hover:scale-110 duration-300"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Play className="w-12 h-12 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    {getMovieRating(movie) && (
                      <div className="absolute top-2 right-2">
                        <Badge className="bg-black/70 text-white">
                          <Star className="w-3 h-3 mr-1 fill-yellow-400 text-yellow-400" />
                          {getMovieRating(movie)}
                        </Badge>
                      </div>
                    )}
                  </div>
                  <div className="mt-2 space-y-1 px-2 pb-2 grow">
                    <h3 className="font-medium text-sm line-clamp-2">
                      {movie.nameRu || movie.nameOriginal}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      {movie.year}
                    </p>
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
