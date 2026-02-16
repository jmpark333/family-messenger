// 저장소 레이어 - 개발용 인메모리 저장소
// 프로덕션에서는 Vercel KV로 교체 필요

import type { Family, Message } from './types';

// 개발용 인메모리 저장소
const families = new Map<string, Family>();
const messagesMap = new Map<string, Message[]>();

export class Storage {
  /**
   * 새 가족 생성
   */
  async createFamily(
    name: string,
    authCode: string,
    memberId: string,
    publicKey: string
  ): Promise<Family> {
    const familyId = crypto.randomUUID();
    const family: Family = {
      id: familyId,
      authCode,
      members: [{ id: memberId, name, publicKey }],
      createdAt: Date.now(),
    };

    families.set(familyId, family);
    return family;
  }

  /**
   * 가족 정보 조회
   */
  async getFamily(familyId: string): Promise<Family | null> {
    return families.get(familyId) || null;
  }

  /**
   * 가족에 멤버 추가 (최대 4명)
   */
  async addMember(
    familyId: string,
    memberId: string,
    name: string,
    publicKey: string
  ): Promise<boolean> {
    const family = families.get(familyId);
    if (!family || family.members.length >= 4) {
      return false;
    }

    family.members.push({ id: memberId, name, publicKey });
    families.set(familyId, family);
    return true;
  }

  /**
   * 메시지 저장
   */
  async saveMessage(message: Message): Promise<void> {
    const familyMessages = messagesMap.get(message.familyId) || [];
    familyMessages.push(message);

    // 최근 1000개만 유지
    if (familyMessages.length > 1000) {
      familyMessages.splice(0, familyMessages.length - 1000);
    }

    messagesMap.set(message.familyId, familyMessages);
  }

  /**
   * 메시지 조회 (since 이후의 메시지)
   */
  async getMessages(familyId: string, since?: number): Promise<Message[]> {
    const familyMessages = messagesMap.get(familyId) || [];

    if (since !== undefined) {
      return familyMessages.filter(m => m.timestamp > since);
    }

    return familyMessages;
  }

  /**
   * 개발용: 모든 데이터 초기화
   */
  async clearAll(): Promise<void> {
    families.clear();
    messagesMap.clear();
  }
}

export const storage = new Storage();
