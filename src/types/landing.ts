export interface Book {
  id: string;
  title: string;
  author: string;
  category: string;
  price: string;
  rating: number;
  imageUrl: string;
  imageAlt: string;
  staggerClass: string;
}

export interface Category {
  id: string;
  label: string;
  staggerClass: string;
}

export interface FooterLink {
  label: string;
  href: string;
}

export interface FooterColumn {
  heading: string;
  links: FooterLink[];
}
