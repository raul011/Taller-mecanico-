import type { AuthResponse, UserPreferences } from '@/types/preferences';
import type { OrdenTrabajo, CreateOrdenTrabajoDto, AddItemDto, OrderStatus } from '@/types/orden-trabajo';

export interface Cita {
    id: number;
    fechaHora: string;
    motivo: string;
    status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
    cliente: { id: number; nombre: string; email?: string; telefono?: string };
    auto?: { id: number; marca: string; modelo: string; placa: string };
    notas?: string;
}

export interface CreateCitaDto {
    fechaHora: string;
    motivo: string;
    clienteId: number;
    autoId?: number;
    notas?: string;
}

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
            cache: 'no-store',
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

    // Work Orders
    async getOrdenes(token: string, filters: { clientId?: number; autoId?: number } = {}): Promise<OrdenTrabajo[]> {
        const query = new URLSearchParams();
        if (filters.clientId) query.append('clientId', filters.clientId.toString());
        if (filters.autoId) query.append('autoId', filters.autoId.toString());

        const res = await fetch(`${API_URL}/orden-trabajo?${query.toString()}`, {
            headers: { 'Authorization': `Bearer ${token}` },
            cache: 'no-store',
        });

        if (!res.ok) throw new Error('Failed to fetch orders');
        return res.json();
    },

    async getOrden(token: string, id: number): Promise<OrdenTrabajo> {
        const res = await fetch(`${API_URL}/orden-trabajo/${id}`, {
            headers: { 'Authorization': `Bearer ${token}` },
            cache: 'no-store',
        });

        if (!res.ok) throw new Error('Failed to fetch order');
        return res.json();
    },

    async createOrden(token: string, data: CreateOrdenTrabajoDto): Promise<OrdenTrabajo> {
        const res = await fetch(`${API_URL}/orden-trabajo`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (!res.ok) throw new Error('Failed to create order');
        return res.json();
    },

    async changeStatus(token: string, id: number, status: OrderStatus): Promise<OrdenTrabajo> {
        const res = await fetch(`${API_URL}/orden-trabajo/${id}/status`, {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ status }),
        });

        if (!res.ok) throw new Error('Failed to update status');
        return res.json();
    },

    async addItem(token: string, id: number, item: AddItemDto): Promise<OrdenTrabajo> {
        const res = await fetch(`${API_URL}/orden-trabajo/${id}/items`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(item),
        });

        if (!res.ok) throw new Error('Failed to add item');
        return res.json();
    },

    async removeItem(token: string, id: number, itemId: number): Promise<OrdenTrabajo> {
        const res = await fetch(`${API_URL}/orden-trabajo/${id}/items/${itemId}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` },
        });

        if (!res.ok) throw new Error('Failed to remove item');
        return res.json();
    },

    async getAutos(search?: string): Promise<any[]> {
        const token = localStorage.getItem('token');
        const query = new URLSearchParams();
        if (search) query.append('search', search);

        const res = await fetch(`${API_URL}/autos?${query.toString()}`, {
            headers: { 'Authorization': `Bearer ${token}` },
            cache: 'no-store',
        });

        if (!res.ok) throw new Error('Failed to fetch autos');
        return res.json();
    },

    async getMechanics(token: string): Promise<any[]> {
        const res = await fetch(`${API_URL}/users?role=mechanic`, {
            headers: { 'Authorization': `Bearer ${token}` },
            cache: 'no-store',
        });

        if (!res.ok) throw new Error('Failed to fetch mechanics');
        return res.json();
    },

    async getServicios(token: string): Promise<any[]> {
        const res = await fetch(`${API_URL}/servicios-trabajo`, {
            headers: { 'Authorization': `Bearer ${token}` },
            cache: 'no-store',
        });

        if (!res.ok) throw new Error('Failed to fetch services');
        return res.json();
    },

    async createServicio(token: string, data: any): Promise<any> {
        const res = await fetch(`${API_URL}/servicios-trabajo`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (!res.ok) throw new Error('Failed to create service');
        return res.json();
    },

    async updateServicio(token: string, id: number, data: any): Promise<any> {
        const res = await fetch(`${API_URL}/servicios-trabajo/${id}`, {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (!res.ok) throw new Error('Failed to update service');
        return res.json();
    },

    async deleteServicio(token: string, id: number): Promise<void> {
        const res = await fetch(`${API_URL}/servicios-trabajo/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` },
        });

        if (!res.ok) throw new Error('Failed to delete service');
    },

    async getRepuestos(token: string): Promise<any[]> {
        const res = await fetch(`${API_URL}/repuestos`, {
            headers: { 'Authorization': `Bearer ${token}` },
            cache: 'no-store',
        });

        if (!res.ok) throw new Error('Failed to fetch parts');
        return res.json();
    },

    // Users (Mechanics)
    async getUsers(token: string, role?: string): Promise<any[]> {
        const query = role ? `?role=${role}` : '';
        const res = await fetch(`${API_URL}/users${query}`, {
            headers: { 'Authorization': `Bearer ${token}` },
            cache: 'no-store',
        });
        if (!res.ok) throw new Error('Failed to fetch users');
        return res.json();
    },

    async createUser(token: string, data: any): Promise<any> {
        const res = await fetch(`${API_URL}/users`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
        if (!res.ok) throw new Error('Failed to create user');
        return res.json();
    },

    async updateUser(token: string, id: string, data: any): Promise<any> {
        const res = await fetch(`${API_URL}/users/${id}`, {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
        if (!res.ok) throw new Error('Failed to update user');
        return res.json();
    },

    async deleteUser(token: string, id: string): Promise<void> {
        const res = await fetch(`${API_URL}/users/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` },
        });
        if (!res.ok) throw new Error('Failed to delete user');
    },

    // Citas
    async getCitas(start?: string, end?: string): Promise<Cita[]> {
        const token = localStorage.getItem('token');
        const query = new URLSearchParams();
        if (start) query.append('start', start);
        if (end) query.append('end', end);

        const res = await fetch(`${API_URL}/citas?${query.toString()}`, {
            headers: { 'Authorization': `Bearer ${token}` },
            cache: 'no-store',
        });

        if (!res.ok) throw new Error('Failed to fetch citas');
        return res.json();
    },

    async createCita(data: CreateCitaDto): Promise<Cita> {
        const token = localStorage.getItem('token');
        const res = await fetch(`${API_URL}/citas`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (!res.ok) throw new Error('Failed to create cita');
        return res.json();
    },

    async getClientes(): Promise<any[]> {
        const token = localStorage.getItem('token');
        const res = await fetch(`${API_URL}/clientes`, {
            headers: { 'Authorization': `Bearer ${token}` },
            cache: 'no-store',
        });
        if (!res.ok) throw new Error('Failed to fetch clientes');
        return res.json();
    },
};


