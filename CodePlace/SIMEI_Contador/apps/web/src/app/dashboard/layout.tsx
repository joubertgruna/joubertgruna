'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/auth';
import Link from 'next/link';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const MENU_EMPRESA = [
  { href: '/dashboard', label: 'Dashboard', icon: '📊' },
  { href: '/dashboard/lancamentos', label: 'Lançamentos', icon: '📝' },
  { href: '/dashboard/apuracao', label: 'Apuração DAS', icon: '💰' },
  { href: '/dashboard/relatorios', label: 'Relatórios', icon: '📈' },
  { href: '/dashboard/empresa', label: 'Minha Empresa', icon: '🏢' },
  { href: '/dashboard/agente', label: 'Assistente IA', icon: '🤖' },
];

const MENU_ADMIN = [
  { href: '/dashboard', label: 'Dashboard', icon: '📊' },
  { href: '/dashboard/admin/empresas', label: 'Empresas', icon: '🏭' },
  { href: '/dashboard/lancamentos', label: 'Lançamentos', icon: '📝' },
  { href: '/dashboard/apuracao', label: 'Apuração DAS', icon: '💰' },
  { href: '/dashboard/relatorios', label: 'Relatórios', icon: '📈' },
  { href: '/dashboard/agente', label: 'Assistente IA', icon: '🤖' },
];

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isAuthenticated, logout } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  const handleLogout = async () => {
    logout();
    router.push('/login');
  };

  const menuItems = user?.role === 'super_usuario' ? MENU_ADMIN : MENU_EMPRESA;
  const isAdmin = user?.role === 'super_usuario' || user?.role === 'admin';

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-500 text-sm">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <aside className="w-64 bg-white border-r border-gray-200 fixed h-full flex flex-col z-10">
        <div className="p-6 border-b border-gray-100">
          <Link href="/dashboard" className="flex items-center gap-2">
            <span className="text-2xl">📊</span>
            <span className="font-bold text-gray-900 text-lg">SIMEI</span>
          </Link>
          <p className="text-xs text-gray-400 mt-1">Simples Nacional</p>
        </div>

        <div className="p-4 border-b border-gray-100">
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
            <div className={`w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold ${isAdmin ? 'bg-purple-500' : 'bg-blue-500'}`}>
              {user?.nome?.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-800 truncate">{user?.nome}</p>
              <span className={`inline-block text-xs px-2 py-0.5 rounded-full font-medium ${isAdmin ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                {isAdmin ? '👑 Admin' : '🏢 Empresa'}
              </span>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm font-medium ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <span className="text-base">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-100">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
          >
            <span>🚪</span>
            <span>Sair</span>
          </button>
        </div>
      </aside>

      <main className="flex-1 ml-64 p-8 min-h-screen">
        {children}
      </main>
    </div>
  );
}
