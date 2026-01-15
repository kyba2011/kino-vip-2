"use server";

import { stackServerApp } from "@/stack/server";
import { prisma } from "@/lib/prisma";

/**
 * Получить или создать пользователя в БД на основе Stack Auth
 */
export async function getOrCreateDbUser() {
  const stackUser = await stackServerApp.getUser();

  if (!stackUser) {
    return null;
  }

  // Ищем пользователя в БД
  let dbUser = await prisma.user.findUnique({
    where: { id: stackUser.id },
  });

  // Если не найден - создаем
  if (!dbUser) {
    dbUser = await prisma.user.create({
      data: {
        id: stackUser.id,
        email: stackUser.primaryEmail || undefined,
        name: stackUser.displayName || undefined,
        language: "ru", // По умолчанию русский
      },
    });
  }

  return dbUser;
}

/**
 * Обновить язык пользователя
 */
export async function updateUserLanguage(language: string) {
  const user = await getOrCreateDbUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  return await prisma.user.update({
    where: { id: user.id },
    data: { language },
  });
}

/**
 * Получить предпочитаемый язык пользователя
 */
export async function getUserLanguage(): Promise<string> {
  const user = await getOrCreateDbUser();
  return user?.language || "ru";
}
