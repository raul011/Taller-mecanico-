'use client';

import { useState, useEffect } from 'react';
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths } from 'date-fns';
import { es } from 'date-fns/locale';
import { ChevronLeft, ChevronRight, Plus, Calendar as CalendarIcon } from 'lucide-react';
import { api } from '@/lib/api';
import CreateCitaModal from '@/components/citas/CreateCitaModal';

export default function AgendaPage() {
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [citas, setCitas] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        fetchCitas();
    }, [currentMonth]);

    const fetchCitas = async () => {
        setLoading(true);
        try {
            const start = startOfMonth(currentMonth).toISOString();
            const end = endOfMonth(currentMonth).toISOString();
            const data = await api.getCitas(start, end);
            setCitas(data);
        } catch (error) {
            console.error('Error fetching citas:', error);
        } finally {
            setLoading(false);
        }
    };

    const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
    const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
    const onDateClick = (day: Date) => {
        setSelectedDate(day);
        // Optional: Open modal on date click
        // setIsModalOpen(true);
    };

    const [viewMode, setViewMode] = useState<'calendar' | 'list'>('calendar');

    const renderHeader = () => {
        return (
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <h2 className="text-2xl font-bold capitalize">
                        {format(currentMonth, 'MMMM yyyy', { locale: es })}
                    </h2>
                    <div className="flex gap-1">
                        <button onClick={prevMonth} className="p-1 hover:bg-gray-100 rounded">
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        <button onClick={nextMonth} className="p-1 hover:bg-gray-100 rounded">
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <div className="bg-gray-100 p-1 rounded-lg flex gap-1">
                        <button
                            onClick={() => setViewMode('calendar')}
                            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${viewMode === 'calendar' ? 'bg-white shadow text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            Calendario
                        </button>
                        <button
                            onClick={() => setViewMode('list')}
                            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${viewMode === 'list' ? 'bg-white shadow text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            Lista
                        </button>
                    </div>

                    <button
                        className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors ml-2"
                        onClick={() => setIsModalOpen(true)}
                    >
                        <Plus className="w-4 h-4" />
                        Nueva Cita
                    </button>
                </div>
            </div>
        );
    };

    const renderListView = () => {
        const sortedCitas = [...citas].sort((a, b) => new Date(a.fechaHora).getTime() - new Date(b.fechaHora).getTime());

        return (
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
                <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50 text-gray-700 font-medium border-b border-gray-200">
                        <tr>
                            <th className="px-4 py-3">Fecha y Hora</th>
                            <th className="px-4 py-3">Cliente</th>
                            <th className="px-4 py-3">Vehículo</th>
                            <th className="px-4 py-3">Motivo</th>
                            <th className="px-4 py-3">Estado</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {sortedCitas.length > 0 ? (
                            sortedCitas.map(cita => (
                                <tr key={cita.id} className="hover:bg-gray-50">
                                    <td className="px-4 py-3 whitespace-nowrap">
                                        <div className="font-medium text-gray-900">{format(new Date(cita.fechaHora), 'dd MMMM yyyy', { locale: es })}</div>
                                        <div className="text-gray-500">{format(new Date(cita.fechaHora), 'HH:mm')}</div>
                                    </td>
                                    <td className="px-4 py-3 font-medium text-gray-900">
                                        {cita.cliente?.nombre || 'Cliente Desconocido'}
                                    </td>
                                    <td className="px-4 py-3 text-gray-600">
                                        {cita.auto ? `${cita.auto.marca} ${cita.auto.modelo} (${cita.auto.placa})` : '-'}
                                    </td>
                                    <td className="px-4 py-3 max-w-xs truncate" title={cita.motivo}>
                                        {cita.motivo}
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium 
                                            ${cita.status === 'completed' ? 'bg-green-100 text-green-700' :
                                                cita.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                                                    'bg-blue-100 text-blue-700'}`}>
                                            {cita.status === 'pending' ? 'Pendiente' :
                                                cita.status === 'completed' ? 'Completado' :
                                                    cita.status === 'cancelled' ? 'Cancelado' : cita.status}
                                        </span>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                                    No hay citas para este mes.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        );
    };

    const renderDays = () => {
        const days = ['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb'];
        return (
            <div className="grid grid-cols-7 mb-2">
                {days.map(day => (
                    <div key={day} className="text-center font-bold text-gray-500 uppercase text-sm py-2">
                        {day}
                    </div>
                ))}
            </div>
        );
    };

    const renderCells = () => {
        const monthStart = startOfMonth(currentMonth);
        const monthEnd = endOfMonth(monthStart);
        const startDate = startOfWeek(monthStart);
        const endDate = endOfWeek(monthEnd);

        const dateFormat = "d";
        const rows = [];
        let days = [];
        let day = startDate;
        let formattedDate = "";

        const daysInMonth = eachDayOfInterval({ start: startDate, end: endDate });

        return (
            <div className="grid grid-cols-7 border-t border-l border-gray-200 bg-white shadow-sm rounded-lg overflow-hidden">
                {daysInMonth.map((day, i) => {
                    const isCurrentMonth = isSameMonth(day, monthStart);
                    const isSelected = isSameDay(day, selectedDate);
                    const citasForDay = citas.filter(cita => isSameDay(new Date(cita.fechaHora), day));

                    return (
                        <div
                            key={day.toISOString()}
                            className={`min-h-[120px] border-b border-r border-gray-200 p-2 relative transition-colors
                                ${!isCurrentMonth ? 'bg-gray-50 text-gray-400' : 'bg-white'}
                                ${isSelected ? 'bg-blue-50' : 'hover:bg-gray-50'}
                            `}
                            onClick={() => onDateClick(day)}
                        >
                            <div className={`flex justify-between items-start`}>
                                <span className={`text-sm font-semibold w-7 h-7 flex items-center justify-center rounded-full ${isSameDay(day, new Date()) ? 'bg-blue-600 text-white' : ''
                                    }`}>
                                    {format(day, dateFormat)}
                                </span>
                                {citasForDay.length > 0 && (
                                    <span className="text-xs bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded-full font-medium">
                                        {citasForDay.length}
                                    </span>
                                )}
                            </div>

                            <div className="mt-2 space-y-1">
                                {citasForDay.slice(0, 3).map((cita, idx) => (
                                    <div key={idx} className="text-xs p-1 bg-blue-100 text-blue-700 rounded truncate cursor-pointer hover:bg-blue-200" title={cita.motivo}>
                                        <div className="font-semibold">{format(new Date(cita.fechaHora), 'HH:mm')} - {cita.cliente?.nombre || 'Cliente'}</div>
                                        {cita.auto && <div className="text-[10px] opacity-80">{cita.auto.marca} {cita.auto.modelo}</div>}
                                    </div>
                                ))}
                                {citasForDay.length > 3 && (
                                    <div className="text-xs text-gray-500 pl-1">
                                        + {citasForDay.length - 3} más
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        );
    };

    return (
        <div className="p-6 max-w-7xl mx-auto">
            {renderHeader()}

            {viewMode === 'calendar' ? (
                <>
                    {renderDays()}
                    {renderCells()}
                </>
            ) : (
                renderListView()
            )}

            <CreateCitaModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={fetchCitas}
                initialDate={selectedDate}
            />
        </div>
    );
}
