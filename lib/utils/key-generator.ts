/**
 * 암호화 키 생성 유틸리티
 * 사전 공유 키(Pre-shared Key) 및 QR 코드 생성
 */

import type { FamilyKey, KeyExchangeData } from '@/types';

/**
 * 32바이트 사전 공유 키 생성 (AES-256용)
 */
export async function generateFamilyKey(): Promise<FamilyKey> {
  // 무작위 32바이트 키 생성
  const keyData = crypto.getRandomValues(new Uint8Array(32));

  // 키 지문(SHA-256) 생성
  const fingerprintBuffer = await crypto.subtle.digest('SHA-256', keyData);
  const fingerprintArray = new Uint8Array(fingerprintBuffer);

  // 16진수 문자열로 변환
  const fingerprint = Array.from(fingerprintArray)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join(':')
    .toUpperCase();

  const now = Date.now();

  return {
    keyId: crypto.randomUUID(),
    keyData,
    fingerprint,
    createdAt: now,
    // 1년 후 만료 (선택사항)
    expiresAt: now + 365 * 24 * 60 * 60 * 1000,
  };
}

/**
 * QR 코드용 데이터 직렬화
 */
export function serializeKeyExchange(data: KeyExchangeData): string {
  const obj = {
    v: 1, // 버전
    kid: data.familyKey.keyId,
    k: Array.from(data.familyKey.keyData)
      .map((b) => b.toString(16).padStart(2, '0'))
      .join(''),
    fp: data.familyKey.fingerprint,
    pid: data.peerId,
  };

  return JSON.stringify(obj);
}

/**
 * QR 코드 데이터 복직렬화
 */
export function deserializeKeyExchange(json: string): KeyExchangeData {
  try {
    const obj = JSON.parse(json);

    if (obj.v !== 1) {
      throw new Error('지원하지 않는 버전입니다');
    }

    const keyData = new Uint8Array(
      obj.k.match(/.{1,2}/g)!.map((byte: string) => parseInt(byte, 16))
    );

    const familyKey: FamilyKey = {
      keyId: obj.kid,
      keyData,
      fingerprint: obj.fp,
      createdAt: Date.now(),
      expiresAt: Date.now() + 365 * 24 * 60 * 60 * 1000,
    };

    return {
      familyKey,
      publicKey: new Uint8Array(0), // 초기 구현에서는 미사용
      peerId: obj.pid,
    };
  } catch (error) {
    throw new Error('키 데이터 복직렬화 실패: ' + (error as Error).message);
  }
}

/**
 * 키 지문 검증
 */
export async function verifyKeyFingerprint(
  keyData: Uint8Array,
  expectedFingerprint: string
): Promise<boolean> {
  const fingerprintBuffer = await crypto.subtle.digest('SHA-256', keyData);
  const fingerprintArray = new Uint8Array(fingerprintBuffer);

  const actualFingerprint = Array.from(fingerprintArray)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join(':')
    .toUpperCase();

  return actualFingerprint === expectedFingerprint;
}

/**
 * 내 Peer ID 생성
 */
export function generatePeerId(): string {
  // 무작위 ID 생성
  const array = new Uint8Array(8);
  crypto.getRandomValues(array);
  return Array.from(array)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

/**
 * 키 데이터를 Base64로 인코딩 (저장/전송용)
 */
export function encodeKeyData(data: Uint8Array): string {
  const binary = Array.from(data)
    .map((b) => String.fromCharCode(b))
    .join('');
  return btoa(binary);
}

/**
 * Base64를 키 데이터로 디코딩
 */
export function decodeKeyData(encoded: string): Uint8Array {
  const binary = atob(encoded);
  return new Uint8Array(Array.from(binary).map((c) => c.charCodeAt(0)));
}

/**
 * 안전한 키 비교 (타이밍 안전 공격 방지)
 */
export async function secureCompareKeys(
  key1: Uint8Array,
  key2: Uint8Array
): Promise<boolean> {
  if (key1.length !== key2.length) {
    return false;
  }

  // XOR를 통한 상수 시간 비교
  let result = 0;
  for (let i = 0; i < key1.length; i++) {
    result |= key1[i] ^ key2[i];
  }

  return result === 0;
}

/**
 * 키 만료 검사
 */
export function isKeyExpired(key: FamilyKey): boolean {
  return Date.now() > key.expiresAt;
}

/**
 * 키 수명 계산 (일 단위)
 */
export function getKeyDaysRemaining(key: FamilyKey): number {
  const msRemaining = key.expiresAt - Date.now();
  return Math.max(0, Math.floor(msRemaining / (24 * 60 * 60 * 1000)));
}

/**
 * 키 회전 권장 시점 계산
 */
export function shouldRotateKey(key: FamilyKey): boolean {
  const daysRemaining = getKeyDaysRemaining(key);
  return daysRemaining < 30; // 30일 미만일 경우 권장
}
