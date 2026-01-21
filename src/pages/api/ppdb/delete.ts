// src/pages/api/ppdb/delete.ts
import type { APIRoute } from 'astro';
import { deleteUser } from '../../../lib/db';

export const GET: APIRoute = async ({ url }) => {
    const id = url.searchParams.get('id');

    if (!id) {
        return new Response(JSON.stringify({
            success: false,
            message: 'ID tidak ditemukan'
        }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' }
        });
    }

    try {
        const result = await deleteUser(Number(id));

        if (result.success) {
            // Redirect ke halaman PPDB setelah delete
            return new Response(null, {
                status: 302,
                headers: {
                    'Location': '/dashboard/ppdb'
                }
            });
        } else {
            return new Response(JSON.stringify({
                success: false,
                message: 'Gagal menghapus data'
            }), {
                status: 500,
                headers: { 'Content-Type': 'application/json' }
            });
        }
    } catch (error: any) {
        return new Response(JSON.stringify({
            success: false,
            message: 'Terjadi kesalahan server',
            error: error.message
        }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
};
