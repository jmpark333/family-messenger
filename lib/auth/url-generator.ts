import * as crypto from 'crypto';

const INVITE_URL_EXPIRY = 24 * 60 * 60 * 1000; // 24 hours

export interface InviteToken {
  familyId: string;
  createdBy: string;
  createdAt: number;
  expiresAt: number;
  signature: string;
}

/**
 * URL-safe base64 인코딩 (브라우저 호환)
 */
function base64UrlEncode(str: string): string {
  return Buffer.from(str).toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

export function generateInviteUrl(familyId: string, createdBy: string, baseUrl: string): string {
  // HMAC signature using Firebase project ID as secret
  const secret = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'family-messenger-default';
  
  const token: InviteToken = {
    familyId,
    createdBy,
    createdAt: Date.now(),
    expiresAt: Date.now() + INVITE_URL_EXPIRY,
    signature: ''
  };

  // Create HMAC signature
  const data = `${token.familyId}:${token.createdBy}:${token.createdAt}:${token.expiresAt}`;
  token.signature = crypto.createHmac('sha256', secret).update(data).digest('hex');

  const encoded = base64UrlEncode(JSON.stringify(token));
  return `${baseUrl}/auth?invite=${encoded}`;
}
