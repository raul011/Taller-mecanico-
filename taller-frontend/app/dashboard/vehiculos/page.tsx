'use client';

import { useState, useEffect } from 'react';
import { Plus, Search, Car, Calendar, Hash, User, X, Loader2 } from 'lucide-react';

interface Auto {
    id: number;
    marca: string;
    modelo: string;
    placa: string;
    anio: number;
    clienteId: number;
    cliente?: { nombre: string }; // Optional if backend returns expanded data
}

interface Cliente {
    id: number;
    nombre: string;
}

export default function VehiculosPage() {
    const [vehiculos, setVehiculos] = useState<Auto[]>([]);
    const [clientes, setClientes] = useState<Cliente[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        marca: '',
        modelo: '',
        placa: '',
        anio: '',
        clienteId: ''
    });

    const getHeaders = () => {
        const token = localStorage.getItem('token');
        const headers: HeadersInit = { 'Content-Type': 'application/json' };
        if (token) headers['Authorization'] = `Bearer ${token}`;
        return headers;
    };

    const fetchData = async () => {
        try {
            setLoading(true);
            const headers = getHeaders();

            const [autosRes, clientesRes] = await Promise.all([
                fetch('http://localhost:3001/autos', { headers }),
                fetch('http://localhost:3001/clientes', { headers })
            ]);

            if (autosRes.ok) {
                const data = await autosRes.json();
                setVehiculos(data);
            }

            if (clientesRes.ok) {
                const data = await clientesRes.json();
                setClientes(data);
            }

        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            const body = {
                ...formData,
                anio: parseInt(formData.anio),
                clienteId: parseInt(formData.clienteId)
            };

            const res = await fetch('http://localhost:3001/autos', {
                method: 'POST',
                headers: getHeaders(),
                body: JSON.stringify(body)
            });

            if (res.ok) {
                await fetchData();
                setIsModalOpen(false);
                setFormData({ marca: '', modelo: '', placa: '', anio: '', clienteId: '' });
                alert('Vehículo registrado exitosamente');
            } else {
                const txt = await res.text();
                console.error('Error:', txt);
                alert(`Error al registrar: ${res.statusText}`);
            }
        } catch (error) {
            console.error('Error creating vehicle:', error);
            alert('Error de conexión');
        } finally {
            setSubmitting(false);
        }
    };

    const filteredVehiculos = vehiculos.filter(v =>
        v.placa.toLowerCase().includes(searchTerm.toLowerCase()) ||
        v.marca.toLowerCase().includes(searchTerm.toLowerCase()) ||
        v.modelo.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6 animate-in fade-in zoom-in-95 duration-500">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">
                        Gestión de Vehículos
                    </h1>
                    <p className="text-zinc-600 dark:text-zinc-400 mt-1">Control de flota y asignación de clientes.</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl font-medium transition-all shadow-lg shadow-purple-600/20 active:scale-95"
                >
                    <Plus className="w-5 h-5" />
                    <span>Nuevo Vehículo</span>
                </button>
            </div>

            {/* Filters */}
            <div className="p-4 rounded-2xl bg-zinc-100 dark:bg-zinc-900/50 border border-zinc-200 dark:border-white/5 backdrop-blur-sm">
                <div className="relative max-w-md">
                    <Search className="absolute left-3 top-2.5 w-5 h-5 text-zinc-500" />
                    <input
                        type="text"
                        placeholder="Buscar por placa, marca o modelo..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-white dark:bg-black/20 border border-zinc-300 dark:border-white/10 rounded-xl py-2 pl-10 pr-4 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-500 dark:placeholder:text-zinc-600 focus:outline-none focus:border-purple-500/50 transition-all"
                    />
                </div>
            </div>

            {/* List */}
            <div className="rounded-2xl border border-zinc-200 dark:border-white/5 overflow-hidden bg-white dark:bg-zinc-900/50 backdrop-blur-sm">
                {loading ? (
                    <div className="p-12 flex justify-center">
                        <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
                    </div>
                ) : filteredVehiculos.length === 0 ? (
                    <div className="p-12 text-center text-zinc-500">
                        No se encontraron vehículos registrados.
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-zinc-100 dark:bg-white/5 text-xs uppercase text-zinc-600 dark:text-zinc-400 font-medium">
                                <tr>
                                    <th className="px-6 py-4">Vehículo</th>
                                    <th className="px-6 py-4">Detalles</th>
                                    <th className="px-6 py-4">Cliente Asignado</th>
                                    <th className="px-6 py-4 text-right">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-200 dark:divide-white/5">
                                {filteredVehiculos.map((auto) => (
                                    <tr key={auto.id} className="group hover:bg-zinc-50 dark:hover:bg-white/5 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center text-purple-400 border border-zinc-200 dark:border-white/5">
                                                    <Car className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <p className="font-medium text-zinc-900 dark:text-zinc-200">{auto.marca} {auto.modelo}</p>
                                                    <p className="text-xs text-zinc-500">ID: {auto.id}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
                                                    <Hash className="w-4 h-4 text-zinc-500 dark:text-zinc-600" />
                                                    <span className="font-mono bg-zinc-100 dark:bg-white/5 px-1.5 rounded text-xs">{auto.placa}</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
                                                    <Calendar className="w-4 h-4 text-zinc-500 dark:text-zinc-600" />
                                                    {auto.anio}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            {auto.cliente ? (
                                                <div className="flex items-center gap-2 text-sm text-zinc-700 dark:text-zinc-300">
                                                    <User className="w-4 h-4 text-zinc-500" />
                                                    {auto.cliente.nombre}
                                                </div>
                                            ) : (
                                                <span className="text-xs text-zinc-600 italic">Cliente ID: {auto.clienteId}</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button className="text-purple-400 hover:text-purple-300 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                                                Ver Historial
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
                            <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">Registrar Nuevo Vehículo</h2>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleCreate} className="p-6 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-zinc-700 dark:text-zinc-400">Marca</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.marca}
                                        onChange={e => setFormData({ ...formData, marca: e.target.value })}
                                        className="w-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-300 dark:border-white/10 rounded-xl py-2 px-4 text-zinc-900 dark:text-zinc-200 focus:outline-none focus:border-purple-500/50"
                                        placeholder="Toyota"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-zinc-700 dark:text-zinc-400">Modelo</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.modelo}
                                        onChange={e => setFormData({ ...formData, modelo: e.target.value })}
                                        className="w-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-300 dark:border-white/10 rounded-xl py-2 px-4 text-zinc-900 dark:text-zinc-200 focus:outline-none focus:border-purple-500/50"
                                        placeholder="Corolla"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-zinc-700 dark:text-zinc-400">Placa</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.placa}
                                        onChange={e => setFormData({ ...formData, placa: e.target.value })}
                                        className="w-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-300 dark:border-white/10 rounded-xl py-2 px-4 text-zinc-900 dark:text-zinc-200 focus:outline-none focus:border-purple-500/50"
                                        placeholder="ABC-123"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-zinc-700 dark:text-zinc-400">Año</label>
                                    <input
                                        type="number"
                                        required
                                        value={formData.anio}
                                        onChange={e => setFormData({ ...formData, anio: e.target.value })}
                                        className="w-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-300 dark:border-white/10 rounded-xl py-2 px-4 text-zinc-900 dark:text-zinc-200 focus:outline-none focus:border-purple-500/50"
                                        placeholder="2024"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-zinc-700 dark:text-zinc-400">Propietario (Cliente)</label>
                                <select
                                    required
                                    value={formData.clienteId}
                                    onChange={e => setFormData({ ...formData, clienteId: e.target.value })}
                                    className="w-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-300 dark:border-white/10 rounded-xl py-2 px-4 text-zinc-900 dark:text-zinc-200 focus:outline-none focus:border-purple-500/50 appearance-none"
                                >
                                    <option value="">Seleccione un cliente...</option>
                                    {clientes.map(cliente => (
                                        <option key={cliente.id} value={cliente.id}>
                                            {cliente.nombre}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="pt-4 flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-4 py-2 rounded-xl text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-white/5 transition-colors font-medium"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl font-medium transition-colors shadow-lg shadow-purple-600/20 disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
                                >
                                    {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                                    Registrar Vehículo
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

