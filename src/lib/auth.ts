// src/lib/auth.ts
// Menggunakan Web Crypto API (kompatibel dengan Cloudflare Pages)

// Simpan credentials di environment variables (lebih aman)
// Atau di file ini jika tidak ingin pakai env

export const ADMIN_CREDENTIALS = {
  username: import.meta.env.ADMIN_USERNAME || 'admin',
  // Hash untuk password: ppdbAdmin2026
  passwordHash: import.meta.env.ADMIN_PASSWORD_HASH || 'd2800b126f83def9f9544d3bf2a99ca06b6706bd974f7234bd67d994e9109a41'
};

// Secret key untuk session (gunakan environment variable)
export const SESSION_SECRET = import.meta.env.SESSION_SECRET || 'ppdb-secret-key-change-this';

// Session expiration (30 menit)
export const SESSION_EXPIRY = 30 * 60 * 1000; // 30 menit dalam milidetik

// Helper untuk hash password menggunakan Web Crypto API (kompatibel Cloudflare)
export async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// Cek credentials
export async function verifyCredentials(username: string, password: string): Promise<boolean> {
  const hashedInput = await hashPassword(password);
  return (
    username === ADMIN_CREDENTIALS.username &&
    hashedInput === ADMIN_CREDENTIALS.passwordHash
  );
}

// Session management
interface SessionData {
  username: string;
  expiresAt: number;
}

// Simpan session di memory (untuk production gunakan Redis atau database)
const sessions = new Map<string, SessionData>();

export function createSession(username: string): string {
  const sessionId = Math.random().toString(36).substring(2) + Date.now().toString(36);
  const expiresAt = Date.now() + SESSION_EXPIRY;

  sessions.set(sessionId, { username, expiresAt });

  // Cleanup expired sessions setiap 5 menit
  setTimeout(() => cleanupSessions(), 5 * 60 * 1000);

  return sessionId;
}

export function verifySession(sessionId: string): boolean {
  const session = sessions.get(sessionId);

  if (!session) return false;

  if (Date.now() > session.expiresAt) {
    sessions.delete(sessionId);
    return false;
  }

  // Perpanjang session
  session.expiresAt = Date.now() + SESSION_EXPIRY;
  return true;
}

export function destroySession(sessionId: string): void {
  sessions.delete(sessionId);
}

function cleanupSessions() {
  const now = Date.now();
  for (const [sessionId, session] of sessions.entries()) {
    if (now > session.expiresAt) {
      sessions.delete(sessionId);
    }
  }
}