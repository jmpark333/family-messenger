/**
 * 인증 세션 관리
 *
 * 사용자의 인증 세션을 생성하고 관리합니다.
 */

import type { AuthCredentials, AuthSession } from '@/types';
import { deriveSessionKey } from './key-derivation';
import { hashPin } from './credentials';

// Peer ID 생성 함수 (간단 구현)
function generatePeerId(): string {
  const array = new Uint8Array(8);
  crypto.getRandomValues(array);
  return Array.from(array)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

class AuthSessionManager {
  private session: AuthSession | null = null;

  /**
   * 세션 생성
   */
  async createSession(credentials: AuthCredentials): Promise<AuthSession> {
    const sessionKey = await deriveSessionKey(
      credentials.id,
      credentials.password
    );

    const pinHash = await hashPin(credentials.additionalPin);

    this.session = {
      userId: credentials.id,
      sessionKey,
      additionalPinHash: pinHash,
      peerId: generatePeerId(),
      createdAt: Date.now()
    };

    return this.session;
  }

  /**
   * 세션 반환
   */
  getSession(): AuthSession | null {
    return this.session;
  }

  /**
   * 세션 삭제
   */
  clearSession(): void {
    this.session = null;
  }

  /**
   * 인증 상태 확인
   */
  isAuthenticated(): boolean {
    return this.session !== null;
  }

  /**
   * 추가비번 업데이트
   */
  async updateAdditionalPin(newPin: string): Promise<void> {
    if (!this.session) {
      throw new Error('세션이 없습니다');
    }

    const pinHash = await hashPin(newPin);
    this.session.additionalPinHash = pinHash;
  }
}

export const authSessionManager = new AuthSessionManager();
