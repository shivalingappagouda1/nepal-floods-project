/**
 * HIMALAYA-SHIELD: Centralized API Client Layer
 * 
 * Provides typed HTTP communication with the FastAPI backend.
 * Handles baseURL configuration, error handling, and response unwrapping.
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
  provenance?: {
    tier: string;
    source: string;
    timestamp?: string;
    algorithm?: string;
    isDemoValue?: boolean;
  };
  error?: {
    code: string;
    message: string;
    path?: string;
    details?: unknown;
  };
}

export class ApiClientError extends Error {
  public statusCode?: number;
  public errorCode?: string;
  public details?: unknown;

  constructor(message: string, statusCode?: number, errorCode?: string, details?: unknown) {
    super(message);
    this.name = 'ApiClientError';
    this.statusCode = statusCode;
    this.errorCode = errorCode;
    this.details = details;
  }
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl.replace(/\/$/, '');
  }

  public getBaseUrl(): string {
    return this.baseUrl;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...(options.headers as Record<string, string> || {}),
    };

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      const json: ApiResponse<T> = await response.json();

      if (!response.ok || json.success === false) {
        throw new ApiClientError(
          json.error?.message || json.message || `Request failed with status ${response.status}`,
          response.status,
          json.error?.code,
          json.error?.details
        );
      }

      return json.data;
    } catch (err: unknown) {
      if (err instanceof ApiClientError) {
        throw err;
      }
      const message = err instanceof Error ? err.message : 'Unknown network error';
      throw new ApiClientError(`API network error: ${message}`);
    }
  }

  public async get<T>(endpoint: string, params?: Record<string, string | number | boolean | undefined>): Promise<T> {
    let url = endpoint;
    if (params) {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, val]) => {
        if (val !== undefined && val !== null) {
          searchParams.append(key, String(val));
        }
      });
      const qs = searchParams.toString();
      if (qs) {
        url += (url.includes('?') ? '&' : '?') + qs;
      }
    }
    return this.request<T>(url, { method: 'GET' });
  }

  public async post<T, B = unknown>(endpoint: string, body?: B): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    });
  }
}

export const apiClient = new ApiClient(API_BASE_URL);
