// src/theme/ThemeContext.jsx
/* eslint-disable react-refresh/only-export-components -- Provider component and its hook intentionally share this module */
import { createContext, useContext, useEffect, useState } from 'react';

const STORAGE_KEY = 'terrabloom-theme';

// Restore the last picked theme (persisted across reloads). Defaults to light.
const getInitialTheme = () => {
    try {
        const saved = window.localStorage.getItem(STORAGE_KEY);
        if (saved === 'dark') return true;
        if (saved === 'light') return false;
    } catch {
        // localStorage unavailable (private mode / embedded webview) - fall back to light
    }
    return false;
};

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    const [isDark, setIsDark] = useState(getInitialTheme);

    const toggleTheme = () => {
        setIsDark((prev) => {
            const next = !prev;
            try {
                window.localStorage.setItem(STORAGE_KEY, next ? 'dark' : 'light');
            } catch {
                // ignore write failures - the in-memory theme still works
            }
            return next;
        });
    };

    // Single source of truth: keep <html> in sync with the active theme so every
    // page renders it - including the admin dashboard, which has no per-page
    // theme effect of its own.
    useEffect(() => {
        document.documentElement.classList.toggle('dark', isDark);
    }, [isDark]);

    return (
        <ThemeContext.Provider value={{ isDark, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => useContext(ThemeContext);
