export interface UserPreferences {
    theme?: 'light' | 'dark';
    color?: string;
    language?: 'es' | 'en';
    notifications?: boolean;
    dashboardLayout?: 'grid' | 'list';
}
