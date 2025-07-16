import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ThemeStore {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  setDarkMode: (isDark: boolean) => void;
}

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set, get) => ({
      isDarkMode: false,
      
      toggleDarkMode: () => {
        const { isDarkMode } = get();
        const newMode = !isDarkMode;
        
        set({ isDarkMode: newMode });
        
        // Apply dark mode to document
        if (newMode) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      },
      
      setDarkMode: (isDark: boolean) => {
        set({ isDarkMode: isDark });
        
        // Apply dark mode to document
        if (isDark) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      },
    }),
    {
      name: 'theme-store',
      version: 1,
    }
  )
); 