import crypto from 'crypto';
import type { InviteToken } from './url-generator';

export function validateInviteToken(encoded: string): InviteToken | null {
  try {
    const decoded = Buffer.from(encoded, 'base64url').toString();
    const token: InviteToken = JSON.parse(decoded);

    // Check expiry
    if (Date.now() > token.expiresAt) {
      return null;
    }

    // Verify signature
    const secret = process.env.FIREBASE_CONFIG || 'default-secret';
    const data = `${token.familyId}:${token.createdBy}:${token.createdAt}:${token.expiresAt}`;
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(data)
      .digest('hex');

    if (token.signature !== expectedSignature) {
      return null;
    }

    return token;
  } catch {
    return null;
  }
}

export function getInviteErrorCode(token: InviteToken | null): string | null {
  if (!token) {
    return 'INVALID_TOKEN';
  }
  if (Date.now() > token.expiresAt) {
    return 'EXPIRED_TOKEN';
  }
  return null;
}
