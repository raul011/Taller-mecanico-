'use client';

import { useState, useEffect } from 'react';
import {
    Plus,
    Search,
    Wrench,
    Loader2,
    Trash2,
    Edit,
    X,
    Save
} from 'lucide-react';
import { api } from '@/lib/api';
import type { Servicio } from '@/types/servicios';

export default function ServiciosPage() {
    const [servicios, setServicios] = useState<Servicio[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
    const [currentService, setCurrentService] = useState<Partial<Servicio>>({});
    const [saving, setSaving] = useState(false);

    const fetchServicios = async () => {
        try {
            const token = localStorage.getItem('token');
            if (token) {
                const data = await api.getServicios(token);
                setServicios(data);
            }
        } catch (error) {
            console.error('Error fetching services:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchServicios();
    }, []);

    const filteredServicios = servicios.filter(s =>
        s.descripcion.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleOpenCreate = () => {
        setModalMode('create');
        setCurrentService({ descripcion: '', costo: 0 });
        setIsModalOpen(true);
    };

    const handleOpenEdit = (servicio: Servicio) => {
        setModalMode('edit');
        setCurrentService(servicio);
        setIsModalOpen(true);
    };

    const handleDelete = async (id: number) => {
        if (!confirm('¿Está seguro de eliminar este servicio?')) return;
        try {
            const token = localStorage.getItem('token');
            if (token) {
                await api.deleteServicio(token, id);
                fetchServicios();
            }
        } catch (error) {
            alert('Error al eliminar servicio');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            const token = localStorage.getItem('token');
            if (token) {
                if (modalMode === 'create') {
                    await api.createServicio(token, currentService);
                } else {
                    await api.updateServicio(token, currentService.id!, currentService);
                }
                setIsModalOpen(false);
                fetchServicios();
            }
        } catch (error) {
            alert('Error al guardar servicio: ' + (error instanceof Error ? error.message : ''));
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in zoom-in-95 duration-500">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">
                        Servicios
                    </h1>
                    <p className="text-zinc-600 dark:text-zinc-400 mt-1">Gestione el catálogo de servicios del taller</p>
                </div>
                <button
                    onClick={handleOpenCreate}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-medium transition-all shadow-lg shadow-blue-600/20 active:scale-95"
                >
                    <Plus className="w-5 h-5" />
                    Nuevo Servicio
                </button>
            </div>

            {/* Filters */}
            <div className="p-4 rounded-2xl bg-zinc-100 dark:bg-zinc-900/50 border border-zinc-200 dark:border-white/5 backdrop-blur-sm">
                <div className="relative max-w-md">
                    <Search className="absolute left-3 top-2.5 w-5 h-5 text-zinc-500" />
                    <input
                        type="text"
                        placeholder="Buscar servicio..."
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
                ) : filteredServicios.length === 0 ? (
                    <div className="p-12 text-center text-zinc-500 flex flex-col items-center gap-3">
                        <Wrench className="w-12 h-12 opacity-20" />
                        <p>No se encontraron servicios</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-zinc-100 dark:bg-white/5 text-xs uppercase text-zinc-600 dark:text-zinc-400 font-medium">
                                <tr>
                                    <th className="px-6 py-4">ID</th>
                                    <th className="px-6 py-4">Descripción</th>
                                    <th className="px-6 py-4">Costo Base</th>
                                    <th className="px-6 py-4 text-right">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-200 dark:divide-white/5">
                                {filteredServicios.map((servicio) => (
                                    <tr key={servicio.id} className="group hover:bg-zinc-50 dark:hover:bg-white/5 transition-colors">
                                        <td className="px-6 py-4 text-zinc-500 font-mono text-sm">#{servicio.id}</td>
                                        <td className="px-6 py-4 font-medium text-zinc-900 dark:text-zinc-200">
                                            {servicio.descripcion}
                                        </td>
                                        <td className="px-6 py-4 text-zinc-600 dark:text-zinc-400">
                                            ${Number(servicio.costo).toFixed(2)}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                <button
                                                    onClick={() => handleOpenEdit(servicio)}
                                                    className="p-2 text-zinc-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-lg transition-colors"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(servicio.id)}
                                                    className="p-2 text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white dark:bg-[#111] border border-zinc-200 dark:border-white/10 rounded-2xl w-full max-w-md shadow-2xl p-6 animate-in zoom-in-95 duration-200">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-zinc-900 dark:text-white">
                                {modalMode === 'create' ? 'Nuevo Servicio' : 'Editar Servicio'}
                            </h2>
                            <button onClick={() => setIsModalOpen(false)} className="text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Descripción</label>
                                <input
                                    type="text"
                                    required
                                    value={currentService.descripcion || ''}
                                    onChange={(e) => setCurrentService({ ...currentService, descripcion: e.target.value })}
                                    className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-300 dark:border-white/10 rounded-xl py-2 px-3 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-blue-500"
                                    placeholder="Ej: Cambio de Aceite"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Costo ($)</label>
                                <input
                                    type="number"
                                    required
                                    min="0"
                                    step="0.01"
                                    value={currentService.costo || ''}
                                    onChange={(e) => setCurrentService({ ...currentService, costo: Number(e.target.value) })}
                                    className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-300 dark:border-white/10 rounded-xl py-2 px-3 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-blue-500"
                                />
                            </div>

                            <div className="flex justify-end gap-2 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-4 py-2 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-white/5 rounded-xl font-medium"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-medium shadow-lg shadow-blue-600/20 disabled:opacity-70"
                                >
                                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                    Guardar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
