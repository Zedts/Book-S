import type { Book, Category } from "@/src/types/landing";

export const USER_CATEGORIES: Category[] = [
  { id: "all", label: "Semua", staggerClass: "stagger-1" },
  { id: "fiksi", label: "Fiksi Sastra", staggerClass: "stagger-2" },
  { id: "non-fiksi", label: "Non-Fiksi", staggerClass: "stagger-3" },
  { id: "pengembangan-diri", label: "Pengembangan Diri", staggerClass: "stagger-4" },
  { id: "seni-desain", label: "Seni & Desain", staggerClass: "stagger-1" },
  { id: "bisnis", label: "Bisnis Ekonomi", staggerClass: "stagger-2" },
];

export const FEATURED_BOOKS: Book[] = [
  {
    id: "arsitektur-minimalis",
    title: "Arsitektur Minimalis",
    author: "Elena Rostova",
    category: "Desain",
    price: "Rp 185.000",
    rating: 4.8,
    imageUrl: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=400&h=600",
    imageAlt: "Arsitektur Minimalis",
    staggerClass: "stagger-1",
  },
  {
    id: "seni-berpikir-jernih",
    title: "Seni Berpikir Jernih",
    author: "Rolf Dobelli",
    category: "Filosofi",
    price: "Rp 120.000",
    rating: 4.9,
    imageUrl: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&q=80&w=400&h=600",
    imageAlt: "Seni Berpikir Jernih",
    staggerClass: "stagger-2",
  },
  {
    id: "filosofi-teras",
    title: "Filosofi Teras",
    author: "Henry Manampiring",
    category: "Gaya Hidup",
    price: "Rp 98.000",
    rating: 4.7,
    imageUrl: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=400&h=600",
    imageAlt: "Filosofi Teras",
    staggerClass: "stagger-3",
  },
  {
    id: "ruang-cahaya",
    title: "Ruang & Cahaya",
    author: "Tadao Ando",
    category: "Arsitektur",
    price: "Rp 210.000",
    rating: 5.0,
    imageUrl: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80&w=400&h=600",
    imageAlt: "Ruang & Cahaya",
    staggerClass: "stagger-4",
  },
];

export const RECENT_BOOKS: Book[] = [
  {
    id: "atomic-habits",
    title: "Atomic Habits",
    author: "James Clear",
    category: "Self-Dev",
    price: "Rp 145.000",
    rating: 4.9,
    imageUrl: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=400&h=600",
    imageAlt: "Atomic Habits",
    staggerClass: "stagger-1",
  },
  {
    id: "psychology-of-money",
    title: "The Psychology of Money",
    author: "Morgan Housel",
    category: "Finansial",
    price: "Rp 135.000",
    rating: 4.8,
    imageUrl: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=400&h=600",
    imageAlt: "The Psychology of Money",
    staggerClass: "stagger-2",
  },
];
