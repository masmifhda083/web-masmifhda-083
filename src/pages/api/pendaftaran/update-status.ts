// src/pages/api/pendaftaran/update-status.ts
import type { APIRoute } from 'astro';
import { updateUserStatus } from '../../../lib/db';

export const GET: APIRoute = async ({ request }) => {
    try {
        const url = new URL(request.url);

        const idParam = url.searchParams.get('id');
        const id = Number(idParam);
        const status = url.searchParams.get('status');

        if (!idParam || Number.isNaN(id)) {
            return new Response(JSON.stringify({
                success: false,
                message: 'ID tidak valid'
            }), { status: 400 });
        }

        if (!status) {
            return new Response(JSON.stringify({
                success: false,
                message: 'Status diperlukan'
            }), { status: 400 });
        }

        const validStatuses = ['pending', 'review', 'approved', 'rejected'];
        if (!validStatuses.includes(status)) {
            return new Response(JSON.stringify({
                success: false,
                message: 'Status tidak valid'
            }), { status: 400 });
        }

        const result = await updateUserStatus(id, status);

        if (result.success) {
            return new Response(null, {
                status: 302,
                headers: { Location: '/dashboard/pendaftaran' }
            });
        }

        return new Response(JSON.stringify({
            success: false,
            message: 'Gagal mengupdate status'
        }), { status: 500 });

    } catch (error: any) {
        return new Response(JSON.stringify({
            success: false,
            message: 'Terjadi kesalahan server'
        }), { status: 500 });
    }
};
