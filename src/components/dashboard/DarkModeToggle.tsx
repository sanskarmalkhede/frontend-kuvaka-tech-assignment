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
    <button
      onClick={toggleDarkMode}
      className="p-2 rounded-lg transition-colors outline-none hover:bg-[var(--hover-bg)] focus:outline-none"
      style={{ 
        color: 'var(--secondary-text)'
      }}
      title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {isDarkMode ? (
        <svg 
          className="w-5 h-5" 
          fill="currentColor" 
          viewBox="0 0 24 24"
        >
          <path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"/>
        </svg>
      ) : (
        <svg 
          className="w-5 h-5" 
          fill="currentColor" 
          viewBox="0 0 24 24"
        >
          <path d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"/>
        </svg>
      )}
    </button>
  );
}; 