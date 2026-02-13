import * as crypto from 'crypto';
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

/**
 * Get error code for invalid/expired tokens
 *
 * Returns error codes consistent with the API specification:
 * - 'INVALID_TOKEN': Token signature is invalid or malformed
 * - 'EXPIRED_TOKEN': Token has passed its expiration time
 *
 * Note: This function is used by token validation. For invite validation
 * that includes Firebase checks, use validateInvite() from invite-service.ts
 * which returns: 'INVALID', 'EXPIRED', 'FULL', 'ALREADY_MEMBER'
 *
 * @param token - The token to check (null if validation failed)
 * @returns Error code string or null if token is valid
 */
export function getInviteErrorCode(token: InviteToken | null): string | null {
  if (!token) {
    return 'INVALID_TOKEN';
  }
  if (Date.now() > token.expiresAt) {
    return 'EXPIRED_TOKEN';
  }
  return null;
}
