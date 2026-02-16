// Web Crypto API E2E 암호화 타입 정의

export interface KeyPair {
  publicKey: string;
  privateKey: string;
}

export interface EncryptedMessage {
  ephemeralPublicKey: string;
  iv: string;
  ciphertext: string;
}
