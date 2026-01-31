"use client";

import { useState, useEffect } from "react";
import { GlassMorphCard } from "@/components/ui/glass-morph-card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  GlassTabs,
  GlassTabsContent,
  GlassTabsList,
  GlassTabsTrigger,
} from "@/components/ui/glass-tabs";
import { Star, Play } from "lucide-react";
import { kinopoiskAPI, getMovieId, getMovieRating } from "@/lib/api";
import { Movie } from "@/types/movie";
import { translateMovies } from "@/lib/translate";
import { useLocale } from "next-intl";
import { Link } from "@/i18n/routing";

export default function TopPage() {
  const locale = useLocale();
  const [topMovies, setTopMovies] = useState<Movie[]>([]);
  const [popularMovies, setPopularMovies] = useState<Movie[]>([]);
  const [awaitMovies, setAwaitMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTopMovies = async () => {
      try {
        const [top250, popular, awaited] = await Promise.all([
          kinopoiskAPI.getTopMovies("TOP_250_BEST_FILMS", 1),
          kinopoiskAPI.getTopMovies("TOP_100_POPULAR_FILMS", 1),
          kinopoiskAPI.getTopMovies("TOP_AWAIT_FILMS", 1),
        ]);

        let top250Films = top250.films || [];
        let popularFilms = popular.films || [];
        let awaitFilms = awaited.films || [];

        // Переводим результаты если язык не русский
        if (locale !== "ru") {
          [top250Films, popularFilms, awaitFilms] = await Promise.all([
            translateMovies(top250Films, locale),
            translateMovies(popularFilms, locale),
            translateMovies(awaitFilms, locale),
          ]);
        }

        setTopMovies(top250Films);
        setPopularMovies(popularFilms);
        setAwaitMovies(awaitFilms);
      } catch (error) {
        console.error("Error loading top movies:", error);
      } finally {
        setLoading(false);
      }
    };

    loadTopMovies();
  }, [locale]);

  const renderMovieGrid = (movies: Movie[]) => (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
      {movies.map((movie) => (
        <GlassMorphCard
          key={getMovieId(movie)}
          className="h-100"
          intensity={5}
        >
          <Link href={`/about/${getMovieId(movie)}`} className="block h-full">
            <div className="relative rounded-2xl group h-full flex flex-col pb-3">
              <div className="shrink-0">
                {movie.posterUrlPreview || movie.posterUrl ? (
                  <img
                    src={movie.posterUrlPreview || movie.posterUrl || ""}
                    alt={movie.nameRu || movie.nameOriginal || ""}
                    className="w-full h-75 object-cover rounded-2xl"
                  />
                ) : (
                  <div className="w-full h-75 bg-gray-800 rounded-2xl flex items-center justify-center">
                    <span className="text-gray-500">No Image</span>
                  </div>
                )}
              </div>
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <Play className="w-12 h-12 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              {getMovieRating(movie) &&
                !isNaN(parseFloat(String(getMovieRating(movie) || ""))) && (
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
              <p className="text-xs text-muted-foreground">{movie.year}</p>
            </div>
          </Link>
        </GlassMorphCard>
      ))}
    </div>
  );

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-24">
        <h1 className="text-2xl font-bold mb-6">
          {locale === "ru" ? "Топ фильмов" : "Top Movies"}
        </h1>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {Array.from({ length: 12 }).map((_, i) => (
            <Skeleton key={i} className="h-75 w-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 mt-16 mb-24">
      <h1 className="text-2xl font-bold mb-6">
        {locale === "ru" ? "Топ фильмов" : "Top Movies"}
      </h1>

      <GlassTabs defaultValue="top250" className="w-full">
        <GlassTabsList className="mb-6">
          <GlassTabsTrigger value="top250">
            {locale === "ru" ? "Топ 250" : "Top 250"}
          </GlassTabsTrigger>
          <GlassTabsTrigger value="popular">
            {locale === "ru" ? "Популярные" : "Popular"}
          </GlassTabsTrigger>
          <GlassTabsTrigger value="await">
            {locale === "ru" ? "Ожидаемые" : "Awaited"}
          </GlassTabsTrigger>
        </GlassTabsList>

        <GlassTabsContent value="top250">
          {renderMovieGrid(topMovies)}
        </GlassTabsContent>
        <GlassTabsContent value="popular">
          {renderMovieGrid(popularMovies)}
        </GlassTabsContent>
        <GlassTabsContent value="await">
          {renderMovieGrid(awaitMovies)}
        </GlassTabsContent>
      </GlassTabs>
    </div>
  );
}
