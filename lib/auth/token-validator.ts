import * as crypto from 'crypto';
import type { InviteToken } from './url-generator';

/**
 * URL-safe base64 디코딩 (브라우저 호환)
 * base64url 형식을 표준 base64로 변환 후 atob으로 디코딩
 */
function base64UrlDecode(str: string): string {
  // base64url을 base64로 변환
  let base64 = str.replace(/-/g, '+').replace(/_/g, '/');

  // 패딩 처리
  while (base64.length % 4) {
    base64 += '=';
  }

  // 브라우저 네이티브 atob 사용 후 UTF-8 디코딩
  return decodeURIComponent(atob(base64).split('').map(c => {
    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));
}

export function validateInviteToken(encoded: string): InviteToken | null {
  try {
    const decoded = base64UrlDecode(encoded);
    const token: InviteToken = JSON.parse(decoded);

    // Check expiry
    const now = Date.now();
    if (now > token.expiresAt) {
      return null;
    }

    // Verify signature
    const secret = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'family-messenger-default';
    if (!secret) {
      return null;
    }
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
