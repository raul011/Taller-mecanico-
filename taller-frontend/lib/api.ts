import type { AuthResponse, UserPreferences } from '@/types/preferences';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export const api = {
    async login(email: string, password: string): Promise<AuthResponse> {
        const res = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });

        if (!res.ok) {
            throw new Error('Login failed');
        }

        return res.json();
    },

    async getPreferences(token: string): Promise<UserPreferences> {
        const res = await fetch(`${API_URL}/users/preferences`, {
            headers: { 'Authorization': `Bearer ${token}` },
        });

        if (!res.ok) {
            throw new Error('Failed to get preferences');
        }

        return res.json();
    },

    async updatePreferences(
        token: string,
        preferences: Partial<UserPreferences>
    ): Promise<UserPreferences> {
        const res = await fetch(`${API_URL}/users/preferences`, {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(preferences),
        });

        if (!res.ok) {
            throw new Error('Failed to update preferences');
        }

        return res.json();
    },
};
