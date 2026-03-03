import type { APIRoute } from 'astro';
import { getAllUsers } from '../../../lib/db';

export const GET: APIRoute = async () => {
    try {
        const result = await getAllUsers();

        if (!result.success) {
            return new Response(JSON.stringify({
                success: false,
                message: (result as any).message || 'Gagal mengambil data'
            }), {
                status: 500,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        }

        return new Response(JSON.stringify({
            success: true,
            data: result.data
        }), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
                // Add CORS headers if TinaCMS is running on a different port locally during dev
                'Access-Control-Allow-Origin': '*',
            }
        });
    } catch (error) {
        console.error('Error in /api/pendaftaran/list:', error);
        return new Response(JSON.stringify({
            success: false,
            message: 'Terjadi kesalahan sistem'
        }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }
}
