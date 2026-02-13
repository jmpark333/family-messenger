/**
 * IndexedDB 기반 암호화 키 저장소
 * 모든 키는 암호화된 상태로 저장됩니다
 */

import type { FamilyKey, IdentityKeyPair, SignalSession, KeyPairType } from '@/types';

const DB_NAME = 'FamilyMessengerSecure';
const DB_VERSION = 1;
const STORE_KEYS = 'keys';
const STORE_SESSIONS = 'sessions';
const STORE_MESSAGES = 'messages';

// IndexedDB 열기
function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(new Error('IndexedDB 열기 실패'));

    request.onsuccess = () => resolve(request.result);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;

      // 키 저장소 생성
      if (!db.objectStoreNames.contains(STORE_KEYS)) {
        const keyStore = db.createObjectStore(STORE_KEYS, { keyPath: 'id' });
        keyStore.createIndex('type', 'type', { unique: false });
      }

      // 세션 저장소 생성
      if (!db.objectStoreNames.contains(STORE_SESSIONS)) {
        const sessionStore = db.createObjectStore(STORE_SESSIONS, { keyPath: 'sessionId' });
        sessionStore.createIndex('recipientId', 'recipientId', { unique: false });
      }

      // 메시지 저장소 생성
      if (!db.objectStoreNames.contains(STORE_MESSAGES)) {
        const messageStore = db.createObjectStore(STORE_MESSAGES, { keyPath: 'id' });
        messageStore.createIndex('timestamp', 'timestamp', { unique: false });
      }
    };
  });
}

// DB 인스턴스 캐싱
let dbInstance: IDBDatabase | null = null;

async function getDB(): Promise<IDBDatabase> {
  if (!dbInstance) {
    dbInstance = await openDB();
  }
  return dbInstance;
}

// ============ 암호화/복호화 유틸리티 ============

/**
 * Web Crypto API를 사용한 키 파생 암호화
 * @param data 암호화할 데이터
 * @param key 암호화 키 (32 bytes)
 * @returns 암호화된 데이터
 */
async function encryptKey(data: Uint8Array, key: Uint8Array): Promise<Uint8Array> {
  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    key,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt']
  );

  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encrypted = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    cryptoKey,
    data
  );

  // IV + 암호화된 데이터 결합
  const result = new Uint8Array(iv.length + encrypted.byteLength);
  result.set(iv);
  result.set(new Uint8Array(encrypted), iv.length);
  return result;
}

/**
 * Web Crypto API를 사용한 키 파생 복호화
 * @param encryptedData 암호화된 데이터 (IV + ciphertext)
 * @param key 복호화 키 (32 bytes)
 * @returns 복호화된 데이터
 */
async function decryptKey(encryptedData: Uint8Array, key: Uint8Array): Promise<Uint8Array> {
  const iv = encryptedData.slice(0, 12);
  const ciphertext = encryptedData.slice(12);

  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    key,
    { name: 'AES-GCM', length: 256 },
    false,
    ['decrypt']
  );

  const decrypted = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv },
    cryptoKey,
    ciphertext
  );

  return new Uint8Array(decrypted);
}

// ============ 저장소 클래스 ============

export class SecureKeyStore {
  private masterKey: Uint8Array | null = null;

  constructor() {
    this.init();
  }

  private async init() {
    // 세션 시작 시 마스터 키 생성 (메모리에만 저장)
    this.masterKey = crypto.getRandomValues(new Uint8Array(32));
  }

  // ============ Family Key 관리 ============

