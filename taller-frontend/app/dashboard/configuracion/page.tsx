'use client';

import Settings from '@/components/Settings';
import { useTranslation } from '@/lib/hooks/useTranslation';

export default function ConfiguracionPage() {
    const { t } = useTranslation();

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">
                    {t('settings.title')}
                </h1>
                <p className="text-zinc-600 dark:text-zinc-400 mt-2">
                    {t('settings.subtitle')}
                </p>
            </div>

            {/* Settings Component */}
            <Settings />
        </div>
    );
}
