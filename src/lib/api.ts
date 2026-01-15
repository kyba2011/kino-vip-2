import {
  Movie,
  MovieDetails,
  SearchResponse,
  TopMoviesResponse,
  PremieresResponse,
} from "@/types/movie";

// Массив API ключей для ротации
const API_KEYS = [
  process.env.KINOPOISK_API_KEY_1 || "851ad9e5-8041-4065-9b1c-1e9948b7ebac",
  process.env.KINOPOISK_API_KEY_2,
  process.env.KINOPOISK_API_KEY_3,
  process.env.KINOPOISK_API_KEY_4,
  process.env.KINOPOISK_API_KEY_5,
].filter(Boolean) as string[]; // Убираем undefined ключи

const BASE_URL = "https://kinopoiskapiunofficial.tech/api";

class KinopoiskAPI {
  private currentKeyIndex = 0;

  private getNextApiKey(): string {
    const key = API_KEYS[this.currentKeyIndex];
    this.currentKeyIndex = (this.currentKeyIndex + 1) % API_KEYS.length;
    return key;
  }

  private async request<T>(endpoint: string, retryCount = 0): Promise<T> {
    const maxRetries = API_KEYS.length;

    try {
      const apiKey = this.getNextApiKey();
      const response = await fetch(`${BASE_URL}${endpoint}`, {
        headers: {
          "X-API-KEY": apiKey,
          "Content-Type": "application/json",
        },
      });

      // Если ошибка 402 (лимит исчерпан) или 429 (слишком много запросов)
      if (response.status === 402 || response.status === 429) {
        console.warn(
          `API Key exhausted (${response.status}), trying next key...`
        );

        if (retryCount < maxRetries - 1) {
          return this.request<T>(endpoint, retryCount + 1);
        }
      }

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      return response.json();
    } catch (error) {
      // При любой ошибке пробуем следующий ключ
      if (retryCount < maxRetries - 1) {
        console.warn(`Request failed, trying next API key...`);
        return this.request<T>(endpoint, retryCount + 1);
      }

      throw error;
    }
  }

  async searchMovies(
    keyword: string,
    page: number = 1
  ): Promise<SearchResponse> {
    return this.request<SearchResponse>(
      `/v2.1/films/search-by-keyword?keyword=${encodeURIComponent(
        keyword
      )}&page=${page}`
    );
  }

  async searchMovieById(id: number): Promise<MovieDetails | null> {
    try {
      return await this.getMovieDetails(id);
    } catch (error) {
      console.error(`Movie with ID ${id} not found:`, error);
      return null;
    }
  }

  async getMovieDetails(id: number): Promise<MovieDetails> {
    return this.request<MovieDetails>(`/v2.2/films/${id}`);
  }

  async getTopMovies(
    type:
      | "TOP_100_POPULAR_FILMS"
      | "TOP_250_BEST_FILMS"
      | "TOP_AWAIT_FILMS" = "TOP_100_POPULAR_FILMS",
    page: number = 1
  ): Promise<TopMoviesResponse> {
    return this.request<TopMoviesResponse>(
      `/v2.2/films/top?type=${type}&page=${page}`
    );
  }

  async getPremieres(year: number, month: string): Promise<PremieresResponse> {
    return this.request<PremieresResponse>(
      `/v2.2/films/premieres?year=${year}&month=${month}`
    );
  }

  async getMoviesByFilters(params: {
    countries?: number[];
    genres?: number[];
    order?: "RATING" | "NUM_VOTE" | "YEAR";
    type?: "ALL" | "FILM" | "TV_SERIES";
    ratingFrom?: number;
    ratingTo?: number;
    yearFrom?: number;
    yearTo?: number;
    page?: number;
  }): Promise<TopMoviesResponse> {
    const searchParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        if (Array.isArray(value)) {
          searchParams.append(key, value.join(","));
        } else {
          searchParams.append(key, value.toString());
        }
      }
    });

    return this.request<TopMoviesResponse>(
      `/v2.2/films?${searchParams.toString()}`
    );
  }

  // Функция для получения ссылки на просмотр с ddbb.lol
  getWatchUrl(id: number): string {
    return `https://ddbb.lol/?id=${id}&n=0`;
  }
}

// Функция для получения ID фильма (filmId или kinopoiskId)
export const getMovieId = (movie: Movie): number => {
  return movie.kinopoiskId || movie.filmId || 0;
};

// Функция для получения рейтинга фильма
export const getMovieRating = (movie: Movie): number | null => {
  if (movie.ratingKinopoisk) return movie.ratingKinopoisk;
  if (movie.rating && typeof movie.rating === "string")
    return parseFloat(movie.rating);
  if (movie.rating && typeof movie.rating === "number") return movie.rating;
  return null;
};

export const kinopoiskAPI = new KinopoiskAPI();
