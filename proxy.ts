import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const url = request.nextUrl.clone();

    url.pathname = '/';

    if (pathname === '/about-us') {
      url.searchParams.set('view', 'about-us');
      return NextResponse.rewrite(url);
    }
    
    if (pathname === '/auth') {
      url.searchParams.set('view', 'auth');
      return NextResponse.rewrite(url);
    }
    
    if (pathname === '/admin/home') {
      url.searchParams.set('view', 'admin-home');
      return NextResponse.rewrite(url);
    }
    
    if (pathname === '/user/home') {
      url.searchParams.set('view', 'user-home');
      return NextResponse.rewrite(url);
    }
}