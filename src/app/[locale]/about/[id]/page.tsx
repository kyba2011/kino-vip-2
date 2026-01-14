"use client";

import { useState, useEffect, use } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Play,
  Heart,
  Star,
  Calendar,
  Clock,
  Globe,
  Film,
  Tv,
  Info,
} from "lucide-react";
import { kinopoiskAPI } from "@/lib/api";
import { MovieDetails } from "@/types/movie";
import { translateMovie } from "@/lib/translate";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";

export default function AboutPage({
  params,
}: {
  params: Promise<{ id: string; locale: string }>;
}) {
  const { id } = use(params);
  const locale = useLocale();
  const t = useTranslations("about");
  const [movie, setMovie] = useState<MovieDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        let movieData = await kinopoiskAPI.getMovieDetails(parseInt(id));

        // Переводим фильм если язык не русский
        if (locale !== "ru") {
          movieData = await translateMovie(movieData, locale);
        }

        setMovie(movieData);

        // Проверяем, есть ли фильм в избранном (из localStorage)
        const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
        setIsFavorite(favorites.includes(movieData.kinopoiskId));
      } catch (error) {
        console.error("Error fetching movie:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovie();
  }, [id, locale]);

  const toggleFavorite = () => {
    if (!movie) return;

    const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
    let newFavorites;

    if (isFavorite) {
      newFavorites = favorites.filter((id: number) => id !== movie.kinopoiskId);
    } else {
      newFavorites = [...favorites, movie.kinopoiskId];
    }

    localStorage.setItem("favorites", JSON.stringify(newFavorites));
    setIsFavorite(!isFavorite);
  };

  const addToHistory = () => {
    if (!movie) return;

    const history = JSON.parse(localStorage.getItem("history") || "[]");
    const newHistory = [
      {
        id: movie.kinopoiskId,
        title: movie.nameRu || movie.nameOriginal,
        poster: movie.posterUrlPreview,
        watchedAt: new Date().toISOString(),
      },
      ...history.filter((item: any) => item.id !== movie.kinopoiskId),
    ].slice(0, 50); // Ограничиваем историю 50 элементами

    localStorage.setItem("history", JSON.stringify(newHistory));
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <Skeleton className="w-full h-[600px]" />
          </div>
          <div className="lg:col-span-2 space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        </div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">{t("notFound")}</h1>
          <Button asChild>
            <Link href="/">{t("backToHome")}</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-center">
        <div className="w-full max-w-5xl">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Постер */}
            <div className="lg:col-span-1 flex justify-center lg:justify-start">
              <div className="w-full max-w-sm">
                <img
                  src={movie.posterUrl}
                  alt={movie.nameRu || movie.nameOriginal || ""}
                  className="w-full rounded-lg shadow-lg"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = "none";
                    const skeleton = target.nextElementSibling as HTMLElement;
                    if (skeleton) skeleton.style.display = "block";
                  }}
                />
                <Skeleton className="w-full h-[600px] rounded-lg hidden" />

                <div className="mt-6 space-y-3">
                  <Button
                    asChild
                    className="w-full bg-red-600 hover:bg-red-700 text-white"
                    onClick={addToHistory}
                  >
                    <Link href={`/watch/${movie.kinopoiskId}`}>
                      <Play className="w-4 h-4 mr-2" />
                      {t("watchOnline")}
                    </Link>
                  </Button>

                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={toggleFavorite}
                  >
                    <Heart
                      className={`w-4 h-4 mr-2 ${
                        isFavorite ? "fill-red-500 text-red-500" : ""
                      }`}
                    />
                    {isFavorite
                      ? t("removeFromFavorites")
                      : t("addToFavorites")}
                  </Button>
                </div>
              </div>
            </div>

            {/* Информация о фильме */}
            <div className="lg:col-span-2 space-y-6">
              {/* Заголовок и основная информация */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  {movie.type === "FILM" ? (
                    <Film className="w-5 h-5" />
                  ) : (
                    <Tv className="w-5 h-5" />
                  )}
                  <Badge variant="secondary">
                    {movie.type === "FILM" ? t("film") : t("series")}
                  </Badge>
                </div>

                <h1 className="text-4xl font-bold mb-2">
                  {movie.nameRu || movie.nameOriginal}
                </h1>

                {movie.nameOriginal && movie.nameRu !== movie.nameOriginal && (
                  <p className="text-xl text-muted-foreground mb-4">
                    {movie.nameOriginal}
                  </p>
                )}

                {movie.slogan && (
                  <p className="text-lg italic text-muted-foreground mb-4">
                    "{movie.slogan}"
                  </p>
                )}
              </div>

              {/* Рейтинги и основные данные */}
              <Card>
                <CardContent className="p-6">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {movie.ratingKinopoisk && (
                      <div className="text-center">
                        <div className="flex items-center justify-center mb-1">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 mr-1" />
                          <span className="text-2xl font-bold">
                            {movie.ratingKinopoisk}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Кинопоиск
                        </p>
                      </div>
                    )}

                    {movie.ratingImdb && (
                      <div className="text-center">
                        <div className="flex items-center justify-center mb-1">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 mr-1" />
                          <span className="text-2xl font-bold">
                            {movie.ratingImdb}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">IMDb</p>
                      </div>
                    )}

                    {movie.year && (
                      <div className="text-center">
                        <div className="flex items-center justify-center mb-1">
                          <Calendar className="w-4 h-4 mr-1" />
                          <span className="text-2xl font-bold">
                            {movie.year}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {t("year")}
                        </p>
                      </div>
                    )}

                    {movie.filmLength && (
                      <div className="text-center">
                        <div className="flex items-center justify-center mb-1">
                          <Clock className="w-4 h-4 mr-1" />
                          <span className="text-2xl font-bold">
                            {movie.filmLength}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">min</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Жанры и страны */}
              <div className="space-y-4">
                {movie.genres && movie.genres.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-2">
                      {t("genres")}
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {movie.genres.map((genre, index) => (
                        <Badge
                          key={index}
                          variant="outline"
                          style={{ paddingTop: "1px", paddingBottom: "4px" }}
                        >
                          {genre.genre}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {movie.countries && movie.countries.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-2">
                      {t("countries")}
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {movie.countries.map((country, index) => (
                        <Badge key={index} variant="outline">
                          <Globe className="w-3 h-3 mr-1" />
                          {country.country}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Описание */}
              {movie.description && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Info className="w-5 h-5 mr-2" />
                      {t("description")}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed">
                      {movie.description}
                    </p>
                  </CardContent>
                </Card>
              )}

              {/* Дополнительная информация */}
              <Card>
                <CardHeader>
                  <CardTitle>{t("additionalInfo")}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {movie.ratingAgeLimits && (
                    <div className="flex justify-between">
                      <span>{t("age")}:</span>
                      <Badge>
                        {movie.ratingAgeLimits.replace(/age(\d+)/, "$1+")}
                      </Badge>
                    </div>
                  )}

                  {movie.ratingMpaa && (
                    <div className="flex justify-between">
                      <span>MPAA:</span>
                      <Badge>{movie.ratingMpaa}</Badge>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <span>{t("type")}:</span>
                    <span>
                      {movie.type === "FILM" ? t("film") : t("series")}
                    </span>
                  </div>

                  {movie.serial && (
                    <div className="flex justify-between">
                      <span>{t("series")}:</span>
                      <span>{locale === "ru" ? "Да" : "Yes"}</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
