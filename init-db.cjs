const { createClient } = require('@libsql/client');
const db = createClient({ url: 'file:database.db' });
db.execute(`
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    kode_pendaftaran TEXT UNIQUE,
    tahun_ppdb TEXT,
    jurusan TEXT,
    nama_lengkap TEXT,
    nama_panggilan TEXT,
    tempat_lahir TEXT,
    tanggal_lahir TEXT,
    jenis_kelamin TEXT,
    agama TEXT,
    nomor_hp TEXT,
    email TEXT,
    alamat_lengkap TEXT,
    asal_sekolah TEXT,
    alamat_sekolah TEXT,
    nama_ayah TEXT,
    telepon_ayah TEXT,
    pekerjaan_ayah TEXT,
    alamat_ayah TEXT,
    nama_ibu TEXT,
    telepon_ibu TEXT,
    pekerjaan_ibu TEXT,
    alamat_ibu TEXT,
    pernyataan_kebenaran INTEGER,
    pernyataan_seleksi INTEGER,
    pernyataan_keputusan INTEGER,
    status TEXT DEFAULT 'pending',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
)
`).then(() => console.log('Table created successfully')).catch(console.error);
