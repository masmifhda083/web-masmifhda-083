import type { APIRoute } from 'astro';
import { getEntry } from 'astro:content';

type StudentData = {
  nisn: string;
  name: string;
  status: string;
  biodata: Record<string, string>;
  grades: { subject: string; score: string }[];
};

/**
 * Parse CSV/TSV data yang di-paste dari Excel.
 * Mendukung pemisah Tab (dari Excel copy-paste) dan Koma (dari file .csv).
 * Format baris 1: Header (NISN, Nama, Status, Biodata opsional, Mata Pelajaran...)
 * Format baris 2+: Data Siswa
 */
function parseStudentData(csvData: string): StudentData[] {
  if (!csvData || !csvData.trim()) return [];

  const lines = csvData.split('\n').filter(line => line.trim() !== '');
  if (lines.length < 2) return []; // Butuh header dan minimal 1 data

  // Gunakan baris pertama sebagai header
  const separator = lines[0].includes('\t') ? '\t' : ',';
  const headers = lines[0].split(separator).map(col => col.trim());
  const lowercaseHeaders = headers.map(h => h.toLowerCase());

  // Temukan index kolom utama (fleksibel)
  const nisnIdx = lowercaseHeaders.findIndex(h => h === 'nisn' || h.includes('induk'));
  const namaIdx = lowercaseHeaders.findIndex(h => h === 'nama' || h.includes('nama lengkap'));
  const statusIdx = lowercaseHeaders.findIndex(h => h === 'status');

  // Daftar kata kunci kolom biodata yang dikenali secara otomatis
  const biodataKeys = ['tempat', 'lahir', 'ijazah', 'tanggal kelulusan', 'keahlian', 'jurusan', 'npsn', 'satuan pendidikan', 'program'];
  
  const students: StudentData[] = [];

  for (let i = 1; i < lines.length; i++) {
    const columns = lines[i].split(separator).map(col => col.trim());
    if (columns.length === 0 || (nisnIdx >= 0 && !columns[nisnIdx])) continue;

    const student: StudentData = {
      nisn: nisnIdx >= 0 ? columns[nisnIdx] : '',
      name: namaIdx >= 0 ? columns[namaIdx] : '',
      status: statusIdx >= 0 ? columns[statusIdx] : '',
      biodata: {},
      grades: []
    };

    // Klasifikasi sisa kolom
    for (let j = 0; j < headers.length; j++) {
      if (j === nisnIdx || j === namaIdx || j === statusIdx) continue;

      const headerName = headers[j];
      const lowerHeader = lowercaseHeaders[j];
      const value = columns[j] || '-';

      if (!headerName || lowerHeader.includes('link transkrip')) continue;

      const isBiodata = biodataKeys.some(key => lowerHeader.includes(key));

      if (isBiodata) {
        student.biodata[headerName] = value;
      } else {
        // Sisanya dianggap sebagai Mata Pelajaran
        student.grades.push({ subject: headerName, score: value });
      }
    }
    
    if (student.nisn) {
      students.push(student);
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
