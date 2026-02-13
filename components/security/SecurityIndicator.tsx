'use client';

import { useState, useEffect } from 'react';
import { useChatStore } from '@/stores/chat-store';

interface SecurityStatus {
  level: 'secure' | 'warning' | 'insecure';
  message: string;
}

export default function SecurityIndicator() {
  const { isAuthenticated, connectionStatus, peers } = useChatStore();
  const [securityStatus, setSecurityStatus] = useState<SecurityStatus>({
    level: 'secure',
    message: 'E2E 암호화 활성화',
  });

  useEffect(() => {
    if (!isAuthenticated) {
      setSecurityStatus({
        level: 'insecure',
        message: '미인증',
      });
      return;
    }

    if (connectionStatus !== 'connected') {
      setSecurityStatus({
        level: 'warning',
        message: '연결 안됨',
      });
      return;
    }

    const connectedCount = Array.from(peers.values()).filter((p) => p.connected).length;

    if (connectedCount === 0) {
      setSecurityStatus({
        level: 'warning',
        message: '가족원 대기 중',
      });
      return;
    }

    setSecurityStatus({
      level: 'secure',
      message: 'E2E 암호화',
    });
  }, [isAuthenticated, connectionStatus, peers]);

  const levelConfig = {
    secure: {
      containerClass: 'bg-secure-green/10 text-secure-green border-secure-green/20',
      dotClass: 'bg-secure-green animate-pulse',
      icon: '🔒',
    },
    warning: {
      containerClass: 'bg-secure-yellow/10 text-secure-yellow border-secure-yellow/20',
      dotClass: 'bg-secure-yellow animate-pulse',
      icon: '⚠️',
    },
    insecure: {
      containerClass: 'bg-secure-red/10 text-secure-red border-secure-red/20',
      dotClass: 'bg-secure-red',
      icon: '🔓',
    },
  };

  const config = levelConfig[securityStatus.level];

  return (
    <div className={`security-badge ${config.containerClass} border`}>
      <div className={`w-2 h-2 rounded-full ${config.dotClass}`} />
      <span className="font-medium">
        {config.icon} {securityStatus.message}
      </span>
    </div>
  );
}
