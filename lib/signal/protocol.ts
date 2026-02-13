/**
 * 가족 전용 메신저 앱
 *
 * 이 앱은 Web Crypto API를 활용하여 간단한 암호화를 구현합니다.
 * P2P 통신은 별도의 시그널링 서버 없이 완전 P2P로 동작합니다.
 */

import type { EncryptedMessage } from '@/types';

// ============ 키 생성 ============

/**
 * E2E 암호화를 위한 식별 키 쌍 생성
 * X25519 키 교환 알고리즘 사용
 */
export async function generateIdentityKeyPair(): Promise<{
  publicKey: Uint8Array;
  privateKey: Uint8Array;
}> {
  const keyPair = await crypto.subtle.generateKey(
    {
      name: 'X25519',
    },
    true,
    ['deriveKey', 'deriveBits']
  );

  const publicKeyBuffer = await crypto.subtle.exportKey('raw', keyPair.publicKey);
  const privateKeyBuffer = await crypto.subtle.exportKey('pkcs8', keyPair.privateKey);

  return {
    publicKey: new Uint8Array(publicKeyBuffer),
    privateKey: new Uint8Array(privateKeyBuffer),
  };
}

// ============ 암호화 유틸리티 ============

/**
 * AES-256-GCM을 사용한 메시지 암호화
 */
export async function encryptMessage(
  plaintext: string,
  key: Uint8Array
): Promise<EncryptedMessage> {
  // Web Crypto API로 키 임포트
  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    key.buffer as BufferSource,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt']
  );

  // 무작위 난수 생성
  const nonce = crypto.getRandomValues(new Uint8Array(12));

  // 텍스트를 바이트로 변환
  const plaintextBytes = new TextEncoder().encode(plaintext);

  // 암호화
  const encrypted = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv: nonce },
    cryptoKey,
    plaintextBytes
  );

  // 결과 추출
  const encryptedArray = new Uint8Array(encrypted);
  const tag = encryptedArray.slice(-16);
  const ciphertext = encryptedArray.slice(0, -16);

  return {
    ciphertext: new Uint8Array([...ciphertext, ...tag]),
    type: 1,
    registrationId: 0,
  };
}

/**
 * AES-256-GCM을 사용한 메시지 복호화
 */
export async function decryptMessage(
  ciphertext: Uint8Array,
  tag: Uint8Array,
  key: Uint8Array
): Promise<string> {
  // 태그와 ciphertext 결합
  const encrypted = new Uint8Array([...ciphertext, ...tag]);

  // Web Crypto API로 키 임포트
  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    key.buffer as BufferSource,
    { name: 'AES-GCM', length: 256 },
    false,
    ['decrypt']
  );

  // 복호화
  const decryptedBytes = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv: new Uint8Array(ciphertext.slice(0, 12)) },
    cryptoKey,
    encrypted
  );

  // 텍스트로 변환
  const decrypted = new TextDecoder().decode(decryptedBytes);
  return decrypted;
}
