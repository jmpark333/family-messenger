/**
 * Offline Message Queue
 *
 * Manages message queuing for offline scenarios with automatic retry logic.
 * Messages are stored in IndexedDB and automatically sent when connection is restored.
 */

import type { DataMessage } from '@/types';

export interface QueuedMessage {
  id: string;
  message: DataMessage;
  attempts: number;
  lastAttempt?: number;
  nextRetry: number;
  status: 'pending' | 'sending' | 'failed';
}

export interface MessageQueueConfig {
  maxRetries?: number;
  retryDelay?: number; // Base delay in ms
  maxRetryDelay?: number; // Max delay in ms
  storageKey?: string;
}

export interface MessageQueueEvents {
  onMessageQueued?: (message: QueuedMessage) => void;
  onMessageSent?: (messageId: string) => void;
  onMessageFailed?: (messageId: string, error: Error) => void;
  onQueueEmpty?: () => void;
}

const DEFAULT_CONFIG: Required<MessageQueueConfig> = {
  maxRetries: 5,
  retryDelay: 1000, // 1 second
  maxRetryDelay: 60000, // 1 minute
  storageKey: 'family-messenger-message-queue',
};

/**
 * Message Queue for Offline Support
 *
 * Features:
 * - Queue messages when offline
 * - Automatic retry with exponential backoff
 * - Persistent storage using localStorage
 * - Connection status monitoring
 * - Batch processing of queued messages
 */
export class MessageQueue {
  private config: Required<MessageQueueConfig>;
  private events: MessageQueueEvents;
  private queue: Map<string, QueuedMessage> = new Map();
  private isProcessing: boolean = false;
  private processingTimer: number | null = null;
  private isOnline: boolean = true;
  private storageCheckInterval: number | null = null;

  constructor(config: MessageQueueConfig = {}, events: MessageQueueEvents = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
    this.events = events;

    if (typeof window !== 'undefined') {
      this.loadFromStorage();
      this.setupOnlineListeners();
      this.startProcessing();
    }
  }

  /**
   * Set up online/offline event listeners
   */
  private setupOnlineListeners(): void {
    if (typeof window === 'undefined') return;

    // Listen for online/offline events
    window.addEventListener('online', () => {
      console.log('[MessageQueue] Connection restored');
      this.isOnline = true;
      this.startProcessing();
    });

    window.addEventListener('offline', () => {
      console.log('[MessageQueue] Connection lost');
      this.isOnline = false;
    });

    // Check initial online status
    this.isOnline = navigator.onLine;
  }

  /**
   * Load queue from localStorage
   */
  private loadFromStorage(): void {
    try {
      const stored = localStorage.getItem(this.config.storageKey);
      if (stored) {
        const data = JSON.parse(stored) as QueuedMessage[];
        this.queue = new Map(data.map(msg => [msg.id, msg]));
        console.log(`[MessageQueue] Loaded ${this.queue.size} messages from storage`);
      }
    } catch (error) {
      console.error('[MessageQueue] Failed to load from storage:', error);
    }
  }

  /**
   * Save queue to localStorage
   */
  private saveToStorage(): void {
    try {
      const data = Array.from(this.queue.values());
      localStorage.setItem(this.config.storageKey, JSON.stringify(data));
    } catch (error) {
      console.error('[MessageQueue] Failed to save to storage:', error);
    }
  }

  /**
   * Start processing the queue
   */
  private startProcessing(): void {
    if (this.isProcessing) return;

    this.isProcessing = true;
    this.processQueue();

    // Set up interval to check for messages ready to retry
    if (this.processingTimer === null) {
      this.processingTimer = window.setInterval(() => {
        this.processQueue();
      }, 1000); // Check every second
    }
  }

  /**
   * Stop processing the queue
   */
  private stopProcessing(): void {
    this.isProcessing = false;

    if (this.processingTimer !== null) {
      clearInterval(this.processingTimer);
      this.processingTimer = null;
    }
  }

  /**
   * Process the queue - send messages that are ready
   */
  private async processQueue(): Promise<void> {
    if (!this.isOnline || !this.isProcessing) {
      return;
    }

    const now = Date.now();
    const messagesToSend: QueuedMessage[] = [];

    // Find messages ready to send
    for (const [id, queued] of this.queue.entries()) {
      if (queued.status === 'pending' || (queued.nextRetry <= now && queued.status !== 'failed')) {
        messagesToSend.push(queued);
      }
    }

    if (messagesToSend.length === 0) {
      if (this.queue.size === 0 && this.events.onQueueEmpty) {
        this.events.onQueueEmpty();
      }
      return;
    }

    // Send each message
    for (const queued of messagesToSend) {
      if (queued.status === 'failed') {
        continue; // Skip permanently failed messages
      }

      queued.status = 'sending';
      queued.lastAttempt = now;

      // Import P2PManager dynamically to avoid circular dependencies
      const { getP2PManager } = await import('@/lib/webrtc/peer');
      const p2pManager = getP2PManager();

      if (!p2pManager) {
        console.log('[MessageQueue] P2P manager not available, queuing for retry');
        this.scheduleRetry(queued);
        continue;
      }

      // Check if we have any connected peers
      const connectedPeers = p2pManager.getConnectedPeers();
      if (connectedPeers.length === 0) {
        console.log('[MessageQueue] No connected peers, queuing for retry');
        this.scheduleRetry(queued);
        continue;
      }

      try {
        // Send the message
        p2pManager.broadcast(queued.message);

        // Success - remove from queue
        this.queue.delete(queued.id);
        this.saveToStorage();

        if (this.events.onMessageSent) {
          this.events.onMessageSent(queued.id);
        }

        console.log(`[MessageQueue] Message sent successfully: ${queued.id}`);
      } catch (error) {
        console.error(`[MessageQueue] Failed to send message ${queued.id}:`, error);
        this.scheduleRetry(queued);

        if (this.events.onMessageFailed) {
          this.events.onMessageFailed(queued.id, error as Error);
        }
      }
    }

    // Check if queue is empty
    if (this.queue.size === 0 && this.events.onQueueEmpty) {
      this.events.onQueueEmpty();
    }
  }

