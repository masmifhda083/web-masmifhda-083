import { createClient } from '@libsql/client';
import dotenv from 'dotenv';

dotenv.config();

async function createUsersTable() {
  const client = createClient({
    url: process.env.TURSO_DATABASE_URL,
    authToken: process.env.TURSO_AUTH_TOKEN,
  });

  await client.execute('DROP TABLE IF EXISTS users');

  await client.execute(`
    CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  kode_pendaftaran TEXT UNIQUE NOT NULL,
  tahun_ppdb TEXT NOT NULL,
  jurusan TEXT NOT NULL,
  nama_lengkap TEXT NOT NULL,
  nama_panggilan TEXT NOT NULL,
  tempat_lahir TEXT NOT NULL,
  tanggal_lahir TEXT NOT NULL,
  jenis_kelamin TEXT NOT NULL,
  agama TEXT NOT NULL,
  nomor_hp TEXT NOT NULL,
  email TEXT NOT NULL,
  alamat_lengkap TEXT NOT NULL,
  asal_sekolah TEXT NOT NULL,
  alamat_sekolah TEXT NOT NULL,
  nama_ayah TEXT NOT NULL,
  telepon_ayah TEXT NOT NULL,
  pekerjaan_ayah TEXT NOT NULL,
  alamat_ayah TEXT NOT NULL,
  nama_ibu TEXT NOT NULL,
  telepon_ibu TEXT NOT NULL,
  pekerjaan_ibu TEXT NOT NULL,
  alamat_ibu TEXT NOT NULL,
  pernyataan_kebenaran INTEGER NOT NULL,
  pernyataan_seleksi INTEGER NOT NULL,
  pernyataan_keputusan INTEGER NOT NULL,
  status TEXT DEFAULT 'pending',
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

  `);

  console.log('Tabel users siap');
}

createUsersTable();
