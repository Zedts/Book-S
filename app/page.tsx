import Landing from '@/src/main/landing';
import AboutUs from '@/src/main/about-us';
import Auth from '@/src/main/auth';
import AdminHome from '@/src/main/admin/home';
import UserHome from '@/src/main/user/home';
import { getCategories } from '@/src/lib/actions/category';
import { getBooks } from '@/src/lib/actions/book';

type SearchParams = {
  view?: string;
};

type PageProps = {
  searchParams?: Promise<SearchParams>;
};

export default async function Page({ searchParams }: PageProps) {
  const resolvedParams = searchParams ? await searchParams : undefined;
  const view = resolvedParams?.view;

  if (view === 'about-us') {
    return <AboutUs />;
  }
  
  if (view === 'auth') {
    return <Auth />;
  }
  
  if (view === 'admin-home') {
    return <AdminHome />;
  }

  // Prefetch data on the server for views that need books and categories
  const categories = await getCategories();
  const books = await getBooks();
  
  if (view === 'user-home') {
    return <UserHome initialCategories={categories} initialBooks={books} />;
  }

  return <Landing initialCategories={categories} initialBooks={books} />;
}
export const dynamic = 'force-dynamic';

