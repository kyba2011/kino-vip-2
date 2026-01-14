"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Star, Play } from "lucide-react";
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
          kinopoiskAPI.getMovieDetails(id)
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
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">
        {locale === "ru" ? "Избранное" : "Favorites"}
      </h1>

      {movies.length === 0 ? (
        <p className="text-muted-foreground">
          {locale === "ru" ? "Нет избранных фильмов" : "No favorite movies"}
        </p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {movies.map((movie) => (
            <Card key={movie.kinopoiskId} className="border-0 bg-transparent">
              <CardContent className="p-0">
                <Link href={`/about/${movie.kinopoiskId}`}>
                  <div className="relative group overflow-hidden rounded-lg">
                    <img
                      src={movie.posterUrlPreview || movie.posterUrl || ""}
                      alt={movie.nameRu || movie.nameOriginal || ""}
                      className="w-full h-75 object-cover rounded-lg transition-transform group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors rounded-lg flex items-center justify-center">
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
                  <div className="mt-2 space-y-1">
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
