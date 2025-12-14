import { config } from '../config';
import { ApiResponse, ApiError } from '../types/api';

class ApiService {
  private baseUrl: string;
  private token: string | null = null;

  constructor() {
    this.baseUrl = config.apiBaseUrl;
    // Attempt to load token from storage if available
    this.token = localStorage.getItem('wysh_auth_token');
  }

  setToken(token: string) {
    this.token = token;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      ...(this.token ? { Authorization: `Bearer ${this.token}` } : {}),
      ...options.headers,
    };

    try {
      const response = await fetch(url, { ...options, headers });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw {
          code: response.status.toString(),
          message: errorData.message || response.statusText,
          details: errorData
        } as ApiError;
      }

      const data: ApiResponse<T> = await response.json();
      return data.data; // Unpack the standardized response
    } catch (error: any) {
      // Gracefully handle network errors for demo/offline resilience
      const isNetworkError = error.message === 'Failed to fetch' || error.name === 'TypeError';
      
      if (isNetworkError) {
          console.warn(`[API] Connection failed to ${endpoint}. Backend may be offline.`);
      } else {
          console.error(`[API] Error request to ${endpoint}:`, error);
      }
      throw error;
    }
  }

  public get<T>(endpoint: string, params?: Record<string, string>) {
    const queryString = params ? '?' + new URLSearchParams(params).toString() : '';
    return this.request<T>(`${endpoint}${queryString}`, { method: 'GET' });
  }

  public post<T>(endpoint: string, body: any) {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(body),
    });
  }

  public put<T>(endpoint: string, body: any) {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(body),
    });
  }

  public patch<T>(endpoint: string, body: any) {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(body),
    });
  }

  public delete<T>(endpoint: string) {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

export const api = new ApiService();