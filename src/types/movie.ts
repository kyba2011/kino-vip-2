export interface Movie {
  kinopoiskId?: number;
  filmId?: number; // для списков фильмов используется filmId
  nameRu?: string;
  nameEn?: string;
  nameOriginal?: string;
  posterUrl?: string;
  posterUrlPreview?: string;
  coverUrl?: string;
  logoUrl?: string;
  reviewsCount?: number;
  ratingGoodReview?: number;
  ratingGoodReviewVoteCount?: number;
  ratingKinopoisk?: number;
  ratingKinopoiskVoteCount?: number;
  ratingImdb?: number;
  ratingImdbVoteCount?: number;
  ratingFilmCritics?: number;
  ratingFilmCriticsVoteCount?: number;
  ratingAwait?: number;
  ratingAwaitCount?: number;
  ratingRfCritics?: number;
  ratingRfCriticsVoteCount?: number;
  webUrl?: string;
  year?: number | string; // может быть строкой в списках
  filmLength?: number | string; // может быть строкой "01:43"
  slogan?: string;
  description?: string;
  shortDescription?: string;
  editorAnnotation?: string;
  isTicketsAvailable?: boolean;
  productionStatus?: string;
  type?: "FILM" | "TV_SERIES" | "TV_SHOW" | "MINI_SERIES";
  ratingMpaa?: string;
  ratingAgeLimits?: string;
  hasImax?: boolean;
  has3D?: boolean;
  lastSync?: string;
  countries?: Country[];
  genres?: Genre[];
  startYear?: number;
  endYear?: number;
  serial?: boolean;
  shortFilm?: boolean;
  completed?: boolean;
  // Дополнительные поля для списков
  rating?: string | number;
  ratingVoteCount?: number;
  ratingChange?: any;
  isRatingUp?: boolean;
  isAfisha?: number;
}

export interface Country {
  country: string;
}

export interface Genre {
  genre: string;
}

export interface MovieDetails extends Movie {
  facts?: string[];
  seasons?: Season[];
}

export interface Season {
  number: number;
  episodes: Episode[];
}

export interface Episode {
  seasonNumber: number;
  episodeNumber: number;
  nameRu?: string;
  nameEn?: string;
  synopsis?: string;
  releaseDate?: string;
}

export interface TopMoviesResponse {
  pagesCount: number;
  films: Movie[];
}

export interface PremieresResponse {
  total: number;
  releases: Movie[];
}

export interface SearchResponse {
  keyword: string;
  pagesCount: number;
  films: Movie[];
  searchFilmsCountResult: number;
}
