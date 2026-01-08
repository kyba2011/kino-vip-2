"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Info, Heart, Star } from "lucide-react";
import { kinopoiskAPI } from "@/lib/api";
import { MovieDetails } from "@/types/movie";

export default function WatchPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [movie, setMovie] = useState<MovieDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const movieData = await kinopoiskAPI.getMovieDetails(parseInt(id));
        setMovie(movieData);

        // Добавляем в историю просмотров
        const history = JSON.parse(localStorage.getItem("history") || "[]");
        const newHistory = [
          {
            id: movieData.kinopoiskId,
            title: movieData.nameRu || movieData.nameOriginal,
            poster: movieData.posterUrlPreview,
            watchedAt: new Date().toISOString(),
          },
          ...history.filter((item: any) => item.id !== movieData.kinopoiskId),
        ].slice(0, 50);

        localStorage.setItem("history", JSON.stringify(newHistory));
      } catch (error) {
        console.error("Error fetching movie:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovie();
  }, [id]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Skeleton className="h-8 w-48 mb-6" />
        <Skeleton className="w-full h-[60vh] mb-6" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Skeleton className="h-6 w-3/4 mb-4" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-2/3" />
          </div>
          <div>
            <Skeleton className="w-full h-[300px]" />
          </div>
        </div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Фильм не найден</h1>
          <Button asChild>
            <Link href="/">Вернуться на главную</Link>
          </Button>
        </div>
      </div>
    );
  }

  const watchUrl = kinopoiskAPI.getWatchUrl(movie.kinopoiskId || 0);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Навигация */}
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" asChild>
          <Link href={`/about/${movie.kinopoiskId}`}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Назад к описанию
          </Link>
        </Button>
        <h1 className="text-2xl font-bold">
          {movie.nameRu || movie.nameOriginal}
        </h1>
      </div>

      {/* Плеер */}
      <Card className="mb-8">
        <CardContent className="p-0">
          <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
            <iframe
              src={watchUrl}
              className="absolute top-0 left-0 w-full h-full rounded-lg"
              allowFullScreen
              title={`Смотреть ${movie.nameRu || movie.nameOriginal}`}
            />
          </div>
        </CardContent>
      </Card>

      {/* Информация о фильме */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Info className="w-5 h-5 mr-2" />О фильме
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {movie.description && (
                <div>
                  <h3 className="font-semibold mb-2">Описание</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {movie.description}
                  </p>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {movie.year && (
                  <div>
                    <span className="font-semibold">Год выпуска:</span>
                    <span className="ml-2">{movie.year}</span>
                  </div>
                )}

                {movie.filmLength && (
                  <div>
                    <span className="font-semibold">Длительность:</span>
                    <span className="ml-2">{movie.filmLength} мин</span>
                  </div>
                )}

                {movie.ratingAgeLimits && (
                  <div>
                    <span className="font-semibold">Возраст:</span>
                    <Badge className="ml-2">
                      {movie.ratingAgeLimits.replace(/age(\d+)/, "$1+")}
                    </Badge>
                  </div>
                )}

                <div>
                  <span className="font-semibold">Тип:</span>
                  <span className="ml-2">
                    {movie.type === "FILM" ? "Фильм" : "Сериал"}
                  </span>
                </div>
              </div>

              {movie.genres && movie.genres.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-2">Жанры</h3>
                  <div className="flex flex-wrap gap-2 ">
                    {movie.genres.map((genre, index) => (
                      <Badge key={index} variant="outline" style={{ paddingTop: "1px", paddingBottom: "4px" }}>
                        {genre.genre}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {movie.countries && movie.countries.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-2">Страны</h3>
                  <div className="flex flex-wrap gap-2">
                    {movie.countries.map((country, index) => (
                      <Badge key={index} variant="outline">
                        {country.country}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardContent className="p-4">
              <img
                src={movie.posterUrlPreview}
                alt={movie.nameRu || movie.nameOriginal || ""}
                className="w-full rounded-lg mb-4"
              />

              <div className="space-y-3">
                {movie.ratingKinopoisk && (
                  <div className="flex items-center justify-between">
                    <span>Рейтинг Кинопоиск:</span>
                    <div className="flex items-center">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 mr-1" />
                      <span className="font-bold">{movie.ratingKinopoisk}</span>
                    </div>
                  </div>
                )}

                {movie.ratingImdb && (
                  <div className="flex items-center justify-between">
                    <span>Рейтинг IMDb:</span>
                    <div className="flex items-center">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 mr-1" />
                      <span className="font-bold">{movie.ratingImdb}</span>
                    </div>
                  </div>
                )}

                <Button asChild variant="outline" className="w-full">
                  <Link href={`/about/${movie.kinopoiskId}`}>
                    <Info className="w-4 h-4 mr-2" />
                    Подробная информация
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
