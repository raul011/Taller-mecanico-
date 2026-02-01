'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
    LayoutDashboard,
    Users,
    Car,
    ClipboardList,
    Package,
    CreditCard,
    LogOut,
    Wrench,
    Settings
} from 'lucide-react';
import { useState } from 'react';

const menuItems = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Clientes', href: '/dashboard/clientes', icon: Users },
    { name: 'Vehículos', href: '/dashboard/vehiculos', icon: Car },
    { name: 'Órdenes', href: '/dashboard/ordenes', icon: ClipboardList },
    { name: 'Inventario', href: '/dashboard/inventario', icon: Package },
    { name: 'Facturación', href: '/dashboard/facturacion', icon: CreditCard },
];

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const router = useRouter();
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const handleLogout = () => {
        localStorage.removeItem('token');
        document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
        router.push('/login');
    };

    return (
        <div className="flex min-h-screen bg-[#0a0a0a] text-zinc-100 font-sans">
            {/* Sidebar */}
            <aside
                className={`${isSidebarOpen ? 'w-64' : 'w-20'
                    } fixed inset-y-0 left-0 z-50 bg-zinc-900/50 backdrop-blur-xl border-r border-white/5 transition-all duration-300 flex flex-col`}
            >
                {/* Logo */}
                <div className="h-20 flex items-center px-6 border-b border-white/5">
                    <div className="flex items-center gap-3 text-blue-500">
                        <div className="p-2 bg-gradient-to-tr from-blue-500/20 to-purple-500/20 rounded-lg">
                            <Wrench className="w-6 h-6 text-blue-400" />
                        </div>
                        {isSidebarOpen && (
                            <span className="font-bold text-lg bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60 whitespace-nowrap">
                                Taller Pro
                            </span>
                        )}
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-4 py-8 space-y-2 overflow-y-auto">
                    {menuItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group relative overflow-hidden ${isActive
                                        ? 'bg-gradient-to-r from-blue-600/10 to-purple-600/10 text-blue-400'
                                        : 'text-zinc-400 hover:text-zinc-100 hover:bg-white/5'
                                    }`}
                            >
                                {isActive && (
                                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500 to-purple-500 rounded-r-full" />
                                )}
                                <item.icon className={`w-5 h-5 ${isActive ? 'text-blue-400' : 'text-zinc-500 group-hover:text-zinc-300'} transition-colors`} />
                                {isSidebarOpen && (
                                    <span className="font-medium text-sm">{item.name}</span>
                                )}
                            </Link>
                        );
                    })}
                </nav>

                {/* Footer Actions */}
                <div className="p-4 border-t border-white/5 space-y-2">
                    <button className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-zinc-400 hover:text-zinc-100 hover:bg-white/5 transition-all group">
                        <Settings className="w-5 h-5 text-zinc-500 group-hover:text-zinc-300" />
                        {isSidebarOpen && <span className="font-medium text-sm">Configuración</span>}
                    </button>
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-red-400/80 hover:text-red-400 hover:bg-red-500/10 transition-all group"
                    >
                        <LogOut className="w-5 h-5 group-hover:scale-110 transition-transform" />
                        {isSidebarOpen && <span className="font-medium text-sm">Cerrar Sesión</span>}
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-20'}`}>
                <div className="p-8 max-w-7xl mx-auto space-y-8">
                    {children}
                </div>
            </main>
        </div>
    );
}
