// Кеш переводов в памяти для быстрого доступа
const translationCache = new Map<string, string>();

// Ключ для localStorage
const CACHE_KEY = "kino_translations_cache";
const CACHE_VERSION = "v1";
const MAX_CACHE_SIZE = 1000; // Максимальное количество записей в кеше

// Загрузка кеша из localStorage при инициализации
if (typeof window !== "undefined") {
  try {
    const savedCache = localStorage.getItem(CACHE_KEY);
    if (savedCache) {
      const parsed = JSON.parse(savedCache);
      if (parsed.version === CACHE_VERSION) {
        Object.entries(parsed.data).forEach(([key, value]) => {
          translationCache.set(key, value as string);
        });
        console.log(`Loaded ${translationCache.size} translations from cache`);
      }
    }
  } catch (e) {
    console.error("Error loading translation cache:", e);
  }
}

// Сохранение кеша в localStorage
function saveCache() {
  if (typeof window === "undefined") return;

  try {
    const cacheData: Record<string, string> = {};
    translationCache.forEach((value, key) => {
      cacheData[key] = value;
    });

    localStorage.setItem(
      CACHE_KEY,
      JSON.stringify({
        version: CACHE_VERSION,
        data: cacheData,
        timestamp: Date.now(),
      })
    );
  } catch (e) {
    console.error("Error saving translation cache:", e);
    // Если localStorage переполнен, очищаем старый кеш
    if (e instanceof Error && e.name === "QuotaExceededError") {
      localStorage.removeItem(CACHE_KEY);
      translationCache.clear();
    }
  }
}

// Очистка кеша если он слишком большой
function cleanupCache() {
  if (translationCache.size > MAX_CACHE_SIZE) {
    const entries = Array.from(translationCache.entries());
    // Удаляем первые 200 записей (самые старые)
    entries.slice(0, 200).forEach(([key]) => {
      translationCache.delete(key);
    });
    saveCache();
  }
}

// Утилита для автоматического перевода текста через Google Translate API
export async function translateText(
  text: string | null | undefined,
  targetLang: string
): Promise<string> {
  // Если текст пустой или язык русский - возвращаем как есть
  if (!text || targetLang === "ru") return text || "";

  // Создаем ключ для кеша
  const cacheKey = `${targetLang}:${text}`;

  // Проверяем кеш
  if (translationCache.has(cacheKey)) {
    return translationCache.get(cacheKey)!;
  }

  try {
    const res = await fetch(
      `https://translate.googleapis.com/translate_a/single?client=gtx&sl=ru&tl=${targetLang}&dt=t&q=${encodeURIComponent(
        text
      )}`
    );
    const data = await res.json();

    // Google возвращает массив, собираем его в строку
    const translated = data[0].map((item: any) => item[0]).join("");

    // Сохраняем в кеш
    translationCache.set(cacheKey, translated);

    // Периодически сохраняем в localStorage (каждые 10 переводов)
    if (translationCache.size % 10 === 0) {
      saveCache();
    }

    // Очищаем кеш если он слишком большой
    cleanupCache();

    return translated;
  } catch (error) {
    console.error("Translation error:", error);
    return text; // Возвращаем оригинальный текст при ошибке
  }
}

// Функция для перевода объекта фильма с кешированием
export async function translateMovie(movie: any, targetLang: string) {
  if (targetLang === "ru") return movie;

  // Создаем уникальный ключ для фильма
  const movieId = movie.kinopoiskId || movie.filmId || movie.id;
  const movieCacheKey = `${targetLang}:movie:${movieId}`;

  // Проверяем кеш для всего фильма
  if (translationCache.has(movieCacheKey)) {
    try {
      return JSON.parse(translationCache.get(movieCacheKey)!);
    } catch (e) {
      // Если не удалось распарсить, продолжаем перевод
    }
  }

  const translated = { ...movie };

  // Переводим основные поля
  if (movie.nameRu) {
    translated.nameRu = await translateText(movie.nameRu, targetLang);
  }
  if (movie.description) {
    translated.description = await translateText(movie.description, targetLang);
  }
  if (movie.slogan) {
    translated.slogan = await translateText(movie.slogan, targetLang);
  }

  // Переводим жанры
  if (movie.genres && Array.isArray(movie.genres)) {
    translated.genres = await Promise.all(
      movie.genres.map(async (g: any) => ({
        ...g,
        genre: await translateText(g.genre, targetLang),
      }))
    );
  }

  // Переводим страны
  if (movie.countries && Array.isArray(movie.countries)) {
    translated.countries = await Promise.all(
      movie.countries.map(async (c: any) => ({
        ...c,
        country: await translateText(c.country, targetLang),
      }))
    );
  }

  // Сохраняем переведенный фильм в кеш
  try {
    translationCache.set(movieCacheKey, JSON.stringify(translated));
  } catch (e) {
    // Игнорируем ошибки сериализации
  }

  return translated;
}

// Функция для перевода массива фильмов
export async function translateMovies(movies: any[], targetLang: string) {
  if (targetLang === "ru") return movies;

  const translated = await Promise.all(
    movies.map((movie) => translateMovie(movie, targetLang))
  );

  // Сохраняем кеш после перевода массива фильмов
  saveCache();

  return translated;
}

// Экспортируем функцию для очистки кеша (может быть полезна)
export function clearTranslationCache() {
  translationCache.clear();
  if (typeof window !== "undefined") {
    localStorage.removeItem(CACHE_KEY);
  }
  console.log("Translation cache cleared");
}

// Экспортируем функцию для получения статистики кеша
export function getCacheStats() {
  return {
    size: translationCache.size,
    maxSize: MAX_CACHE_SIZE,
    version: CACHE_VERSION,
  };
}
