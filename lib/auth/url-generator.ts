import * as crypto from 'crypto';

const INVITE_URL_EXPIRY = 24 * 60 * 60 * 1000; // 24 hours

export interface InviteToken {
  familyId: string;
  createdBy: string;
  createdAt: number;
  expiresAt: number;
  signature: string;
}

export function generateInviteUrl(familyId: string, createdBy: string, baseUrl: string): string {
  const token: InviteToken = {
    familyId,
    createdBy,
    createdAt: Date.now(),
    expiresAt: Date.now() + INVITE_URL_EXPIRY,
    signature: ''
  };

  // HMAC signature
  const secret = process.env.FIREBASE_CONFIG;
  if (!secret) {
    throw new Error('FIREBASE_CONFIG environment variable is required for secure invite URL generation');
  }
  const data = `${token.familyId}:${token.createdBy}:${token.createdAt}:${token.expiresAt}`;
  token.signature = crypto.createHmac('sha256', secret).update(data).digest('hex');

  const encoded = Buffer.from(JSON.stringify(token)).toString('base64url');
  return `${baseUrl}/auth?invite=${encoded}`;
}
