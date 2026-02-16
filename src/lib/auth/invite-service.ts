/**
 * Invite Validation Service
 *
 * Validates family invite tokens against Firebase Realtime Database
 * Checks:
 * - Family existence at families/{familyId}
 * - Member count (must be <= 4)
 * - User membership status (if userId provided)
 */

import type { InviteToken } from './url-generator';
import { getFirebaseAdmin } from '../firebase/firebase-admin';

export interface InviteValidationResult {
  valid: boolean;
  error?: 'EXPIRED' | 'INVALID' | 'FULL' | 'ALREADY_MEMBER';
  familyId?: string;
  memberCount?: number;
}

/**
 * Validate an invite token against Firebase
 *
 * @param token - The validated invite token from validateInviteToken()
 * @param userId - Optional user ID to check membership status
 * @returns Promise<InviteValidationResult> - Validation result with error codes
 *
 * Error codes:
 * - 'INVALID': Family doesn't exist or token is invalid
 * - 'EXPIRED': Token has expired (also checked in token-validator)
 * - 'FULL': Family has reached maximum 4 members
 * - 'ALREADY_MEMBER': User is already a member of this family
 */
export async function validateInvite(token: InviteToken, userId?: string): Promise<InviteValidationResult> {
  const admin = getFirebaseAdmin();

  try {
    // Check 1: Family exists in Firebase Realtime Database
    const familyExists = await admin.familyExists(token.familyId);
    if (!familyExists) {
      return {
        valid: false,
        error: 'INVALID',
        familyId: token.familyId
      };
    }

    // Check 2: Member count (max 4 members per family)
    const memberCount = await admin.getMemberCount(token.familyId);
    if (memberCount >= 4) {
      return {
        valid: false,
        error: 'FULL',
        familyId: token.familyId,
        memberCount
      };
    }

    // Check 3: User is not already a member (optional, only if userId provided)
    if (userId) {
      const isMember = await admin.isMember(token.familyId, userId);
      if (isMember) {
        return {
          valid: false,
          error: 'ALREADY_MEMBER',
          familyId: token.familyId,
          memberCount
        };
      }
    }

    // All checks passed
    return {
      valid: true,
      familyId: token.familyId,
      memberCount
    };
  } catch (error) {
    // Log error for debugging but don't expose internal details
    console.error('[InviteService] Error validating invite:', error);
    return {
      valid: false,
      error: 'INVALID',
      familyId: token.familyId
    };
  }
}
