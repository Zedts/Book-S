'use server';

import { prisma } from '@/src/lib/prisma';
import type { Book, Category } from '@prisma/client';

type BookWithCategory = Book & { category: Category | null };

// Utility to serialize Books to Plain Objects and prevent Date Serialization Errors
function mapBookToPlainObject(book: BookWithCategory) {
  return {
    id: book.id,
    title: book.title,
    author: book.author,
    description: book.description,
    price: book.price,
    stock: book.stock,
    rating: book.rating,
    imageUrl: book.imageUrl,
    imageAlt: book.imageAlt,
    isFeatured: book.isFeatured,
    categoryId: book.categoryId,
    category: book.category ? {
      id: book.category.id,
      slug: book.category.slug,
      name: book.category.name,
    } : null,
  };
}

async function fetchBooks(where: object = {}, take?: number) {
  try {
    const books = await prisma.book.findMany({
      where,
      include: {
        category: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
      ...(take ? { take } : {}),
    });
    return books.map(mapBookToPlainObject);
  } catch (error) {
    console.error('Prisma Error:', error);
    return [];
  }
}

export async function getBooks(take?: number) {
  return fetchBooks({}, take);
}

export async function getFeaturedBooks(take: number = 3) {
  return fetchBooks({ isFeatured: true }, take);
}

export async function getBooksByCategory(categorySlug: string) {
  return fetchBooks({
    category: {
      slug: categorySlug,
    },
  });
}
