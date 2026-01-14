import { NextRequest, NextResponse } from "next/server";

// Кеш переводов в памяти (для production лучше использовать Redis)
const translationCache = new Map<string, string>();

// Используем бесплатный API MyMemory Translation
async function translateText(
  text: string,
  targetLang: string
): Promise<string> {
  try {
    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(
      text
    )}&langpair=ru|${targetLang}`;
    const response = await fetch(url);
    const data = await response.json();

    if (data.responseStatus === 200 && data.responseData?.translatedText) {
      return data.responseData.translatedText;
    }

    // Если API не сработал, возвращаем оригинал
    return text;
  } catch (error) {
    console.error("Translation error:", error);
    return text;
  }
}

export async function POST(request: NextRequest) {
  try {
    const { text, targetLang } = await request.json();

    if (!text || !targetLang) {
      return NextResponse.json(
        { error: "Missing text or targetLang" },
        { status: 400 }
      );
    }

    // Если целевой язык русский, возвращаем как есть
    if (targetLang === "ru") {
      return NextResponse.json({ translatedText: text });
    }

    // Проверяем кеш
    const cacheKey = `${targetLang}:${text}`;
    if (translationCache.has(cacheKey)) {
      return NextResponse.json({
        translatedText: translationCache.get(cacheKey),
        cached: true,
      });
    }

    // Переводим через MyMemory API
    const translatedText = await translateText(text, targetLang);

    // Сохраняем в кеш
    translationCache.set(cacheKey, translatedText);

    // Ограничиваем размер кеша
    if (translationCache.size > 1000) {
      const firstKey = translationCache.keys().next().value;
      translationCache.delete(firstKey);
    }

    return NextResponse.json({ translatedText, cached: false });
  } catch (error) {
    console.error("Translation API error:", error);
    const body = await request.json();
    return NextResponse.json(
      { error: "Translation failed", translatedText: body.text || text },
      { status: 500 }
    );
  }
}
