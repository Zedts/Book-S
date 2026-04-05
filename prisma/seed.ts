import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const adminPassword = await bcrypt.hash('admin123', 10);
  const userPassword = await bcrypt.hash('user123', 10);

  // Setup Admin
  const admin = await prisma.user.upsert({
    where: { email: 'admin@bookshop.com' },
    update: {},
    create: {
      email: 'admin@bookshop.com',
      password: adminPassword,
      fullName: 'Administrator',
      phone: '081234567890',
      role: 'admin',
    },
  });

  // Setup Regular User
  const user = await prisma.user.upsert({
    where: { email: 'user@bookshop.com' },
    update: {},
    create: {
      email: 'user@bookshop.com',
      password: userPassword,
      fullName: 'Regular User',
      phone: '089876543210',
      role: 'users',
    },
  });

  console.log('User Seed completed:');
  console.log('  Admin:', admin.email);
  console.log('  User:', user.email);

  // Seed Categories
  const categoriesData = [
    { slug: 'fiksi-sastra', name: 'Fiksi Sastra' },
    { slug: 'non-fiksi', name: 'Non-Fiksi' },
    { slug: 'pengembangan-diri', name: 'Pengembangan Diri' },
    { slug: 'seni-desain', name: 'Seni & Desain' },
    { slug: 'bisnis-ekonomi', name: 'Bisnis Ekonomi' },
  ];

  const createdCategories: Record<string, string> = {};

  for (const cat of categoriesData) {
    const category = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: { name: cat.name },
      create: { slug: cat.slug, name: cat.name },
    });
    createdCategories[cat.slug] = category.id;
  }
  console.log('Kategori berhasil di-seed.');

  // Seed Books
  const booksData = [
    {
      title: 'Filosofi Teras',
      author: 'Henry Manampiring',
      description: 'Sebuah buku yang mengupas ajaran stoikisme (filosofi stoa) asli Yunani-Romawi kuno, namun disesuaikan dengan konteks milenial Indonesia di masa kini.',
      price: 98000,
      stock: 50,
      rating: 4.8,
      imageUrl: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=400&h=600',
      imageAlt: 'Cover Buku Filosofi Teras',
      isFeatured: true,
      categoryId: createdCategories['pengembangan-diri'],
    },
    {
      title: 'Seni Berpikir Jernih',
      author: 'Rolf Dobelli',
      description: 'Mengungkap 99 sesat pikir keliru (cognitive biases) yang umum terjadi sehari-hari, agar kita tidak terjebak dalam keputusan bodoh.',
      price: 120000,
      stock: 35,
      rating: 4.9,
      imageUrl: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&q=80&w=400&h=600',
      imageAlt: 'Cover Buku Seni Berpikir Jernih',
      isFeatured: true,
      categoryId: createdCategories['pengembangan-diri'],
    },
    {
      title: 'Arsitektur Minimalis',
      author: 'Elena Rostova',
      description: 'Eksplorasi gaya arsitektur minimalis dari berbagai belahan dunia, menampilkan harmoni antara ruang, fungsi, dan keindahan natural.',
      price: 185000,
      stock: 12,
      rating: 4.7,
      imageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=400&h=600',
      imageAlt: 'Cover Buku Arsitektur Minimalis',
      isFeatured: true,
      categoryId: createdCategories['seni-desain'],
    },
    {
      title: 'Ruang & Cahaya',
      author: 'Tadao Ando',
      description: 'Buku ini mengisahkan perjalanan arsitektur kontemporer Jepang dari kacamata sang maestro, Tadao Ando, mengenai elemen pencahayaan beton.',
      price: 210000,
      stock: 8,
      rating: 5.0,
      imageUrl: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80&w=400&h=600',
      imageAlt: 'Cover Buku Ruang & Cahaya',
      isFeatured: true,
      categoryId: createdCategories['seni-desain'],
    },
    {
      title: 'Bumi Manusia',
      author: 'Pramoedya Ananta Toer',
      description: 'Karya klasik sastra Indonesia yang epik dengan latar belakang masa kolonial Hindia Belanda. Mengisahkan perjuangan identitas dan cinta Minke.',
      price: 145000,
      stock: 100,
      rating: 4.9,
      imageUrl: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=400&h=600',
      imageAlt: 'Cover Buku Bumi Manusia',
      isFeatured: false,
      categoryId: createdCategories['fiksi-sastra'],
    },
    {
      title: 'Atomic Habits',
      author: 'James Clear',
      description: 'Cara Mudah dan Terbukti untuk Membentuk Kebiasaan Baik dan Menghilangkan Kebiasaan Buruk.',
      price: 110000,
      stock: 75,
      rating: 4.8,
      imageUrl: 'https://images.unsplash.com/photo-1589998059171-989d887df466?auto=format&fit=crop&q=80&w=400&h=600',
      imageAlt: 'Atomic Habits Cover',
      isFeatured: false,
      categoryId: createdCategories['pengembangan-diri'],
    },
  ];

  for (const book of booksData) {
    await prisma.book.upsert({
      where: {
        // We'll use a combination of title and author as a unique identifier for seeding
        // This requires a unique index in the schema, which we will add.
        title_author: {
          title: book.title,
          author: book.author,
        }
      },
      update: book,
      create: book,
    });
  }

  console.log('Buku berhasil di-seed.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
