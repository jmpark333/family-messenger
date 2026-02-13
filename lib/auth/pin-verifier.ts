/**
 * 추가비번 검증 (Challenge-Response 방식)
 *
 * P2P 연결 후 추가비번으로 상대방을 검증합니다.
 */

import type { AuthChallenge, AuthResponse } from '@/types';
import { hashPin } from './credentials';

/**
 * 인증 챌린지 생성
 */
export async function createAuthChallenge(): Promise<AuthChallenge> {
  return {
    challengeId: crypto.randomUUID(),
    nonce: crypto.getRandomValues(new Uint8Array(16)),
    timestamp: Date.now()
  };
}

/**
 * 인증 응답 생성 (PIN + Challenge로 해시)
 */
export async function createAuthResponse(
  challenge: AuthChallenge,
  pin: string
): Promise<AuthResponse> {
  // 챌린지 + PIN으로 해시 생성
  const encoder = new TextEncoder();
  const pinBytes = encoder.encode(pin);
  const combined = new Uint8Array([
    ...challenge.nonce,
    ...pinBytes
  ]);

  const hashBuffer = await crypto.subtle.digest('SHA-256', combined);
  const hashArray = new Uint8Array(hashBuffer);
  const hashHex = Array.from(hashArray)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');

  return {
    challengeId: challenge.challengeId,
    pinHash: hashHex,
    timestamp: Date.now()
  };
}

/**
 * 인증 응답 검증
 */
export async function verifyAuthResponse(
  response: AuthResponse,
  challenge: AuthChallenge,
  expectedPin: string
): Promise<boolean> {
  const expectedResponse = await createAuthResponse(challenge, expectedPin);

  // 타이밍 안전 비교 (30초 이내)
  const timeValid = Math.abs(response.timestamp - challenge.timestamp) < 30000;

  return response.pinHash === expectedResponse.pinHash &&
         response.challengeId === challenge.challengeId &&
         timeValid;
}
