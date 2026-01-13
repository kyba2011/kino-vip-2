"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Play, Heart, Star, Trash2 } from "lucide-react";
import { kinopoiskAPI } from "@/lib/api";
import { Movie } from "@/types/movie";

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<number[]>([]);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFavorites = async () => {
      const savedFavorites = JSON.parse(
        localStorage.getItem("favorites") || "[]"
      );
      setFavorites(savedFavorites);

      if (savedFavorites.length > 0) {
        try {
          // Загружаем информацию о каждом фильме
          const moviePromises = savedFavorites.map((id: number) =>
            kinopoiskAPI.getMovieDetails(id).catch(() => null)
          );

          const movieResults = await Promise.all(moviePromises);
          const validMovies = movieResults.filter(
            (movie) => movie !== null
          ) as Movie[];
          setMovies(validMovies);
        } catch (error) {
          console.error("Error loading favorites:", error);
        }
      }

      setLoading(false);
    };

    loadFavorites();
  }, []);

  const removeFromFavorites = (id: number) => {
    const newFavorites = favorites.filter((favId) => favId !== id);
    localStorage.setItem("favorites", JSON.stringify(newFavorites));
    setFavorites(newFavorites);
    setMovies(
      movies.filter(
        (movie) => movie.kinopoiskId !== id && movie.kinopoiskId !== undefined
      )
    );
  };

  const clearFavorites = () => {
    localStorage.removeItem("favorites");
    setFavorites([]);
    setMovies([]);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <Skeleton className="h-8 w-48 mb-2" />
            <Skeleton className="h-4 w-32" />
          </div>
          <Skeleton className="h-10 w-32" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="p-0">
                <Skeleton className="w-full h-[300px] rounded-t-lg" />
                <div className="p-4">
                  <Skeleton className="h-4 w-3/4 mb-2" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Избранное</h1>
          <p className="text-muted-foreground">
            {movies.length > 0
              ? `В избранном: ${movies.length} ${
                  movies.length === 1 ? "фильм" : "фильмов"
                }`
              : "Избранное пусто"}
          </p>
        </div>

        {movies.length > 0 && (
          <Button variant="destructive" onClick={clearFavorites}>
            <Trash2 className="w-4 h-4 mr-2" />
            Очистить избранное
          </Button>
        )}
      </div>

      {movies.length === 0 ? (
        <div className="text-center py-12">
          <Heart className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
          <h2 className="text-xl font-semibold mb-2">Избранное пусто</h2>
          <p className="text-muted-foreground mb-6">
            Добавляйте фильмы в избранное, и они появятся здесь
          </p>
          <Button asChild>
            <Link href="/">Перейти к фильмам</Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {movies.map((movie) => (
            <Card
              key={movie.kinopoiskId ?? movie.filmId}
              className="group cursor-pointer hover:scale-105 transition-transform duration-200"
            >
              <CardContent className="p-0">
                <div className="relative">
                  <img
                    src={movie.posterUrlPreview}
                    alt={movie.nameRu || movie.nameOriginal || ""}
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
                        <Link
                          href={`/watch/${movie.kinopoiskId ?? movie.filmId}`}
                        >
                          <Play className="w-4 h-4" />
                        </Link>
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={(e) => {
                          e.preventDefault();
                          if (movie.kinopoiskId) {
                            removeFromFavorites(movie.kinopoiskId);
                          }
                        }}
                      >
                        <Heart className="w-4 h-4 fill-current" />
                      </Button>
                    </div>
                  </div>

                  {movie.ratingKinopoisk && (
                    <div className="absolute top-2 right-2">
                      <Badge className="bg-black/70 text-white">
                        <Star className="w-3 h-3 mr-1 fill-yellow-400 text-yellow-400" />
                        {movie.ratingKinopoisk}
                      </Badge>
                    </div>
                  )}

                  <div className="absolute top-2 left-2">
                    <Badge className="bg-red-600 text-white">
                      <Heart className="w-3 h-3 mr-1 fill-current" />
                      Избранное
                    </Badge>
                  </div>
                </div>

                <div className="p-4">
                  <Link href={`/about/${movie.kinopoiskId ?? movie.filmId}`}>
                    <h3 className="font-semibold text-sm mb-2 line-clamp-2 hover:text-primary transition-colors">
                      {movie.nameRu || movie.nameOriginal}
                    </h3>
                  </Link>

                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{movie.year}</span>
                    {movie.genres && movie.genres.length > 0 && (
                      <span>{movie.genres[0].genre}</span>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
