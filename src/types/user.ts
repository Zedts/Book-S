export type UserProfile = {
  id: string;
  fullName: string;
  email: string;
  role: string;
  bio?: string | null;
  address?: string | null;
  avatarUrl?: string | null;
  hasPaymentPin: boolean;
  createdAt: Date;
};

export type UserItem = {
  id: string;
  fullName: string;
  email: string;
  role: string;
  avatarUrl: string | null;
  createdAt: Date;
};
