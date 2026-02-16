/**
 * PBKDF2를 사용한 세션 키 파생
 *
 * ID/Password에서 암호화 키를 파생합니다.
 * 이 키는 메시지 암호화 등에 사용됩니다.
 */

/**
 * 자격증명에서 세션 키 파생 (PBKDF2)
 */
export async function deriveSessionKey(
  id: string,
  password: string
): Promise<Uint8Array> {
  const encoder = new TextEncoder();
  const credentials = encoder.encode(`${id}:${password}`);

  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    credentials,
    'PBKDF2',
    false,
    ['deriveKey']
  );

  // 솔트 (고정값)
  const salt = encoder.encode('family-messenger-salt-v1');

  const key = await crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: salt,
      iterations: 100000,
      hash: 'SHA-256'
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    true,
    ['encrypt', 'decrypt']
  );

  const exported = await crypto.subtle.exportKey('raw', key);
  return new Uint8Array(exported);
}
