'use client';

import { useState, useEffect } from 'react';
import { X, Calendar as CalendarIcon, Clock, Car, User, FileText } from 'lucide-react';
import { api } from '@/lib/api';

interface CreateCitaModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    initialDate?: Date;
}

export default function CreateCitaModal({ isOpen, onClose, onSuccess, initialDate }: CreateCitaModalProps) {
    const [formData, setFormData] = useState({
        fecha: '',
        hora: '09:00',
        clienteId: '',
        autoId: '',
        motivo: '',
        notas: ''
    });
    const [clientes, setClientes] = useState<any[]>([]);
    const [autos, setAutos] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen) {
            loadClientes();
            if (initialDate) {
                setFormData(prev => ({
                    ...prev,
                    fecha: initialDate.toISOString().split('T')[0]
                }));
            }
        }
    }, [isOpen, initialDate]);

    const loadClientes = async () => {
        try {
            const data = await api.getClientes();
            setClientes(data);
        } catch (error) {
            console.error('Error loading clientes:', error);
        }
    };

    const loadAutos = async (clienteId: string) => {
        try {
            console.log('Loading autos for client:', clienteId);
            // Fetch all autos and filter client side
            const data = await api.getAutos('');
            console.log('All autos fetched:', data);

            const filteredAutos = data.filter((a: any) => {
                const autoClienteId = a.cliente?.id || a.clienteId || a.cliente; // Handle object, property, or direct ID
                // Ensure we compare numbers or matching strings
                const match = autoClienteId && (Number(autoClienteId) === Number(clienteId));
                console.log(`Checking auto ${a.id}: foundId=${autoClienteId}, selected=${clienteId}, match=${match}`);
                return match;
            });
            console.log('Filtered autos:', filteredAutos);

            setAutos(filteredAutos);

            // Auto-select if only one vehicle
            if (filteredAutos.length === 1) {
                setFormData(prev => ({ ...prev, autoId: filteredAutos[0].id }));
            }
        } catch (error) {
            console.error('Error loading autos:', error);
        }
    };

    const handleClienteChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const clienteId = e.target.value;
        setFormData(prev => ({ ...prev, clienteId, autoId: '' }));
        if (clienteId) {
            loadAutos(clienteId);
        } else {
            setAutos([]);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Combine date and time
            const fechaHora = new Date(`${formData.fecha}T${formData.hora}:00`);

            await api.createCita({
                fechaHora: fechaHora.toISOString(),
                motivo: formData.motivo,
                clienteId: Number(formData.clienteId), // Sending number ID
                autoId: formData.autoId ? Number(formData.autoId) : undefined,
                notas: formData.notas
            });

            onSuccess();
            onClose();
            // Reset form
            setFormData({
                fecha: '',
                hora: '09:00',
                clienteId: '',
                autoId: '',
                motivo: '',
                notas: ''
            });
        } catch (error) {
            console.error('Error creating cita:', error);
            alert('Error al crear la cita');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg w-full max-w-md p-6 relative shadow-xl">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                >
                    <X className="w-5 h-5" />
                </button>

                <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-gray-900">
                    <CalendarIcon className="w-5 h-5 text-blue-600" />
                    Nueva Cita
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Fecha</label>
                            <input
                                type="date"
                                required
                                className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none bg-white text-gray-900"
                                value={formData.fecha}
                                onChange={e => setFormData({ ...formData, fecha: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Hora</label>
                            <input
                                type="time"
                                required
                                className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none bg-white text-gray-900"
                                value={formData.hora}
                                onChange={e => setFormData({ ...formData, hora: e.target.value })}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                            <User className="w-4 h-4" /> Cliente
                        </label>
                        <select
                            required
                            className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none bg-white text-gray-900"
                            value={formData.clienteId}
                            onChange={handleClienteChange}
                        >
                            <option value="">Seleccionar Cliente</option>
                            {clientes.map(c => (
                                <option key={c.id} value={c.id}>{c.nombre || c.fullName}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                            <Car className="w-4 h-4" /> Vehículo (Opcional)
                        </label>
                        <select
                            className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none bg-white text-gray-900 disabled:bg-gray-100 disabled:text-gray-500"
                            value={formData.autoId}
                            onChange={e => setFormData({ ...formData, autoId: e.target.value })}
                            disabled={!formData.clienteId}
                        >
                            <option value="">Seleccionar Vehículo</option>
                            {autos.map(auto => (
                                <option key={auto.id} value={auto.id}>
                                    {auto.marca} {auto.modelo} ({auto.placa})
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                            <FileText className="w-4 h-4" /> Motivo
                        </label>
                        <textarea
                            required
                            className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none bg-white text-gray-900 placeholder-gray-400"
                            rows={2}
                            placeholder="Ej: Cambio de aceite, Revisión frenos..."
                            value={formData.motivo}
                            onChange={e => setFormData({ ...formData, motivo: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Notas Adicionales</label>
                        <textarea
                            className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none bg-white text-gray-900 placeholder-gray-400"
                            rows={2}
                            value={formData.notas}
                            onChange={e => setFormData({ ...formData, notas: e.target.value })}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                    >
                        {loading ? 'Guardando...' : 'Agendar Cita'}
                    </button>
                </form>
            </div>
        </div>
    );
}
