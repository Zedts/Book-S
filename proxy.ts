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
      '/admin/books': 'admin-books',
      '/admin/categories': 'admin-categories',
      '/admin/users': 'admin-users',
      '/admin/transactions': 'admin-transactions',
      '/admin/orders': 'admin-orders',
      '/admin/settings': 'admin-settings',
      '/user/home': 'user-home',
      '/user/explore': 'user-explore',
      '/user/my-books': 'user-my-books',
      '/user/favorites': 'user-favorites',
      '/user/cart': 'user-cart',
      '/user/settings': 'user-settings',
    };

    if (routeMap[pathname]) {
      url.searchParams.set('view', routeMap[pathname]);
      return NextResponse.rewrite(url);
    }
}