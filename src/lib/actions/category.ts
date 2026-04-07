'use server';

import { prisma } from '@/src/lib/prisma';
import { revalidatePath } from 'next/cache';
import { getSession } from '@/src/lib/auth';

export async function getCategories() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: {
        name: 'asc',
      },
    });
    
    // Convert to plain objects to fix Date serialization issue
    return categories.map(cat => ({
      id: cat.id,
      slug: cat.slug,
      name: cat.name,
    }));
  } catch (error) {
    console.error('Failed to fetch categories:', error);
    return [];
  }
}

function generateSlug(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
}

export async function createCategory(name: string) {
  try {
    const session = await getSession();
    if (session?.role !== 'admin') {
      return { success: false, message: 'Unauthorized' };
    }

    if (!name || name.trim() === '') {
      return { success: false, message: 'Nama kategori wajib diisi' };
    }

    const baseSlug = generateSlug(name);
    let slug = baseSlug;
    let counter = 1;
    
    while (await prisma.category.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    const newCat = await prisma.category.create({
      data: {
        name: name.trim(),
        slug,
      },
    });

    revalidatePath('/admin/categories');
    return { success: true, message: 'Kategori berhasil ditambahkan', data: newCat };
  } catch (error) {
    console.error('Create Category Error:', error);
    return { success: false, message: 'Terjadi kesalahan saat menambahkan kategori' };
  }
}

export async function updateCategory(id: string, name: string) {
  try {
    const session = await getSession();
    if (session?.role !== 'admin') {
      return { success: false, message: 'Unauthorized' };
    }

    if (!name || name.trim() === '') {
      return { success: false, message: 'Nama kategori wajib diisi' };
    }

    const category = await prisma.category.findUnique({ where: { id } });
    if (!category) {
      return { success: false, message: 'Kategori tidak ditemukan' };
    }

    let slug = category.slug;
    if (category.name !== name.trim()) {
      const baseSlug = generateSlug(name);
      slug = baseSlug;
      let counter = 1;
      
      let existingCat = await prisma.category.findUnique({ where: { slug } });
      while (existingCat && existingCat.id !== id) {
        slug = `${baseSlug}-${counter}`;
        counter++;
        existingCat = await prisma.category.findUnique({ where: { slug } });
      }
    }

    const updatedCat = await prisma.category.update({
      where: { id },
      data: {
        name: name.trim(),
        slug,
      },
    });

    revalidatePath('/admin/categories');
    return { success: true, message: 'Kategori berhasil diperbarui', data: updatedCat };
  } catch (error) {
    console.error('Update Category Error:', error);
    return { success: false, message: 'Terjadi kesalahan saat memperbarui kategori' };
  }
}

export async function deleteCategory(id: string) {
  try {
    const session = await getSession();
    if (session?.role !== 'admin') {
      return { success: false, message: 'Unauthorized' };
    }

    await prisma.category.delete({ where: { id } });
    
    revalidatePath('/admin/categories');
    return { success: true, message: 'Kategori berhasil dihapus' };
  } catch (error) {
    console.error('Delete Category Error:', error);
    return { success: false, message: 'Gagal menghapus kategori. Mungkin karena masih ada buku yang ditautkan.' };
  }
}
