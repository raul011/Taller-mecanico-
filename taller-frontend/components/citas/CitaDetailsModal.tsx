import { X, Calendar as CalendarIcon, Clock, User, Car, FileText, CheckCircle, XCircle, Edit } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { useState } from 'react';
import { api, Cita } from '@/lib/api';

interface CitaDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    cita: Cita | null;
    onStatusChange: () => void;
    onEdit: (cita: Cita) => void;
}

export default function CitaDetailsModal({ isOpen, onClose, cita, onStatusChange, onEdit }: CitaDetailsModalProps) {
    const [loading, setLoading] = useState(false);

    if (!isOpen || !cita) return null;

    const citaDate = new Date(cita.fechaHora);

    const handleUpdateStatus = async (newStatus: 'completed' | 'cancelled') => {
        if (!confirm(`¿Estás seguro de que quieres marcar esta cita como ${newStatus === 'completed' ? 'COMPLETADA' : 'CANCELADA'}?`)) {
            return;
        }

        setLoading(true);
        try {
            await api.updateCita(cita.id, { status: newStatus });
            onStatusChange(); // Refresh list
            onClose();
        } catch (error) {
            console.error('Error updating status:', error);
            alert('Hubo un error al actualizar el estado de la cita.');
        } finally {
            setLoading(false);
        }
    };

    const getStatusBadge = (status: string) => {
        const styles: Record<string, { bg: string, text: string, label: string }> = {
            pending: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Pendiente' },
            confirmed: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Confirmada' },
            completed: { bg: 'bg-green-100', text: 'text-green-800', label: 'Completada' },
            cancelled: { bg: 'bg-red-100', text: 'text-red-800', label: 'Cancelada' },
        };
        const currentStyle = styles[status] || styles['pending'];

        return (
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium uppercase ${currentStyle.bg} ${currentStyle.text}`}>
                {currentStyle.label}
            </span>
        );
    };

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div
                className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden relative"
                onClick={e => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-gray-50/50">
                    <h3 className="text-lg font-semibold text-gray-900">
                        Detalle de Cita - {format(citaDate, 'dd MMM yyyy', { locale: es })}
                    </h3>
                    <button
                        onClick={onClose}
                        className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 space-y-5">

                    {/* Time */}
                    <div className="flex items-start gap-3">
                        <Clock className="w-5 h-5 text-gray-400 mt-0.5" />
                        <div>
                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Hora</p>
                            <p className="text-gray-900 font-medium">{format(citaDate, 'HH:mm')} hrs</p>
                        </div>
                    </div>

                    {/* Client */}
                    <div className="flex items-start gap-3">
                        <User className="w-5 h-5 text-gray-400 mt-0.5" />
                        <div>
                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Cliente</p>
                            <p className="text-gray-900 font-medium">{cita.cliente?.nombre || 'Desconocido'}</p>
                            {cita.cliente?.telefono && (
                                <p className="text-sm text-gray-500">Tel: {cita.cliente.telefono}</p>
                            )}
                            {cita.cliente?.email && (
                                <p className="text-sm text-gray-500">{cita.cliente.email}</p>
                            )}
                        </div>
                    </div>

                    {/* Vehicle */}
                    <div className="flex items-start gap-3">
                        <Car className="w-5 h-5 text-gray-400 mt-0.5" />
                        <div>
                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Vehículo</p>
                            {cita.auto ? (
                                <>
                                    <p className="text-gray-900 font-medium">{cita.auto.marca} {cita.auto.modelo}</p>
                                    <p className="text-sm text-gray-500">Patente: <span className="uppercase">{cita.auto.placa}</span></p>
                                </>
                            ) : (
                                <p className="text-gray-500 italic">No especificado</p>
                            )}
                        </div>
                    </div>

                    {/* Service/Motivo */}
                    <div className="flex items-start gap-3">
                        <FileText className="w-5 h-5 text-gray-400 mt-0.5" />
                        <div>
                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Servicio / Motivo</p>
                            <p className="text-gray-900">{cita.motivo}</p>
                        </div>
                    </div>

                    {/* Status */}
                    <div className="flex items-start gap-3">
                        <div className="w-5 h-5 flex justify-center mt-0.5">
                            <span className="w-2 h-2 rounded-full bg-gray-400 mt-1"></span>
                        </div>
                        <div>
                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Estado</p>
                            {getStatusBadge(cita.status)}
                        </div>
                    </div>

                    {/* Notas */}
                    {cita.notas && (
                        <div className="flex items-start gap-3 bg-yellow-50/50 p-3 rounded-lg border border-yellow-100">
                            <FileText className="w-5 h-5 text-yellow-500 mt-0.5" />
                            <div>
                                <p className="text-xs font-semibold text-yellow-700 uppercase tracking-wider">Notas</p>
                                <p className="text-sm text-gray-700 italic">{cita.notas}</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer / Actions */}
                <div className="p-4 bg-gray-50 border-t border-gray-100 grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <button
                        onClick={() => {
                            onClose();
                            onEdit(cita);
                        }}
                        disabled={loading}
                        className="flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                    >
                        <Edit className="w-4 h-4" />
                        EDITAR
                    </button>

                    <button
                        onClick={() => handleUpdateStatus('cancelled')}
                        disabled={loading || cita.status === 'cancelled' || cita.status === 'completed'}
                        className="flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-red-700 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors disabled:opacity-50 disabled:grayscale"
                    >
                        <XCircle className="w-4 h-4" />
                        CANCELAR
                    </button>

                    <button
                        onClick={() => handleUpdateStatus('completed')}
                        disabled={loading || cita.status === 'completed' || cita.status === 'cancelled'}
                        className="flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-green-700 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition-colors disabled:opacity-50 disabled:grayscale"
                    >
                        <CheckCircle className="w-4 h-4" />
                        COMPLETADA
                    </button>
                </div>

                {loading && (
                    <div className="absolute inset-0 bg-white/50 backdrop-blur-[1px] flex items-center justify-center rounded-xl z-10">
                        <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                )}
            </div>
        </div>
    );
}
