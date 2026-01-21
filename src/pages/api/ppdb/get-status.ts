// src/pages/api/ppdb/get-status.ts
import type { APIRoute } from 'astro';
import { getUserByKode } from '../../../lib/db';

export const GET: APIRoute = async ({ request }) => {
    try {
        const url = new URL(request.url);
        const kode = url.searchParams.get('kode');


        if (!kode) {
            return new Response(JSON.stringify({
                success: false,
                message: 'Kode pendaftaran diperlukan'
            }), { status: 400 });
        }

        const result = await getUserByKode(kode);

        if (result.success) {
            return new Response(JSON.stringify({
                success: true,
                data: result.data
            }), { status: 200 });
        }

        return new Response(JSON.stringify({
            success: false,
            message: 'Data tidak ditemukan'
        }), { status: 404 });

    } catch (error: any) {

        return new Response(JSON.stringify({
            success: false,
            message: 'Terjadi kesalahan server'
        }), { status: 500 });
    }
};