  async saveFamilyKey(familyKey: FamilyKey): Promise<void> {
    const db = await getDB();
    const tx = db.transaction(STORE_KEYS, 'readwrite');
    const store = tx.objectStore(STORE_KEYS);

    const encryptedKey = await encryptKey(familyKey.keyData, this.masterKey!);

    await new Promise<void>((resolve, reject) => {
      const request = store.put({
        id: 'family-key',
        type: 'family-key',
        data: encryptedKey,
        fingerprint: familyKey.fingerprint,
        createdAt: familyKey.createdAt,
        expiresAt: familyKey.expiresAt,
      });

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async getFamilyKey(): Promise<FamilyKey | null> {
    const db = await getDB();
    const tx = db.transaction(STORE_KEYS, 'readonly');
    const store = tx.objectStore(STORE_KEYS);

    return new Promise((resolve, reject) => {
      const request = store.get('family-key');

      request.onsuccess = async () => {
        if (!request.result) {
          resolve(null);
          return;
        }

        try {
          const decryptedKey = await decryptKey(request.result.data, this.masterKey!);
          resolve({
            keyId: request.result.id,
            keyData: decryptedKey,
            fingerprint: request.result.fingerprint,
            createdAt: request.result.createdAt,
            expiresAt: request.result.expiresAt,
          });
        } catch (error) {
          reject(error);
        }
      };

      request.onerror = () => reject(request.error);
    });
  }

  // ============ Identity Key 관리 ============

  async saveIdentityKey(keyPair: IdentityKeyPair): Promise<void> {
    const db = await getDB();
    const tx = db.transaction(STORE_KEYS, 'readwrite');
    const store = tx.objectStore(STORE_KEYS);

    const encryptedPub = await encryptKey(keyPair.pubKey, this.masterKey!);
    const encryptedPriv = await encryptKey(keyPair.privKey, this.masterKey!);

    await new Promise<void>((resolve, reject) => {
      const request = store.put({
        id: 'identity-key',
        type: 'identity-key',
        pubKey: encryptedPub,
        privKey: encryptedPriv,
      });

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async getIdentityKey(): Promise<IdentityKeyPair | null> {
    const db = await getDB();
    const tx = db.transaction(STORE_KEYS, 'readonly');
    const store = tx.objectStore(STORE_KEYS);

    return new Promise((resolve, reject) => {
      const request = store.get('identity-key');

      request.onsuccess = async () => {
        if (!request.result) {
          resolve(null);
          return;
        }

        try {
          const pubKey = await decryptKey(request.result.pubKey, this.masterKey!);
          const privKey = await decryptKey(request.result.privKey, this.masterKey!);
          resolve({ pubKey, privKey });
        } catch (error) {
          reject(error);
        }
      };

      request.onerror = () => reject(request.error);
    });
  }

  // ============ 세션 관리 ============

  async saveSession(session: SignalSession): Promise<void> {
    const db = await getDB();
    const tx = db.transaction(STORE_SESSIONS, 'readwrite');
    const store = tx.objectStore(STORE_SESSIONS);

    const serializedState = JSON.stringify(session.state);

    await new Promise<void>((resolve, reject) => {
      const request = store.put({
        ...session,
        state: serializedState,
        updatedAt: Date.now(),
      });

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async getSession(recipientId: string): Promise<SignalSession | null> {
    const db = await getDB();
    const tx = db.transaction(STORE_SESSIONS, 'readonly');
    const store = tx.objectStore(STORE_SESSIONS);

    return new Promise((resolve, reject) => {
      const index = store.index('recipientId');
      const request = index.get(recipientId);

      request.onsuccess = () => {
        if (!request.result) {
          resolve(null);
          return;
        }

        resolve({
          ...request.result,
          state: JSON.parse(request.result.state),
        });
      };

      request.onerror = () => reject(request.error);
    });
  }

  async deleteSession(sessionId: string): Promise<void> {
    const db = await getDB();
    const tx = db.transaction(STORE_SESSIONS, 'readwrite');
    const store = tx.objectStore(STORE_SESSIONS);

    await new Promise<void>((resolve, reject) => {
      const request = store.delete(sessionId);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  // ============ 유틸리티 ============

  async clearAll(): Promise<void> {
    const db = await getDB();

    // 모든 저장소 클리어
    const storeNames = [STORE_KEYS, STORE_SESSIONS, STORE_MESSAGES];

    for (const storeName of storeNames) {
      await new Promise<void>((resolve, reject) => {
        const tx = db.transaction(storeName, 'readwrite');
        const store = tx.objectStore(storeName);
        const request = store.clear();

        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      });
    }
  }

  // 데이터베이스 닫기 (앱 종료 시)
  async close(): Promise<void> {
    if (dbInstance) {
      dbInstance.close();
      dbInstance = null;
    }
  }
}

// 싱글톤 인스턴스
let keyStoreInstance: SecureKeyStore | null = null;

export function getKeyStore(): SecureKeyStore {
  if (!keyStoreInstance) {
    keyStoreInstance = new SecureKeyStore();
  }
  return keyStoreInstance;
}
