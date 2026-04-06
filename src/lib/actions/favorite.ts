"use server";

import { prisma } from "@/src/lib/prisma";
import { getSession } from "@/src/lib/auth";
import { revalidatePath } from "next/cache";

export async function getFavorites() {
  const session = await getSession();
  if (!session?.id) return [];

  const favorites = await prisma.favorite.findMany({
    where: { userId: session.id },
    select: { bookId: true },
  });

  return favorites.map((f) => f.bookId);
}

export async function toggleFavoriteAction(bookId: string) {
  const session = await getSession();
  if (!session?.id) {
    throw new Error("Unauthorized");
  }

  const existing = await prisma.favorite.findUnique({
    where: {
      userId_bookId: {
        userId: session.id,
        bookId,
      },
    },
  });

  if (existing) {
    await prisma.favorite.delete({
      where: {
        id: existing.id,
      },
    });
    revalidatePath("/");
    return { added: false };
  } else {
    await prisma.favorite.create({
      data: {
        userId: session.id,
        bookId,
      },
    });
    revalidatePath("/");
    return { added: true };
  }
}
