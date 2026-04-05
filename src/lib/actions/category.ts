'use server';

import { prisma } from '@/src/lib/prisma';

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
