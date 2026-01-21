// src/pages/api/admin/login.ts
import type { APIRoute } from 'astro';
import { verifyCredentials, createSession } from '../../../lib/auth';

export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    const data = await request.json();
    const { username, password } = data;

    if (!username || !password) {
      return new Response(JSON.stringify({
        success: false,
        message: 'Username dan password diperlukan'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Verify credentials
    const isValid = await verifyCredentials(username, password);

    if (!isValid) {
      return new Response(JSON.stringify({
        success: false,
        message: 'Username atau password salah'
      }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Create session
    const sessionId = createSession(username);

    // Set cookie
    cookies.set('session_id', sessionId, {
      httpOnly: true,
      secure: import.meta.env.PROD, // Hanya HTTPS di production
      sameSite: 'strict',
      maxAge: 30 * 60, // 30 menit
      path: '/'
    });

    return new Response(JSON.stringify({
      success: true,
      message: 'Login berhasil'
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error: any) {

    return new Response(JSON.stringify({
      success: false,
      message: 'Terjadi kesalahan server'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};