'use client';

import { useEffect } from 'react';
import { useThemeStore } from '@/store/theme';

export const DarkModeToggle = () => {
  const { isDarkMode, toggleDarkMode, setDarkMode } = useThemeStore();

  // Initialize dark mode on mount
  useEffect(() => {
    const storedTheme = localStorage.getItem('theme-store');
    if (storedTheme) {
      const parsed = JSON.parse(storedTheme);
      setDarkMode(parsed.state.isDarkMode);
    }
  }, [setDarkMode]);

  return (
    <div className="flex items-center space-x-3">
      <span className="text-sm font-medium" style={{ color: 'var(--secondary-text)' }}>
        Light
      </span>
      
      <button
        onClick={toggleDarkMode}
        className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white"
        style={{ 
          backgroundColor: isDarkMode ? 'var(--accent)' : 'var(--border)'
        }}
      >
        <span
          className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ease-in-out"
          style={{
            transform: isDarkMode ? 'translateX(1.5rem)' : 'translateX(0.125rem)',
          }}
        />
      </button>
      
      <span className="text-sm font-medium" style={{ color: 'var(--secondary-text)' }}>
        Dark
      </span>
    </div>
  );
}; 