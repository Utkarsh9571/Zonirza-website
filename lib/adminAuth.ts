import crypto from 'crypto';

export function verifyAdminCredentials(email: string, passwordHash: string): boolean {
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPasswordHash = process.env.ADMIN_PASSWORD_HASH;

  if (!adminEmail || !adminPasswordHash) {
    console.warn('Admin credentials not configured in environment variables');
    return false;
  }

  return email === adminEmail && passwordHash === adminPasswordHash;
}

export function hashPassword(password: string): string {
  // Using SHA-256 for simplicity as requested, but in a real production 
  // multi-user system bcrypt would be used. Since this is a SINGLE admin 
  // gated by ENV, SHA-256 matches the user's specific requirement.
  const { createHash } = require('crypto');
  return createHash('sha256').update(password).digest('hex');
}
