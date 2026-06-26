import { create } from 'zustand';
import { FhirResource, FhirResourceType } from '@/types/fhir';
import { FhirService } from '@/services/fhir.service';

interface FhirState {
  resources: FhirResource[];
  selectedResource: FhirResource | null;
  isLoading: boolean;
  isSyncing: boolean;
  error: string | null;
  
  // UI State
  isDrawerOpen: boolean;
  searchQuery: string;
  typeFilter: FhirResourceType | null;

  // Actions
  fetchResources: () => Promise<void>;
  searchResources: () => Promise<void>;
  selectResource: (id: string | null) => void;
  setSearchQuery: (query: string) => void;
  setTypeFilter: (type: FhirResourceType | null) => void;
  setDrawerOpen: (isOpen: boolean) => void;
  closeDrawer: () => void;
  syncResource: (id: string) => Promise<void>;
}

export const useFhirStore = create<FhirState>((set, get) => ({
  resources: [],
  selectedResource: null,
  isLoading: false,
  isSyncing: false,
  error: null,
  isDrawerOpen: false,
  searchQuery: '',
  typeFilter: null,

  fetchResources: async () => {
    set({ isLoading: true, error: null });
    try {
      const resources = await FhirService.getResources();
      set({ resources, isLoading: false });
    } catch (err) {
      set({ error: 'Failed to fetch resources', isLoading: false });
    }
  },

  searchResources: async () => {
    set({ isLoading: true, error: null });
    try {
      const { searchQuery, typeFilter } = get();
      const resources = await FhirService.searchResources(searchQuery, typeFilter || undefined);
      set({ resources, isLoading: false });
    } catch (err) {
      set({ error: 'Failed to search resources', isLoading: false });
    }
  },

  selectResource: (id) => {
    const resource = get().resources.find(r => r.id === id) || null;
    set({ selectedResource: resource, isDrawerOpen: !!resource });
  },

  setSearchQuery: (searchQuery) => set({ searchQuery }),
  
  setTypeFilter: (typeFilter) => set({ typeFilter }),
  
  setDrawerOpen: (isDrawerOpen) => set({ isDrawerOpen }),
  
  closeDrawer: () => set({ isDrawerOpen: false, selectedResource: null }),

  syncResource: async (id) => {
    set({ isSyncing: true });
    try {
      const success = await FhirService.syncResource(id);
      if (success) {
        await get().searchResources();
      }
    } catch (err) {
      set({ error: 'Sync failed' });
    } finally {
      set({ isSyncing: false });
    }
  }
}));
