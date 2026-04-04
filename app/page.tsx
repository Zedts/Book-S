import Landing from '@/src/main/landing';
import Aboutus from '@/src/main/about-us';

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
    return (
        <Aboutus />
    );
  }

  return (
        <Landing />
  );
}