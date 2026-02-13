import { get, ref } from 'firebase/database';
import { getFirebaseDatabase, initFirebase } from '../firebase/config';
import type { InviteToken } from './token-validator';

export interface InviteValidationResult {
  valid: boolean;
  error?: 'EXPIRED' | 'INVALID' | 'FULL' | 'ALREADY_MEMBER';
  familyId?: string;
  memberCount?: number;
}

export async function validateInvite(token: InviteToken, userId?: string): Promise<InviteValidationResult> {
  // Initialize Firebase
  const database = getFirebaseDatabase();
  initFirebase();

  // Check family exists
  const familyRef = ref(database, `families/${token.familyId}`);
  const familySnap = await get(familyRef);

  if (!familySnap.exists()) {
    return { valid: false, error: 'INVALID' };
  }

  // Check member count
  const membersRef = ref(database, `families/${token.familyId}/members`);
  const membersSnap = await get(membersRef);
  const membersData = membersSnap.val();
  const memberCount = membersData ? Object.keys(membersData).length : 0;

  if (memberCount >= 4) {
    return { valid: false, error: 'FULL', memberCount };
  }

  // Check if user is already a member
  if (userId && membersData && Object.values(membersData).includes(userId)) {
    return { valid: false, error: 'ALREADY_MEMBER', memberCount };
  }

  return {
    valid: true,
    familyId: token.familyId,
    memberCount
  };
}
