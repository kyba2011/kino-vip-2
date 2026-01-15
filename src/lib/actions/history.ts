"use server";

import { prisma } from "@/lib/prisma";
import { getOrCreateDbUser } from "@/lib/db-user";
import { revalidatePath } from "next/cache";

export interface MovieData {
  id: number;
  name: string;
  poster: string;
}

/**
 * Добавить фильм в историю просмотров
 */
export async function addToHistory(movie: MovieData) {
  const user = await getOrCreateDbUser();

  if (!user) {
    return;
  }

  // Сначала создаем или обновляем фильм
  await prisma.movie.upsert({
    where: { id: movie.id },
    update: {
      nameRu: movie.name,
      posterUrlPreview: movie.poster,
    },
    create: {
      id: movie.id,
      nameRu: movie.name,
      posterUrlPreview: movie.poster,
      type: "FILM",
    },
  });

  // Добавляем в историю
  await prisma.userHistory.create({
    data: {
      userId: user.id,
      movieId: movie.id,
    },
  });

  revalidatePath("/history");
}

/**
 * Получить историю просмотров пользователя
 */
export async function getHistory() {
  const user = await getOrCreateDbUser();

  if (!user) {
    return [];
  }

  const history = await prisma.userHistory.findMany({
    where: { userId: user.id },
    include: { movie: true },
    orderBy: { watchedAt: "desc" },
    take: 50, // Ограничиваем 50 последними
  });

  return history.map((h) => ({
    ...h.movie,
    watchedAt: h.watchedAt,
  }));
}

/**
 * Очистить историю просмотров
 */
export async function clearHistory() {
  const user = await getOrCreateDbUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  await prisma.userHistory.deleteMany({
    where: { userId: user.id },
  });

  revalidatePath("/history");
}
