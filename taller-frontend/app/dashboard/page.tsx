'use client';

import { Users, Car, ClipboardList, TrendingUp, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useTranslation } from '@/lib/hooks/useTranslation';
import { api } from '@/lib/api';
import type { OrdenTrabajo } from '@/types/orden-trabajo';
import Link from 'next/link';

export default function DashboardPage() {
    const { t } = useTranslation();
    const [stats, setStats] = useState({
        clientes: 0,
        vehiculos: 0,
        ordenes: 0,
        ingresos: 0,
        ingresosChange: 0
    });
    const [recentOrders, setRecentOrders] = useState<OrdenTrabajo[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) return;

                // We can use the existing API helper or fetch directly for simple counts
                const [clientesRes, autosRes, ordenesData] = await Promise.all([
                    fetch('http://localhost:3001/clientes', { headers: { Authorization: `Bearer ${token}` } }),
                    fetch('http://localhost:3001/autos', { headers: { Authorization: `Bearer ${token}` } }),
                    api.getOrdenes(token)
                ]);

                let clientesCount = 0;
                let autosCount = 0;

                if (clientesRes.ok) {
                    const data = await clientesRes.json();
                    clientesCount = Array.isArray(data) ? data.length : 0;
                }
                if (autosRes.ok) {
                    const data = await autosRes.json();
                    autosCount = Array.isArray(data) ? data.length : 0;
                }

                const ordenesList = Array.isArray(ordenesData) ? ordenesData : [];
                const ordenesCount = ordenesList.length;

                // Income Calculation
                const now = new Date();
                const currentMonth = now.getMonth();
                const currentYear = now.getFullYear();

                const prevDate = new Date();
                prevDate.setMonth(prevDate.getMonth() - 1);
                const prevMonth = prevDate.getMonth();
                const prevYear = prevDate.getFullYear();

                let currentIncome = 0;
                let prevIncome = 0;
                let ordersToday = 0;

                ordenesList.forEach(order => {
                    const orderDate = new Date(order.createdAt);

                    // Count orders today
                    if (orderDate.getDate() === now.getDate() &&
                        orderDate.getMonth() === currentMonth &&
                        orderDate.getFullYear() === currentYear) {
                        ordersToday++;
                    }

                    // Calculate Income (Only Finished or Paid)
                    // You might want to include partial payments if you had that logic, but total is safer
                    if (order.status === 'finished' || order.status === 'paid') {
                        if (orderDate.getMonth() === currentMonth && orderDate.getFullYear() === currentYear) {
                            currentIncome += Number(order.total);
                        } else if (orderDate.getMonth() === prevMonth && orderDate.getFullYear() === prevYear) {
                            prevIncome += Number(order.total);
                        }
                    }
                });

                let incomeChange = 0;
                if (prevIncome > 0) {
                    incomeChange = ((currentIncome - prevIncome) / prevIncome) * 100;
                } else if (currentIncome > 0) {
                    incomeChange = 100; // 100% growth if previous was 0
                }

                // Sort orders by date (newest first) and take top 5
                const sortedOrders = [...ordenesList].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 5);

                setStats({
                    clientes: clientesCount,
                    vehiculos: autosCount,
                    ordenes: ordersToday, // Changed to Orders Today as per label
                    ingresos: currentIncome,
                    ingresosChange: incomeChange
                });
                setRecentOrders(sortedOrders);

            } catch (error) {
                console.error('Error loading stats:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

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

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('es-BO', { style: 'currency', currency: 'BOB' }).format(amount);
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header */}
            <div className="flex items-end justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">
                        {t('dashboard.title')}
                    </h1>
                    <p className="text-zinc-600 dark:text-zinc-400 mt-2">{t('dashboard.subtitle')}</p>
                </div>
                <div className="flex gap-3">
                    <Link href="/dashboard/ordenes/nueva" className="px-4 py-2 bg-blue-600/10 text-blue-400 border border-blue-600/20 rounded-lg text-sm font-medium hover:bg-blue-600/20 transition-colors">
                        + {t('dashboard.newOrder')}
                    </Link>
                    <button className="px-4 py-2 bg-zinc-100 dark:bg-white/5 text-zinc-700 dark:text-zinc-300 border border-zinc-300 dark:border-white/10 rounded-lg text-sm font-medium hover:bg-zinc-200 dark:hover:bg-white/10 transition-colors">
                        {t('dashboard.downloadReport')}
                    </button>
                </div>
            </div>

            {/* KPI Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { title: t('dashboard.totalClients'), value: loading ? '...' : stats.clientes, change: '+12%', icon: Users, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-500/10', border: 'border-blue-200 dark:border-blue-500/20' },
                    { title: t('dashboard.activeVehicles'), value: loading ? '...' : stats.vehiculos, change: '+5%', icon: Car, color: 'text-purple-500', bg: 'bg-purple-50 dark:bg-purple-500/10', border: 'border-purple-200 dark:border-purple-500/20' },
                    { title: t('dashboard.ordersToday'), value: loading ? '...' : stats.ordenes, change: 'Hoy', icon: ClipboardList, color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-500/10', border: 'border-amber-200 dark:border-amber-500/20' },
                    {
                        title: t('dashboard.monthlyIncome'),
                        value: loading ? '...' : formatCurrency(stats.ingresos),
                        change: (stats.ingresosChange >= 0 ? '+' : '') + stats.ingresosChange.toFixed(1) + '%',
                        icon: TrendingUp,
                        color: 'text-emerald-500',
                        bg: 'bg-emerald-50 dark:bg-emerald-500/10',
                        border: 'border-emerald-200 dark:border-emerald-500/20'
                    },
                ].map((item, i) => (
                    <div key={i} className={`p-6 rounded-2xl bg-white dark:bg-zinc-900/50 backdrop-blur-sm border border-zinc-200 dark:border-white/5 hover:border-zinc-300 dark:hover:border-white/10 transition-all group lg:col-span-1`}>
                        <div className="flex items-start justify-between mb-4">
                            <div className={`p-3 rounded-xl ${item.bg} ${item.border} border`}>
                                {item.value === '...' ? <Loader2 className={`w-6 h-6 animate-spin ${item.color}`} /> : <item.icon className={`w-6 h-6 ${item.color}`} />}
                            </div>
                            <span className={`text-xs font-medium px-2 py-1 rounded-full ${item.change.startsWith('+') ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'}`}>
                                {item.change}
                            </span>
                        </div>
                        <div>
                            <p className="text-zinc-600 dark:text-zinc-400 text-sm font-medium">{item.title}</p>
                            <h3 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mt-1">{item.value}</h3>
                        </div>
                    </div>
                ))}
            </div>

            {/* Recent Activity Section Placeholder */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 p-6 rounded-2xl bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-white/5">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">{t('dashboard.recentOrders')}</h3>
                        <Link href="/dashboard/ordenes" className="text-sm text-blue-500 hover:text-blue-400 font-medium">Ver todas</Link>
                    </div>

                    {/* List */}
                    <div className="space-y-4">
                        {loading ? (
                            <div className="flex justify-center p-8">
                                <Loader2 className="w-6 h-6 animate-spin text-zinc-500" />
                            </div>
                        ) : recentOrders.length === 0 ? (
                            <div className="text-center py-8 text-zinc-500">
                                No hay ordenes recientes
                            </div>
                        ) : (
                            recentOrders.map((orden) => (
                                <Link href={`/dashboard/ordenes/${orden.id}`} key={orden.id} className="block">
                                    <div className="flex items-center justify-between p-4 rounded-xl bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/5 hover:bg-zinc-100 dark:hover:bg-white/10 transition-colors cursor-pointer group">
                                        <div className="flex items-center gap-4">
                                            <div className="h-10 w-10 rounded-full bg-blue-50 dark:bg-zinc-800 flex items-center justify-center border border-blue-200 dark:border-transparent group-hover:bg-blue-100 dark:group-hover:bg-zinc-700 transition-colors">
                                                <Car className="w-5 h-5 text-blue-500 dark:text-zinc-400" />
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-medium text-zinc-900 dark:text-zinc-200">
                                                    {orden.auto.marca} {orden.auto.modelo} <span className="text-zinc-500 font-normal">({orden.auto.placa})</span>
                                                </h4>
                                                <p className="text-xs text-zinc-500">
                                                    {orden.mechanic ? orden.mechanic.fullName : 'Sin asignar'} • {new Date(orden.createdAt).toLocaleDateString()}
                                                </p>
                                            </div>
                                        </div>
                                        <span className={`text-xs font-medium px-2 py-1 rounded-full border 
                                            ${orden.status === 'pending' ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' :
                                                orden.status === 'in_progress' ? 'bg-blue-500/10 text-blue-500 border-blue-500/20' :
                                                    orden.status === 'finished' ? 'bg-green-500/10 text-green-500 border-green-500/20' :
                                                        'bg-zinc-500/10 text-zinc-500 border-zinc-500/20'
                                            }`}>
                                            {getStatusLabel(orden.status)}
                                        </span>
                                    </div>
                                </Link>
                            ))
                        )}
                    </div>
                </div>

                <div className="lg:col-span-1 p-6 rounded-2xl bg-gradient-to-br from-blue-100 dark:from-blue-900/20 to-purple-100 dark:to-purple-900/20 border border-blue-200 dark:border-white/5">
                    <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 mb-4">{t('dashboard.workshopStatus')}</h3>
                    <div className="space-y-6">
                        <div>
                            <div className="flex justify-between text-sm mb-2">
                                <span className="text-zinc-600 dark:text-zinc-400">{t('dashboard.capacity')}</span>
                                <span className="text-zinc-900 dark:text-zinc-200">85%</span>
                            </div>
                            <div className="h-2 bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
                                <div className="h-full w-[85%] bg-gradient-to-r from-blue-500 to-purple-500"></div>
                            </div>
                        </div>
                        <div>
                            <div className="flex justify-between text-sm mb-2">
                                <span className="text-zinc-600 dark:text-zinc-400">{t('dashboard.activeTechnicians')}</span>
                                <span className="text-zinc-900 dark:text-zinc-200">4/5</span>
                            </div>
                            <div className="h-2 bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
                                <div className="h-full w-[80%] bg-emerald-500"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
