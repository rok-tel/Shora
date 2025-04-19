import { NextRequest, NextResponse } from 'next/server'
 
// Define the expected locales
const EXPECTED_LOCALES = ['en', 'he']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Log the current URL for debugging
  console.log('Middleware processing URL:', pathname)
  
  // Skip middleware for Next.js internals, API routes, and static files
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.includes('.') ||
    pathname === '/favicon.ico' ||
    pathname === '/robots.txt' ||
    pathname === '/sitemap.xml'
  ) {
    return NextResponse.next()
  }
  
  // Check if the pathname starts with a valid locale
  const pathnameHasLocale = EXPECTED_LOCALES.some(locale => 
    pathname === `/${locale}` || pathname.startsWith(`/${locale}/`)
  )
  
  // If the pathname doesn't have a valid locale or is the root path, redirect to /en
  if (!pathnameHasLocale || pathname === '/') {
    const redirectPath = pathname === '/' ? '/en' : `/en${pathname}`
    console.log(`Redirecting to: ${redirectPath}`)
    return NextResponse.redirect(new URL(redirectPath, request.url))
  }
  
  // Continue with the request
  return NextResponse.next()
}

// Configure the middleware to run on all paths
export const config = {
  matcher: [
    // Match all paths except static files and API routes
    '/((?!_next/static|_next/image|favicon.ico|api).*)',
    // Also match the root path
    '/'
  ]
}