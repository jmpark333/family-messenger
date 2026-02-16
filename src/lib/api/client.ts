// API 클라이언트 - Vercel Functions와 통신
import type {
  CreateFamilyRequest,
  CreateFamilyResponse,
  JoinFamilyRequest,
  JoinFamilyResponse,
  SendMessageRequest,
  SendMessageResponse,
  PollMessagesResponse,
} from './types';

class ApiClient {
  private baseUrl: string;

  constructor() {
    // 개발 중에는 Vite proxy, 프로덕션에서는 상대 경로
    this.baseUrl = import.meta.env.DEV ? '/api' : '/api';
  }

  private async fetchApi(
    endpoint: string,
    options?: RequestInit
  ): Promise<Response> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      headers: { 'Content-Type': 'application/json' },
      ...options,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Unknown error' }));
      throw new Error(error.error || 'API request failed');
    }

    return response;
  }

  async createFamily(
    request: CreateFamilyRequest
  ): Promise<CreateFamilyResponse> {
    const response = await this.fetchApi('/create-family', {
      method: 'POST',
      body: JSON.stringify(request),
    });
    return response.json();
  }

  async joinFamily(request: JoinFamilyRequest): Promise<JoinFamilyResponse> {
    const response = await this.fetchApi('/join-family', {
      method: 'POST',
      body: JSON.stringify(request),
    });
    return response.json();
  }

  async sendMessage(request: SendMessageRequest): Promise<SendMessageResponse> {
    console.log('[apiClient] sendMessage called:', request);
    const response = await this.fetchApi('/send-message', {
      method: 'POST',
      body: JSON.stringify(request),
    });
    const result = await response.json();
    console.log('[apiClient] sendMessage response:', result);
    return result;
  }

  async pollMessages(
    familyId: string,
    since?: number
  ): Promise<PollMessagesResponse> {
    const params = new URLSearchParams({ familyId });
    if (since !== undefined) {
      params.set('since', since.toString());
    }

    const response = await this.fetchApi(`/poll-messages?${params}`);
    return response.json();
  }
}

export const apiClient = new ApiClient();
