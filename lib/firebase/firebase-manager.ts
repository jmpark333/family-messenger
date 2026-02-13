/**
 * Firebase Manager - Firebase Realtime Database를 사용한 메시징 관리
 * 
 * 메시지 동기화, presence 관리, 타이핑 인디케이터等功能
 */

import { ref, set, push, onValue, onDisconnect, serverTimestamp, remove, get } from 'firebase/database';
import { getFirebaseDatabase, initFirebase } from './config';
import type { DataMessage, PeerInfo } from '../../types';

// Firebase Manager 콜백 타입
export interface FirebaseManagerCallbacks {
  onMessage?: (message: DataMessage) => void;
  onPresenceChange?: (userId: string, online: boolean) => void;
  onTypingChange?: (userId: string, isTyping: boolean) => void;
  onError?: (error: Error) => void;
}

class FirebaseManager {
  private callbacks: FirebaseManagerCallbacks;
  private database = getFirebaseDatabase();
  private familyId: string = '';
  private userId: string = '';
  private userName: string = '';
  private messageRef: any = null;
  private presenceRef: any = null;
  private typingRef: any = null;
  private isInitialized: boolean = false;

  constructor(callbacks: FirebaseManagerCallbacks) {
    this.callbacks = callbacks;
    initFirebase();
  }

  /**
   * 가족 방に参加
   */
  joinFamily(familyId: string, userId: string, userName: string): void {
    this.familyId = familyId;
    this.userId = userId;
    this.userName = userName;

    if (this.isInitialized) {
      this.cleanup();
    }

    // Presence 설정 (온라인 상태 관리)
    this.setupPresence();

    // 메시지 리스너 설정
    this.setupMessageListener();

    // 타이핑 인디케이터 리스너 설정
    this.setupTypingListener();

    this.isInitialized = true;
    console.log('[FirebaseManager] Joined family:', familyId, 'as', userId);
  }

  /**
   * Presence 설정 (온라인 상태)
   */
  private setupPresence(): void {
    const presencePath = `families/${this.familyId}/presence/${this.userId}`;
    this.presenceRef = ref(this.database, presencePath);

    // 온라인 상태 설정
    const connectedRef = ref(this.database, '.info/connected');
    onValue(connectedRef, (snapshot) => {
      if (snapshot.val() === true) {
        // 연결됨 - 온라인 상태 설정
        set(this.presenceRef, {
          name: this.userName,
          online: true,
          lastSeen: serverTimestamp(),
        });

        // 연결 해제 시 오프라인으로 설정
        onDisconnect(this.presenceRef).set({
          name: this.userName,
          online: false,
          lastSeen: serverTimestamp(),
        });
      }
    });

    // 다른 사용자의 presence 변경 감지
    const allPresenceRef = ref(this.database, `families/${this.familyId}/presence`);
    onValue(allPresenceRef, (snapshot) => {
      const presenceData = snapshot.val();
      if (presenceData) {
        Object.entries(presenceData).forEach(([uid, data]: [string, any]) => {
          if (uid !== this.userId && this.callbacks.onPresenceChange) {
            this.callbacks.onPresenceChange(uid, data.online === true);
          }
        });
      }
    });
  }

  /**
   * 메시지 리스너 설정
   */
  private setupMessageListener(): void {
    const messagesPath = `families/${this.familyId}/messages`;
    this.messageRef = ref(this.database, messagesPath);

    onValue(this.messageRef, (snapshot) => {
      const messages = snapshot.val();
      if (messages && this.callbacks.onMessage) {
        Object.entries(messages).forEach(([id, data]: [string, any]) => {
          const message: DataMessage = {
            id,
            type: data.type || 'text',
            senderId: data.senderId,
            timestamp: data.timestamp,
            data: data.content,
            encrypted: data.encrypted || false,
          };
          this.callbacks.onMessage!(message);
        });
      }
    });
  }

