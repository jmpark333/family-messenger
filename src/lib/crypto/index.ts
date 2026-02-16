// Web Crypto API E2E 암호화 구현
// ECDH P-256 키 교환 + AES-GCM 암호화

import type { KeyPair } from './types';

/**
 * ECDH P-256 키 쌍 생성
 */
export async function generateKeyPair(): Promise<KeyPair> {
  const keyPair = await crypto.subtle.generateKey(
    { name: 'ECDH', namedCurve: 'P-256' },
    true,
    ['deriveKey']
  );

  const publicKey = await crypto.subtle.exportKey('spki', keyPair.publicKey);
  const privateKey = await crypto.subtle.exportKey('pkcs8', keyPair.privateKey);

  return {
    publicKey: btoa(String.fromCharCode(...new Uint8Array(publicKey))),
    privateKey: btoa(String.fromCharCode(...new Uint8Array(privateKey))),
  };
}

/**
 * 메시지 암호화 (수신자 공개키로)
 */
export async function encryptMessage(
  message: string,
  recipientPublicKeyBase64: string
): Promise<string> {
  // 수신자 공개키 import
  const publicKeyBuffer = Uint8Array.from(
    atob(recipientPublicKeyBase64),
    c => c.charCodeAt(0)
  );
  const publicKey = await crypto.subtle.importKey(
    'spki',
    publicKeyBuffer,
    { name: 'ECDH', namedCurve: 'P-256' },
    false,
    []
  );

  // 일회용 키 쌍 생성 (Ephemeral key)
  const ephemeralKey = await crypto.subtle.generateKey(
    { name: 'ECDH', namedCurve: 'P-256' },
    true,
    ['deriveKey']
  );

  // 공유 키 파생 (ECDH)
  const sharedKey = await crypto.subtle.deriveKey(
    { name: 'ECDH', public: publicKey },
    ephemeralKey.privateKey,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt']
  );

  // 메시지 암호화
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encrypted = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    sharedKey,
    new TextEncoder().encode(message)
  );

  // 일회용 공개키 export
  const ephemeralPublicKey = await crypto.subtle.exportKey(
    'spki',
    ephemeralKey.publicKey
  );
  const ephemeralPublicKeyArray = new Uint8Array(ephemeralPublicKey);

  // 결합: ephemeralPublicKey + iv + ciphertext
  const combined = new Uint8Array(
    ephemeralPublicKeyArray.length + iv.length + encrypted.byteLength
  );
  combined.set(ephemeralPublicKeyArray);
  combined.set(iv, ephemeralPublicKeyArray.length);
  combined.set(new Uint8Array(encrypted), ephemeralPublicKeyArray.length + iv.length);

  return btoa(String.fromCharCode(...combined));
}

/**
 * 메시지 복호화 (자신의 개인키로)
 */
export async function decryptMessage(
  encryptedBase64: string,
  privateKeyBase64: string
): Promise<string> {
  // 개인키 import
  const privateKeyBuffer = Uint8Array.from(
    atob(privateKeyBase64),
    c => c.charCodeAt(0)
  );
  const privateKey = await crypto.subtle.importKey(
    'pkcs8',
    privateKeyBuffer,
    { name: 'ECDH', namedCurve: 'P-256' },
    false,
    ['deriveKey']
  );

  // 암호화된 데이터 파싱
  const combined = Uint8Array.from(
    atob(encryptedBase64),
    c => c.charCodeAt(0)
  );

  // P-256 공개키 크기는 약 91바이트 (ASN.1 DER 인코딩)
  const ephemeralPublicKeyArray = combined.slice(0, 91);
  const iv = combined.slice(91, 103); // 12 bytes
  const ciphertext = combined.slice(103);

  // 일회용 공개키 import
  const ephemeralPublicKey = await crypto.subtle.importKey(
    'spki',
    ephemeralPublicKeyArray,
    { name: 'ECDH', namedCurve: 'P-256' },
    false,
    []
  );

  // 공유 키 파생
  const sharedKey = await crypto.subtle.deriveKey(
    { name: 'ECDH', public: ephemeralPublicKey },
    privateKey,
    { name: 'AES-GCM', length: 256 },
    false,
    ['decrypt']
  );

  // 메시지 복호화
  const decrypted = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv },
    sharedKey,
    ciphertext
  );

  return new TextDecoder().decode(decrypted);
}
