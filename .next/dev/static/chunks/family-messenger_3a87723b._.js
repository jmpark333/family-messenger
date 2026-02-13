(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/family-messenger/stores/chat-store.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "selectConnectedPeers",
    ()=>selectConnectedPeers,
    "selectPeers",
    ()=>selectPeers,
    "selectTypingUsers",
    ()=>selectTypingUsers,
    "useChatStore",
    ()=>useChatStore
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/family-messenger/node_modules/zustand/esm/react.mjs [app-client] (ecmascript)");
;
// Typing timeout (ms)
const TYPING_TIMEOUT = 3000;
const initialState = {
    isAuthenticated: false,
    familyKey: null,
    myPeerId: '',
    myName: '',
    peers: new Map(),
    connectionStatus: 'disconnected',
    messages: [],
    typingUsers: new Map(),
    connectedPeers: [],
    typingUserList: [],
    isSetupComplete: false,
    showKeyExchange: false
};
const useChatStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["create"])((set, get)=>({
        ...initialState,
        // 인증 액션
        setAuthenticated: (authenticated, key)=>set({
                isAuthenticated: authenticated,
                familyKey: key || null
            }),
        setMyInfo: (peerId, name)=>set({
                myPeerId: peerId,
                myName: name
            }),
        // P2P 연결 액션
        addPeer: (peer)=>set((state)=>{
                const newPeers = new Map(state.peers);
                newPeers.set(peer.id, peer);
                const connectedPeers = Array.from(newPeers.values()).filter((p)=>p.connected);
                return {
                    peers: newPeers,
                    connectedPeers
                };
            }),
        removePeer: (peerId)=>set((state)=>{
                const newPeers = new Map(state.peers);
                newPeers.delete(peerId);
                const connectedPeers = Array.from(newPeers.values()).filter((p)=>p.connected);
                return {
                    peers: newPeers,
                    connectedPeers
                };
            }),
        updatePeer: (peerId, updates)=>set((state)=>{
                const newPeers = new Map(state.peers);
                const peer = newPeers.get(peerId);
                if (peer) {
                    newPeers.set(peerId, {
                        ...peer,
                        ...updates
                    });
                }
                const connectedPeers = Array.from(newPeers.values()).filter((p)=>p.connected);
                return {
                    peers: newPeers,
                    connectedPeers
                };
            }),
        setConnectionStatus: (status)=>set({
                connectionStatus: status
            }),
        // 메시지 액션
        addMessage: (message)=>set((state)=>({
                    messages: [
                        ...state.messages,
                        message
                    ]
                })),
        updateMessageStatus: (messageId, status)=>set((state)=>({
                    messages: state.messages.map((m)=>m.id === messageId ? {
                            ...m,
                            status
                        } : m)
                })),
        clearMessages: ()=>set({
                messages: []
            }),
        // 타이핑 액션
        setTyping: (userId, isTyping)=>{
            const state = get();
            const newTypingUsers = new Map(state.typingUsers);
            if (isTyping) {
                // Set typing indicator
                newTypingUsers.set(userId, setTimeout(()=>{
                    get().setTyping(userId, false);
                }, TYPING_TIMEOUT));
            } else {
                // Clear typing indicator
                const timeout = newTypingUsers.get(userId);
                if (timeout) {
                    clearTimeout(timeout);
                    newTypingUsers.delete(userId);
                }
            }
            const typingUserList = Array.from(newTypingUsers.keys());
            set({
                typingUsers: newTypingUsers,
                typingUserList
            });
        },
        // UI 액션
        setSetupComplete: (complete)=>set({
                isSetupComplete: complete
            }),
        setShowKeyExchange: (show)=>set({
                showKeyExchange: show
            }),
        // 초기화
        reset: ()=>set(initialState)
    }));
