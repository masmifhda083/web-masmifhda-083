// src/pages/api/ppdb/register.ts
import type { APIRoute } from 'astro';
import { insertUser, checkUsersTable } from '../../../lib/db';

export const POST: APIRoute = async ({ request }) => {
    try {

        // Cek tabel (opsional, bisa dihapus)
        const tableCheck = await checkUsersTable();

        const data = await request.json();

        // Validasi required fields
        const requiredFields = [
            'tahun_ppdb', 'nama_lengkap', 'nama_panggilan', 'tempat_lahir',
            'tanggal_lahir', 'jenis_kelamin', 'agama', 'nomor_hp', 'email',
            'alamat_lengkap', 'asal_sekolah', 'alamat_sekolah', 'nama_ayah',
            'telepon_ayah', 'pekerjaan_ayah', 'alamat_ayah', 'nama_ibu',
            'telepon_ibu', 'pekerjaan_ibu', 'alamat_ibu'
        ];

        const missingFields = requiredFields.filter(field => !data[field]);
        if (missingFields.length > 0) {
            return new Response(JSON.stringify({
                success: false,
                message: `Field berikut harus diisi: ${missingFields.join(', ')}`
            }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        // Validasi pernyataan
        if (!data.pernyataan_kebenaran || !data.pernyataan_seleksi || !data.pernyataan_keputusan) {
            return new Response(JSON.stringify({
                success: false,
                message: 'Semua pernyataan harus disetujui'
            }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        // Validasi email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.email)) {
            return new Response(JSON.stringify({
                success: false,
                message: 'Format email tidak valid'
            }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        // Insert ke database
        const result = await insertUser(data);

        if (result.success) {
            return new Response(JSON.stringify({
                success: true,
                message: 'Pendaftaran berhasil disimpan',
                data: {
                    kode_pendaftaran: result.kode_pendaftaran,
                    timestamp: new Date().toISOString()
                }
            }), {
                status: 201,
                headers: { 'Content-Type': 'application/json' }
            });
        } else {
            return new Response(JSON.stringify({
                success: false,
                message: 'Gagal menyimpan data pendaftaran'
            }), {
                status: 500,
                headers: { 'Content-Type': 'application/json' }
            });
        }

    } catch (error: any) {
        return new Response(JSON.stringify({
            success: false,
            message: 'Terjadi kesalahan server',
            error: error.message,
            stack: import.meta.env.DEV ? error.stack : undefined
        }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
};
