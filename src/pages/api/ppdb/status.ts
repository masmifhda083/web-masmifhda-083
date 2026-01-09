// src/pages/api/ppdb/status.ts
import type { APIRoute } from 'astro';
import { getUserByKode } from '../../../lib/db';

export const GET: APIRoute = async ({ url }) => {
  try {
    const kode = url.searchParams.get('kode');
    
    if (!kode) {
      return new Response(JSON.stringify({
        success: false,
        message: 'Kode pendaftaran diperlukan'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    const result = await getUserByKode(kode);
    
    if (result.success && result.data) {
      return new Response(JSON.stringify({
        success: true,
        data: result.data
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    } else {
      return new Response(JSON.stringify({
        success: false,
        message: 'Data tidak ditemukan'
      }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }
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