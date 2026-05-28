"use client";
import { useEffect } from 'react';

export default function ThemeListener() {
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const applyTheme = (isDark: boolean) => {
      if (isDark) document.documentElement.classList.add('dark');
      else document.documentElement.classList.remove('dark');
    };
    const handler = (e: MediaQueryListEvent) => applyTheme(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);
  
  return null;
}