  /**
   * Schedule a retry for a failed message
   */
  private scheduleRetry(queued: QueuedMessage): void {
    queued.attempts++;

    if (queued.attempts >= this.config.maxRetries) {
      console.log(`[MessageQueue] Message ${queued.id} exceeded max retries, marking as failed`);
      queued.status = 'failed';
      this.saveToStorage();
      return;
    }

    // Calculate exponential backoff delay
    const delay = Math.min(
      this.config.retryDelay * Math.pow(2, queued.attempts),
      this.config.maxRetryDelay
    );

    // Add some jitter to avoid thundering herd
    const jitter = Math.random() * 0.3 * delay;
    queued.nextRetry = Date.now() + delay + jitter;
    queued.status = 'pending';

    this.saveToStorage();
    console.log(`[MessageQueue] Scheduled retry for ${queued.id} in ${Math.round((delay + jitter) / 1000)}s`);
  }

  /**
   * Enqueue a message for sending
   * @param message - The DataMessage to send
   * @returns The queued message ID
   */
  enqueue(message: DataMessage): string {
    const queued: QueuedMessage = {
      id: crypto.randomUUID(),
      message,
      attempts: 0,
      nextRetry: Date.now(),
      status: 'pending',
    };

    this.queue.set(queued.id, queued);
    this.saveToStorage();

    if (this.events.onMessageQueued) {
      this.events.onMessageQueued(queued);
    }

    console.log(`[MessageQueue] Message enqueued: ${queued.id}`);

    // Try to send immediately if online
    if (this.isOnline) {
      this.processQueue();
    }

    return queued.id;
  }

  /**
   * Remove a message from the queue
   * @param messageId - The queued message ID to remove
   */
  dequeue(messageId: string): boolean {
    const removed = this.queue.delete(messageId);
    if (removed) {
      this.saveToStorage();
    }
    return removed;
  }

  /**
   * Get the current queue size
   */
  getQueueSize(): number {
    return this.queue.size;
  }

  /**
   * Get all queued messages
   */
  getQueuedMessages(): QueuedMessage[] {
    return Array.from(this.queue.values());
  }

  /**
   * Get pending messages (not failed)
   */
  getPendingMessages(): QueuedMessage[] {
    return Array.from(this.queue.values()).filter(m => m.status !== 'failed');
  }

  /**
   * Clear all messages from the queue
   */
  clear(): void {
    this.queue.clear();
    this.saveToStorage();
  }

  /**
   * Retry a specific failed message
   * @param messageId - The message ID to retry
   */
  retryMessage(messageId: string): boolean {
    const queued = this.queue.get(messageId);
    if (!queued) return false;

    queued.attempts = 0;
    queued.nextRetry = Date.now();
    queued.status = 'pending';
    this.saveToStorage();

    if (this.isOnline) {
      this.processQueue();
    }

    return true;
  }

  /**
   * Retry all failed messages
   */
  retryAll(): void {
    for (const [id, queued] of this.queue.entries()) {
      if (queued.status === 'failed') {
        queued.attempts = 0;
        queued.nextRetry = Date.now();
        queued.status = 'pending';
      }
    }
    this.saveToStorage();

    if (this.isOnline) {
      this.processQueue();
    }
  }

  /**
   * Update the configuration
   */
  updateConfig(config: Partial<MessageQueueConfig>): void {
    this.config = { ...this.config, ...config };
  }

  /**
   * Check if currently online
   */
  isConnectionOnline(): boolean {
    return this.isOnline;
  }

  /**
   * Destroy the queue and clean up
   */
  destroy(): void {
    this.stopProcessing();
    this.queue.clear();

    if (this.storageCheckInterval !== null) {
      clearInterval(this.storageCheckInterval);
    }

    try {
      localStorage.removeItem(this.config.storageKey);
    } catch (error) {
      console.error('[MessageQueue] Failed to clear storage:', error);
    }
  }
}

// ============ Message Queue Singleton ============

let messageQueueInstance: MessageQueue | null = null;

export function initMessageQueue(
  config?: MessageQueueConfig,
  events?: MessageQueueEvents
): MessageQueue {
  if (messageQueueInstance) {
    messageQueueInstance.destroy();
  }

  messageQueueInstance = new MessageQueue(config, events);
  return messageQueueInstance;
}

export function getMessageQueue(): MessageQueue | null {
  return messageQueueInstance;
}

export function destroyMessageQueue(): void {
  if (messageQueueInstance) {
    messageQueueInstance.destroy();
    messageQueueInstance = null;
  }
}
