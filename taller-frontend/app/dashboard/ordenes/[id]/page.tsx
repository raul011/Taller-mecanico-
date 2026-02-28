'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
    ArrowLeft,
    User,
    Car,
    Wrench,
    Plus,
    Trash2,
    CheckCircle,
    XCircle,
    DollarSign,
    Loader2,
    Calendar,
    Printer,
    FileText
} from 'lucide-react';
import Link from 'next/link';
import { api } from '@/lib/api';
import type { OrdenTrabajo, OrdenItem } from '@/types/orden-trabajo';
import { OrderStatus } from '@/types/orden-trabajo';

export default function DetalleOrdenPage() {
    const params = useParams();
    const router = useRouter();
    const id = Number(params.id);

    const [orden, setOrden] = useState<any>(null); // using any because OrdenTrabajo type might be missing auto.cliente relation in my types file, but backend sends it
    const [loading, setLoading] = useState(true);
    const [services, setServices] = useState<any[]>([]);
    const [parts, setParts] = useState<any[]>([]);

    // Modal State
    const [isAddItemOpen, setIsAddItemOpen] = useState(false);
    const [addItemType, setAddItemType] = useState<'service' | 'part'>('service');
    const [selectedItemId, setSelectedItemId] = useState<number | ''>('');
    const [quantity, setQuantity] = useState(1);
    const [addingItem, setAddingItem] = useState(false);

    const fetchOrder = async () => {
        try {
            const token = localStorage.getItem('token');
            if (token) {
                const data = await api.getOrden(token, id);
                setOrden(data);
            }
        } catch (error) {
            console.error('Error fetching order:', error);
            alert('Error al cargar la orden');
        }
    };

    const loadHelpers = async () => {
        try {
            const token = localStorage.getItem('token');
            if (token) {
                const [s, p] = await Promise.all([
                    api.getServicios(token),
                    api.getRepuestos(token)
                ]);
                setServices(s);
                setParts(p);
            }
        } catch (error) {
            console.error('helpers error', error);
        }
    };

    useEffect(() => {
        if (id) {
            Promise.all([fetchOrder(), loadHelpers()]).finally(() => setLoading(false));
        }
    }, [id]);

    const handleStatusChange = async (newStatus: OrderStatus) => {
        if (!confirm('¿Está seguro de cambiar el estado?')) return;
        try {
            const token = localStorage.getItem('token');
            if (token) {
                await api.changeStatus(token, id, newStatus);
                fetchOrder();
            }
        } catch (error) {
            alert('Error al actualizar estado');
        }
    };

    const handleAddItem = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedItemId) return;
        setAddingItem(true);
        try {
            const token = localStorage.getItem('token');
            if (token) {
                const updatedOrder = await api.addItem(token, id, {
                    type: addItemType,
                    itemId: Number(selectedItemId),
                    quantity: Number(quantity)
                });

                setOrden(updatedOrder);

                setIsAddItemOpen(false);
                setSelectedItemId('');
                setQuantity(1);
            }
        } catch (error) {
            console.error('❌ Error al agregar item:', error);
            alert('Error al agregar item: ' + (error instanceof Error ? error.message : ''));
        } finally {
            setAddingItem(false);
        }
    };

    const handleRemoveItem = async (itemId: number) => {
        if (!confirm('¿Eliminar este item?')) return;
        try {
            const token = localStorage.getItem('token');
            if (token) {
                const updatedOrder = await api.removeItem(token, id, itemId);
                setOrden(updatedOrder);
            }
        } catch (error) {
            alert('Error al eliminar item');
        }
    };

    if (loading) return (
        <div className="flex justify-center items-center min-h-[50vh]">
            <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
        </div>
    );

    if (!orden) return <div>Orden no encontrada</div>;

    const isEditable = orden.status === OrderStatus.PENDING || orden.status === OrderStatus.IN_PROGRESS;

    return (
        <div className="space-y-6 animate-in fade-in zoom-in-95 duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex items-center gap-4">
                    <Link
                        href="/dashboard/ordenes"
                        className="p-2 -ml-2 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-white/5 rounded-full transition-colors"
                    >
                        <ArrowLeft className="w-6 h-6" />
                    </Link>
                    <div>
                        <div className="flex items-center gap-3">
                            <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">
                                Orden #{orden.id}
                            </h1>
                            <span className={`px-3 py-1 rounded-full text-sm font-medium
                                ${orden.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                                    orden.status === 'in_progress' ? 'bg-blue-100 text-blue-700' :
                                        orden.status === 'finished' ? 'bg-green-100 text-green-700' :
                                            orden.status === 'paid' ? 'bg-purple-100 text-purple-700' :
                                                'bg-red-100 text-red-700'
                                }`}>
                                {orden.status.replace('_', ' ').toUpperCase()}
                            </span>
                        </div>
                        <p className="text-zinc-500 text-sm mt-1">
                            Creada el {new Date(orden.createdAt).toLocaleDateString()}
                        </p>
                    </div>
                </div>

                <div className="flex gap-2">
                    {/* Status Actions */}
                    {orden.status === OrderStatus.PENDING && (
                        <button
                            onClick={() => handleStatusChange(OrderStatus.IN_PROGRESS)}
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-medium transition-colors shadow-lg shadow-blue-600/20"
                        >
                            Comenzar Trabajo
                        </button>
                    )}
                    {orden.status === OrderStatus.IN_PROGRESS && (
                        <button
                            onClick={() => handleStatusChange(OrderStatus.FINISHED)}
                            className="px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded-xl font-medium transition-colors shadow-lg shadow-green-600/20"
                        >
                            Finalizar Trabajo
                        </button>
                    )}
                    {orden.status === OrderStatus.FINISHED && (
                        <button
                            onClick={() => handleStatusChange(OrderStatus.PAID)}
                            className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl font-medium transition-colors shadow-lg shadow-purple-600/20"
                        >
                            Registrar Pago
                        </button>
                    )}
                    {(orden.status === OrderStatus.PENDING || orden.status === OrderStatus.IN_PROGRESS) && (
                        <button
                            onClick={() => handleStatusChange(OrderStatus.CANCELLED)}
                            className="px-4 py-2 bg-red-100 text-red-600 hover:bg-red-200 rounded-xl font-medium transition-colors"
                        >
                            Cancelar
                        </button>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column: Items */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-white/5 rounded-2xl p-6 shadow-sm backdrop-blur-sm">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-lg font-semibold text-zinc-900 dark:text-white flex items-center gap-2">
                                <Wrench className="w-5 h-5 text-blue-500" />
                                Servicios y Repuestos
                            </h2>
                            {isEditable && (
                                <button
                                    onClick={() => setIsAddItemOpen(true)}
                                    className="flex items-center gap-2 px-3 py-1.5 bg-zinc-100 dark:bg-white/10 hover:bg-zinc-200 dark:hover:bg-white/20 text-zinc-700 dark:text-zinc-200 rounded-lg text-sm font-medium transition-colors"
                                >
                                    <Plus className="w-4 h-4" />
                                    Agregar
                                </button>
                            )}
                        </div>

                        {orden.items.length === 0 ? (
                            <div className="text-center py-12 text-zinc-500 border-2 border-dashed border-zinc-200 dark:border-white/10 rounded-xl">
                                No hay items agregados aún
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
                                            <th className="px-4 py-3 text-right">Total</th>
                                            {isEditable && <th className="px-4 py-3 text-right rounded-r-lg"></th>}
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-zinc-100 dark:divide-white/5">
                                        {orden.items.map((item: any) => (
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
                                                {isEditable && (
                                                    <td className="px-4 py-3 text-right">
                                                        <button
                                                            onClick={() => handleRemoveItem(item.id)}
                                                            className="p-1 text-red-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded transition-colors"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </td>
                                                )}
                                            </tr>
                                        ))}
                                    </tbody>
                                    <tfoot>
                                        <tr className="border-t-2 border-zinc-100 dark:border-white/5">
                                            <td colSpan={4} className="px-4 py-4 text-right font-bold text-zinc-900 dark:text-white">TOTAL</td>
                                            <td className="px-4 py-4 text-right font-bold text-xl text-blue-600">${Number(orden.total).toFixed(2)}</td>
                                            {isEditable && <td></td>}
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
                            {orden.observaciones || 'Sin observaciones'}
                        </div>
                    </div>
                </div>

                {/* Right Column: Details */}
                <div className="space-y-6">
                    {/* Customer Card */}
                    <div className="bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-white/5 rounded-2xl p-6 shadow-sm backdrop-blur-sm">
                        <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-500 mb-4">Cliente</h2>
                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center text-purple-600 font-bold text-xl">
                                {orden.auto?.cliente?.nombre?.charAt(0) || '?'}
                            </div>
                            <div>
                                <p className="font-bold text-lg text-zinc-900 dark:text-white">{orden.auto?.cliente?.nombre || 'Desconocido'}</p>
                                <div className="space-y-1 mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                                    <p>{orden.auto?.cliente?.email}</p>
                                    <p>{orden.auto?.cliente?.telefono}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Vehicle Card */}
                    <div className="bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-white/5 rounded-2xl p-6 shadow-sm backdrop-blur-sm">
                        <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-500 mb-4">Vehículo</h2>
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <Car className="w-5 h-5 text-blue-500" />
                                <div>
                                    <p className="font-bold text-zinc-900 dark:text-white">{orden.auto.marca} {orden.auto.modelo}</p>
                                    <p className="text-sm text-zinc-500">{orden.auto.anio}</p>
                                </div>
                            </div>
                            <div className="p-3 bg-zinc-100 dark:bg-white/5 rounded-xl text-center">
                                <p className="text-xs text-zinc-500 uppercase font-medium">Placa</p>
                                <p className="text-xl font-mono font-bold text-zinc-900 dark:text-white tracking-widest">{orden.auto.placa}</p>
                            </div>
                        </div>
                    </div>

                    {/* Mechanic Card */}
                    <div className="bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-white/5 rounded-2xl p-6 shadow-sm backdrop-blur-sm">
                        <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-500 mb-4">Mecánico</h2>
                        {orden.mechanic ? (
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
                                    <User className="w-5 h-5" />
                                </div>
                                <p className="font-medium text-zinc-900 dark:text-white">{orden.mechanic.fullName}</p>
                            </div>
                        ) : (
                            <p className="text-sm text-zinc-500 italic">No asignado</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Add Item Modal */}
            {isAddItemOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white dark:bg-[#111] border border-zinc-200 dark:border-white/10 rounded-2xl w-full max-w-md shadow-2xl p-6 animate-in zoom-in-95 duration-200">
                        <h2 className="text-xl font-bold text-zinc-900 dark:text-white mb-4">Agregar Item</h2>
                        <form onSubmit={handleAddItem} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Tipo</label>
                                <div className="flex bg-zinc-100 dark:bg-zinc-900 rounded-lg p-1">
                                    <button
                                        type="button"
                                        onClick={() => setAddItemType('service')}
                                        className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-all ${addItemType === 'service' ? 'bg-white dark:bg-zinc-800 shadow text-zinc-900 dark:text-white' : 'text-zinc-500 hover:text-zinc-700'}`}
                                    >
                                        Servicio
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setAddItemType('part')}
                                        className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-all ${addItemType === 'part' ? 'bg-white dark:bg-zinc-800 shadow text-zinc-900 dark:text-white' : 'text-zinc-500 hover:text-zinc-700'}`}
                                    >
                                        Repuesto
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                                    {addItemType === 'service' ? 'Seleccionar Servicio' : 'Seleccionar Repuesto'}
                                </label>
                                <select
                                    required
                                    value={selectedItemId}
                                    onChange={(e) => setSelectedItemId(Number(e.target.value))}
                                    className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-300 dark:border-white/10 rounded-xl py-2 px-3 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-blue-500"
                                >
                                    <option value="">Seleccione...</option>
                                    {addItemType === 'service' ? (
                                        services.map(s => (
                                            <option key={s.id} value={s.id}>{s.descripcion} - ${s.costo}</option>
                                        ))
                                    ) : (
                                        parts.map(p => (
                                            <option key={p.id} value={p.id} disabled={p.stock === 0}>
                                                {p.nombre} (Stock: {p.stock}) - ${p.precioVenta}
                                            </option>
                                        ))
                                    )}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Cantidad</label>
                                <input
                                    type="number"
                                    min="1"
                                    value={quantity}
                                    onChange={(e) => setQuantity(Number(e.target.value))}
                                    className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-300 dark:border-white/10 rounded-xl py-2 px-3 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-blue-500"
                                />
                            </div>

                            <div className="flex justify-end gap-2 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setIsAddItemOpen(false)}
                                    className="px-4 py-2 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-white/5 rounded-xl font-medium"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    disabled={addingItem}
                                    className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-medium shadow-lg shadow-blue-600/20 disabled:opacity-70"
                                >
                                    {addingItem ? 'Agregando...' : 'Agregar'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
