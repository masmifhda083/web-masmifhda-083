// src/middleware/auth.ts
import type { APIContext, MiddlewareNext } from 'astro';
import { verifySession, destroySession } from '../lib/auth';

// List route yang perlu authentication
const PROTECTED_ROUTES = [
  '/dashboard',
  '/dashboard/',
  '/dashboard/ppdb',
  '/dashboard/ppdb/',
  '/dashboard/ppdb/detail',
  '/api/ppdb/update-status',
  '/api/ppdb/export'
];

export function onRequest(context: APIContext, next: MiddlewareNext) {
  const { url, cookies } = context;
  const pathname = url.pathname;
  
  // Cek jika route perlu protection
  const needsAuth = PROTECTED_ROUTES.some(route => 
    pathname.startsWith(route)
  );
  
  if (!needsAuth) {
    return next();
  }
  
  // Cek session
  const sessionId = cookies.get('session_id')?.value;
  
  if (!sessionId || !verifySession(sessionId)) {
    // Redirect ke login page
    if (pathname.startsWith('/api/')) {
      // Untuk API, return 401
      return new Response(JSON.stringify({
        success: false,
        message: 'Unauthorized'
      }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    } else {
      // Untuk pages, redirect ke login
      return Response.redirect(new URL('/dashboard/login', url), 302);
    }
  }
  
  return next();
}