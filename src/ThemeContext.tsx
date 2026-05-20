import React, { createContext, useContext, useEffect, useState } from 'react';

export type ThemeType = 'dark' | 'light' | 'cyber' | 'obsidian';

export const THEMES: { id: ThemeType; label: string; color: string }[] = [
  { id: 'dark', label: 'Classic Dark', color: '#F0FF42' },
  { id: 'light', label: 'Pure Light', color: '#3D44FF' },
  { id: 'cyber', label: 'Neon Cyber', color: '#FF00E5' },
  { id: 'obsidian', label: 'Obsidian', color: '#818CF8' },
];

interface ThemeContextType {
  theme: ThemeType;
  setTheme: (theme: ThemeType) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<ThemeType>(() => {
    const saved = localStorage.getItem('app-theme');
    return (saved as ThemeType) || 'dark';
  });

  const setTheme = (newTheme: ThemeType) => {
    setThemeState(newTheme);
    localStorage.setItem('app-theme', newTheme);
  };

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('dark', 'light', 'cyber', 'obsidian');
    root.classList.add(theme);
    
    // Also manage basic data-theme attribute
    root.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
