export const dynamic = 'force-dynamic';

import { NextResponse } from "next/server";
import { stackServerApp } from "@/stack/server";

export async function GET() {
  try {
    const { prisma } = await import("@/lib/prisma"); // Импорт ВНУТРИ функции
    const stackUser = await stackServerApp.getUser();

    // Проверяем подключение к БД
    const userCount = await prisma.user.count();
    const historyCount = await prisma.userHistory.count();

    return NextResponse.json({
      stackUser: stackUser
        ? { id: stackUser.id, email: stackUser.primaryEmail }
        : null,
      db: { userCount, historyCount },
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
