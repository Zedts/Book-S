import { Book } from "./landing";

export type UserBookProgress = {
  id: string;
  status: "reading" | "completed";
  progress: number;
  bookId: string;
  userId: string;
  book: Book;
  createdAt: string | Date;
  updatedAt: string | Date;
};
