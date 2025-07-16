'use client';

import { useEffect, useState } from 'react';
import { useThemeStore } from '@/store/theme';

interface ThemeProviderProps {
  children: React.ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const { isDarkMode, setDarkMode } = useThemeStore();
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    // Initialize theme from localStorage on mount
    const storedTheme = localStorage.getItem('theme-store');
    if (storedTheme) {
      try {
        const parsed = JSON.parse(storedTheme);
        const darkMode = parsed.state?.isDarkMode ?? false;
        setDarkMode(darkMode);
      } catch (error) {
        console.error('Failed to parse theme from localStorage:', error);
      }
    }

    // Apply theme immediately to prevent flash
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    setIsHydrated(true);
  }, [isDarkMode, setDarkMode]);

  // Apply theme changes
  useEffect(() => {
    if (isHydrated) {
      if (isDarkMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  }, [isDarkMode, isHydrated]);

  // Prevent hydration mismatch by not rendering until hydrated
  if (!isHydrated) {
    return (
      <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
        <div className="flex flex-col items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-[var(--accent)] border-t-transparent mb-4"></div>
          <p className="text-sm text-[var(--secondary-text)]">Loading...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
} 