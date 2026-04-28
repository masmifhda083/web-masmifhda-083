import type { APIRoute } from 'astro';
import { getEntry } from 'astro:content';

/**
 * Parse CSV/TSV data yang di-paste dari Excel.
 * Mendukung pemisah Tab (dari Excel copy-paste) dan Koma (dari file .csv).
 * Format per baris: NISN [Tab/Koma] Nama [Tab/Koma] Status [Tab/Koma] Link Transkrip (opsional)
 */
function parseStudentData(csvData: string) {
  if (!csvData || !csvData.trim()) return [];

  const lines = csvData.split('\n').filter(line => line.trim() !== '');
  const students: { nisn: string; name: string; status: string; link?: string }[] = [];

  for (const line of lines) {
    // Deteksi pemisah: prioritaskan Tab (dari Excel), lalu Koma
    const separator = line.includes('\t') ? '\t' : ',';
    const columns = line.split(separator).map(col => col.trim());

    // Minimal harus ada 3 kolom: NISN, Nama, Status
    if (columns.length >= 3) {
      const [nisn, name, status, link] = columns;
      students.push({ nisn, name, status, link: link || undefined });
    }
  }

  return students;
}

export const GET: APIRoute = async ({ request }) => {
  const url = new URL(request.url);
  const nisn = url.searchParams.get('nisn');

  if (!nisn) {
    return new Response(JSON.stringify({ error: 'NISN harus diisi' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const kelulusanEntry = await getEntry('kelulusan', 'data');
  const data = kelulusanEntry?.data;

  if (!data) {
    return new Response(JSON.stringify({ error: 'Data kelulusan belum dikonfigurasi' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  if (!data.isActive) {
    return new Response(JSON.stringify({ error: 'Pengumuman kelulusan belum dibuka' }), {
      status: 403,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  // Parse csvData menjadi array siswa
  const students = parseStudentData(data.csvData);

  // Cari siswa berdasarkan NISN
  const student = students.find(s => s.nisn === nisn);

  if (!student) {
    return new Response(JSON.stringify({ error: 'Data siswa dengan NISN tersebut tidak ditemukan. Pastikan NISN yang dimasukkan sudah benar.' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  return new Response(JSON.stringify({ data: student }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
};
