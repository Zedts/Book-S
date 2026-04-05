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

  console.log('Seed completed:');
  console.log('  Admin:', admin.email);
  console.log('  User:', user.email);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
