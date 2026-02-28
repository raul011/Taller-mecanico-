'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { UserPreferences } from '@/types/preferences';
import { api } from '@/lib/api';

interface PreferencesContextType {
    preferences: UserPreferences;
    updatePreferences: (prefs: Partial<UserPreferences>) => Promise<void>;
    isLoading: boolean;
}

const PreferencesContext = createContext<PreferencesContextType | undefined>(undefined);

export function PreferencesProvider({ children }: { children: ReactNode }) {
    const [preferences, setPreferences] = useState<UserPreferences>({
        theme: 'dark',
        language: 'es',
        notifications: true,
        dashboardLayout: 'grid',
    });
    const [isLoading, setIsLoading] = useState(true);

    // Load preferences on mount
    useEffect(() => {
        loadPreferences();
    }, []);

    // Apply theme when it changes
    useEffect(() => {
        applyTheme(preferences.theme || 'dark');
    }, [preferences.theme]);

    // Apply color when it changes
    useEffect(() => {
        if (preferences.color) {
            applyColor(preferences.color);
        }
    }, [preferences.color]);

    const loadPreferences = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setIsLoading(false);
                return;
            }

            const prefs = await api.getPreferences(token);
            setPreferences(prefs);
        } catch (error) {
            console.error('Failed to load preferences:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const updatePreferences = async (newPrefs: Partial<UserPreferences>) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) throw new Error('No token');

            const updated = await api.updatePreferences(token, newPrefs);
            setPreferences(updated);
        } catch (error) {
            console.error('Failed to update preferences:', error);
            throw error;
        }
    };

    const applyTheme = (theme: 'light' | 'dark') => {
        console.log('🎨 Applying theme:', theme);
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
            console.log(' tema oscuro agregado to html');
        } else {
            document.documentElement.classList.remove('dark');
            console.log(' Removed dark class from html');
        }
        console.log('Current classes:', document.documentElement.className);
    };

    const applyColor = (color: string) => {
        document.documentElement.style.setProperty('--primary-color', color);
    };

    return (
        <PreferencesContext.Provider value={{ preferences, updatePreferences, isLoading }}>
            {children}
        </PreferencesContext.Provider>
    );
}

export function usePreferences() {
    const context = useContext(PreferencesContext);
    if (!context) {
        throw new Error('usePreferences must be used within PreferencesProvider');
    }
    return context;
}
