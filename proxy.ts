import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const url = request.nextUrl.clone();

    url.pathname = '/';

    if (pathname === '/tes') {
    url.searchParams.set('view', 'tes');
    return NextResponse.rewrite(url);
    }
}