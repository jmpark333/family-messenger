/**
 * Firebase Admin SDK Setup for Server-Side Operations
 *
 * This module provides Firebase admin functionality for server-side operations
 * like verifying family existence, member counts, and other admin tasks.
 *
 * NOTE: This requires the Firebase Admin SDK to be installed:
 * npm install firebase-admin
 *
 * TODO: Add firebase-admin to dependencies when ready for production
 */

import { getDatabase, ref, get, child } from 'firebase/database';
import { initFirebase } from './config';

/**
 * Firebase Admin interface for server-side operations
 *
 * Since this project uses Firebase Client SDK on both client and server,
 * we'll use the existing Firebase setup. For production with proper admin
 * privileges, install firebase-admin and initialize it with service account.
 */
export class FirebaseAdmin {
  private database: ReturnType<typeof getDatabase>;

  constructor() {
    const { database } = initFirebase();
    this.database = database;
  }

  /**
   * Check if a family exists in the database
   * @param familyId - The family ID to check
   * @returns Promise<boolean> - true if family exists
   */
  async familyExists(familyId: string): Promise<boolean> {
    try {
      const familyRef = ref(this.database, `families/${familyId}`);
      const snapshot = await get(familyRef);
      return snapshot.exists();
    } catch (error) {
      console.error('[FirebaseAdmin] Error checking family existence:', error);
      return false;
    }
  }

  /**
   * Get the current member count of a family
   * @param familyId - The family ID to check
   * @returns Promise<number> - Current member count
   */
  async getMemberCount(familyId: string): Promise<number> {
    try {
      const membersRef = ref(this.database, `families/${familyId}/members`);
      const snapshot = await get(membersRef);

      if (!snapshot.exists()) {
        return 0;
      }

      const members = snapshot.val();
      // Count actual member entries (not null values)
      return Object.values(members).filter(m => m !== null).length;
    } catch (error) {
      console.error('[FirebaseAdmin] Error getting member count:', error);
      return 0;
    }
  }

  /**
   * Check if a user is already a member of a family
   * @param familyId - The family ID to check
   * @param userId - The user ID to check
   * @returns Promise<boolean> - true if user is already a member
   */
  async isMember(familyId: string, userId: string): Promise<boolean> {
    try {
      const memberRef = ref(this.database, `families/${familyId}/members/${userId}`);
      const snapshot = await get(memberRef);
      return snapshot.exists();
    } catch (error) {
      console.error('[FirebaseAdmin] Error checking membership:', error);
      return false;
    }
  }

  /**
   * Get family data
   * @param familyId - The family ID to fetch
   * @returns Promise<object | null> - Family data or null if not found
   */
  async getFamily(familyId: string): Promise<object | null> {
    try {
      const familyRef = ref(this.database, `families/${familyId}`);
      const snapshot = await get(familyRef);

      if (!snapshot.exists()) {
        return null;
      }

      return snapshot.val();
    } catch (error) {
      console.error('[FirebaseAdmin] Error getting family data:', error);
      return null;
    }
  }
}

// Singleton instance
let adminInstance: FirebaseAdmin | null = null;

/**
 * Get or create Firebase Admin instance
 * @returns FirebaseAdmin instance
 */
export function getFirebaseAdmin(): FirebaseAdmin {
  if (!adminInstance) {
    adminInstance = new FirebaseAdmin();
  }
  return adminInstance;
}
