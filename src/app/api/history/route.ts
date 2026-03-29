export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from "next/server";
import { stackServerApp } from "@/stack/server";

// GET /api/history — получить историю текущего пользователя
export async function GET() {
  const { prisma } = await import("@/lib/prisma"); // Импорт ВНУТРИ функции
  const stackUser = await stackServerApp.getUser();
  if (!stackUser) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const history = await prisma.userHistory.findMany({
    where: { userId: stackUser.id },
    include: {
      movie: {
        select: {
          id: true,
          nameRu: true,
          nameOriginal: true,
          posterUrlPreview: true,
        },
      },
    },
    orderBy: { watchedAt: "desc" },
    take: 50,
  });

  return NextResponse.json(history);
}

// POST /api/history — добавить фильм в историю
export async function POST(req: NextRequest) {
  const { prisma } = await import("@/lib/prisma"); // Импорт ВНУТРИ функции
  const stackUser = await stackServerApp.getUser();
  if (!stackUser) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { movieId, nameRu, nameOriginal, posterUrlPreview } = body;

  if (!movieId) {
    return NextResponse.json({ error: "movieId required" }, { status: 400 });
  }

  // Убедимся что пользователь существует в БД
  await prisma.user.upsert({
    where: { id: stackUser.id },
    update: {},
    create: {
      id: stackUser.id,
      email: stackUser.primaryEmail ?? undefined,
      name: stackUser.displayName ?? undefined,
    },
  });

  // Убедимся что фильм существует в БД
  await prisma.movie.upsert({
    where: { id: movieId },
    update: { nameRu, nameOriginal, posterUrlPreview },
    create: {
      id: movieId,
      nameRu,
      nameOriginal,
      posterUrlPreview,
      type: "FILM",
    },
  });

  // Удаляем старую запись если есть, добавляем новую
  await prisma.userHistory.deleteMany({
    where: { userId: stackUser.id, movieId: movieId },
  });

  const entry = await prisma.userHistory.create({
    data: {
      userId: stackUser.id,
      movieId,
      watchedAt: new Date(),
    },
  });

  return NextResponse.json(entry);
}

// DELETE /api/history?movieId=123 — удалить из истории
export async function DELETE(req: NextRequest) {
  const { prisma } = await import("@/lib/prisma"); // Импорт ВНУТРИ функции
  const stackUser = await stackServerApp.getUser();
  if (!stackUser) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const movieId = searchParams.get("movieId");

  if (!movieId) {
    return NextResponse.json({ error: "movieId required" }, { status: 400 });
  }

  await prisma.userHistory.deleteMany({
    where: { userId: stackUser.id, movieId: parseInt(movieId) },
  });

  return NextResponse.json({ ok: true });
}
