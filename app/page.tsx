import Landing from '@/src/main/landing';
import AboutUs from '@/src/main/about-us';
import Auth from '@/src/main/auth';
import AdminHome from '@/src/main/admin/home';
import UserHome from '@/src/main/user/home';
import UserExplore from '@/src/main/user/explore';
import UserMyBooks from '@/src/main/user/my-books';
import UserFavorites from '@/src/main/user/favorites';
import UserCart from '@/src/main/user/cart';
import UserSettings from '@/src/main/user/settings';
import { getCategories } from '@/src/lib/actions/category';
import { getBooks } from '@/src/lib/actions/book';

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
    'user-home': <UserHome initialCategories={categories} initialBooks={books} />,
    'user-explore': <UserExplore initialCategories={categories} initialBooks={books} />,
    'user-my-books': <UserMyBooks />,
    'user-favorites': <UserFavorites initialBooks={books} />,
    'user-cart': <UserCart />,
    'user-settings': <UserSettings />,
  };

  if (view && viewMap[view]) {
    return viewMap[view];
  }

  return <Landing initialCategories={categories} initialBooks={books} />;
}
export const dynamic = 'force-dynamic';

