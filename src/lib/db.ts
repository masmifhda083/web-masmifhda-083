// src/lib/db.ts
import { createClient } from '@libsql/client';

const db = createClient({
  url: import.meta.env.TURSO_DATABASE_URL || 'file:database.db',
  authToken: import.meta.env.TURSO_AUTH_TOKEN,
});

export interface UserData {
  tahun_ppdb: string;
  nama_lengkap: string;
  nama_panggilan: string;
  tempat_lahir: string;
  tanggal_lahir: string;
  jenis_kelamin: string;
  agama: string;
  nomor_hp: string;
  email: string;
  alamat_lengkap: string;
  asal_sekolah: string;
  alamat_sekolah: string;
  nama_ayah: string;
  telepon_ayah: string;
  pekerjaan_ayah: string;
  alamat_ayah: string;
  nama_ibu: string;
  telepon_ibu: string;
  pekerjaan_ibu: string;
  alamat_ibu: string;
  pernyataan_kebenaran: boolean;
  pernyataan_seleksi: boolean;
  pernyataan_keputusan: boolean;
  status?: string;
}


export async function checkUsersTable() {
  const result = await db.execute(`
    SELECT name FROM sqlite_master
    WHERE type='table' AND name='users'
  `);
  return { exists: result.rows.length > 0 };
}

function generateKodePendaftaran() {
  return `PPDB-${Date.now()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
}
export async function insertUser(userData: UserData) {
  const now = new Date().toISOString();
  const kodePendaftaran = generateKodePendaftaran();

  const sql = `
  INSERT INTO users (
    kode_pendaftaran,
    tahun_ppdb, jurusan, nama_lengkap, nama_panggilan, tempat_lahir,
    tanggal_lahir, jenis_kelamin, agama, nomor_hp, email, alamat_lengkap,
    asal_sekolah, alamat_sekolah, nama_ayah, telepon_ayah, pekerjaan_ayah,
    alamat_ayah, nama_ibu, telepon_ibu, pekerjaan_ibu, alamat_ibu,
    pernyataan_kebenaran, pernyataan_seleksi, pernyataan_keputusan,
    status, created_at, updated_at
  ) VALUES (
    ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
  )
`;


  const result = await db.execute({
    sql,
    args: [
      kodePendaftaran,
      userData.tahun_ppdb,
      '', // jurusan dikosongkan
      userData.nama_lengkap,
      userData.nama_panggilan,
      userData.tempat_lahir,
      userData.tanggal_lahir,
      userData.jenis_kelamin,
      userData.agama,
      userData.nomor_hp,
      userData.email,
      userData.alamat_lengkap,
      userData.asal_sekolah,
      userData.alamat_sekolah,
      userData.nama_ayah,
      userData.telepon_ayah,
      userData.pekerjaan_ayah,
      userData.alamat_ayah,
      userData.nama_ibu,
      userData.telepon_ibu,
      userData.pekerjaan_ibu,
      userData.alamat_ibu,
      userData.pernyataan_kebenaran ? 1 : 0,
      userData.pernyataan_seleksi ? 1 : 0,
      userData.pernyataan_keputusan ? 1 : 0,
      userData.status || 'pending',
      now,
      now
    ]
  });

  return {
    success: true,
    id: Number(result.lastInsertRowid),
    kode_pendaftaran: kodePendaftaran
  };
}


export async function getUserById(id: number) {
  const result = await db.execute({
    sql: 'SELECT * FROM users WHERE id = ?',
    args: [id]
  });

  if (result.rows.length === 0) {
    return {
      success: false,
      message: 'Data tidak ditemukan'
    };
  }

  return {
    success: true,
    data: result.rows[0]
  };
}

export async function updateUserStatus(id: number, status: string) {
  const result = await db.execute({
    sql: 'UPDATE users SET status = ?, updated_at = ? WHERE id = ?',
    args: [status, new Date().toISOString(), id]
  });

  return {
    success: result.rowsAffected > 0
  };
}

export async function deleteUser(id: number) {
  const result = await db.execute({
    sql: 'DELETE FROM users WHERE id = ?',
    args: [id]
  });

  return {
    success: result.rowsAffected > 0
  };
}

export async function getUserByKode(kode: string) {
  try {

    const result = await db.execute({
      sql: `
        SELECT *
        FROM users
        WHERE kode_pendaftaran = ?
        LIMIT 1
      `,
      args: [kode]
    });

    if (result.rows.length === 0) {
      return { success: false };
    }

    return {
      success: true,
      data: result.rows[0]
    };
  } catch (error) {
    throw error; // WAJIB throw supaya ketahuan error aslinya
  }
}

export async function getAllUsers() {
  const result = await db.execute(`
    SELECT
      id,
      kode_pendaftaran,
      tahun_ppdb,
      nama_lengkap,
      nama_panggilan,
      email,
      nomor_hp,
      status,
      created_at
    FROM users
    ORDER BY created_at DESC
  `);

  return {
    success: true,
    data: result.rows
  };
}

export default db;
