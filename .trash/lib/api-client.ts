import { API_CONFIG } from '@/config/api';
import { ApiError, ApiErrorResponse } from '@/types/api';
import { useUIStore } from '@/stores/useUIStore';
import { toast } from 'sonner';

type RequestOptions = RequestInit & {
  timeout?: number;
  params?: Record<string, string | number | boolean | null | undefined>;
};

class ApiClient {
  private baseUrl: string;
  private pendingRequests = new Map<string, Promise<unknown>>();

  constructor(baseUrl: string = API_CONFIG.BASE_URL) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    const { timeout = API_CONFIG.TIMEOUT, params, ...fetchOptions } = options;

    // Construct URL with query parameters
    let url = `${this.baseUrl}${endpoint}`;
    if (params) {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, String(value));
        }
      });
      const queryString = searchParams.toString();
      if (queryString) {
        url += `?${queryString}`;
      }
    }

    const isGet = !fetchOptions.method || fetchOptions.method.toUpperCase() === 'GET';
    const cacheKey = isGet ? url : null;

    // Deduplication: If a GET request to this exact URL is already in flight, return its Promise
    if (cacheKey && this.pendingRequests.has(cacheKey)) {
      return this.pendingRequests.get(cacheKey) as Promise<T>;
    }

    const requestPromise = (async () => {
      // Notify global store that a request started
      useUIStore.getState().incrementNetworkRequests();

      // Abort controller for timeouts
      const controller = new AbortController();
      const id = setTimeout(() => controller.abort(), timeout);

      const headers = new Headers(fetchOptions.headers);
      if (!headers.has('Content-Type')) {
        headers.set('Content-Type', 'application/json');
      }

      // Auth is handled via httpOnly cookie — automatically sent by browser
      // for same-origin requests. No client-side token injection needed.

      try {
        const response = await fetch(url, {
          ...fetchOptions,
          headers,
          signal: controller.signal,
        });

        clearTimeout(id);

        const data = await this.parseResponse(response);

        if (!response.ok) {
          const errorData = data as ApiErrorResponse;
          const errorMsg = errorData?.error?.message || 'An unexpected error occurred';
          toast.error(errorMsg); // Global error toast
          throw new ApiError(
            errorMsg,
            response.status,
            errorData?.error?.code || 'INTERNAL_ERROR',
            errorData?.error?.requestId || 'unknown',
            errorData?.error?.details
          );
        }

        return data as T;
      } catch (error: unknown) {
        clearTimeout(id);
        
        if (error instanceof ApiError) {
          throw error;
        }

        if (error instanceof Error) {
          if (error.name === 'AbortError') {
            toast.error('Request timed out. The server took too long to respond.');
            throw new ApiError('Request timed out', 408, 'REQUEST_TIMEOUT', 'timeout');
          }
          toast.error(error.message || 'Network error');
          throw new ApiError(error.message || 'Network error', 0, 'NETWORK_ERROR', 'network');
        }
        
        toast.error('An unknown error occurred');
        throw new ApiError('An unknown error occurred', 0, 'UNKNOWN_ERROR', 'unknown');
      } finally {
        useUIStore.getState().decrementNetworkRequests();
        if (cacheKey) {
          this.pendingRequests.delete(cacheKey);
        }
      }
    })();

    if (cacheKey) {
      this.pendingRequests.set(cacheKey, requestPromise);
    }

    return requestPromise;
  }

  private async parseResponse(response: Response): Promise<unknown> {
    const contentType = response.headers.get('content-type');
    try {
      if (contentType && contentType.includes('application/json')) {
        return await response.json();
      }
      return await response.text();
    } catch (err) {
      return null;
    }
  }

  public get<T>(endpoint: string, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'GET' });
  }

  public post<T>(endpoint: string, body?: unknown, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: JSON.stringify(body),
    });
  }

  public put<T>(endpoint: string, body?: unknown, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(body),
    });
  }

  public patch<T>(endpoint: string, body?: unknown, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PATCH',
      body: JSON.stringify(body),
    });
  }

  public delete<T>(endpoint: string, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' });
  }
}

export const apiClient = new ApiClient();
