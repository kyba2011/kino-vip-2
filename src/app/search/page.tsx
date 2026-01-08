"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, Star, Calendar, Play } from "lucide-react";
import { kinopoiskAPI, getMovieId, getMovieRating } from "@/lib/api";
import { Movie } from "@/types/movie";

export default function SearchPage() {
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const searchMovies = async (searchQuery: string, pageNum: number = 1) => {
    if (!searchQuery.trim()) return;

    setLoading(true);
    try {
      const response = await kinopoiskAPI.searchMovies(searchQuery, pageNum);
      setMovies(response.films);
      setTotalPages(response.pagesCount);
      setPage(pageNum);
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const q = searchParams.get("q");
    if (q) {
      setQuery(q);
      searchMovies(q);
    }
  }, [searchParams]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      searchMovies(query);
    }
  };

  const loadMore = () => {
    if (page < totalPages) {
      searchMovies(query, page + 1);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Поиск фильмов и сериалов</h1>

        {/* Форма поиска */}
        <form onSubmit={handleSearch} className="mb-8">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                type="text"
                placeholder="Введите название фильма или сериала..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button type="submit" disabled={loading}>
              {loading ? "Поиск..." : "Найти"}
            </Button>
          </div>
        </form>

        {/* Результаты поиска */}
        {loading && movies.length === 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i}>
                <CardContent className="p-4">
                  <Skeleton className="w-full h-[300px] mb-4" />
                  <Skeleton className="h-4 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : movies.length > 0 ? (
          <>
            <div className="mb-6">
              <p className="text-muted-foreground">
                Найдено результатов: {movies.length} (страница {page} из{" "}
                {totalPages})
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {movies.map((movie) => (
                <Card
                  key={getMovieId(movie)}
                  className="group cursor-pointer hover:scale-105 transition-transform duration-200"
                >
                  <CardContent className="p-0">
                    <Link href={`/about/${getMovieId(movie)}`}>
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
                          <Play className="w-12 h-12 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                        </div>

                        {/* Рейтинг */}
                        {getMovieRating(movie) && (
                          <div className="absolute top-2 right-2">
                            <Badge className="bg-black/70 text-white">
                              <Star className="w-3 h-3 mr-1 fill-yellow-400 text-yellow-400" />
                              {getMovieRating(movie)}
                            </Badge>
                          </div>
                        )}

                        {/* Год */}
                        {movie.year && (
                          <div className="absolute top-2 left-2">
                            <Badge
                              variant="secondary"
                              className="bg-black/70 text-white"
                            >
                              <Calendar className="w-3 h-3 mr-1" />
                              {movie.year}
                            </Badge>
                          </div>
                        )}
                      </div>

                      <div className="p-4">
                        <h3 className="font-semibold text-sm mb-2 line-clamp-2">
                          {movie.nameRu || movie.nameOriginal}
                        </h3>

                        {movie.genres && movie.genres.length > 0 && (
                          <div className="flex flex-wrap gap-1 mb-2">
                            {movie.genres.slice(0, 2).map((genre, index) => (
                              <Badge
                                key={index}
                                variant="outline"
                                className="text-xs"
                                style={{
                                  paddingTop: "1px",
                                  paddingBottom: "4px",
                                }}
                              >
                                {genre.genre}
                              </Badge>
                            ))}
                          </div>
                        )}

                        {movie.countries && movie.countries.length > 0 && (
                          <p className="text-xs text-muted-foreground">
                            {movie.countries[0].country}
                          </p>
                        )}
                      </div>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Кнопка "Загрузить еще" */}
            {page < totalPages && (
              <div className="text-center mt-8">
                <Button onClick={loadMore} disabled={loading}>
                  {loading ? "Загрузка..." : "Загрузить еще"}
                </Button>
              </div>
            )}
          </>
        ) : query && !loading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">
              По запросу "{query}" ничего не найдено
            </p>
            <p className="text-muted-foreground mt-2">
              Попробуйте изменить поисковый запрос
            </p>
          </div>
        ) : null}
      </div>
    </div>
  );
}
