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
 * Добавить/удалить фильм из избранного
 */
export async function toggleFavorite(movie: MovieData) {
  const user = await getOrCreateDbUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const existing = await prisma.userFavorite.findUnique({
    where: {
      userId_movieId: {
        userId: user.id,
        movieId: movie.id,
      },
    },
  });

  if (existing) {
    // Удаляем из избранного
    await prisma.userFavorite.delete({
      where: { id: existing.id },
    });
  } else {
    // Добавляем в избранное
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

    // Затем добавляем в избранное
    await prisma.userFavorite.create({
      data: {
        userId: user.id,
        movieId: movie.id,
      },
    });
  }

  revalidatePath("/favorites");
  return !existing; // Возвращаем новое состояние
}

/**
 * Проверить, находится ли фильм в избранном
 */
export async function isFavorite(movieId: number): Promise<boolean> {
  const user = await getOrCreateDbUser();

  if (!user) {
    return false;
  }

  const favorite = await prisma.userFavorite.findUnique({
    where: {
      userId_movieId: {
        userId: user.id,
        movieId: movieId,
      },
    },
  });

  return !!favorite;
}

/**
 * Получить все избранные фильмы пользователя
 */
export async function getFavorites() {
  const user = await getOrCreateDbUser();

  if (!user) {
    return [];
  }

  const favorites = await prisma.userFavorite.findMany({
    where: { userId: user.id },
    include: { movie: true },
    orderBy: { createdAt: "desc" },
  });

  return favorites.map((f) => f.movie);
}
