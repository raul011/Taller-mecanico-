'use client';

import { useState, useEffect } from 'react';
import { Plus, Search, User, Phone, Mail, X, Loader2 } from 'lucide-react';
import { useTranslation } from '@/lib/hooks/useTranslation';

interface Cliente {
    id: number;
    nombre: string;
    telefono: string;
    email: string;
}

export default function ClientesPage() {
    const { t } = useTranslation();
    const [clientes, setClientes] = useState<Cliente[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        nombre: '',
        telefono: '',
        email: ''
    });

    const fetchClientes = async () => {
        try {
            const token = localStorage.getItem('token');
            const headers: HeadersInit = {};
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }

            const res = await fetch('http://localhost:3001/clientes', {
                headers: headers
            });

            if (res.ok) {
                const data = await res.json();
                setClientes(data);
            } else {
                console.error('Error fetching clients:', res.status, res.statusText);
            }
        } catch (error) {
            console.error('Error fetching clients:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchClientes();
    }, []);

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            const token = localStorage.getItem('token');
            const headers: HeadersInit = {
                'Content-Type': 'application/json'
            };
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }

            const res = await fetch('http://localhost:3001/clientes', {
                method: 'POST',
                headers: headers,
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                // Refresh list and close modal
                await fetchClientes();
                setIsModalOpen(false);
                setFormData({ nombre: '', telefono: '', email: '' });
                alert('Cliente creado exitosamente');
            } else {
                const errorData = await res.text();
                console.error('Server error:', errorData);
                alert(`Error al crear cliente: ${res.status} ${res.statusText}`);
            }
        } catch (error) {
            console.error('Error creating client:', error);
            alert(`Error de conexión: ${error instanceof Error ? error.message : 'Desconocido'}`);
        } finally {
            setSubmitting(false);
        }
    };

    const filteredClientes = clientes.filter(c =>
        c.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6 animate-in fade-in zoom-in-95 duration-500">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">
                        {t('clients.title')}
                    </h1>
                    <p className="text-zinc-600 dark:text-zinc-400 mt-1">{t('clients.subtitle')}</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-medium transition-all shadow-lg shadow-blue-600/20 active:scale-95"
                >
                    <Plus className="w-5 h-5" />
                    {t('clients.newClient')}
                </button>
            </div>

            {/* Filters */}
            <div className="p-4 rounded-2xl bg-zinc-100 dark:bg-zinc-900/50 border border-zinc-200 dark:border-white/5 backdrop-blur-sm">
                <div className="relative max-w-md">
                    <Search className="absolute left-3 top-2.5 w-5 h-5 text-zinc-500" />
                    <input
                        type="text"
                        placeholder={t('clients.searchPlaceholder')}
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
                ) : filteredClientes.length === 0 ? (
                    <div className="p-12 text-center text-zinc-500">
                        {t('clients.noClientsFound')}
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-zinc-100 dark:bg-white/5 text-xs uppercase text-zinc-600 dark:text-zinc-400 font-medium">
                                <tr>
                                    <th className="px-6 py-4">{t('clients.name')}</th>
                                    <th className="px-6 py-4">{t('clients.contact')}</th>
                                    <th className="px-6 py-4 text-right">{t('common.actions')}</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-200 dark:divide-white/5">
                                {filteredClientes.map((cliente: any) => (
                                    <tr key={cliente.id} className="group hover:bg-zinc-50 dark:hover:bg-white/5 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center text-blue-400 font-bold border border-zinc-200 dark:border-white/5">
                                                    {cliente.nombre.charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <p className="font-medium text-zinc-900 dark:text-zinc-200">{cliente.nombre}</p>
                                                    <p className="text-xs text-zinc-500">ID: {cliente.id}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
                                                    <Phone className="w-4 h-4 text-zinc-500 dark:text-zinc-600" />
                                                    {cliente.telefono}
                                                </div>
                                                <div className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
                                                    <Mail className="w-4 h-4 text-zinc-500 dark:text-zinc-600" />
                                                    {cliente.email}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button className="text-blue-400 hover:text-blue-300 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                                                {t('clients.viewDetails')}
                                            </button>
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
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white dark:bg-[#111] border border-zinc-200 dark:border-white/10 rounded-2xl w-full max-w-lg shadow-2xl animate-in zoom-in-95 duration-200">
                        <div className="flex items-center justify-between p-6 border-b border-zinc-200 dark:border-white/5">
                            <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">{t('clients.registerNewClient')}</h2>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleCreate} className="p-6 space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-zinc-700 dark:text-zinc-400">{t('clients.fullName')}</label>
                                <div className="relative">
                                    <User className="absolute left-3 top-2.5 w-5 h-5 text-zinc-500 dark:text-zinc-600" />
                                    <input
                                        type="text"
                                        required
                                        value={formData.nombre}
                                        onChange={e => setFormData({ ...formData, nombre: e.target.value })}
                                        className="w-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-300 dark:border-white/10 rounded-xl py-2 pl-10 pr-4 text-zinc-900 dark:text-zinc-200 focus:outline-none focus:border-blue-500/50"
                                        placeholder="Ej: Juan Pérez"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-zinc-700 dark:text-zinc-400">{t('clients.phone')}</label>
                                    <div className="relative">
                                        <Phone className="absolute left-3 top-2.5 w-5 h-5 text-zinc-500 dark:text-zinc-600" />
                                        <input
                                            type="text"
                                            required
                                            value={formData.telefono}
                                            onChange={e => setFormData({ ...formData, telefono: e.target.value })}
                                            className="w-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-300 dark:border-white/10 rounded-xl py-2 pl-10 pr-4 text-zinc-900 dark:text-zinc-200 focus:outline-none focus:border-blue-500/50"
                                            placeholder="555-1234"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-zinc-700 dark:text-zinc-400">{t('clients.email')}</label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-2.5 w-5 h-5 text-zinc-500 dark:text-zinc-600" />
                                        <input
                                            type="email"
                                            required
                                            value={formData.email}
                                            onChange={e => setFormData({ ...formData, email: e.target.value })}
                                            className="w-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-300 dark:border-white/10 rounded-xl py-2 pl-10 pr-4 text-zinc-900 dark:text-zinc-200 focus:outline-none focus:border-blue-500/50"
                                            placeholder="juan@ejemplo.com"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="pt-4 flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-4 py-2 rounded-xl text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-white/5 transition-colors font-medium"
                                >
                                    {t('common.cancel')}
                                </button>
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-medium transition-colors shadow-lg shadow-blue-600/20 disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
                                >
                                    {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                                    {t('clients.saveClient')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
