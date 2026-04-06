import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const url = request.nextUrl.clone();

    url.pathname = '/';

    const routeMap: Record<string, string> = {
      '/about-us': 'about-us',
      '/auth': 'auth',
      '/admin/home': 'admin-home',
      '/user/home': 'user-home',
      '/user/explore': 'user-explore',
      '/user/my-books': 'user-my-books',
      '/user/favorites': 'user-favorites',
      '/user/library': 'user-library',
    };

    if (routeMap[pathname]) {
      url.searchParams.set('view', routeMap[pathname]);
      return NextResponse.rewrite(url);
    }
}