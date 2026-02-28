'use client';

import { useState, useEffect } from 'react';
import { Plus, Search, ClipboardList, Loader2, Calendar, User, Car } from 'lucide-react';
import Link from 'next/link';
import { api } from '@/lib/api';
import type { OrdenTrabajo } from '@/types/orden-trabajo';

export default function OrdenesPage() {
    const [ordenes, setOrdenes] = useState<OrdenTrabajo[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    const fetchOrdenes = async () => {
        try {
            const token = localStorage.getItem('token');
            if (token) {
                const data = await api.getOrdenes(token);
                setOrdenes(data);
            }
        } catch (error) {
            console.error('Error fetching orders:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrdenes();
    }, []);

    // Filter logic (simple client name or plate search)
    const filteredOrdenes = ordenes.filter(orden =>
        orden.auto.placa.toLowerCase().includes(searchTerm.toLowerCase()) ||
        orden.auto.modelo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (orden.mechanic?.fullName || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending': return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
            case 'in_progress': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
            case 'finished': return 'bg-green-500/10 text-green-500 border-green-500/20';
            case 'paid': return 'bg-purple-500/10 text-purple-500 border-purple-500/20';
            case 'cancelled': return 'bg-red-500/10 text-red-500 border-red-500/20';
            default: return 'bg-zinc-500/10 text-zinc-500 border-zinc-500/20';
        }
    };

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'pending': return 'Pendiente';
            case 'in_progress': return 'En Progreso';
            case 'finished': return 'Terminado';
            case 'paid': return 'Pagado';
            case 'cancelled': return 'Cancelado';
            default: return status;
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in zoom-in-95 duration-500">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">
                        Ordenes de Trabajo
                    </h1>
                    <p className="text-zinc-600 dark:text-zinc-400 mt-1">Gestione las reparaciones y servicios del taller</p>
                </div>
                <Link
                    href="/dashboard/ordenes/nueva"
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-medium transition-all shadow-lg shadow-blue-600/20 active:scale-95"
                >
                    <Plus className="w-5 h-5" />
                    Nueva Orden
                </Link>
            </div>

            {/* Filters */}
            <div className="p-4 rounded-2xl bg-zinc-100 dark:bg-zinc-900/50 border border-zinc-200 dark:border-white/5 backdrop-blur-sm">
                <div className="relative max-w-md">
                    <Search className="absolute left-3 top-2.5 w-5 h-5 text-zinc-500" />
                    <input
                        type="text"
                        placeholder="Buscar por placa, modelo o mecánico..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-white dark:bg-black/20 border border-zinc-300 dark:border-white/10 rounded-xl py-2 pl-10 pr-4 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-500 dark:placeholder:text-zinc-600 focus:outline-none focus:border-blue-500/50 transition-all"
                    />
                </div>
            </div>

            {/* List */}
            <div className="rounded-2xl border border-zinc-200 dark:border-white/5 overflow-hidden bg-white dark:bg-zinc-900/50 backdrop-blur-sm">
                {loading ? (
                    <div className="p-12 flex justify-center">
                        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
                    </div>
                ) : filteredOrdenes.length === 0 ? (
                    <div className="p-12 text-center text-zinc-500 flex flex-col items-center gap-3">
                        <ClipboardList className="w-12 h-12 opacity-20" />
                        <p>No se encontraron ordenes de trabajo</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-zinc-100 dark:bg-white/5 text-xs uppercase text-zinc-600 dark:text-zinc-400 font-medium">
                                <tr>
                                    <th className="px-6 py-4">ID</th>
                                    <th className="px-6 py-4">Vehículo</th>
                                    <th className="px-6 py-4">Mecánico</th>
                                    <th className="px-6 py-4">Estado</th>
                                    <th className="px-6 py-4">Fecha Ingreso</th>
                                    <th className="px-6 py-4 text-right">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-200 dark:divide-white/5">
                                {filteredOrdenes.map((orden) => (
                                    <tr key={orden.id} className="group hover:bg-zinc-50 dark:hover:bg-white/5 transition-colors">
                                        <td className="px-6 py-4 text-zinc-500 font-mono text-sm">#{orden.id}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-500">
                                                    <Car className="w-4 h-4" />
                                                </div>
                                                <div>
                                                    <p className="font-medium text-zinc-900 dark:text-zinc-200">{orden.auto.marca} {orden.auto.modelo}</p>
                                                    <p className="text-xs text-zinc-500 uppercase">{orden.auto.placa}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            {orden.mechanic ? (
                                                <div className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
                                                    <User className="w-4 h-4 text-zinc-500" />
                                                    {orden.mechanic.fullName}
                                                </div>
                                            ) : (
                                                <span className="text-xs text-zinc-400 italic">No asignado</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2.5 py-1 rounded-lg text-xs font-medium border ${getStatusColor(orden.status)}`}>
                                                {getStatusLabel(orden.status)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2 text-sm text-zinc-500">
                                                <Calendar className="w-4 h-4" />
                                                {new Date(orden.dateIn).toLocaleDateString()}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <Link
                                                href={`/dashboard/ordenes/${orden.id}`}
                                                className="text-blue-500 hover:text-blue-400 text-sm font-medium transition-colors"
                                            >
                                                Ver Detalles
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
