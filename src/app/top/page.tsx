"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Play, Star, Trophy, TrendingUp, Award } from "lucide-react";
import { kinopoiskAPI, getMovieId, getMovieRating } from "@/lib/api";
import { Movie } from "@/types/movie";

export default function TopPage() {
  const [topMovies, setTopMovies] = useState<Movie[]>([]);
  const [popularMovies, setPopularMovies] = useState<Movie[]>([]);
  const [awaitedMovies, setAwaitedMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("top250");

  useEffect(() => {
    loadAllTops();
  }, []);

  const loadAllTops = async () => {
    try {
      setLoading(true);

      // Загружаем топ 250
      const topResponse = await kinopoiskAPI.getTopMovies(
        "TOP_250_BEST_FILMS",
        1
      );
      setTopMovies(topResponse.films || []);

      // Загружаем популярные
      const popularResponse = await kinopoiskAPI.getTopMovies(
        "TOP_100_POPULAR_FILMS",
        1
      );
      setPopularMovies(popularResponse.films || []);

      // Загружаем ожидаемые
      const awaitedResponse = await kinopoiskAPI.getTopMovies(
        "TOP_AWAIT_FILMS",
        1
      );
      setAwaitedMovies(awaitedResponse.films || []);
    } catch (error) {
      console.error("Error loading top movies:", error);
    } finally {
      setLoading(false);
    }
  };

  const renderMovieGrid = (movies: Movie[]) => (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
      {movies.map((movie, index) => (
        <Card
          key={getMovieId(movie)}
          className="border-0 bg-transparent overflow-hidden"
        >
          <CardContent className="p-0">
            <Link href={`/about/${getMovieId(movie)}`}>
              <div className="relative group">
                <img
                  src={movie.posterUrlPreview || movie.posterUrl || ""}
                  alt={movie.nameRu || movie.nameOriginal || ""}
                  className="w-full h-[300px] object-cover rounded-lg transition-transform group-hover:scale-105"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src =
                      "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='450'%3E%3Crect width='300' height='450' fill='%231a1a1a'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='18' fill='%23666'%3ENo Image%3C/text%3E%3C/svg%3E";
                  }}
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors rounded-lg flex items-center justify-center">
                  <Play className="w-12 h-12 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <div className="absolute top-2 left-2">
                  <Badge className="bg-yellow-500/90 text-black font-bold">
                    #{index + 1}
                  </Badge>
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
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{movie.year}</span>
                  {movie.genres && movie.genres[0] && (
                    <span>{movie.genres[0].genre}</span>
                  )}
                </div>
              </div>
            </Link>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center space-x-2 mb-6">
          <Skeleton className="h-8 w-8" />
          <Skeleton className="h-8 w-32" />
        </div>
        <Skeleton className="h-12 w-full mb-6" />
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {Array.from({ length: 24 }).map((_, i) => (
            <Skeleton key={i} className="h-[400px] w-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-4">
      <div className="flex items-center space-x-2 mb-6">
        <Trophy className="w-8 h-8 text-yellow-500" />
        <h1 className="text-3xl font-bold">Топ фильмов</h1>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="top250" className="flex items-center space-x-2">
            <Award className="w-4 h-4" />
            <span>Топ 250</span>
          </TabsTrigger>
          <TabsTrigger value="popular" className="flex items-center space-x-2">
            <TrendingUp className="w-4 h-4" />
            <span>Популярные</span>
          </TabsTrigger>
          <TabsTrigger value="awaited" className="flex items-center space-x-2">
            <Star className="w-4 h-4" />
            <span>Ожидаемые</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="top250" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Топ 250 лучших фильмов</h2>
            <Badge
              variant="outline"
              className="text-yellow-600 border-yellow-600"
            >
              {topMovies.length} фильмов
            </Badge>
          </div>
          {renderMovieGrid(topMovies)}
        </TabsContent>

        <TabsContent value="popular" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">100 популярных фильмов</h2>
            <Badge variant="outline" className="text-blue-600 border-blue-600">
              {popularMovies.length} фильмов
            </Badge>
          </div>
          {renderMovieGrid(popularMovies)}
        </TabsContent>

        <TabsContent value="awaited" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Самые ожидаемые фильмы</h2>
            <Badge
              variant="outline"
              className="text-green-600 border-green-600"
            >
              {awaitedMovies.length} фильмов
            </Badge>
          </div>
          {renderMovieGrid(awaitedMovies)}
        </TabsContent>
      </Tabs>
    </div>
  );
}