const selectPeers = (state)=>Array.from(state.peers.values());
const selectConnectedPeers = (state)=>state.connectedPeers;
const selectTypingUsers = (state)=>state.typingUserList;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/family-messenger/lib/webrtc/peer.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "P2PManager",
    ()=>P2PManager,
    "destroyP2PManager",
    ()=>destroyP2PManager,
    "getP2PManager",
    ()=>getP2PManager,
    "initP2PManager",
    ()=>initP2PManager
]);
/**
 * WebRTC 기반 P2P 통신 관리자
 *
 * 이 구현에서는 시그널링 없이도 동작하도록 설계했습니다.
 * 실제 배포에서는 최소한의 시그널링 서버가 필요할 수 있습니다.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f$peerjs$2f$dist$2f$bundler$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/family-messenger/node_modules/peerjs/dist/bundler.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$stores$2f$chat$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/family-messenger/stores/chat-store.ts [app-client] (ecmascript)");
;
;
// 공용 STUN 서버
const ICE_SERVERS = [
    {
        urls: 'stun:stun.l.google.com:19302'
    },
    {
        urls: 'stun:stun1.l.google.com:19302'
    },
    {
        urls: 'stun:stun2.l.google.com:19302'
    },
    {
        urls: 'stun:stun3.l.google.com:19302'
    },
    {
        urls: 'stun:stun4.l.google.com:19302'
    }
];
class P2PManager {
    peer = null;
    connections = new Map();
    config;
    events;
    reconnectAttempts = new Map();
    maxReconnectAttempts = 5;
    constructor(config, events){
        this.config = config;
        this.events = events;
        if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
        ;
        this.init();
    }
    /**
   * PeerJS 초기화
   */ async init() {
        try {
            this.peer = new __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f$peerjs$2f$dist$2f$bundler$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"](this.config.peerId, {
                debug: this.config.debug || false,
                config: {
                    iceServers: ICE_SERVERS
                }
            });
            this.setupPeerEvents();
        } catch (error) {
            this.events.onError(error);
        }
    }
    /**
   * Peer 이벤트 핸들러 설정
   */ setupPeerEvents() {
        if (!this.peer) return;
        // Peer가 준비됨
        this.peer.on('open', (peerId)=>{
            console.log('[P2P] My Peer ID:', peerId);
            __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$stores$2f$chat$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useChatStore"].getState().setMyInfo(peerId, '나');
        });
        // 연결 수락
        this.peer.on('connection', (conn)=>{
            console.log('[P2P] Incoming connection from:', conn.peer);
            this.setupConnectionEvents(conn);
        });
        // 에러 처리
        this.peer.on('error', (error)=>{
            console.error('[P2P] Peer error:', error);
            this.events.onError(new Error(error.type));
        });
        // 연결 종료
        this.peer.on('disconnected', ()=>{
            console.log('[P2P] Peer disconnected');
            __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$stores$2f$chat$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useChatStore"].getState().setConnectionStatus('disconnected');
        });
        // Peer 종료
        this.peer.on('close', ()=>{
            console.log('[P2P] Peer closed');
            __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$stores$2f$chat$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useChatStore"].getState().setConnectionStatus('disconnected');
        });
    }
    /**
   * Data Connection 이벤트 핸들러 설정
   */ setupConnectionEvents(conn) {
        const peerId = conn.peer;
        // 연결됨
        conn.on('open', ()=>{
            console.log('[P2P] Connection opened:', peerId);
            this.connections.set(peerId, conn);
            this.reconnectAttempts.delete(peerId);
            // 피어 정보 저장
            const peerInfo = {
                id: peerId,
                name: '',
                publicKey: new Uint8Array(0),
                fingerprint: '',
                connected: true,
                lastSeen: Date.now()
            };
            __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$stores$2f$chat$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useChatStore"].getState().addPeer(peerInfo);
            __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$stores$2f$chat$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useChatStore"].getState().setConnectionStatus('connected');
            this.events.onPeerConnected(peerInfo);
        });
        // 메시지 수락
        conn.on('data', (data)=>{
            console.log('[P2P] Message received from:', peerId, data);
            this.handleIncomingData(peerId, data);
        });
        // 연결 종료
        conn.on('close', ()=>{
            console.log('[P2P] Connection closed:', peerId);
            this.connections.delete(peerId);
            __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$stores$2f$chat$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useChatStore"].getState().removePeer(peerId);
            this.events.onPeerDisconnected(peerId);
        });
        // 에러
        conn.on('error', (error)=>{
            console.error('[P2P] Connection error:', peerId, error);
            this.handleConnectionError(peerId, error);
        });
    }
    /**
   * 수신 데이터 처리
   */ handleIncomingData(peerId, data) {
        try {
            const message = data;
            // 피어의 lastSeen 업데이트
            __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$stores$2f$chat$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useChatStore"].getState().updatePeer(peerId, {
                lastSeen: Date.now()
            });
            // 메시지 타입별 처리
            switch(message.type){
                case 'text':
                case 'encrypted':
                    this.events.onMessage(message);
                    break;
                case 'typing':
                    __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$stores$2f$chat$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useChatStore"].getState().setTyping(peerId, message.data.isTyping);
                    break;
                case 'presence':
                    // 피어 정보 업데이트
                    __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$stores$2f$chat$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useChatStore"].getState().updatePeer(peerId, {
                        name: message.data.name || '',
                        connected: true
                    });
                    break;
            }
        } catch (error) {
            console.error('[P2P] Error handling incoming data:', error);
        }
    }
    /**
   * 연결 에러 처리
   */ handleConnectionError(peerId, error) {
        const attempts = (this.reconnectAttempts.get(peerId) || 0) + 1;
        this.reconnectAttempts.set(peerId, attempts);
        if (attempts < this.maxReconnectAttempts) {
            // 재연결 시도
            console.log(`[P2P] Reconnecting to ${peerId} (attempt ${attempts})`);
            setTimeout(()=>{
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
   */ connectToPeer(peerId) {
        return new Promise((resolve, reject)=>{
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
            __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$stores$2f$chat$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useChatStore"].getState().setConnectionStatus('connecting');
            const conn = this.peer.connect(peerId, {
                reliable: true,
                serialization: 'json'
            });
            this.setupConnectionEvents(conn);
            // 연결 대기
            conn.on('open', ()=>{
                resolve();
            });
            conn.on('error', (error)=>{
                reject(error);
            });
        });
    }
    /**
   * 피어에 메시지 전송
   */ sendToPeer(peerId, message) {
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
   */ broadcast(message) {
        const store = __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$stores$2f$chat$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useChatStore"].getState();
        const peers = Array.from(store.peers.values()).filter((p)=>p.connected);
        for (const peer of peers){
            this.sendToPeer(peer.id, message);
        }
    }
    /**
   * 특정 피어와 연결 종료
   */ disconnectFromPeer(peerId) {
        const conn = this.connections.get(peerId);
        if (conn) {
            conn.close();
            this.connections.delete(peerId);
        }
    }
    /**
   * 모든 연결 종료
   */ disconnectAll() {
        for (const [peerId, conn] of this.connections.entries()){
            conn.close();
        }
        this.connections.clear();
    }
    /**
   * P2P 관리자 종료
   */ destroy() {
        this.disconnectAll();
        if (this.peer) {
            this.peer.destroy();
            this.peer = null;
        }
    }
    /**
   * 내 Peer ID 반환
   */ getMyPeerId() {
        return this.peer?.id || null;
    }
    /**
   * 연결된 피어 목록 반환
   */ getConnectedPeers() {
        return Array.from(this.connections.keys());
    }
    /**
   * 특정 피어와 연결됨 확인
   */ isConnectedTo(peerId) {
        const conn = this.connections.get(peerId);
        return conn?.open || false;
    }
}
// ============ P2P 관리자 팩토리 ============
let p2pManagerInstance = null;
function initP2PManager(config, events) {
    if (p2pManagerInstance) {
        p2pManagerInstance.destroy();
    }
    p2pManagerInstance = new P2PManager(config, events);
    return p2pManagerInstance;
}
function getP2PManager() {
    return p2pManagerInstance;
}
function destroyP2PManager() {
    if (p2pManagerInstance) {
        p2pManagerInstance.destroy();
        p2pManagerInstance = null;
    }
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/family-messenger/components/chat/ChatMessage.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>ChatMessage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/family-messenger/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
'use client';
;
function ChatMessage({ message, isMine }) {
    const timeString = new Date(message.timestamp).toLocaleTimeString('ko-KR', {
        hour: '2-digit',
        minute: '2-digit'
    });
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: `flex ${isMine ? 'justify-end' : 'justify-start'} animate-fade-in`,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: `max-w-[80%] ${isMine ? 'items-end' : 'items-start'} flex flex-col`,
            children: [
                !isMine && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    className: "text-xs text-gray-500 dark:text-gray-400 mb-1 ml-2",
                    children: [
                        message.senderId.slice(0, 8),
                        "..."
                    ]
                }, void 0, true, {
                    fileName: "[project]/family-messenger/components/chat/ChatMessage.tsx",
                    lineNumber: 23,
                    columnNumber: 11
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: `message-bubble ${isMine ? 'message-sent' : 'message-received'}`,
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-sm whitespace-pre-wrap break-words",
                            children: message.content
                        }, void 0, false, {
                            fileName: "[project]/family-messenger/components/chat/ChatMessage.tsx",
                            lineNumber: 30,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: `flex items-center gap-2 mt-1 ${isMine ? 'justify-end' : 'justify-start'}`,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "text-xs opacity-70",
                                    children: timeString
                                }, void 0, false, {
                                    fileName: "[project]/family-messenger/components/chat/ChatMessage.tsx",
                                    lineNumber: 36,
                                    columnNumber: 13
                                }, this),
                                message.encrypted && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "text-xs opacity-70",
                                    title: "End-to-End 암호화됨",
                                    children: "🔒"
                                }, void 0, false, {
                                    fileName: "[project]/family-messenger/components/chat/ChatMessage.tsx",
                                    lineNumber: 42,
                                    columnNumber: 15
                                }, this),
                                isMine && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(MessageStatus, {
                                    status: message.status
                                }, void 0, false, {
                                    fileName: "[project]/family-messenger/components/chat/ChatMessage.tsx",
                                    lineNumber: 49,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/family-messenger/components/chat/ChatMessage.tsx",
                            lineNumber: 35,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/family-messenger/components/chat/ChatMessage.tsx",
                    lineNumber: 29,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/family-messenger/components/chat/ChatMessage.tsx",
            lineNumber: 20,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/family-messenger/components/chat/ChatMessage.tsx",
        lineNumber: 17,
        columnNumber: 5
    }, this);
}
_c = ChatMessage;
function MessageStatus({ status }) {
    const statusConfig = {
        sending: {
            icon: '⏳',
            label: '전송 중'
        },
        sent: {
            icon: '✓',
            label: '전송됨'
        },
        delivered: {
            icon: '✓✓',
            label: '도착'
        },
        read: {
            icon: '✓✓✓',
            label: '읽음'
        }
    };
    const config = statusConfig[status];
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
        className: "text-xs opacity-70",
        title: config.label,
        children: config.icon
    }, void 0, false, {
        fileName: "[project]/family-messenger/components/chat/ChatMessage.tsx",
        lineNumber: 75,
        columnNumber: 5
    }, this);
}
_c1 = MessageStatus;
var _c, _c1;
__turbopack_context__.k.register(_c, "ChatMessage");
__turbopack_context__.k.register(_c1, "MessageStatus");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/family-messenger/components/chat/MessageInput.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>MessageInput
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/family-messenger/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/family-messenger/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$stores$2f$chat$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/family-messenger/stores/chat-store.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$lib$2f$webrtc$2f$peer$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/family-messenger/lib/webrtc/peer.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
function MessageInput() {
    _s();
    const [text, setText] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [isTyping, setIsTyping] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const textareaRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const { myPeerId } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$stores$2f$chat$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useChatStore"])();
    // 타이핑 인디케이터 전송
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "MessageInput.useEffect": ()=>{
            if (!isTyping || !myPeerId) return;
            const p2pManager = (0, __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$lib$2f$webrtc$2f$peer$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getP2PManager"])();
            if (!p2pManager) return;
            const typingMessage = {
                id: crypto.randomUUID(),
                type: 'typing',
                senderId: myPeerId,
                timestamp: Date.now(),
                data: {
                    isTyping: true
                }
            };
            p2pManager.broadcast(typingMessage);
            // 3초 후 타이핑 종료
            const timeout = setTimeout({
                "MessageInput.useEffect.timeout": ()=>{
                    setIsTyping(false);
                }
            }["MessageInput.useEffect.timeout"], 3000);
            return ({
                "MessageInput.useEffect": ()=>clearTimeout(timeout)
            })["MessageInput.useEffect"];
        }
    }["MessageInput.useEffect"], [
        isTyping,
        myPeerId
    ]);
    const handleSend = ()=>{
        if (!text.trim() || !myPeerId) return;
        // 메시지 생성
        const message = {
            id: crypto.randomUUID(),
            type: 'text',
            senderId: myPeerId,
            timestamp: Date.now(),
            data: text,
            encrypted: true
        };
        // P2P로 전송
        const p2pManager = (0, __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$lib$2f$webrtc$2f$peer$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getP2PManager"])();
        if (p2pManager) {
            p2pManager.broadcast(message);
            if ("TURBOPACK compile-time truthy", 1) {
                // 로컬 메시지 목록에 추가
                __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$stores$2f$chat$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useChatStore"].getState().addMessage({
                    id: message.id,
                    senderId: myPeerId,
                    content: text,
                    timestamp: Date.now(),
                    status: 'sent',
                    encrypted: true
                });
                setText('');
                setIsTyping(false);
            }
        }
    };
    const handleKeyDown = (e)=>{
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };
    const handleChange = (e)=>{
        setText(e.target.value);
        // 타이핑 인디케이터 활성화
        if (!isTyping && e.target.value.length > 0) {
            setIsTyping(true);
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex items-end gap-2",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex-1 relative",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                        ref: textareaRef,
                        value: text,
                        onChange: handleChange,
                        onKeyDown: handleKeyDown,
                        placeholder: "메시지를 입력하세요... (Shift+Enter로 줄바꿈)",
                        className: "w-full px-4 py-3 bg-gray-100 dark:bg-gray-700 border-2 border-transparent focus:border-blue-500 focus:bg-white dark:focus:bg-gray-600 rounded-2xl resize-none focus:outline-none transition-colors text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400",
                        rows: 1,
                        style: {
                            minHeight: '48px',
                            maxHeight: '120px'
                        }
                    }, void 0, false, {
                        fileName: "[project]/family-messenger/components/chat/MessageInput.tsx",
                        lineNumber: 95,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "absolute right-3 bottom-3 text-xs text-secure-green flex items-center gap-1",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "animate-pulse",
                                children: "🔒"
                            }, void 0, false, {
                                fileName: "[project]/family-messenger/components/chat/MessageInput.tsx",
                                lineNumber: 108,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "hidden sm:inline",
                                children: "E2E"
                            }, void 0, false, {
                                fileName: "[project]/family-messenger/components/chat/MessageInput.tsx",
                                lineNumber: 109,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/family-messenger/components/chat/MessageInput.tsx",
                        lineNumber: 107,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/family-messenger/components/chat/MessageInput.tsx",
                lineNumber: 94,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                onClick: handleSend,
                disabled: !text.trim(),
                className: "px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-2xl font-semibold hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2",
                "aria-label": "메시지 전송",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "hidden sm:inline",
                        children: "전송"
                    }, void 0, false, {
                        fileName: "[project]/family-messenger/components/chat/MessageInput.tsx",
                        lineNumber: 120,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "text-xl",
                        children: "➤"
                    }, void 0, false, {
                        fileName: "[project]/family-messenger/components/chat/MessageInput.tsx",
                        lineNumber: 121,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/family-messenger/components/chat/MessageInput.tsx",
                lineNumber: 114,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/family-messenger/components/chat/MessageInput.tsx",
        lineNumber: 92,
        columnNumber: 5
    }, this);
}
_s(MessageInput, "pDYsBXdkEFGKrVWnliIpIdpQCB8=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$stores$2f$chat$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useChatStore"]
    ];
});
_c = MessageInput;
var _c;
__turbopack_context__.k.register(_c, "MessageInput");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/family-messenger/components/security/SecurityIndicator.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>SecurityIndicator
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/family-messenger/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/family-messenger/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$stores$2f$chat$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/family-messenger/stores/chat-store.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
function SecurityIndicator() {
    _s();
    const { isAuthenticated, connectionStatus, peers } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$stores$2f$chat$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useChatStore"])();
    const [securityStatus, setSecurityStatus] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        level: 'secure',
        message: 'E2E 암호화 활성화'
    });
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "SecurityIndicator.useEffect": ()=>{
            if (!isAuthenticated) {
                setSecurityStatus({
                    level: 'insecure',
                    message: '미인증'
                });
                return;
            }
            if (connectionStatus !== 'connected') {
                setSecurityStatus({
                    level: 'warning',
                    message: '연결 안됨'
                });
                return;
            }
            const connectedCount = Array.from(peers.values()).filter({
                "SecurityIndicator.useEffect": (p)=>p.connected
            }["SecurityIndicator.useEffect"]).length;
            if (connectedCount === 0) {
                setSecurityStatus({
                    level: 'warning',
                    message: '가족원 대기 중'
                });
                return;
            }
            setSecurityStatus({
                level: 'secure',
                message: 'E2E 암호화'
            });
        }
    }["SecurityIndicator.useEffect"], [
        isAuthenticated,
        connectionStatus,
        peers
    ]);
    const levelConfig = {
        secure: {
            containerClass: 'bg-secure-green/10 text-secure-green border-secure-green/20',
            dotClass: 'bg-secure-green animate-pulse',
            icon: '🔒'
        },
        warning: {
            containerClass: 'bg-secure-yellow/10 text-secure-yellow border-secure-yellow/20',
            dotClass: 'bg-secure-yellow animate-pulse',
            icon: '⚠️'
        },
        insecure: {
            containerClass: 'bg-secure-red/10 text-secure-red border-secure-red/20',
            dotClass: 'bg-secure-red',
            icon: '🔓'
        }
    };
    const config = levelConfig[securityStatus.level];
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: `security-badge ${config.containerClass} border`,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: `w-2 h-2 rounded-full ${config.dotClass}`
            }, void 0, false, {
                fileName: "[project]/family-messenger/components/security/SecurityIndicator.tsx",
                lineNumber: 73,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "font-medium",
                children: [
                    config.icon,
                    " ",
                    securityStatus.message
                ]
            }, void 0, true, {
                fileName: "[project]/family-messenger/components/security/SecurityIndicator.tsx",
                lineNumber: 74,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/family-messenger/components/security/SecurityIndicator.tsx",
        lineNumber: 72,
        columnNumber: 5
    }, this);
}
_s(SecurityIndicator, "7F99ABmzR35YaHd/FxbIUj2nIZE=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$stores$2f$chat$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useChatStore"]
    ];
});
_c = SecurityIndicator;
var _c;
__turbopack_context__.k.register(_c, "SecurityIndicator");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/family-messenger/components/p2p/PeerConnection.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>PeerConnection
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/family-messenger/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/family-messenger/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f$qrcode$2e$react$2f$lib$2f$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/family-messenger/node_modules/qrcode.react/lib/esm/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
function PeerConnection({ isOpen, onClose, myPeerId, onConnect }) {
    _s();
    const [tab, setTab] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('my-code');
    const [peerIdInput, setPeerIdInput] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [isConnecting, setIsConnecting] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const resetForm = ()=>{
        setPeerIdInput('');
        setError('');
        setIsConnecting(false);
    };
    const handleConnect = async ()=>{
        if (!peerIdInput.trim()) {
            setError('Peer ID를 입력하세요');
            return;
        }
        if (peerIdInput === myPeerId) {
            setError('자기 자신에게는 연결할 수 없습니다');
            return;
        }
        setIsConnecting(true);
        setError('');
        try {
            await onConnect(peerIdInput.trim());
            onClose();
            resetForm();
        } catch (err) {
            setError(err.message || '연결에 실패했습니다');
        } finally{
            setIsConnecting(false);
        }
    };
    // ESC 키로 닫기
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "PeerConnection.useEffect": ()=>{
            const handleEscape = {
                "PeerConnection.useEffect.handleEscape": (e)=>{
                    if (e.key === 'Escape' && isOpen) {
                        onClose();
                    }
                }
            }["PeerConnection.useEffect.handleEscape"];
            window.addEventListener('keydown', handleEscape);
            return ({
                "PeerConnection.useEffect": ()=>window.removeEventListener('keydown', handleEscape)
            })["PeerConnection.useEffect"];
        }
    }["PeerConnection.useEffect"], [
        isOpen,
        onClose
    ]);
    if (!isOpen) return null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "fixed inset-0 z-50 flex items-center justify-center p-4",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "absolute inset-0 bg-black/50 backdrop-blur-sm",
                onClick: onClose
            }, void 0, false, {
                fileName: "[project]/family-messenger/components/p2p/PeerConnection.tsx",
                lineNumber: 68,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                className: "text-xl font-bold text-gray-900 dark:text-white",
                                children: "가족원 연결"
                            }, void 0, false, {
                                fileName: "[project]/family-messenger/components/p2p/PeerConnection.tsx",
                                lineNumber: 77,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: onClose,
                                className: "w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors",
                                "aria-label": "닫기",
                                children: "✕"
                            }, void 0, false, {
                                fileName: "[project]/family-messenger/components/p2p/PeerConnection.tsx",
                                lineNumber: 80,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/family-messenger/components/p2p/PeerConnection.tsx",
                        lineNumber: 76,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex border-b border-gray-200 dark:border-gray-700",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>{
                                    setTab('my-code');
                                    resetForm();
                                },
                                className: `flex-1 py-4 font-medium transition-colors ${tab === 'my-code' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'}`,
                                children: "내 코드"
                            }, void 0, false, {
                                fileName: "[project]/family-messenger/components/p2p/PeerConnection.tsx",
                                lineNumber: 91,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>{
                                    setTab('scan-code');
                                    resetForm();
                                },
                                className: `flex-1 py-4 font-medium transition-colors ${tab === 'scan-code' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'}`,
                                children: "코드 입력"
                            }, void 0, false, {
                                fileName: "[project]/family-messenger/components/p2p/PeerConnection.tsx",
                                lineNumber: 104,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/family-messenger/components/p2p/PeerConnection.tsx",
                        lineNumber: 90,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "p-6",
                        children: [
                            tab === 'my-code' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "text-center space-y-6",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "space-y-2",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                className: "font-semibold text-gray-900 dark:text-white",
                                                children: "내 Peer ID"
                                            }, void 0, false, {
                                                fileName: "[project]/family-messenger/components/p2p/PeerConnection.tsx",
                                                lineNumber: 125,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-sm text-gray-600 dark:text-gray-400",
                                                children: "이 QR 코드를 가족원에게 보여주세요"
                                            }, void 0, false, {
                                                fileName: "[project]/family-messenger/components/p2p/PeerConnection.tsx",
                                                lineNumber: 128,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/family-messenger/components/p2p/PeerConnection.tsx",
                                        lineNumber: 124,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "bg-white p-6 rounded-xl border-2 border-dashed border-gray-300 inline-block",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f$qrcode$2e$react$2f$lib$2f$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["QRCodeSVG"], {
                                            value: JSON.stringify({
                                                pid: myPeerId,
                                                v: 1
                                            }),
                                            size: 200,
                                            level: "H",
                                            includeMargin: false
                                        }, void 0, false, {
                                            fileName: "[project]/family-messenger/components/p2p/PeerConnection.tsx",
                                            lineNumber: 135,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/family-messenger/components/p2p/PeerConnection.tsx",
                                        lineNumber: 134,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "space-y-2",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                className: "text-sm font-medium text-gray-700 dark:text-gray-300",
                                                children: "Peer ID (복사해서 공유)"
                                            }, void 0, false, {
                                                fileName: "[project]/family-messenger/components/p2p/PeerConnection.tsx",
                                                lineNumber: 145,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex gap-2",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                        type: "text",
                                                        value: myPeerId,
                                                        readOnly: true,
                                                        className: "flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg text-gray-900 dark:text-white text-sm font-mono"
                                                    }, void 0, false, {
                                                        fileName: "[project]/family-messenger/components/p2p/PeerConnection.tsx",
                                                        lineNumber: 149,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        onClick: ()=>navigator.clipboard.writeText(myPeerId),
                                                        className: "px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium",
                                                        children: "복사"
                                                    }, void 0, false, {
                                                        fileName: "[project]/family-messenger/components/p2p/PeerConnection.tsx",
                                                        lineNumber: 155,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/family-messenger/components/p2p/PeerConnection.tsx",
                                                lineNumber: 148,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/family-messenger/components/p2p/PeerConnection.tsx",
                                        lineNumber: 144,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 text-left",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-sm text-blue-800 dark:text-blue-300",
                                            children: [
                                                "💡 ",
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                    children: "팁:"
                                                }, void 0, false, {
                                                    fileName: "[project]/family-messenger/components/p2p/PeerConnection.tsx",
                                                    lineNumber: 167,
                                                    columnNumber: 22
                                                }, this),
                                                " 가족원이 이 QR 코드를 스캔하거나 Peer ID를 입력하면 연결됩니다."
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/family-messenger/components/p2p/PeerConnection.tsx",
                                            lineNumber: 166,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/family-messenger/components/p2p/PeerConnection.tsx",
                                        lineNumber: 165,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/family-messenger/components/p2p/PeerConnection.tsx",
                                lineNumber: 123,
                                columnNumber: 13
                            }, this),
                            tab === 'scan-code' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "space-y-6",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "space-y-2",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                className: "font-semibold text-gray-900 dark:text-white",
                                                children: "가족원 Peer ID 입력"
                                            }, void 0, false, {
                                                fileName: "[project]/family-messenger/components/p2p/PeerConnection.tsx",
                                                lineNumber: 177,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-sm text-gray-600 dark:text-gray-400",
                                                children: "가족원에게 받은 Peer ID를 입력하세요"
                                            }, void 0, false, {
                                                fileName: "[project]/family-messenger/components/p2p/PeerConnection.tsx",
                                                lineNumber: 180,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/family-messenger/components/p2p/PeerConnection.tsx",
                                        lineNumber: 176,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "space-y-4",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                        htmlFor: "peerIdInput",
                                                        className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2",
                                                        children: "Peer ID"
                                                    }, void 0, false, {
                                                        fileName: "[project]/family-messenger/components/p2p/PeerConnection.tsx",
                                                        lineNumber: 188,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                        id: "peerIdInput",
                                                        type: "text",
                                                        value: peerIdInput,
                                                        onChange: (e)=>setPeerIdInput(e.target.value),
                                                        placeholder: "가족원의 Peer ID를 입력하세요",
                                                        className: "w-full px-4 py-3 bg-gray-100 dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:border-blue-500 focus:outline-none focus:bg-white dark:focus:bg-gray-600 transition-colors text-gray-900 dark:text-white",
                                                        disabled: isConnecting,
                                                        autoFocus: true
                                                    }, void 0, false, {
                                                        fileName: "[project]/family-messenger/components/p2p/PeerConnection.tsx",
                                                        lineNumber: 194,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/family-messenger/components/p2p/PeerConnection.tsx",
                                                lineNumber: 187,
                                                columnNumber: 17
                                            }, this),
                                            error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg text-sm",
                                                children: [
                                                    "⚠️ ",
                                                    error
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/family-messenger/components/p2p/PeerConnection.tsx",
                                                lineNumber: 208,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                onClick: handleConnect,
                                                disabled: !peerIdInput.trim() || isConnecting,
                                                className: "w-full py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl font-semibold hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2",
                                                children: isConnecting ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "animate-spin",
                                                            children: "⏳"
                                                        }, void 0, false, {
                                                            fileName: "[project]/family-messenger/components/p2p/PeerConnection.tsx",
                                                            lineNumber: 221,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            children: "연결 중..."
                                                        }, void 0, false, {
                                                            fileName: "[project]/family-messenger/components/p2p/PeerConnection.tsx",
                                                            lineNumber: 222,
                                                            columnNumber: 23
                                                        }, this)
                                                    ]
                                                }, void 0, true) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            children: "🔗"
                                                        }, void 0, false, {
                                                            fileName: "[project]/family-messenger/components/p2p/PeerConnection.tsx",
                                                            lineNumber: 226,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            children: "연결하기"
                                                        }, void 0, false, {
                                                            fileName: "[project]/family-messenger/components/p2p/PeerConnection.tsx",
                                                            lineNumber: 227,
                                                            columnNumber: 23
                                                        }, this)
                                                    ]
                                                }, void 0, true)
                                            }, void 0, false, {
                                                fileName: "[project]/family-messenger/components/p2p/PeerConnection.tsx",
                                                lineNumber: 214,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/family-messenger/components/p2p/PeerConnection.tsx",
                                        lineNumber: 186,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                className: "font-medium text-gray-900 dark:text-white mb-2",
                                                children: "연결 방법"
                                            }, void 0, false, {
                                                fileName: "[project]/family-messenger/components/p2p/PeerConnection.tsx",
                                                lineNumber: 235,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ol", {
                                                className: "text-sm text-gray-600 dark:text-gray-400 space-y-1 list-decimal list-inside",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                        children: "가족원에게 Peer ID를 받으세요"
                                                    }, void 0, false, {
                                                        fileName: "[project]/family-messenger/components/p2p/PeerConnection.tsx",
                                                        lineNumber: 239,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                        children: "위 입력창에 Peer ID를 붙여넣으세요"
                                                    }, void 0, false, {
                                                        fileName: "[project]/family-messenger/components/p2p/PeerConnection.tsx",
                                                        lineNumber: 240,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                        children: '"연결하기" 버튼을 누르세요'
                                                    }, void 0, false, {
                                                        fileName: "[project]/family-messenger/components/p2p/PeerConnection.tsx",
                                                        lineNumber: 241,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/family-messenger/components/p2p/PeerConnection.tsx",
                                                lineNumber: 238,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/family-messenger/components/p2p/PeerConnection.tsx",
                                        lineNumber: 234,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/family-messenger/components/p2p/PeerConnection.tsx",
                                lineNumber: 175,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/family-messenger/components/p2p/PeerConnection.tsx",
                        lineNumber: 120,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/family-messenger/components/p2p/PeerConnection.tsx",
                lineNumber: 74,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/family-messenger/components/p2p/PeerConnection.tsx",
        lineNumber: 66,
        columnNumber: 5
    }, this);
}
_s(PeerConnection, "Rqg2jOchzCN9/85iYqeoN4Wr14M=");
_c = PeerConnection;
var _c;
__turbopack_context__.k.register(_c, "PeerConnection");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/family-messenger/app/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>HomePage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/family-messenger/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/family-messenger/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$stores$2f$chat$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/family-messenger/stores/chat-store.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$lib$2f$webrtc$2f$peer$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/family-messenger/lib/webrtc/peer.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$components$2f$chat$2f$ChatMessage$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/family-messenger/components/chat/ChatMessage.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$components$2f$chat$2f$MessageInput$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/family-messenger/components/chat/MessageInput.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$components$2f$security$2f$SecurityIndicator$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/family-messenger/components/security/SecurityIndicator.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$components$2f$p2p$2f$PeerConnection$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/family-messenger/components/p2p/PeerConnection.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f$qrcode$2e$react$2f$lib$2f$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/family-messenger/node_modules/qrcode.react/lib/esm/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
'use client';
;
;
;
;
;
;
;
;
function HomePage() {
    _s();
    const [isReady, setIsReady] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [showQR, setShowQR] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const { isAuthenticated, myPeerId, myName, connectionStatus, messages, isSetupComplete } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$stores$2f$chat$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useChatStore"])();
    const connectedPeers = (0, __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$stores$2f$chat$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useChatStore"])(__TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$stores$2f$chat$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["selectConnectedPeers"]);
    const typingUsers = (0, __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$stores$2f$chat$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useChatStore"])(__TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$stores$2f$chat$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["selectTypingUsers"]);
    // P2P 관리자 초기화
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "HomePage.useEffect": ()=>{
            const p2pManager = (0, __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$lib$2f$webrtc$2f$peer$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["initP2PManager"])({
                debug: true
            }, {
                onPeerConnected: {
                    "HomePage.useEffect.p2pManager": (peer)=>console.log('Peer connected:', peer)
                }["HomePage.useEffect.p2pManager"],
                onPeerDisconnected: {
                    "HomePage.useEffect.p2pManager": (peerId)=>console.log('Peer disconnected:', peerId)
                }["HomePage.useEffect.p2pManager"],
                onMessage: {
                    "HomePage.useEffect.p2pManager": (message)=>{
                        if (message.type === 'text') {
                            __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$stores$2f$chat$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useChatStore"].getState().addMessage({
                                id: message.id,
                                senderId: message.senderId,
                                content: message.data,
                                timestamp: message.timestamp,
                                status: 'delivered',
                                encrypted: message.encrypted || false
                            });
                        }
                    }
                }["HomePage.useEffect.p2pManager"],
                onError: {
                    "HomePage.useEffect.p2pManager": (error)=>console.error('P2P error:', error)
                }["HomePage.useEffect.p2pManager"]
            });
            return ({
                "HomePage.useEffect": ()=>{
                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$lib$2f$webrtc$2f$peer$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["destroyP2PManager"])();
                }
            })["HomePage.useEffect"];
        }
    }["HomePage.useEffect"], []);
    // 초기 설정이 안 된 경우
    if (!isSetupComplete) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(InitialSetup, {
            onSetupComplete: ()=>setIsReady(true)
        }, void 0, false, {
            fileName: "[project]/family-messenger/app/page.tsx",
            lineNumber: 57,
            columnNumber: 12
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
                className: "bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "max-w-4xl mx-auto px-4 py-3 flex items-center justify-between",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center gap-3",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-white text-xl",
                                        children: "👨‍👩‍👧‍👦"
                                    }, void 0, false, {
                                        fileName: "[project]/family-messenger/app/page.tsx",
                                        lineNumber: 66,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/family-messenger/app/page.tsx",
                                    lineNumber: 65,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                            className: "text-lg font-semibold text-gray-900 dark:text-white",
                                            children: "가족 메신저"
                                        }, void 0, false, {
                                            fileName: "[project]/family-messenger/app/page.tsx",
                                            lineNumber: 69,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-xs text-gray-500 dark:text-gray-400",
                                            children: "E2E 암호화 활성화"
                                        }, void 0, false, {
                                            fileName: "[project]/family-messenger/app/page.tsx",
                                            lineNumber: 70,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/family-messenger/app/page.tsx",
                                    lineNumber: 68,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/family-messenger/app/page.tsx",
                            lineNumber: 64,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$components$2f$security$2f$SecurityIndicator$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                            fileName: "[project]/family-messenger/app/page.tsx",
                            lineNumber: 73,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/family-messenger/app/page.tsx",
                    lineNumber: 63,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/family-messenger/app/page.tsx",
                lineNumber: 62,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
                className: "max-w-4xl mx-auto p-4 pb-32",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ConnectionStatus, {
                        status: connectionStatus,
                        peerCount: connectedPeers.length
                    }, void 0, false, {
                        fileName: "[project]/family-messenger/app/page.tsx",
                        lineNumber: 78,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "message-list overflow-y-auto space-y-4",
                        style: {
                            maxHeight: 'calc(100vh - 300px)'
                        },
                        children: [
                            messages.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "text-center py-12",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "text-6xl mb-4",
                                        children: "💬"
                                    }, void 0, false, {
                                        fileName: "[project]/family-messenger/app/page.tsx",
                                        lineNumber: 83,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                        className: "text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2",
                                        children: "아직 메시지가 없습니다"
                                    }, void 0, false, {
                                        fileName: "[project]/family-messenger/app/page.tsx",
                                        lineNumber: 84,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-gray-500 dark:text-gray-400",
                                        children: "가족원에게 첫 메시지를 보내보세요!"
                                    }, void 0, false, {
                                        fileName: "[project]/family-messenger/app/page.tsx",
                                        lineNumber: 85,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/family-messenger/app/page.tsx",
                                lineNumber: 82,
                                columnNumber: 13
                            }, this) : messages.map((message)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$components$2f$chat$2f$ChatMessage$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                    message: message,
                                    isMine: message.senderId === myPeerId
                                }, message.id, false, {
                                    fileName: "[project]/family-messenger/app/page.tsx",
                                    lineNumber: 89,
                                    columnNumber: 15
                                }, this)),
                            typingUsers.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "text-sm text-gray-500 dark:text-gray-400 animate-pulse",
                                children: [
                                    typingUsers.join(', '),
                                    " 님이 입력 중..."
                                ]
                            }, void 0, true, {
                                fileName: "[project]/family-messenger/app/page.tsx",
                                lineNumber: 93,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/family-messenger/app/page.tsx",
                        lineNumber: 80,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/family-messenger/app/page.tsx",
                lineNumber: 77,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("footer", {
                className: "fixed bottom-0 left-0 right-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm border-t border-gray-200 dark:border-gray-700",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "max-w-4xl mx-auto p-4",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$components$2f$chat$2f$MessageInput$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                        fileName: "[project]/family-messenger/app/page.tsx",
                        lineNumber: 101,
                        columnNumber: 48
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/family-messenger/app/page.tsx",
                    lineNumber: 101,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/family-messenger/app/page.tsx",
                lineNumber: 100,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$components$2f$p2p$2f$PeerConnection$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                isOpen: showQR,
                onClose: ()=>setShowQR(false),
                myPeerId: myPeerId,
                onConnect: async (peerId)=>{
                    const p2pManager = (0, __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$lib$2f$webrtc$2f$peer$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getP2PManager"])();
                    if (p2pManager) {
                        await p2pManager.connectToPeer(peerId);
                        setShowQR(false);
                    }
                }
            }, void 0, false, {
                fileName: "[project]/family-messenger/app/page.tsx",
                lineNumber: 104,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                onClick: ()=>setShowQR(true),
                className: "fixed bottom-24 right-4 w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all flex items-center justify-center text-2xl",
                children: "➕"
            }, void 0, false, {
                fileName: "[project]/family-messenger/app/page.tsx",
                lineNumber: 117,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/family-messenger/app/page.tsx",
        lineNumber: 61,
        columnNumber: 5
    }, this);
}
_s(HomePage, "MTywCr4lAF8AKwayoLOQknXx0CE=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$stores$2f$chat$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useChatStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$stores$2f$chat$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useChatStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$stores$2f$chat$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useChatStore"]
    ];
});
_c = HomePage;
function InitialSetup({ onSetupComplete }) {
    _s1();
    const [step, setStep] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('welcome');
    const [familyKey, setFamilyKey] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [myName, setMyName] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const handleCreateFamily = ()=>{
        const mockKey = Array.from(crypto.getRandomValues(new Uint8Array(32))).map((b)=>b.toString(16).padStart(2, '0')).join('');
        setFamilyKey(mockKey);
        setStep('create');
    };
    const handleJoinFamily = ()=>setStep('join');
    const handleSetupComplete = ()=>{
        __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$stores$2f$chat$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useChatStore"].getState().setSetupComplete(true);
        __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$stores$2f$chat$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useChatStore"].getState().setMyInfo(crypto.randomUUID(), myName || '나');
        __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$stores$2f$chat$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useChatStore"].getState().setAuthenticated(true);
        onSetupComplete();
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 max-w-md w-full",
            children: [
                step === 'welcome' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "text-center space-y-6",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "text-6xl",
                            children: "🏠"
                        }, void 0, false, {
                            fileName: "[project]/family-messenger/app/page.tsx",
                            lineNumber: 155,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                            className: "text-2xl font-bold text-gray-900 dark:text-white",
                            children: "가족 메신저에 오신 것을 환영합니다!"
                        }, void 0, false, {
                            fileName: "[project]/family-messenger/app/page.tsx",
                            lineNumber: 156,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-gray-600 dark:text-gray-400",
                            children: "가족 3명만을 위한 완전 보안 메신저를 시작해보세요."
                        }, void 0, false, {
                            fileName: "[project]/family-messenger/app/page.tsx",
                            lineNumber: 157,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "space-y-3",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: handleCreateFamily,
                                    className: "w-full py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all",
                                    children: "🆕 새 가족 만들기"
                                }, void 0, false, {
                                    fileName: "[project]/family-messenger/app/page.tsx",
                                    lineNumber: 159,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: handleJoinFamily,
                                    className: "w-full py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-semibold hover:bg-gray-200 dark:hover:bg-gray-600 transition-all",
                                    children: "🔗 가족에 참여하기"
                                }, void 0, false, {
                                    fileName: "[project]/family-messenger/app/page.tsx",
                                    lineNumber: 160,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/family-messenger/app/page.tsx",
                            lineNumber: 158,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "text-xs text-gray-500 dark:text-gray-400 space-y-1",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    children: "🔒 End-to-End 암호화"
                                }, void 0, false, {
                                    fileName: "[project]/family-messenger/app/page.tsx",
                                    lineNumber: 163,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    children: "👨‍👩‍👧‍👦 P2P 직접 통신"
                                }, void 0, false, {
                                    fileName: "[project]/family-messenger/app/page.tsx",
                                    lineNumber: 164,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    children: "🔐 사전 공유 키 인증"
                                }, void 0, false, {
                                    fileName: "[project]/family-messenger/app/page.tsx",
                                    lineNumber: 165,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/family-messenger/app/page.tsx",
                            lineNumber: 162,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/family-messenger/app/page.tsx",
                    lineNumber: 154,
                    columnNumber: 11
                }, this),
                step === 'create' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "text-center space-y-6",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                            className: "text-xl font-bold text-gray-900 dark:text-white",
                            children: "가족 키가 생성되었습니다!"
                        }, void 0, false, {
                            fileName: "[project]/family-messenger/app/page.tsx",
                            lineNumber: 172,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-gray-600 dark:text-gray-400",
                            children: "이 QR 코드를 가족원에게 보여주세요"
                        }, void 0, false, {
                            fileName: "[project]/family-messenger/app/page.tsx",
                            lineNumber: 173,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "bg-white p-4 rounded-xl border-2 border-dashed border-gray-300",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f$qrcode$2e$react$2f$lib$2f$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["QRCodeSVG"], {
                                value: JSON.stringify({
                                    key: familyKey,
                                    type: 'family-key'
                                }),
                                size: 200,
                                level: "H",
                                includeMargin: false
                            }, void 0, false, {
                                fileName: "[project]/family-messenger/app/page.tsx",
                                lineNumber: 175,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/family-messenger/app/page.tsx",
                            lineNumber: 174,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "text-xs text-gray-500 dark:text-gray-400",
                            children: "⚠️ 이 코드는 안전하게 보관하세요. 분실 시 재발급할 수 없습니다."
                        }, void 0, false, {
                            fileName: "[project]/family-messenger/app/page.tsx",
                            lineNumber: 177,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: handleSetupComplete,
                            className: "w-full py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all",
                            children: "시작하기"
                        }, void 0, false, {
                            fileName: "[project]/family-messenger/app/page.tsx",
                            lineNumber: 178,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/family-messenger/app/page.tsx",
                    lineNumber: 171,
                    columnNumber: 11
                }, this),
                step === 'join' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "text-center space-y-6",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                            className: "text-xl font-bold text-gray-900 dark:text-white",
                            children: "가족 코드를 입력하세요"
                        }, void 0, false, {
                            fileName: "[project]/family-messenger/app/page.tsx",
                            lineNumber: 184,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                            type: "text",
                            value: familyKey,
                            onChange: (e)=>setFamilyKey(e.target.value),
                            placeholder: "가족 코드 입력",
                            className: "w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:border-blue-500 focus:outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        }, void 0, false, {
                            fileName: "[project]/family-messenger/app/page.tsx",
                            lineNumber: 185,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: handleSetupComplete,
                            disabled: !familyKey,
                            className: "w-full py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed",
                            children: "참여하기"
                        }, void 0, false, {
                            fileName: "[project]/family-messenger/app/page.tsx",
                            lineNumber: 186,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/family-messenger/app/page.tsx",
                    lineNumber: 183,
                    columnNumber: 11
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/family-messenger/app/page.tsx",
            lineNumber: 152,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/family-messenger/app/page.tsx",
        lineNumber: 151,
        columnNumber: 5
    }, this);
}
_s1(InitialSetup, "Tj09SCDiego9JngdGqe5mRwbDRA=");
_c1 = InitialSetup;
function ConnectionStatus({ status, peerCount }) {
    const statusConfig = {
        disconnected: {
            color: 'bg-secure-red',
            text: '연결 안됨'
        },
        connecting: {
            color: 'bg-secure-yellow',
            text: '연결 중...'
        },
        connected: {
            color: 'bg-secure-green',
            text: '연결됨'
        }
    };
    const config = statusConfig[status];
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "mb-4 bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex items-center justify-between",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-center gap-3",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: `w-3 h-3 rounded-full ${config.color} ${status === 'connected' ? 'animate-pulse' : ''}`
                        }, void 0, false, {
                            fileName: "[project]/family-messenger/app/page.tsx",
                            lineNumber: 211,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "font-medium text-gray-900 dark:text-white",
                            children: config.text
                        }, void 0, false, {
                            fileName: "[project]/family-messenger/app/page.tsx",
                            lineNumber: 212,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/family-messenger/app/page.tsx",
                    lineNumber: 210,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "text-sm text-gray-600 dark:text-gray-400",
                    children: peerCount > 0 ? `가족원 ${peerCount}명과 연결됨` : '가족원을 기다리는 중...'
                }, void 0, false, {
                    fileName: "[project]/family-messenger/app/page.tsx",
                    lineNumber: 214,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/family-messenger/app/page.tsx",
            lineNumber: 209,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/family-messenger/app/page.tsx",
        lineNumber: 208,
        columnNumber: 5
    }, this);
}
_c2 = ConnectionStatus;
var _c, _c1, _c2;
__turbopack_context__.k.register(_c, "HomePage");
__turbopack_context__.k.register(_c1, "InitialSetup");
__turbopack_context__.k.register(_c2, "ConnectionStatus");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=family-messenger_3a87723b._.js.map