  /**
   * 타이핑 인디케이터 리스너 설정
   */
  private setupTypingListener(): void {
    const typingPath = `families/${this.familyId}/typing`;
    this.typingRef = ref(this.database, typingPath);

    onValue(this.typingRef, (snapshot) => {
      const typingData = snapshot.val();
      if (typingData && this.callbacks.onTypingChange) {
        Object.entries(typingData).forEach(([uid, isTyping]: [string, any]) => {
          if (uid !== this.userId) {
            this.callbacks.onTypingChange!(uid, isTyping === true);
          }
        });
      }
    });
  }

  /**
   * 메시지 전송
   */
  async sendMessage(content: string): Promise<void> {
    const messagesPath = `families/${this.familyId}/messages`;
    const messageRef = ref(this.database, messagesPath);
    const newMessageRef = push(messageRef);

    await set(newMessageRef, {
      type: 'text',
      senderId: this.userId,
      senderName: this.userName,
      content,
      timestamp: serverTimestamp(),
      encrypted: false,
    });

    console.log('[FirebaseManager] Message sent:', content);
  }

  /**
   * 이미지 전송
   */
  async sendImage(imageData: string, fileName: string): Promise<void> {
    const messagesPath = `families/${this.familyId}/messages`;
    const messageRef = ref(this.database, messagesPath);
    const newMessageRef = push(messageRef);

    await set(newMessageRef, {
      type: 'image',
      senderId: this.userId,
      senderName: this.userName,
      content: imageData,
      fileName,
      timestamp: serverTimestamp(),
      encrypted: false,
    });

    console.log('[FirebaseManager] Image sent:', fileName);
  }

  /**
   * PDF 전송
   */
  async sendPdf(pdfData: string, fileName: string): Promise<void> {
    const messagesPath = `families/${this.familyId}/messages`;
    const messageRef = ref(this.database, messagesPath);
    const newMessageRef = push(messageRef);

    await set(newMessageRef, {
      type: 'pdf',
      senderId: this.userId,
      senderName: this.userName,
      content: pdfData,
      fileName,
      timestamp: serverTimestamp(),
      encrypted: false,
    });

    console.log('[FirebaseManager] PDF sent:', fileName);
  }

  /**
   * 타이핑 상태 설정
   */
  setTyping(isTyping: boolean): void {
    const typingPath = `families/${this.familyId}/typing/${this.userId}`;
    const typingRef = ref(this.database, typingPath);

    if (isTyping) {
      set(typingRef, true);
      // 3초 후 자동 해제
      setTimeout(() => {
        remove(typingRef);
      }, 3000);
    } else {
      remove(typingRef);
    }
  }

  /**
   * 모든 메시지 삭제
   */
  async clearMessages(): Promise<void> {
    const messagesPath = `families/${this.familyId}/messages`;
    const messagesRef = ref(this.database, messagesPath);
    await remove(messagesRef);
    console.log('[FirebaseManager] Messages cleared');
  }

  /**
   * 리소스 정리
   */
  private cleanup(): void {
    if (this.presenceRef) {
      const presenceRef = ref(this.database, `families/${this.familyId}/presence/${this.userId}`);
      remove(presenceRef);
    }
    if (this.typingRef) {
      const typingPath = `families/${this.familyId}/typing/${this.userId}`;
      const typingRef = ref(this.database, typingPath);
      remove(typingRef);
    }
  }

  /**
   * 파괴
   */
  destroy(): void {
    this.cleanup();
    this.isInitialized = false;
    console.log('[FirebaseManager] Destroyed');
  }
}

// Singleton instance
let firebaseManager: FirebaseManager | null = null;

/**
 * Firebase Manager 초기화
 */
export function initFirebaseManager(callbacks: FirebaseManagerCallbacks): FirebaseManager {
  if (firebaseManager) {
    firebaseManager.destroy();
  }
  firebaseManager = new FirebaseManager(callbacks);
  return firebaseManager;
}

/**
 * Firebase Manager 가져오기
 */
export function getFirebaseManager(): FirebaseManager | null {
  return firebaseManager;
}

/**
 * Firebase Manager 파괴
 */
export function destroyFirebaseManager(): void {
  if (firebaseManager) {
    firebaseManager.destroy();
    firebaseManager = null;
  }
}
