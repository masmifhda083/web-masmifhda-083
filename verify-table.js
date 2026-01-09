// verify-table.js
import { createClient } from '@libsql/client';
import dotenv from 'dotenv';

dotenv.config();

async function verifyTable() {
  const client = createClient({
    url: process.env.TURSO_DATABASE_URL,
    authToken: process.env.TURSO_AUTH_TOKEN,
  });

  try {
    console.log('🔍 Verifying users table...');
    
    // Cek tabel users
    const usersTable = await client.execute(`
      SELECT name FROM sqlite_master 
      WHERE type='table' AND name='users'
    `);
    
    console.log('✅ users table exists:', usersTable.rows.length > 0);
    
    // Cek struktur
    const structure = await client.execute('PRAGMA table_info(users)');
    console.log('\n📐 Table structure:');
    structure.rows.forEach((row, index) => {
      console.log(`${index + 1}. ${row.name} - ${row.type} ${row.notnull ? 'NOT NULL' : ''}`);
    });
    
    // Cek data sample
    const data = await client.execute('SELECT id, nama_lengkap, status FROM users');
    console.log('\n📊 Data in table:', data.rows);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

verifyTable();