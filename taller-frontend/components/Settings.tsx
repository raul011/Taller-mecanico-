'use client';

import { usePreferences } from '@/contexts/PreferencesContext';
import { Sun, Moon, Palette, Globe, Bell, LayoutGrid, List } from 'lucide-react';
import { useTranslation } from '@/lib/hooks/useTranslation';

export default function Settings() {
    const { t } = useTranslation();
    const { preferences, updatePreferences } = usePreferences();

    const handleThemeChange = async (theme: 'light' | 'dark') => {
        await updatePreferences({ theme });
    };

    const handleColorChange = async (color: string) => {
        await updatePreferences({ color });
    };

    const handleLanguageChange = async (language: 'es' | 'en') => {
        await updatePreferences({ language });
    };

    const handleLayoutChange = async (layout: 'grid' | 'list') => {
        await updatePreferences({ dashboardLayout: layout });
    };

    const handleNotificationsChange = async (notifications: boolean) => {
        await updatePreferences({ notifications });
    };

    return (
        <div className="p-6 bg-white dark:bg-white/5 backdrop-blur-xl border border-zinc-200 dark:border-white/10 rounded-2xl shadow-2xl">
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-6">⚙️ Configuración</h2>

            <div className="space-y-6">
                {/* Theme */}
                <div>
                    <label className="flex items-center gap-2 text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-3">
                        {preferences.theme === 'dark' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
                        {t('settings.theme')}
                    </label>
                    <div className="flex gap-3">
                        <button
                            onClick={() => handleThemeChange('light')}
                            className={`flex-1 px-4 py-3 rounded-xl font-medium transition-all ${preferences.theme === 'light'
                                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-600/20'
                                : 'bg-zinc-100 dark:bg-zinc-900/50 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-800/50 border border-zinc-300 dark:border-white/10'
                                }`}
                        >
                            <Sun className="w-5 h-5 inline mr-2" />
                            {t('settings.light')}
                        </button>
                        <button
                            onClick={() => handleThemeChange('dark')}
                            className={`flex-1 px-4 py-3 rounded-xl font-medium transition-all ${preferences.theme === 'dark'
                                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-600/20'
                                : 'bg-zinc-100 dark:bg-zinc-900/50 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-800/50 border border-zinc-300 dark:border-white/10'
                                }`}
                        >
                            <Moon className="w-5 h-5 inline mr-2" />
                            {t('settings.dark')}
                        </button>
                    </div>
                </div>

                {/* Color */}
                <div>
                    <label className="flex items-center gap-2 text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-3">
                        <Palette className="w-4 h-4" />
                        {t('settings.primaryColor')}
                    </label>
                    <div className="flex items-center gap-3">
                        <input
                            type="color"
                            value={preferences.color || '#3b82f6'}
                            onChange={(e) => handleColorChange(e.target.value)}
                            className="w-16 h-12 rounded-xl cursor-pointer bg-transparent border-2 border-zinc-300 dark:border-white/10"
                        />
                        <span className="text-zinc-600 dark:text-zinc-400 text-sm font-mono">
                            {preferences.color || '#3b82f6'}
                        </span>
                    </div>
                </div>

                {/* Language */}
                <div>
                    <label className="flex items-center gap-2 text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-3">
                        <Globe className="w-4 h-4" />
                        {t('settings.language')}
                    </label>
                    <select
                        value={preferences.language || 'es'}
                        onChange={(e) => handleLanguageChange(e.target.value as 'es' | 'en')}
                        className="w-full px-4 py-3 bg-zinc-100 dark:bg-zinc-900/50 border border-zinc-300 dark:border-white/10 rounded-xl text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 transition-all"
                    >
                        <option value="es">🇪🇸 Español</option>
                        <option value="en">🇬🇧 English</option>
                    </select>
                </div>

                {/* Layout */}
                <div>
                    <label className="flex items-center gap-2 text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-3">
                        <LayoutGrid className="w-4 h-4" />
                        {t('settings.dashboardView')}
                    </label>
                    <div className="flex gap-3">
                        <button
                            onClick={() => handleLayoutChange('grid')}
                            className={`flex-1 px-4 py-3 rounded-xl font-medium transition-all ${preferences.dashboardLayout === 'grid'
                                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-600/20'
                                : 'bg-zinc-100 dark:bg-zinc-900/50 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-800/50 border border-zinc-300 dark:border-white/10'
                                }`}
                        >
                            <LayoutGrid className="w-5 h-5 inline mr-2" />
                            {t('settings.grid')}
                        </button>
                        <button
                            onClick={() => handleLayoutChange('list')}
                            className={`flex-1 px-4 py-3 rounded-xl font-medium transition-all ${preferences.dashboardLayout === 'list'
                                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-600/20'
                                : 'bg-zinc-100 dark:bg-zinc-900/50 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-800/50 border border-zinc-300 dark:border-white/10'
                                }`}
                        >
                            <List className="w-5 h-5 inline mr-2" />
                            {t('settings.list')}
                        </button>
                    </div>
                </div>

                {/* Notifications */}
                <div>
                    <label className="flex items-center justify-between p-4 bg-zinc-100 dark:bg-zinc-900/50 border border-zinc-300 dark:border-white/10 rounded-xl cursor-pointer hover:bg-zinc-200 dark:hover:bg-zinc-800/50 transition-all">
                        <div className="flex items-center gap-3">
                            <Bell className="w-5 h-5 text-zinc-600 dark:text-zinc-400" />
                            <span className="font-semibold text-zinc-700 dark:text-zinc-300">Notificaciones</span>
                        </div>
                        <input
                            type="checkbox"
                            checked={preferences.notifications ?? true}
                            onChange={(e) => handleNotificationsChange(e.target.checked)}
                            className="w-5 h-5 rounded border-zinc-300 dark:border-white/10 bg-white dark:bg-white/5 text-blue-500 focus:ring-offset-0 focus:ring-2 focus:ring-blue-500/20"
                        />
                    </label>
                </div>
            </div>
        </div>
    );
}
