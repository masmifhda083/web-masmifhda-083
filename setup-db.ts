// setup-db.ts
import { createClient } from '@libsql/client';
import * as dotenv from 'dotenv';

dotenv.config();

async function setupDatabase() {
  console.log('🚀 Memulai setup database...');
  console.log('📡 Menghubungkan ke:', process.env.TURSO_DATABASE_URL?.substring(0, 30) + '...');
  
  const client = createClient({
    url: process.env.TURSO_DATABASE_URL!,
    authToken: process.env.TURSO_AUTH_TOKEN!,
  });

  try {
    // Cek apakah tabel sudah ada
    console.log('🔍 Mengecek tabel yang ada...');
    try {
      const tables = await client.execute(`
        SELECT name FROM sqlite_master 
        WHERE type='table' AND name='users'
      `);
      
      if (tables.rows.length > 0) {
        console.log('📋 Tabel users sudah ada');
        
        // Tampilkan struktur tabel
        const structure = await client.execute('PRAGMA table_info(users)');
        console.log('📐 Struktur tabel users:');
        structure.rows.forEach((row: any) => {
          console.log(`  - ${row.name} (${row.type})`);
        });
        
        // Hitung jumlah data
        const count = await client.execute('SELECT COUNT(*) as count FROM users');
        console.log(`📊 Total data: ${count.rows[0].count}`);
        
      } else {
        console.log('❌ Tabel users tidak ditemukan, membuat baru...');
        await createUsersTable(client);
      }
    } catch (error) {
      console.log('⚠️  Error saat mengecek tabel:', error);
      await createUsersTable(client);
    }
    
    console.log('✅ Setup database selesai!');
    
  } catch (error) {
    console.error('❌ Error setup database:', error);
    if (error instanceof Error) {
      console.error('Error message:', error.message);
    }
  }
}

async function createUsersTable(client: any) {
  try {
    await client.execute(`
      CREATE TABLE users (
        id TEXT PRIMARY KEY,
        tahun_ppdb TEXT NOT NULL,
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
      )
    `);
    
    console.log('✅ Tabel users berhasil dibuat');
    
    // Tambah data sample
    const sampleId = `sample-${Date.now()}`;
    await client.execute({
      sql: `
        INSERT INTO users (
          id, tahun_ppdb, nama_lengkap, nama_panggilan, tempat_lahir,
          tanggal_lahir, jenis_kelamin, agama, nomor_hp, email, alamat_lengkap,
          asal_sekolah, alamat_sekolah, nama_ayah, telepon_ayah, pekerjaan_ayah,
          alamat_ayah, nama_ibu, telepon_ibu, pekerjaan_ibu, alamat_ibu,
          pernyataan_kebenaran, pernyataan_seleksi, pernyataan_keputusan, status
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      args: [
        sampleId, '2026/2027', 'Budi Santoso', 'Budi', 'Jakarta',
        '2010-05-15', 'Laki-laki', 'Islam', '081234567890', 'budi@example.com', 'Jl. Merdeka No. 123, Jakarta',
        'SDN 01 Jakarta', 'Jl. Pendidikan No. 45, Jakarta', 'Ahmad Santoso', '081234567891', 'PNS',
        'Jl. Merdeka No. 123, Jakarta', 'Siti Aminah', '081234567892', 'Ibu Rumah Tangga', 'Jl. Merdeka No. 123, Jakarta',
        1, 1, 1, 'pending'
      ]
    });
    
    console.log(`📝 Data sample ditambahkan dengan ID: ${sampleId}`);
    
  } catch (error) {
    console.error('❌ Error membuat tabel:', error);
    throw error;
  }
}

setupDatabase();