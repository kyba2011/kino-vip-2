"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Card, CardContent } from "./ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "./ui/carousel";
import { Skeleton } from "./ui/skeleton";
import { Play, Info, Star, Calendar, Clock } from "lucide-react";
import { kinopoiskAPI, getMovieId, getMovieRating } from "@/lib/api";
import { Movie } from "@/types/movie";

export default function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [featuredMovies, setFeaturedMovies] = useState<Movie[]>([]);
  const [popularMovies, setPopularMovies] = useState<Movie[]>([]);

  const [loading, setLoading] = useState(true);
  const carouselRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const carousel = carouselRef.current;
    if (!carousel) return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      carousel.scrollLeft += e.deltaY;
    };

    carousel.addEventListener("wheel", handleWheel, { passive: false });
    return () => carousel.removeEventListener("wheel", handleWheel);
  }, []);

  useEffect(() => {
    const loadMovies = async () => {
      try {
        // Загружаем топ фильмы для главного баннера
        const topResponse = await kinopoiskAPI.getTopMovies(
          "TOP_250_BEST_FILMS",
          1
        );
        const featured = topResponse.films?.slice(0, 3) || [];
        setFeaturedMovies(featured);

        // Загружаем популярные фильмы
        const popularResponse = await kinopoiskAPI.getTopMovies(
          "TOP_100_POPULAR_FILMS",
          1
        );
        const popular = popularResponse.films?.slice(0, 12) || [];
        setPopularMovies(popular);
      } catch (error) {
        console.error("Error loading movies:", error);
        // Fallback к моковым данным при ошибке
        setFeaturedMovies([
          {
            kinopoiskId: 1,
            nameRu: "Мстители: Финал",
            posterUrl:
              "https://image.tmdb.org/t/p/w500/or06FN3Dka5tukK1e9sl16pB3iy.jpg",
            posterUrlPreview:
              "https://image.tmdb.org/t/p/w500/or06FN3Dka5tukK1e9sl16pB3iy.jpg",
            ratingKinopoisk: 8.4,
            year: 2019,
            countries: [{ country: "США" }],
            genres: [{ genre: "Боевик" }],
          } as Movie,
        ]);
      } finally {
        setLoading(false);
      }
    };

    loadMovies();
  }, []);

  useEffect(() => {
    if (featuredMovies.length > 0) {
      const timer = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % featuredMovies.length);
      }, 5000);

      return () => clearInterval(timer);
    }
  }, [featuredMovies.length]);

  if (loading) {
    return (
      <div className="space-y-4">
        {/* Скелетон главного баннера */}
        <div className="relative w-full h-[500px] sm:h-[calc(100vh-64px)]">
          <Skeleton className="w-full h-full" />
        </div>

        {/* Скелетон популярных фильмов */}
        <div className="container my-10 mx-auto px-4 space-y-6">
          <Skeleton className="h-8 w-48" />
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-75 w-full" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  const currentMovie = featuredMovies[currentSlide];

  return (
    <div className="space-y-2">
      {/* Главный баннер */}
      {currentMovie && (
        <div className="relative overflow-hidden h-[500px] sm:h-[calc(100vh-64px)]">
          {/* Фоновое изображение с блюром */}
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat blur-xl scale-110"
            style={{
              backgroundImage: `url(${
                currentMovie.coverUrl ||
                currentMovie.posterUrl ||
                currentMovie.posterUrlPreview
              })`,
            }}
          />

          {/* Основное изображение по центру */}
          <div
            className="absolute bg-contain bg-center bg-no-repeat"
            style={{
              backgroundImage: `url(${
                currentMovie.posterUrl || currentMovie.posterUrlPreview
              })`,
              top: "-25px",
              bottom: "-25px",
              left: 0,
              right: 0,
            }}
          />

          <div className="absolute inset-0 bg-black/60" />
          <div className="absolute inset-0 bg-linear-to-r from-black/80 via-black/40 to-transparent" />

          <div className="relative h-full flex items-center ml-4 sm:ml-10 md:ml-20">
            <div className="container mx-auto px-2 sm:px-4">
              <div className="max-w-2xl space-y-3 sm:space-y-6">
                <div className="flex items-center space-x-4">
                  <Badge
                    className="bg-red-600 hover:bg-red-700 text-white text-center px-2"
                    style={{ paddingTop: "1px", paddingBottom: "3px" }}
                  >
                    Рекомендуем
                  </Badge>
                  <div className="flex items-center space-x-4 text-sm text-gray-300">
                    {getMovieRating(currentMovie) && (
                      <div className="flex items-center space-x-1">
                        <Star className="w-3 h-3 sm:w-4 sm:h-4 fill-yellow-400 text-yellow-400" />
                        <span>{getMovieRating(currentMovie)}</span>
                      </div>
                    )}
                    {currentMovie.year && (
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span>{currentMovie.year}</span>
                      </div>
                    )}
                    {currentMovie.filmLength && (
                      <div className="flex items-center space-x-1">
                        <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span>{currentMovie.filmLength} мин</span>
                      </div>
                    )}
                  </div>
                </div>

                <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-5xl font-bold text-white">
                  {currentMovie.nameRu || currentMovie.nameOriginal}
                </h1>

                <div className="flex flex-wrap gap-2">
                  {currentMovie.genres?.map((genre) => (
                    <Badge
                      key={genre.genre}
                      variant="outline"
                      className="text-white border-white/30 px-2 text-center text-xs sm:text-sm"
                      style={{ paddingTop: "1px", paddingBottom: "4px" }}
                    >
                      {genre.genre}
                    </Badge>
                  ))}
                </div>

                {currentMovie.description && (
                  <p className="text-xs sm:text-sm md:text-base lg:text-lg text-gray-200 leading-relaxed max-w-xl line-clamp-3 sm:line-clamp-4 md:line-clamp-none">
                    {currentMovie.description}
                  </p>
                )}

                <div className="flex items-center space-x-4">
                  <Button
                    asChild
                    size="lg"
                    className="bg-red-600 hover:bg-red-700 text-white"
                  >
                    <Link href={`/watch/${getMovieId(currentMovie)}`}>
                      <Play className="w-4 h-4" />
                      Смотреть
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    asChild
                    size="lg"
                    className="border-white/30 text-white hover:bg-white/10"
                  >
                    <Link href={`/about/${getMovieId(currentMovie)}`}>
                      <Info className="w-4 h-4" />
                      Подробнее
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Индикаторы слайдов */}
          {featuredMovies.length > 1 && (
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2">
              {featuredMovies.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-3 h-3 rounded-full cursor-pointer transition-colors ${
                    index === currentSlide ? "bg-white" : "bg-white/40"
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Популярные фильмы */}
      {popularMovies.length > 0 && (
        <div className="container my-10 mx-auto px-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-2xl font-bold">Популярные фильмы</h2>
            <Button variant="ghost" asChild>
              <Link href="/movies">Смотреть все</Link>
            </Button>
          </div>

          <div className="px-14">
            <Carousel className="w-full" opts={{ align: "start" }}>
              <CarouselContent className="-ml-2 md:-ml-4" ref={carouselRef}>
                {popularMovies.map((movie) => (
                  <CarouselItem
                    key={getMovieId(movie)}
                    className="pl-2 md:pl-4 basis-1/2 md:basis-1/4 lg:basis-1/6 "
                  >
                    <Card className="border-0 bg-transparent">
                      <CardContent className="p-0">
                        <Link href={`/about/${getMovieId(movie)}`}>
                          <div className="relative group overflow-hidden rounded-lg">
                            <img
                              src={
                                movie.posterUrlPreview || movie.posterUrl || ""
                              }
                              alt={movie.nameRu || movie.nameOriginal || ""}
                              className="w-full h-75 object-cover rounded-lg transition-transform group-hover:scale-105"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src =
                                  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='450'%3E%3Crect width='300' height='450' fill='%231a1a1a'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='18' fill='%23666'%3ENo Image%3C/text%3E%3C/svg%3E";
                              }}
                            />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors rounded-lg flex items-center justify-center scale-110">
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
                  </CarouselItem>
                ))}
              </CarouselContent>
              <div className="hidden md:block">
                <CarouselPrevious className="-left-12" />
                <CarouselNext className="-right-12" />
              </div>
            </Carousel>
          </div>
        </div>
      )}
    </div>
  );
}
