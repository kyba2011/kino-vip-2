"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Star, Play, Hash, Search as SearchIcon } from "lucide-react";
import { kinopoiskAPI, getMovieId, getMovieRating } from "@/lib/api";
import { Movie, MovieDetails } from "@/types/movie";
import { translateMovies } from "@/lib/translate";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const locale = useLocale();
  const t = useTranslations("search");
  const [movieById, setMovieById] = useState<MovieDetails | null>(null);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const searchMovies = async () => {
      if (!query) {
        setLoading(false);
        return;
      }

      try {
        // Проверяем, является ли запрос числом (ID Кинопоиска)
        const isNumeric = /^\d+$/.test(query.trim());
        let movieByIdResult: MovieDetails | null = null;

        if (isNumeric) {
          const movieId = parseInt(query.trim(), 10);
          movieByIdResult = await kinopoiskAPI.searchMovieById(movieId);
          setMovieById(movieByIdResult);
        } else {
          setMovieById(null);
        }

        // Всегда выполняем поиск по названию
        const response = await kinopoiskAPI.searchMovies(query);
        let results = response.films || [];

        // Переводим результаты если язык не русский
        if (locale !== "ru") {
          results = await translateMovies(results, locale);
        }

        setMovies(results);
      } catch (error) {
        console.error("Error searching movies:", error);
      } finally {
        setLoading(false);
      }
    };

    searchMovies();
  }, [query, locale]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {Array.from({ length: 12 }).map((_, i) => (
            <Skeleton key={i} className="h-75 w-full" />
          ))}
        </div>
      </div>
    );
  }

  const renderMovieCard = (movie: Movie | MovieDetails) => {
    const rating = getMovieRating(movie);

    return (
      <Card
        key={getMovieId(movie)}
        className="h-100 bg-white/5 backdrop-blur-[0.0px] backdrop-saturate-150 border border-white/10 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1),0_8px_32px_0_rgba(0,0,0,0.2)] hover:bg-white/10 hover:border-white/20 transition-all duration-300 group"
      >
        <CardContent className="p-0 h-full">
          <Link href={`/about/${getMovieId(movie)}`} className="block h-full">
            <div className="relative rounded-2xl h-full flex flex-col pb-3">
              {movie.posterUrlPreview || movie.posterUrl ? (
                <img
                  src={movie.posterUrlPreview || movie.posterUrl || ""}
                  alt={movie.nameRu || movie.nameOriginal || ""}
                  className="w-full h-75 object-cover rounded-2xl transition-transform group-hover:scale-110 duration-300"
                />
              ) : (
                <div className="w-full h-75 bg-gray-800 rounded-2xl flex items-center justify-center">
                  <span className="text-gray-500">No Image</span>
                </div>
              )}
              <div className="absolute inset-0 flex items-center justify-center">
                <Play className="w-12 h-12 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              {rating && !isNaN(rating) && rating > 0 && (
                <div className="absolute top-2 right-2">
                  <Badge className="bg-black/70 text-white">
                    <Star className="w-3 h-3 mr-1 fill-yellow-400 text-yellow-400" />
                    {rating}
                  </Badge>
                </div>
              )}
            </div>
            <div className="mt-2 space-y-1 px-2 pb-2 grow">
              <h3 className="font-medium text-sm line-clamp-2">
                {movie.nameRu || movie.nameOriginal}
              </h3>
              <p className="text-xs text-muted-foreground">{movie.year}</p>
            </div>
          </Link>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8 mt-16 mb-24">
      {/* Результаты по коду (ID) */}
      {movieById && (
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Hash className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-medium">{t("resultsByCode")}</h2>
            <Badge variant="secondary" className="text-sm font-normal mt-1">
              {query}
            </Badge>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {renderMovieCard(movieById)}
          </div>
        </div>
      )}

      {/* Результаты по запросу (название) */}
      {movies.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <SearchIcon className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-medium">{t("resultsByQuery")}</h2>
            <Badge variant="secondary" className="text-sm font-normal mt-1">
              {query}
            </Badge>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {movies.map((movie) => renderMovieCard(movie))}
          </div>
        </div>
      )}

      {/* Если ничего не найдено */}
      {!movieById && movies.length === 0 && query && (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
          <SearchIcon className="w-16 h-16 text-muted-foreground mb-4" />
          <p className="text-xl font-medium mb-2">{t("noResults")}</p>
          <Link
            href="/"
            className="mt-4 px-6 py-3 rounded-2xl bg-black/40 backdrop-blur-xs backdrop-saturate-150 border border-white/10 text-white hover:bg-black/50 transition-all shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1),0_8px_32px_0_rgba(0,0,0,0.2)]"
          >
            {locale === "ru" ? "Вернуться на главную" : "Back to Home"}
          </Link>
        </div>
      )}
    </div>
  );
}
