'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { User, Car, FileText, Loader2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { api } from '@/lib/api';

export default function NuevaOrdenPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    // Data
    const [autos, setAutos] = useState<any[]>([]);
    const [mechanics, setMechanics] = useState<any[]>([]);

    // Form State
    const [selectedAutoId, setSelectedAutoId] = useState<number | ''>('');
    const [selectedMechanicId, setSelectedMechanicId] = useState<string>('');
    const [observaciones, setObservaciones] = useState('');

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            try {
                const token = localStorage.getItem('token');
                if (token) {
                    const [autosData, mechanicsData] = await Promise.all([
                        api.getAutos(),
                        api.getMechanics(token)
                    ]);
                    console.log('Autos Data:', autosData);
                    setAutos(autosData);
                    setMechanics(mechanicsData);
                }
            } catch (error) {
                console.error('Error loading data:', error);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedAutoId) return;

        setSubmitting(true);
        try {
            const token = localStorage.getItem('token');
            if (token) {
                await api.createOrden(token, {
                    autoId: Number(selectedAutoId),
                    mechanicId: selectedMechanicId || undefined,
                    observaciones: observaciones
                });
                router.push('/dashboard/ordenes');
            }
        } catch (error) {
            console.error('Error creating order:', error);
            alert('Error al crear la orden');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in zoom-in-95 duration-500">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Link
                    href="/dashboard/ordenes"
                    className="p-2 -ml-2 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-white/5 rounded-full transition-colors"
                >
                    <ArrowLeft className="w-6 h-6" />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">
                        Nueva Orden de Trabajo
                    </h1>
                    <p className="text-zinc-600 dark:text-zinc-400">Ingrese los detalles para registrar un nuevo servicio</p>
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center p-12">
                    <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="p-6 bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-white/5 rounded-2xl shadow-sm space-y-6 backdrop-blur-sm">

                    {/* Vehicle Select */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Vehículo</label>
                        <div className="relative">
                            <Car className="absolute left-3 top-2.5 w-5 h-5 text-zinc-500" />
                            <select
                                required
                                value={selectedAutoId}
                                onChange={(e) => setSelectedAutoId(Number(e.target.value))}
                                className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-300 dark:border-white/10 rounded-xl py-2 pl-10 pr-4 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-blue-500/50 appearance-none"
                            >
                                <option value="">Seleccione un vehículo</option>
                                {autos.map(auto => (
                                    <option key={auto.id} value={auto.id}>
                                        {auto.placa} - {auto.marca} {auto.modelo} ({auto.cliente?.nombre || 'Sin cliente'})
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Mechanic Select */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Mecánico Asignado (Opcional)</label>
                        <div className="relative">
                            <User className="absolute left-3 top-2.5 w-5 h-5 text-zinc-500" />
                            <select
                                value={selectedMechanicId}
                                onChange={(e) => setSelectedMechanicId(e.target.value)}
                                className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-300 dark:border-white/10 rounded-xl py-2 pl-10 pr-4 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-blue-500/50 appearance-none"
                            >
                                <option value="">Sin asignar</option>
                                {mechanics.map(mechanic => (
                                    <option key={mechanic.id} value={mechanic.id}>
                                        {mechanic.fullName}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Observations */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Observaciones</label>
                        <div className="relative">
                            <textarea
                                value={observaciones}
                                onChange={(e) => setObservaciones(e.target.value)}
                                rows={4}
                                className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-300 dark:border-white/10 rounded-xl py-2 px-4 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-blue-500/50 resize-fnone"
                                placeholder="Describa el problema o los servicios requeridos..."
                            />
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="pt-4 flex justify-end gap-3">
                        <Link
                            href="/dashboard/ordenes"
                            className="px-4 py-2 rounded-xl text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-white/5 transition-colors font-medium"
                        >
                            Cancelar
                        </Link>
                        <button
                            type="submit"
                            disabled={submitting || !selectedAutoId}
                            className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-medium transition-colors shadow-lg shadow-blue-600/20 disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                            {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                            Crear Orden
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
}
