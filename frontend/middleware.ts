import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Allow the backend API through (keep api.3tattava.com working)
  if (request.nextUrl.pathname.startsWith('/api')) {
    return NextResponse.next()
  }

  // Block everything else — clean empty response, no error page
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Content-Type': 'text/html',
      'X-Robots-Tag': 'noindex, nofollow',
      'Cache-Control': 'no-store',
    },
  })
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
