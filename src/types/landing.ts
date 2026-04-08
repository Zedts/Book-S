export interface Book {
  id: string;
  title: string;
  author: string;
  category: {
    id: string;
    name: string;
    slug: string;
  } | null;
  price: number;
  rating: number;
  imageUrl: string;
  imageAlt: string;
  description?: string;
  isFeatured?: boolean;
  stock?: number;
  categoryId?: string;
}

export interface Category {
  id: string;
  slug: string;
  name: string;
}

export interface FooterLink {
  label: string;
  href: string;
}

export interface FooterColumn {
  heading: string;
  links: FooterLink[];
}
