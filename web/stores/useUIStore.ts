import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UIState {
  isSidebarCollapsed: boolean;
  isMobileMenuOpen: boolean;
  activeNetworkRequests: number;
  
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  toggleMobileMenu: () => void;
  closeMobileMenu: () => void;
  incrementNetworkRequests: () => void;
  decrementNetworkRequests: () => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      isSidebarCollapsed: false,
      isMobileMenuOpen: false,
      activeNetworkRequests: 0,

      toggleSidebar: () => set((state) => ({ isSidebarCollapsed: !state.isSidebarCollapsed })),
      setSidebarCollapsed: (collapsed) => set({ isSidebarCollapsed: collapsed }),
      toggleMobileMenu: () => set((state) => ({ isMobileMenuOpen: !state.isMobileMenuOpen })),
      closeMobileMenu: () => set({ isMobileMenuOpen: false }),
      incrementNetworkRequests: () => set((state) => ({ activeNetworkRequests: state.activeNetworkRequests + 1 })),
      decrementNetworkRequests: () => set((state) => ({ activeNetworkRequests: Math.max(0, state.activeNetworkRequests - 1) })),
    }),
    {
      name: 'medibridgex-ui-storage',
      partialize: (state) => ({ isSidebarCollapsed: state.isSidebarCollapsed }),
    }
  )
);
