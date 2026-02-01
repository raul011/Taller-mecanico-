'use client';

import { Users, Car, ClipboardList, TrendingUp, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useTranslation } from '@/lib/hooks/useTranslation';

export default function DashboardPage() {
    const { t } = useTranslation();
    const [stats, setStats] = useState({
        clientes: 0,
        vehiculos: 0,
        ordenes: 0 // Placeholder until orders are implemented
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const token = localStorage.getItem('token');
                const headers: HeadersInit = {};
                if (token) headers['Authorization'] = `Bearer ${token}`;

                const [clientesRes, autosRes] = await Promise.all([
                    fetch('http://localhost:3001/clientes', { headers }),
                    fetch('http://localhost:3001/autos', { headers })
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

                setStats({
                    clientes: clientesCount,
                    vehiculos: autosCount,
                    ordenes: 12 // Hardcoded for now
                });

            } catch (error) {
                console.error('Error loading stats:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

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
                    <button className="px-4 py-2 bg-blue-600/10 text-blue-400 border border-blue-600/20 rounded-lg text-sm font-medium hover:bg-blue-600/20 transition-colors">
                        + {t('dashboard.newOrder')}
                    </button>
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
                    { title: t('dashboard.ordersToday'), value: loading ? '...' : stats.ordenes, change: '-2%', icon: ClipboardList, color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-500/10', border: 'border-amber-200 dark:border-amber-500/20' },
                    { title: t('dashboard.monthlyIncome'), value: '$15,400', change: '+18%', icon: TrendingUp, color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-500/10', border: 'border-emerald-200 dark:border-emerald-500/20' },
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
                    <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 mb-4">{t('dashboard.recentOrders')}</h3>
                    {/* Simple List */}
                    <div className="space-y-4">
                        {[1, 2, 3].map((j) => (
                            <div key={j} className="flex items-center justify-between p-4 rounded-xl bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/5 hover:bg-zinc-100 dark:hover:bg-white/10 transition-colors cursor-pointer">
                                <div className="flex items-center gap-4">
                                    <div className="h-10 w-10 rounded-full bg-blue-50 dark:bg-zinc-800 flex items-center justify-center border border-blue-200 dark:border-transparent">
                                        <Car className="w-5 h-5 text-blue-500 dark:text-zinc-400" />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-medium text-zinc-900 dark:text-zinc-200">Toyota Corolla - Mantenimiento</h4>
                                        <p className="text-xs text-zinc-500">Juan Perez • Hace 2 horas</p>
                                    </div>
                                </div>
                                <span className="text-xs font-medium px-2 py-1 rounded-full bg-blue-500/10 text-blue-500 border border-blue-500/20">
                                    {t('dashboard.inProgress')}
                                </span>
                            </div>
                        ))}
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
