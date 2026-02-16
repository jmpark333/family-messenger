import Dexie, { Table } from 'dexie';
import type { MessageSchema, FileAttachment, FamilySchema, MemberSchema } from './schema';

// 실제 IndexedDB 접근 테스트를 위한 플래그
let dbAvailabilityChecked = false;
let isDBFullyAvailable = false;

/**
 * IndexedDB 사용 가능 여부를 확인합니다.
 * 단순히 API 존재 여부가 아니라 실제 접근을 시도해봅니다.
 */
async function checkIndexedDBAvailability(): Promise<boolean> {
  if (typeof window === 'undefined') return false;

  // 이미 확인했다면 결과를 반환
  if (dbAvailabilityChecked) return isDBFullyAvailable;

  try {
    // 실제 데이터베이스 접근 시도
    await new Promise<void>((resolve, reject) => {
      const request = window.indexedDB.open('_db_test_');
      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        request.result.close();
        // 테스트용 DB 삭제
        window.indexedDB.deleteDatabase('_db_test_');
        resolve();
      };
    });

    isDBFullyAvailable = true;
    dbAvailabilityChecked = true;
    return true;
  } catch (error) {
    // 더 상세한 에러 정보 제공
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.warn('IndexedDB 접근 불가:', errorMessage);

    // 사용자에게 더 명확한 안내
    if (errorMessage.includes('storage') || errorMessage.includes('allowed')) {
      console.error('IndexedDB 접근이 브라우저 보안 설정에 의해 차단되었습니다.');
      console.error('해결 방법:');
      console.error('1. 브라우저 설정에서 개인정보 보호/써드파티 설정을 확인하세요');
      console.error('2. 사생성 모드에서는 IndexedDB 접근을 허용해야 합니다');
      console.error('3. 일반 브라우징 모드(시크릿 모드 등)에서 다시 시도하세요');
    }

    isDBFullyAvailable = false;
    dbAvailabilityChecked = true;
    return false;
  }
}

/**
 * Family Messenger IndexedDB 데이터베이스 클래스
 * Dexie를 사용하여 IndexedDB를 추상화합니다.
 */
export class FamilyMessengerDB extends Dexie {
  messages!: Table<MessageSchema, string>;
  files!: Table<FileAttachment, string>;
  family!: Table<FamilySchema, string>;
  members!: Table<MemberSchema, string>;

  constructor() {
    super('FamilyMessengerDB');

    this.version(1).stores({
      messages: 'id, timestamp, senderId',
      files: 'id, messageId',
      family: 'id',
      members: 'id, name'
    });
  }
}

/**
 * 데이터베이스가 사용 가능한지 비동기로 확인합니다.
 */
export async function isDatabaseAvailable(): Promise<boolean> {
  return await checkIndexedDBAvailability();
}

export const db = new FamilyMessengerDB();

/**
 * 데이터베이스 헬퍼 함수들
 * 모든 작업은 에러 처리와 함께 제공됩니다.
 */
