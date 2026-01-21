import type { APIRoute } from 'astro';
import db from '../../../lib/db';

export const GET: APIRoute = async ({ url }) => {
  const tahun = url.searchParams.get('tahun');

  let where: string[] = [];
  let args: any[] = [];

  if (tahun && tahun !== 'Semua') {
    where.push('tahun_ppdb = ?');
    args.push(tahun);
  }

  const whereSql = where.length ? `WHERE ${where.join(' AND ')}` : '';

  const result = await db.execute({
    sql: `
      SELECT
        kode_pendaftaran,
        tahun_ppdb,
        nama_lengkap,
        nama_panggilan,
        email,
        nomor_hp,
        status,
        created_at
      FROM users
      ${whereSql}
      ORDER BY created_at DESC
    `,
    args
  });

  let csv = 'Kode,Tahun,Nama Lengkap,Nama Panggilan,Email,HP,Status,Tanggal\n';

  for (const row of result.rows) {
    csv += [
      row.kode_pendaftaran,
      row.tahun_ppdb,
      row.nama_lengkap,
      row.nama_panggilan,
      row.email,
      row.nomor_hp,
      row.status,
      row.created_at
    ]
      .map(v => `"${String(v ?? '').replace(/"/g, '""')}"`)
      .join(',') + '\n';
  }

  const filename = `ppdb_${tahun || 'semua'}.csv`;

  return new Response(csv, {
    status: 200,
    headers: {
      'Content-Type': 'text/csv',
      'Content-Disposition': `attachment; filename=${filename}`
    }
  });
};
