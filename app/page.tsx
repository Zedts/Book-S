import Landing from '@/src/main/landing';
import AboutUs from '@/src/main/about-us';
import Auth from '@/src/main/auth';
import AdminHome from '@/src/main/admin/home';
import AdminBooks from '@/src/main/admin/books';
import AdminCategories from '@/src/main/admin/categories';
import AdminUsers from '@/src/main/admin/users';
import AdminTransactions from '@/src/main/admin/transactions';
import AdminOrders from '@/src/main/admin/orders';
import AdminSettings from '@/src/main/admin/settings';
import UserHome from '@/src/main/user/home';
import UserExplore from '@/src/main/user/explore';
import UserMyBooks from '@/src/main/user/my-books';
import UserFavorites from '@/src/main/user/favorites';
import UserCart from '@/src/main/user/cart';
import UserSettings from '@/src/main/user/settings';
import { getCategories } from '@/src/lib/actions/category';
import { getBooks } from '@/src/lib/actions/book';

import { FavoritesProvider } from '@/src/components/layout/FavoritesProvider';
import { getSession } from '@/src/lib/auth';

type SearchParams = {
  view?: string;
};

type PageProps = {
  searchParams?: Promise<SearchParams>;
};

export default async function Page({ searchParams }: PageProps) {
  const { view } = (await searchParams) || {};

  // Prefetch data on the server for views that need books and categories
  const categories = await getCategories();
  const books = await getBooks();

  const viewMap: Record<string, React.ReactNode> = {
    'about-us': <AboutUs />,
    'auth': <Auth />,
    'admin-home': <AdminHome />,
    'admin-books': <AdminBooks />,
    'admin-categories': <AdminCategories />,
    'admin-users': <AdminUsers />,
    'admin-transactions': <AdminTransactions />,
    'admin-orders': <AdminOrders />,
    'admin-settings': <AdminSettings />,
    'user-home': <UserHome initialCategories={categories} initialBooks={books} />,
    'user-explore': <UserExplore initialCategories={categories} initialBooks={books} />,
    'user-my-books': <UserMyBooks />,
    'user-favorites': <UserFavorites initialBooks={books} />,
    'user-cart': <UserCart />,
    'user-settings': <UserSettings />,
  };

  const session = await getSession();
  const isAuthenticated = !!session;

  if (view && viewMap[view]) {
    return (
      <FavoritesProvider isAuthenticated={isAuthenticated}>
        {viewMap[view]}
      </FavoritesProvider>
    );
  }

  return (
    <FavoritesProvider isAuthenticated={isAuthenticated}>
      <Landing initialCategories={categories} initialBooks={books} />
    </FavoritesProvider>
  );
}
export const dynamic = 'force-dynamic';