export const dbHelpers = {
  // Messages

  /**
   * 메시지를 IndexedDB에 추가합니다.
   * @param message - 저장할 메시지 객체
   * @throws {Error} 데이터베이스 저장 실패 시 (quota exceeded, transaction error 등)
   */
  async addMessage(message: MessageSchema): Promise<void> {
    try {
      await db.messages.add(message);
    } catch (error) {
      throw new Error(`메시지 저장 실패: ${error}`);
    }
  },

  /**
   * 지정된 개수의 최신 메시지를 가져옵니다.
   * @param limit - 가져올 메시지 개수 (기본값: 100)
   * @param before - 이 시간보다 이전의 메시지만 가져옵니다 (옵션)
   * @returns 내림차순으로 정렬된 메시지 목록
   * @throws {Error} 데이터베이스 조회 실패 시
   */
  async getMessages(limit: number = 100, before?: number): Promise<MessageSchema[]> {
    try {
      let query = db.messages.orderBy('timestamp').reverse();
      if (before) {
        query = query.filter((m: MessageSchema) => m.timestamp < before);
      }
      return await query.limit(limit).toArray();
    } catch (error) {
      throw new Error(`메시지 조회 실패: ${error}`);
    }
  },

  /**
   * 메시지의 상태를 업데이트합니다.
   * @param id - 업데이트할 메시지 ID
   * @param status - 새로운 상태 ('pending' | 'sent' | 'delivered' | 'failed')
   * @throws {Error} 데이터베이스 업데이트 실패 시
   */
  async updateMessageStatus(id: string, status: MessageSchema['status']): Promise<void> {
    try {
      await db.messages.update(id, { status });
    } catch (error) {
      throw new Error(`메시지 상태 업데이트 실패: ${error}`);
    }
  },

  /**
   * 모든 메시지를 삭제합니다.
   * @throws {Error} 데이터베이스 삭제 실패 시
   */
  async clearMessages(): Promise<void> {
    try {
      await db.messages.clear();
    } catch (error) {
      throw new Error(`메시지 전체 삭제 실패: ${error}`);
    }
  },

  // Files

  /**
   * 파일 첨부 정보를 추가합니다.
   * @param file - 저장할 파일 첨부 객체
   * @throws {Error} 데이터베이스 저장 실패 시
   */
  async addFile(file: FileAttachment): Promise<void> {
    try {
      await db.files.add(file);
    } catch (error) {
      throw new Error(`파일 정보 저장 실패: ${error}`);
    }
  },

  /**
   * ID로 파일 첨부 정보를 조회합니다.
   * @param id - 조회할 파일 ID
   * @returns 파일 첨부 정보 또는 undefined (존재하지 않는 경우)
   * @throws {Error} 데이터베이스 조회 실패 시
   */
  async getFile(id: string): Promise<FileAttachment | undefined> {
    try {
      return await db.files.get(id);
    } catch (error) {
      throw new Error(`파일 정보 조회 실패: ${error}`);
    }
  },

  // Family

  /**
   * 가족 정보를 저장합니다 (있으면 업데이트).
   * @param family - 저장할 가족 정보 객체
   * @throws {Error} 데이터베이스 저장 실패 시
   */
  async saveFamily(family: FamilySchema): Promise<void> {
    try {
      await db.family.put(family);
    } catch (error) {
      throw new Error(`가족 정보 저장 실패: ${error}`);
    }
  },

  /**
   * 저장된 가족 정보를 조회합니다.
   * @returns 가족 정보 또는 undefined (저장된 정보가 없는 경우)
   * @throws {Error} 데이터베이스 조회 실패 시
   */
  async getFamily(): Promise<FamilySchema | undefined> {
    try {
      return await db.family.toCollection().first();
    } catch (error) {
      throw new Error(`가족 정보 조회 실패: ${error}`);
    }
  },

  /**
   * 가족 정보를 삭제합니다.
   * @throws {Error} 데이터베이스 삭제 실패 시
   */
  async clearFamily(): Promise<void> {
    try {
      await db.family.clear();
    } catch (error) {
      throw new Error(`가족 정보 삭제 실패: ${error}`);
    }
  },

  // Members

  /**
   * 멤버 정보를 추가하거나 업데이트합니다.
   * @param member - 저장할 멤버 정보 객체
   * @throws {Error} 데이터베이스 저장 실패 시
   */
  async addMember(member: MemberSchema): Promise<void> {
    try {
      await db.members.put(member);
    } catch (error) {
      throw new Error(`멤버 정보 저장 실패: ${error}`);
    }
  },

  /**
   * ID로 멤버 정보를 조회합니다.
   * @param id - 조회할 멤버 ID
   * @returns 멤버 정보 또는 undefined (존재하지 않는 경우)
   * @throws {Error} 데이터베이스 조회 실패 시
   */
  async getMember(id: string): Promise<MemberSchema | undefined> {
    try {
      return await db.members.get(id);
    } catch (error) {
      throw new Error(`멤버 정보 조회 실패: ${error}`);
    }
  },

  /**
   * 멤버 정보를 부분적으로 업데이트합니다.
   * @param id - 업데이트할 멤버 ID
   * @param updates - 업데이트할 필드들
   * @throws {Error} 데이터베이스 업데이트 실패 시
   */
  async updateMember(id: string, updates: Partial<MemberSchema>): Promise<void> {
    try {
      await db.members.update(id, updates);
    } catch (error) {
      throw new Error(`멤버 정보 업데이트 실패: ${error}`);
    }
  },

  /**
   * 모든 멤버 정보를 조회합니다.
   * @returns 멤버 목록
   * @throws {Error} 데이터베이스 조회 실패 시
   */
  async getAllMembers(): Promise<MemberSchema[]> {
    try {
      return await db.members.toArray();
    } catch (error) {
      throw new Error(`멤버 목록 조회 실패: ${error}`);
    }
  },

  /**
   * 모든 멤버 정보를 삭제합니다.
   * @throws {Error} 데이터베이스 삭제 실패 시
   */
  async clearMembers(): Promise<void> {
    try {
      await db.members.clear();
    } catch (error) {
      throw new Error(`멤버 전체 삭제 실패: ${error}`);
    }
  }
};
