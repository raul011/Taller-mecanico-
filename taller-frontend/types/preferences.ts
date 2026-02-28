export interface UserPreferences {
    theme?: 'light' | 'dark';
    color?: string;
    language?: 'es' | 'en';
    notifications?: boolean;
    dashboardLayout?: 'grid' | 'list';
}

export interface User {
    id: string;
    email: string;
    fullName: string;
    roles: string[];
    preferences: UserPreferences;
}

export interface AuthResponse {
    access_token: string;
    refresh_token: string;
    preferences: UserPreferences;
    id: string;
    email: string;
    fullName: string;
    roles: string[];
    isActive: boolean;
}
