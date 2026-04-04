import Landing from '@/src/main/landing';
import Aboutus from '@/src/main/about-us';
import Auth from '@/src/main/auth';
import AdminHome from '@/src/main/admin/home';
import UserHome from '@/src/main/user/home';

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
    return <Aboutus />;
  }
  
  if (view === 'auth') {
    return <Auth />;
  }
  
  if (view === 'admin-home') {
    return <AdminHome />;
  }
  
  if (view === 'user-home') {
    return <UserHome />;
  }

  return <Landing />;
}