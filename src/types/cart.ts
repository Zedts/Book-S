import { Book } from "./landing";

export type CartItem = {
  id: string;
  userId: string;
  bookId: string;
  quantity: number;
  createdAt: string | Date;
  updatedAt: string | Date;
  book: Book;
};
