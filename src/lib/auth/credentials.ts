/**
 * 자격증명 검증
 *
 * 하드코딩된 기본 자격증명:
 * - ID: family
 * - Password: happy
 * - 추가비번: 327024
 */

import type { AuthCredentials } from '@/types';

const DEFAULT_CREDENTIALS = {
  ID: 'family',
  PASSWORD: 'happy',
  ADDITIONAL_PIN: '327024'
};

/**
 * ID/Password 검증
 */
export async function verifyCredentials(
  id: string,
  password: string
): Promise<boolean> {
  return id === DEFAULT_CREDENTIALS.ID &&
         password === DEFAULT_CREDENTIALS.PASSWORD;
}

/**
 * 추가비번 검증
 */
export async function verifyAdditionalPin(
  pin: string,
  storedHash?: string
): Promise<boolean> {
  if (storedHash) {
    // 저장된 해시와 비교
    return await hashPin(pin) === storedHash;
  }
  // 기본 PIN 검증
  return pin === DEFAULT_CREDENTIALS.ADDITIONAL_PIN;
}

/**
 * PIN 해시 생성 (SHA-256)
 */
export async function hashPin(pin: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(pin);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

/**
 * 기본 자격증명 반환
 */
export function getDefaultCredentials(): typeof DEFAULT_CREDENTIALS {
  return { ...DEFAULT_CREDENTIALS };
}
