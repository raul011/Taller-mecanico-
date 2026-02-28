import { usePreferences } from '@/contexts/PreferencesContext';
import esTranslations from '@/lib/translations/es.json';
import enTranslations from '@/lib/translations/en.json';

type TranslationKey = string;

const translations = {
    es: esTranslations,
    en: enTranslations,
};

export function useTranslation() {
    const { preferences } = usePreferences();
    const currentLanguage = preferences.language || 'es';

    const t = (key: TranslationKey): string => {
        const keys = key.split('.');
        let value: any = translations[currentLanguage as 'es' | 'en'];

        for (const k of keys) {
            value = value?.[k];
        }

        return value || key;
    };

    return { t, language: currentLanguage };
}
