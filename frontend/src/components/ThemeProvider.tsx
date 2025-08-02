'use client';

import { useEffect } from 'react';
import { useThemeStore } from '@/lib/stores/theme-store';

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { isDarkMode, setDarkMode } = useThemeStore();

  useEffect(() => {
    // Check for system preference on first load
    if (typeof window !== 'undefined') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      
      // Only set system preference if no stored preference exists
      const stored = localStorage.getItem('theme-storage');
      if (!stored) {
        setDarkMode(mediaQuery.matches);
      }

      // Listen for system theme changes
      const handleChange = (e: MediaQueryListEvent) => {
        const stored = localStorage.getItem('theme-storage');
        if (!stored) {
          setDarkMode(e.matches);
        }
      };

      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, [setDarkMode]);

  return <>{children}</>;
}
