'use server';

import { prisma } from '@/src/lib/prisma';
import type { Book, Category } from '@prisma/client';
import { getSession } from '@/src/lib/auth';
import { revalidatePath } from 'next/cache';
import { savePublicFile } from '../upload';

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

export async function getTopBooks(take: number = 4) {
  try {
    const topBookAggregations = await prisma.orderItem.groupBy({
      by: ['bookId'],
      _sum: {
        quantity: true,
      },
      where: {
        order: {
          status: 'completed',
        },
      },
      orderBy: {
        _sum: {
          quantity: 'desc',
        },
      },
      take,
    });

    const topBookIds = topBookAggregations.map(agg => agg.bookId);

    const books = await prisma.book.findMany({
      where: {
        id: {
          in: topBookIds,
        }
      },
      include: {
        category: true,
      },
    });

    const orderedBooks = topBookIds
      .map(id => books.find(book => book.id === id))
      .filter((book): book is typeof books[0] => book !== undefined);

    const result = orderedBooks.map(book => {
      const agg = topBookAggregations.find(a => a.bookId === book.id);
      return {
        id: book.id,
        title: book.title,
        author: book.author,
        imageUrl: book.imageUrl,
        imageAlt: book.imageAlt,
        sales: agg?._sum.quantity || 0,
      };
    });

    return result;
  } catch (error) {
    console.error('Failed to fetch top books:', error);
    return [];
  }
}

export async function createBook(formData: FormData) {
  try {
    const session = await getSession();
    if (session?.role !== 'admin') return { success: false, message: 'Unauthorized' };

    const title = formData.get('title')?.toString();
    const author = formData.get('author')?.toString();
    const description = formData.get('description')?.toString();
    const priceStr = formData.get('price')?.toString();
    const stockStr = formData.get('stock')?.toString();
    const categoryId = formData.get('categoryId')?.toString();
    const isFeatured = formData.get('isFeatured') === 'true';
    
    // Check required fields
    if (!title || !author || !description || !priceStr || !stockStr || !categoryId) {
      return { success: false, message: 'Semua field wajib diisi' };
    }

    const price = parseInt(priceStr, 10);
    const stock = parseInt(stockStr, 10);
    if (isNaN(price) || isNaN(stock)) return { success: false, message: 'Harga dan Stok harus berupa angka' };

    // Image logic
    const urlInput = formData.get("imageUrl")?.toString();
    const file = formData.get("imageFile") as File | null;
    let finalImageUrl = "";

    if (file && file.size > 0) {
      const MaxFileSize = 2 * 1024 * 1024;
      if (file.size > MaxFileSize) return { success: false, message: 'Ukuran file max 2MB' };

      finalImageUrl = await savePublicFile(file, 'books');
    } else if (urlInput && urlInput.trim() !== '') {
      finalImageUrl = urlInput.trim();
    } else {
      return { success: false, message: 'Gambar buku wajib diisi (Upload / URL)' };
    }

    await prisma.book.create({
      data: {
        title,
        author,
        description,
        price,
        stock,
        categoryId,
        isFeatured,
        imageUrl: finalImageUrl,
        imageAlt: title,
      }
    });

    revalidatePath('/admin/books');
    return { success: true, message: 'Buku berhasil ditambahkan' };
  } catch (error) {
    console.error('Create Book Error:', error);
    return { success: false, message: 'Gagal menambahkan buku. Kombinasi judul dan penulis mungkin sudah ada.' };
  }
}

export async function updateBook(id: string, formData: FormData) {
  try {
    const session = await getSession();
    if (session?.role !== 'admin') return { success: false, message: 'Unauthorized' };

    const title = formData.get('title')?.toString();
    const author = formData.get('author')?.toString();
    const description = formData.get('description')?.toString();
    const priceStr = formData.get('price')?.toString();
    const stockStr = formData.get('stock')?.toString();
    const categoryId = formData.get('categoryId')?.toString();
    const isFeatured = formData.get('isFeatured') === 'true';

    if (!title || !author || !description || !priceStr || !stockStr || !categoryId) {
      return { success: false, message: 'Data tidak lengkap' };
    }

    const price = parseInt(priceStr, 10);
    const stock = parseInt(stockStr, 10);

    const existingBook = await prisma.book.findUnique({ where: { id } });
    if (!existingBook) return { success: false, message: 'Buku tidak ditemukan' };

    // Image logic
    const urlInput = formData.get("imageUrl")?.toString();
    const file = formData.get("imageFile") as File | null;
    let finalImageUrl = existingBook.imageUrl;

    if (file && file.size > 0) {
      const MaxFileSize = 2 * 1024 * 1024;
      if (file.size > MaxFileSize) return { success: false, message: 'Ukuran file max 2MB' };

      finalImageUrl = await savePublicFile(file, 'books');
    } else if (urlInput && urlInput.trim() !== '') {
      finalImageUrl = urlInput.trim();
    }

    await prisma.book.update({
      where: { id },
      data: {
        title,
        author,
        description,
        price,
        stock,
        categoryId,
        isFeatured,
        imageUrl: finalImageUrl,
        imageAlt: title,
      }
    });

    revalidatePath('/admin/books');
    revalidatePath('/admin/home');
    return { success: true, message: 'Buku berhasil diperbarui' };
  } catch (error) {
    console.error('Update Book Error:', error);
    return { success: false, message: 'Gagal memperbarui buku' };
  }
}

export async function deleteBook(id: string) {
  try {
    const session = await getSession();
    if (session?.role !== 'admin') return { success: false, message: 'Unauthorized' };

    await prisma.book.delete({ where: { id } });
    revalidatePath('/admin/books');
    revalidatePath('/admin/home');
    return { success: true, message: 'Buku berhasil dihapus' };
  } catch (error) {
    console.error('Delete Book Error:', error);
    return { success: false, message: 'Gagal menghapus buku' };
  }
}
