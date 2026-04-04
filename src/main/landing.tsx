"use client";

import HeroSection from "@/src/components/landing/HeroSection";
import CategoriesSection from "@/src/components/landing/CategoriesSection";
import BestSellersSection from "@/src/components/landing/BestSellersSection";
import NewsletterSection from "@/src/components/landing/NewsletterSection";
import GuestLayout from "@/src/components/layout/GuestLayout";

export default function Landing() {
  return (
    <GuestLayout>
      <HeroSection />
      <CategoriesSection />
      <BestSellersSection />
      <NewsletterSection />
    </GuestLayout>
  );
}