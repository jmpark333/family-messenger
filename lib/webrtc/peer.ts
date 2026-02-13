/**
 * WebRTC 기반 P2P 통신 관리자
 *
 * 이 구현에서는 시그널링 없이도 동작하도록 설계했습니다.
 * 실제 배포에서는 최소한의 시그널링 서버가 필요할 수 있습니다.
 */

import Peer, { DataConnection, MediaConnection } from 'peerjs';
import type { PeerInfo, DataMessage } from '@/types';
import { useChatStore } from '@/stores/chat-store';

// 공용 STUN 서버
const ICE_SERVERS = [
  { urls: 'stun:stun.l.google.com:19302' },
  { urls: 'stun:stun1.l.google.com:19302' },
  { urls: 'stun:stun2.l.google.com:19302' },
  { urls: 'stun:stun3.l.google.com:19302' },
  { urls: 'stun:stun4.l.google.com:19302' },
];

export interface P2PConfig {
  peerId?: string;
  debug?: boolean;
}

export interface P2PEvents {
  onPeerConnected: (peer: PeerInfo) => void;
  onPeerDisconnected: (peerId: string) => void;
  onMessage: (message: DataMessage) => void;
  onError: (error: Error) => void;
}

/**
 * P2P 통신 관리자
 */
export class P2PManager {
  private peer: Peer | null = null;
  private connections: Map<string, DataConnection> = new Map();
  private config: P2PConfig;
  private events: P2PEvents;
  private reconnectAttempts: Map<string, number> = new Map();
  private maxReconnectAttempts = 5;

  constructor(config: P2PConfig, events: P2PEvents) {
    this.config = config;
    this.events = events;

    if (typeof window === 'undefined') {
      return; // SSR 방지
    }

    this.init();
  }

  /**
   * PeerJS 초기화
   */
  private async init() {
    try {
      this.peer = new Peer(this.config.peerId, {
        debug: this.config.debug || false,
        config: {
          iceServers: ICE_SERVERS,
        },
      });

      this.setupPeerEvents();
    } catch (error) {
      this.events.onError(error as Error);
    }
  }

  /**
   * Peer 이벤트 핸들러 설정
   */
  private setupPeerEvents() {
    if (!this.peer) return;

    // Peer가 준비됨
    this.peer.on('open', (peerId) => {
      console.log('[P2P] My Peer ID:', peerId);
      useChatStore.getState().setMyInfo(peerId, '나');
    });

    // 연결 수락
    this.peer.on('connection', (conn) => {
      console.log('[P2P] Incoming connection from:', conn.peer);
      this.setupConnectionEvents(conn);
    });

    // 에러 처리
    this.peer.on('error', (error) => {
      console.error('[P2P] Peer error:', error);
      this.events.onError(new Error(error.type));
    });

    // 연결 종료
    this.peer.on('disconnected', () => {
      console.log('[P2P] Peer disconnected');
      useChatStore.getState().setConnectionStatus('disconnected');
    });

    // Peer 종료
    this.peer.on('close', () => {
      console.log('[P2P] Peer closed');
      useChatStore.getState().setConnectionStatus('disconnected');
    });
  }

  /**
   * Data Connection 이벤트 핸들러 설정
   */
  private setupConnectionEvents(conn: DataConnection) {
    const peerId = conn.peer;

    // 연결됨
    conn.on('open', () => {
      console.log('[P2P] Connection opened:', peerId);
      this.connections.set(peerId, conn);
      this.reconnectAttempts.delete(peerId);

      // 피어 정보 저장
      const peerInfo: PeerInfo = {
        id: peerId,
        name: '', // 추후 메시지로 수신
        publicKey: new Uint8Array(0),
        fingerprint: '',
        connected: true,
        lastSeen: Date.now(),
      };

      useChatStore.getState().addPeer(peerInfo);
      useChatStore.getState().setConnectionStatus('connected');
      this.events.onPeerConnected(peerInfo);
    });

    // 메시지 수락
    conn.on('data', (data) => {
      console.log('[P2P] Message received from:', peerId, data);
      this.handleIncomingData(peerId, data);
    });

    // 연결 종료
    conn.on('close', () => {
      console.log('[P2P] Connection closed:', peerId);
      this.connections.delete(peerId);
      useChatStore.getState().removePeer(peerId);
      this.events.onPeerDisconnected(peerId);
    });

    // 에러
    conn.on('error', (error) => {
      console.error('[P2P] Connection error:', peerId, error);
      this.handleConnectionError(peerId, error);
    });
  }

