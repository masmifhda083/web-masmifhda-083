// src/pages/api/admin/logout.ts
import type { APIRoute } from 'astro';
import { destroySession } from '../../../lib/auth';

export const POST: APIRoute = async ({ cookies }) => {
  const sessionId = cookies.get('session_id')?.value;
  
  if (sessionId) {
    destroySession(sessionId);
    cookies.delete('session_id');
  }
  
  return new Response(JSON.stringify({
    success: true,
    message: 'Logout berhasil'
  }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
};