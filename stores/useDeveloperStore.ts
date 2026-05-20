import { create } from 'zustand';
import { developersService } from '@/services/developers.service';
import { ApiKey, WebhookEndpoint, ApiRequestLog, UsageMetric } from '@/types/developers';

interface DeveloperState {
  apiKeys: ApiKey[];
  webhooks: WebhookEndpoint[];
  requestLogs: ApiRequestLog[];
  usageMetrics: UsageMetric[];
  isLoading: boolean;
  error: string | null;

  fetchApiKeys: () => Promise<void>;
  fetchWebhooks: () => Promise<void>;
  fetchLogs: () => Promise<void>;
  fetchMetrics: () => Promise<void>;
  createKey: (name: string, environment: 'live' | 'test', scopes: string[]) => Promise<void>;
  revokeKey: (id: string) => Promise<void>;
  initialize: () => Promise<void>;
}

export const useDeveloperStore = create<DeveloperState>((set, get) => ({
  apiKeys: [],
  webhooks: [],
  requestLogs: [],
  usageMetrics: [],
  isLoading: false,
  error: null,

  fetchApiKeys: async () => {
    set({ isLoading: true });
    try {
      const keys = await developersService.getApiKeys();
      set({ apiKeys: keys, isLoading: false });
    } catch (error) {
      set({ error: 'Failed to fetch API keys', isLoading: false });
    }
  },

  fetchWebhooks: async () => {
    try {
      const webhooks = await developersService.getWebhooks();
      set({ webhooks });
    } catch (error) {
      set({ error: 'Failed to fetch webhooks' });
    }
  },

  fetchLogs: async () => {
    try {
      const response = await developersService.getApiLogs();
      set({ requestLogs: response.data });
    } catch (error) {
      set({ error: 'Failed to fetch request logs' });
    }
  },

  fetchMetrics: async () => {
    try {
      const metrics = await developersService.getUsageMetrics();
      set({ usageMetrics: metrics });
    } catch (error) {
      set({ error: 'Failed to fetch metrics' });
    }
  },

  createKey: async (name: string, environment: 'live' | 'test', scopes: string[]) => {
    set({ isLoading: true });
    try {
      const newKey = await developersService.createApiKey(name, environment, scopes);
      set((state) => ({ 
        apiKeys: [...state.apiKeys, newKey],
        isLoading: false 
      }));
    } catch (error) {
      set({ error: 'Failed to create API key', isLoading: false });
    }
  },

  revokeKey: async (id: string) => {
    set({ isLoading: true });
    try {
      await developersService.revokeApiKey(id);
      set((state) => ({
        apiKeys: state.apiKeys.filter(k => k.id !== id),
        isLoading: false
      }));
    } catch (error) {
      set({ error: 'Failed to revoke API key', isLoading: false });
    }
  },

  initialize: async () => {
    // Only set loading if not already loading
    if (get().isLoading) return;
    
    set({ isLoading: true, error: null });
    try {
      await Promise.all([
        get().fetchApiKeys(),
        get().fetchWebhooks(),
        get().fetchLogs(),
        get().fetchMetrics()
      ]);
    } catch (error) {
      set({ error: 'Failed to initialize developer dashboard' });
    } finally {
      set({ isLoading: false });
    }
  }
}));
