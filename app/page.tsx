import Home from '@/src/main/home';
import Tes from '@/src/main/tes';

type SearchParams = {
  view?: string;
};

type PageProps = {
  searchParams?: Promise<SearchParams>;
};

export default async function Page({ searchParams }: PageProps) {
  const resolvedParams = searchParams ? await searchParams : undefined;
  const view = resolvedParams?.view;

  if (view === 'tes') {
    return (
        <Tes />
    );
  }

  return (
        <Home />
  );
}