  /**
   * 수신 데이터 처리
   */
  private handleIncomingData(peerId: string, data: any) {
    try {
      const message: DataMessage = data;

      // 피어의 lastSeen 업데이트
      useChatStore.getState().updatePeer(peerId, {
        lastSeen: Date.now(),
      });

      // 메시지 타입별 처리
      switch (message.type) {
        case 'text':
        case 'encrypted':
          this.events.onMessage(message);
          break;

        case 'typing':
          useChatStore.getState().setTyping(peerId, message.data.isTyping);
          break;

        case 'presence':
          // 피어 정보 업데이트
          useChatStore.getState().updatePeer(peerId, {
            name: message.data.name || '',
            connected: true,
          });
          break;
      }
    } catch (error) {
      console.error('[P2P] Error handling incoming data:', error);
    }
  }

  /**
   * 연결 에러 처리
   */
  private handleConnectionError(peerId: string, error: any) {
    const attempts = (this.reconnectAttempts.get(peerId) || 0) + 1;
    this.reconnectAttempts.set(peerId, attempts);

    if (attempts < this.maxReconnectAttempts) {
      // 재연결 시도
      console.log(`[P2P] Reconnecting to ${peerId} (attempt ${attempts})`);
      setTimeout(() => {
        this.connectToPeer(peerId);
      }, Math.pow(2, attempts) * 1000); // 지수 백오프
    } else {
      // 최종 실패
      console.error(`[P2P] Failed to reconnect to ${peerId} after ${attempts} attempts`);
      this.events.onError(new Error(`연결 실패: ${peerId}`));
    }
  }

  /**
   * 피어에 연결
   */
  connectToPeer(peerId: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.peer) {
        reject(new Error('Peer가 초기화되지 않았습니다'));
        return;
      }

      // 이미 연결됨
      if (this.connections.has(peerId)) {
        resolve();
        return;
      }

      console.log('[P2P] Connecting to:', peerId);
      useChatStore.getState().setConnectionStatus('connecting');

      const conn = this.peer.connect(peerId, {
        reliable: true,
        serialization: 'json', // JSON 직렬화
      });

      this.setupConnectionEvents(conn);

      // 연결 대기
      conn.on('open', () => {
        resolve();
      });

      conn.on('error', (error) => {
        reject(error);
      });
    });
  }

  /**
   * 피어에 메시지 전송
   */
  sendToPeer(peerId: string, message: DataMessage): boolean {
    const conn = this.connections.get(peerId);
    if (!conn || !conn.open) {
      console.error('[P2P] No connection to peer:', peerId);
      return false;
    }

    try {
      conn.send(message);
      return true;
    } catch (error) {
      console.error('[P2P] Error sending message:', error);
      return false;
    }
  }

  /**
   * 모든 피어에 메시지 방송
   */
  broadcast(message: DataMessage): void {
    const store = useChatStore.getState();
    const peers = Array.from(store.peers.values()).filter((p) => p.connected);

    for (const peer of peers) {
      this.sendToPeer(peer.id, message);
    }
  }

  /**
   * 특정 피어와 연결 종료
   */
  disconnectFromPeer(peerId: string): void {
    const conn = this.connections.get(peerId);
    if (conn) {
      conn.close();
      this.connections.delete(peerId);
    }
  }

  /**
   * 모든 연결 종료
   */
  disconnectAll(): void {
    for (const [peerId, conn] of this.connections.entries()) {
      conn.close();
    }
    this.connections.clear();
  }

  /**
   * P2P 관리자 종료
   */
  destroy(): void {
    this.disconnectAll();

    if (this.peer) {
      this.peer.destroy();
      this.peer = null;
    }
  }

  /**
   * 내 Peer ID 반환
   */
  getMyPeerId(): string | null {
    return this.peer?.id || null;
  }

  /**
   * 연결된 피어 목록 반환
   */
  getConnectedPeers(): string[] {
    return Array.from(this.connections.keys());
  }

  /**
   * 특정 피어와 연결됨 확인
   */
  isConnectedTo(peerId: string): boolean {
    const conn = this.connections.get(peerId);
    return conn?.open || false;
  }
}

// ============ P2P 관리자 팩토리 ============

let p2pManagerInstance: P2PManager | null = null;

export function initP2PManager(config: P2PConfig, events: P2PEvents): P2PManager {
  if (p2pManagerInstance) {
    p2pManagerInstance.destroy();
  }

  p2pManagerInstance = new P2PManager(config, events);
  return p2pManagerInstance;
}

export function getP2PManager(): P2PManager | null {
  return p2pManagerInstance;
}

export function destroyP2PManager(): void {
  if (p2pManagerInstance) {
    p2pManagerInstance.destroy();
    p2pManagerInstance = null;
  }
}
