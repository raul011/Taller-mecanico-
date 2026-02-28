import { useState, useEffect, useMemo } from 'react';
import { X, Calendar, Wrench, FileText, CheckCircle, Tag, Clock, Search, ArrowLeft, User, Car } from 'lucide-react';
import { api } from '@/lib/api';
import type { OrdenTrabajo } from '@/types/orden-trabajo';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface VehiculoHistorialModalProps {
    isOpen: boolean;
    onClose: () => void;
    auto: {
        id: number;
        marca: string;
        modelo: string;
        placa: string;
    } | null;
}

export default function VehiculoHistorialModal({ isOpen, onClose, auto }: VehiculoHistorialModalProps) {
    const [ordenes, setOrdenes] = useState<OrdenTrabajo[]>([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);

    useEffect(() => {
        if (isOpen && auto) {
            fetchHistorial();
            setSelectedOrderId(null);
        } else {
            setOrdenes([]);
            setSelectedOrderId(null);
        }
    }, [isOpen, auto]);

    const fetchHistorial = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token') || '';
            const data = await api.getOrdenes(token, { autoId: auto?.id });

            // Sort by date DESC (newest first) automatically
            const sorted = data.sort((a, b) => new Date(b.dateIn).getTime() - new Date(a.dateIn).getTime());
            setOrdenes(sorted);
        } catch (error) {
            console.error('Error fetching historial:', error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusStyle = (status: string) => {
        switch (status) {
            case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'in_progress': return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'finished': return 'bg-indigo-100 text-indigo-800 border-indigo-200';
            case 'paid': return 'bg-green-100 text-green-800 border-green-200';
            case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
            default: return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'pending': return 'Pendiente';
            case 'in_progress': return 'En Progreso';
            case 'finished': return 'Finalizado';
            case 'paid': return 'Al Día (Pagado)';
            case 'cancelled': return 'Cancelado';
            default: return status;
        }
    };

    const filteredOrdenes = useMemo(() => {
        if (!searchTerm) return ordenes;
        const lowerSearch = searchTerm.toLowerCase();
        return ordenes.filter(orden =>
            orden.id.toString().includes(lowerSearch) ||
            getStatusLabel(orden.status).toLowerCase().includes(lowerSearch) ||
            (orden.mechanic?.fullName || '').toLowerCase().includes(lowerSearch) ||
            (orden.observaciones || '').toLowerCase().includes(lowerSearch) ||
            (orden.items || []).some(item => item.itemName.toLowerCase().includes(lowerSearch))
        );
    }, [ordenes, searchTerm]);

    if (!isOpen || !auto) return null;

    const selectedOrder = ordenes.find(o => o.id === selectedOrderId);

    return (
        <div className="bg-white dark:bg-[#111] border border-zinc-200 dark:border-white/5 rounded-2xl shadow-sm overflow-hidden flex flex-col min-h-[600px] animate-in fade-in duration-300">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between px-6 py-5 border-b border-zinc-200 dark:border-white/10 bg-zinc-50 dark:bg-[#0a0a0a] gap-4">
                <div className="flex-1">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={onClose}
                            className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 p-2 -ml-2 rounded-full transition-colors flex-shrink-0"
                        >
                            <X className="w-6 h-6" />
                        </button>
                        <div>
                            <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                                Historial Médico del Vehículo
                            </h2>
                            <div className="flex items-center gap-2 mt-1">
                                <span className="text-sm font-medium px-2 py-0.5 rounded-md bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300">
                                    {auto.placa}
                                </span>
                                <span className="text-sm text-zinc-500 dark:text-zinc-400">
                                    {auto.marca} {auto.modelo}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {!selectedOrder && (
                    <div className="w-full sm:w-72 relative">
                        <Search className="absolute left-3 top-2.5 w-4 h-4 text-zinc-400" />
                        <input
                            type="text"
                            placeholder="Buscar en el historial..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 bg-zinc-100 dark:bg-zinc-900/50 border border-zinc-200 dark:border-white/5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-500"
                        />
                    </div>
                )}
            </div>

            {/* Body / List */}
            <div className="p-6 overflow-y-auto flex-1 max-w-5xl mx-auto w-full">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-12 text-zinc-400">
                        <div className="w-8 h-8 border-2 border-purple-600 border-t-transparent rounded-full animate-spin mb-4"></div>
                        <p>Buscando registros...</p>
                    </div>
                ) : ordenes.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 text-zinc-500 dark:text-zinc-400 text-center">
                        <div className="w-16 h-16 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mb-4">
                            <FileText className="w-8 h-8 opacity-50" />
                        </div>
                        <h3 className="text-lg font-medium text-zinc-900 dark:text-zinc-200 mb-1">Sin Historial</h3>
                        <p className="max-w-xs">{searchTerm ? 'No se encontraron órdenes que coincidan con la búsqueda.' : 'Este vehículo aún no tiene órdenes de trabajo registradas en el sistema.'}</p>
                    </div>
                ) : selectedOrder ? (
                    <div className="animate-in slide-in-from-right-8 duration-300">
                        {/* Detailed View Header */}
                        <div className="flex items-center gap-4 mb-6">
                            <button
                                onClick={() => setSelectedOrderId(null)}
                                className="p-2 -ml-2 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-white/5 rounded-full transition-colors flex items-center gap-2 font-medium"
                            >
                                <ArrowLeft className="w-5 h-5" />
                                <span>Volver al historial</span>
                            </button>
                            <div className="h-6 w-px bg-zinc-200 dark:bg-zinc-800 hidden sm:block"></div>
                            <div className="flex items-center gap-3">
                                <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">
                                    Orden #{selectedOrder.id}
                                </h1>
                                <span className={`px-2.5 py-1 text-xs font-semibold uppercase tracking-wider rounded-lg border ${getStatusStyle(selectedOrder.status)}`}>
                                    {getStatusLabel(selectedOrder.status)}
                                </span>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Left Column: Items */}
                            <div className="lg:col-span-2 space-y-6">
                                <div className="bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-white/5 rounded-2xl p-6 shadow-sm backdrop-blur-sm">
                                    <h2 className="text-lg font-semibold text-zinc-900 dark:text-white mb-6 flex items-center gap-2">
                                        <Wrench className="w-5 h-5 text-blue-500" />
                                        Servicios y Repuestos
                                    </h2>

                                    {(!selectedOrder.items || selectedOrder.items.length === 0) ? (
                                        <div className="text-center py-12 text-zinc-500 border-2 border-dashed border-zinc-200 dark:border-white/10 rounded-xl">
                                            No hay items registrados en esta orden
                                        </div>
                                    ) : (
                                        <div className="overflow-x-auto">
                                            <table className="w-full text-left">
                                                <thead className="bg-zinc-50 dark:bg-white/5 text-xs uppercase text-zinc-500 font-medium">
                                                    <tr>
                                                        <th className="px-4 py-3 rounded-l-lg">Descripción</th>
                                                        <th className="px-4 py-3 text-center">Tipo</th>
                                                        <th className="px-4 py-3 text-center">Cant.</th>
                                                        <th className="px-4 py-3 text-right">Unitario</th>
                                                        <th className="px-4 py-3 text-right rounded-r-lg">Total</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-zinc-100 dark:divide-white/5">
                                                    {selectedOrder.items.map((item: any) => (
                                                        <tr key={item.id} className="group">
                                                            <td className="px-4 py-3 text-zinc-900 dark:text-zinc-200 font-medium">{item.itemName}</td>
                                                            <td className="px-4 py-3 text-center">
                                                                <span className={`text-xs px-2 py-0.5 rounded-full ${item.type === 'service' ? 'bg-blue-100 text-blue-700' : 'bg-orange-100 text-orange-700'}`}>
                                                                    {item.type === 'service' ? 'Servicio' : 'Repuesto'}
                                                                </span>
                                                            </td>
                                                            <td className="px-4 py-3 text-center text-zinc-600 dark:text-zinc-400">{item.quantity}</td>
                                                            <td className="px-4 py-3 text-right text-zinc-600 dark:text-zinc-400">${Number(item.unitPrice).toFixed(2)}</td>
                                                            <td className="px-4 py-3 text-right font-medium text-zinc-900 dark:text-zinc-200">${Number(item.totalPrice).toFixed(2)}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                                <tfoot>
                                                    <tr className="border-t-2 border-zinc-100 dark:border-white/5">
                                                        <td colSpan={4} className="px-4 py-4 text-right font-bold text-zinc-900 dark:text-white">TOTAL</td>
                                                        <td className="px-4 py-4 text-right font-bold text-xl text-blue-600">${Number(selectedOrder.total).toFixed(2)}</td>
                                                    </tr>
                                                </tfoot>
                                            </table>
                                        </div>
                                    )}
                                </div>

                                <div className="bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-white/5 rounded-2xl p-6 shadow-sm backdrop-blur-sm">
                                    <h2 className="text-lg font-semibold text-zinc-900 dark:text-white mb-4 flex items-center gap-2">
                                        <FileText className="w-5 h-5 text-zinc-500" />
                                        Observaciones
                                    </h2>
                                    <div className="p-4 bg-zinc-50 dark:bg-black/20 rounded-xl text-zinc-700 dark:text-zinc-300 min-h-[100px]">
                                        {selectedOrder.observaciones || 'Sin observaciones'}
                                    </div>
                                </div>
                            </div>

                            {/* Right Column: Details */}
                            <div className="space-y-6">
                                {/* Dates Card */}
                                <div className="bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-white/5 rounded-2xl p-6 shadow-sm backdrop-blur-sm">
                                    <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-500 mb-4">Fechas</h2>
                                    <div className="space-y-3">
                                        <div>
                                            <p className="text-xs text-zinc-500 mb-1">Ingresó</p>
                                            <div className="flex items-center gap-2 font-medium text-zinc-900 dark:text-zinc-100">
                                                <Calendar className="w-4 h-4 text-zinc-400" />
                                                {format(new Date(selectedOrder.dateIn), "dd 'de' MMMM, yyyy HH:mm", { locale: es })}
                                            </div>
                                        </div>
                                        {selectedOrder.dateOut && (
                                            <div>
                                                <p className="text-xs text-zinc-500 mb-1">Salió</p>
                                                <div className="flex items-center gap-2 font-medium text-zinc-900 dark:text-zinc-100">
                                                    <Calendar className="w-4 h-4 text-zinc-400" />
                                                    {format(new Date(selectedOrder.dateOut), "dd 'de' MMMM, yyyy HH:mm", { locale: es })}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Mechanic Card */}
                                <div className="bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-white/5 rounded-2xl p-6 shadow-sm backdrop-blur-sm">
                                    <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-500 mb-4">Mecánico Asignado</h2>
                                    {selectedOrder.mechanic ? (
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
                                                <User className="w-5 h-5" />
                                            </div>
                                            <p className="font-medium text-zinc-900 dark:text-white">{selectedOrder.mechanic.fullName}</p>
                                        </div>
                                    ) : (
                                        <p className="text-sm text-zinc-500 italic">No asignado</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {filteredOrdenes.map((orden, index) => (
                            <div key={orden.id} className="relative pl-6 pb-6 last:pb-0">
                                {index !== filteredOrdenes.length - 1 && (
                                    <div className="absolute left-[11px] top-6 bottom-0 w-px bg-zinc-200 dark:bg-zinc-800"></div>
                                )}
                                <div className="absolute left-0 top-1.5 w-[23px] h-[23px] rounded-full bg-white dark:bg-zinc-900 border-2 border-purple-500 z-10 transition-colors"></div>

                                <div
                                    className="bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 hover:border-purple-300 dark:hover:border-purple-500/50 transition-all cursor-pointer hover:shadow-md group"
                                    onClick={() => setSelectedOrderId(orden.id)}
                                >

                                    <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <Calendar className="w-4 h-4 text-zinc-400" />
                                                <span className="font-semibold text-zinc-900 dark:text-zinc-100 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                                                    {format(new Date(orden.dateIn), "dd 'de' MMMM, yyyy", { locale: es })}
                                                </span>
                                                <span className="text-sm text-zinc-500 uppercase tracking-wider ml-2">
                                                    Orden #{orden.id}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
                                                <Wrench className="w-4 h-4" />
                                                <span>Mecánico: <span className="font-medium text-zinc-800 dark:text-zinc-300">{orden.mechanic?.fullName || 'No asignado'}</span></span>
                                            </div>
                                        </div>

                                        <div className="flex flex-col items-end gap-2">
                                            <span className={`px-2.5 py-1 text-xs font-semibold uppercase tracking-wider rounded-lg border ${getStatusStyle(orden.status)}`}>
                                                {getStatusLabel(orden.status)}
                                            </span>
                                            <span className="text-lg font-bold text-zinc-900 dark:text-white">
                                                ${Number(orden.total).toFixed(2)}
                                            </span>
                                        </div>
                                    </div>

                                    {orden.items && orden.items.length > 0 && (
                                        <div className="mt-4 pt-4 border-t border-zinc-200 dark:border-zinc-800">
                                            <h4 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                                                <Tag className="w-3.5 h-3.5" />
                                                Trabajos Realizados
                                            </h4>
                                            <div className="flex flex-wrap gap-2">
                                                {orden.items.slice(0, 4).map(item => (
                                                    <span key={item.id} className="inline-flex items-center px-2 py-1 rounded bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs text-zinc-700 dark:text-zinc-300">
                                                        {item.itemName} (x{item.quantity})
                                                    </span>
                                                ))}
                                                {orden.items.length > 4 && (
                                                    <span className="inline-flex items-center px-2 py-1 rounded bg-zinc-100 dark:bg-zinc-800/50 text-xs text-zinc-500">
                                                        + {orden.items.length - 4} más
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {orden.observaciones && (
                                        <div className="mt-3 text-sm text-zinc-600 dark:text-zinc-400 bg-white/50 dark:bg-black/20 p-3 rounded-lg border border-zinc-100 dark:border-zinc-800/50 italic">
                                            {orden.observaciones}
                                        </div>
                                    )}

                                    <div className="mt-4 text-right">
                                        <span className="text-sm font-medium text-purple-600 dark:text-purple-400 flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            Ver orden completa →
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
