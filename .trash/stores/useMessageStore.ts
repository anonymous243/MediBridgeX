import { create } from 'zustand';
import { Message, PipelineMetrics, MessageActivity } from '@/types/message';
import { MessageService } from '@/services/messages.service';

interface MessageState {
  messages: Message[];
  selectedMessage: Message | null;
  metrics: PipelineMetrics | null;
  activities: MessageActivity[];
  isLoading: boolean;
  isReplaying: boolean;
  error: string | null;
  
  // Filters
  filterQuery: string;
  statusFilter: string | null;

  // Actions
  fetchMessages: () => Promise<void>;
  fetchMetrics: () => Promise<void>;
  fetchActivities: () => Promise<void>;
  selectMessage: (id: string | null) => void;
  setFilterQuery: (query: string) => void;
  setStatusFilter: (status: string | null) => void;
  replayMessage: (id: string) => Promise<void>;
}

export const useMessageStore = create<MessageState>((set, get) => ({
  messages: [],
  selectedMessage: null,
  metrics: null,
  activities: [],
  isLoading: false,
  isReplaying: false,
  error: null,
  filterQuery: '',
  statusFilter: null,

  fetchMessages: async () => {
    set({ isLoading: true, error: null });
    try {
      const messages = await MessageService.getMessages();
      set({ messages, isLoading: false });
    } catch (err) {
      set({ error: 'Failed to fetch messages', isLoading: false });
    }
  },

  fetchMetrics: async () => {
    try {
      const metrics = await MessageService.getPipelineMetrics();
      set({ metrics });
    } catch (err) {
      console.error('Failed to fetch metrics', err);
    }
  },

  fetchActivities: async () => {
    try {
      const activities = await MessageService.getActivities();
      set({ activities });
    } catch (err) {
      console.error('Failed to fetch activities', err);
    }
  },

  selectMessage: (id) => {
    const message = get().messages.find(m => m.id === id) || null;
    set({ selectedMessage: message });
  },

  setFilterQuery: (filterQuery) => set({ filterQuery }),
  
  setStatusFilter: (statusFilter) => set({ statusFilter }),

  replayMessage: async (id) => {
    set({ isReplaying: true });
    try {
      const success = await MessageService.replayMessage(id);
      if (success) {
        // Optimistic update or refetch
        await get().fetchMessages();
      }
    } catch (err) {
      set({ error: 'Replay failed' });
    } finally {
      set({ isReplaying: false });
    }
  }
}));

