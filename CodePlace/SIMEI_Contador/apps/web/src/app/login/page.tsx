'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { api } from '@/lib/api';
import { useAuthStore } from '@/store/auth';

interface LoginForm {
  email: string;
  senha: string;
}

type Perfil = 'empresa' | 'super_usuario';

const PERFIS = {
  empresa: {
    label: 'Empresa',
    icon: '🏢',
    email: 'usuario@exemplo.com',
    senha: 'empresa123',
    desc: 'Acesse o painel da sua empresa',
    color: 'border-blue-500 bg-blue-50',
    btn: 'bg-blue-600 hover:bg-blue-700',
  },
  super_usuario: {
    label: 'Administrador',
    icon: '👑',
    email: 'admin@simei.com',
    senha: 'admin123',
    desc: 'Acesso total ao sistema',
    color: 'border-purple-500 bg-purple-50',
    btn: 'bg-purple-600 hover:bg-purple-700',
  },
};

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [perfil, setPerfil] = useState<Perfil>('empresa');
  const router = useRouter();
  const { setAuth } = useAuthStore();

  const { register, handleSubmit, setValue, formState: { errors } } = useForm<LoginForm>();

  const selecionarPerfil = (p: Perfil) => {
    setPerfil(p);
    setValue('email', PERFIS[p].email);
    setValue('senha', PERFIS[p].senha);
  };

  const onSubmit = async (data: LoginForm) => {
    setLoading(true);
    try {
      const response = await api.post('/auth/login', data);
      const { user, accessToken, refreshToken } = response.data;
      setAuth(user, accessToken, refreshToken);
      toast.success(`Bem-vindo, ${user.nome}!`);
      router.push('/dashboard');
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Credenciais inválidas');
    } finally {
      setLoading(false);
    }
  };

  const perfilAtual = PERFIS[perfil];

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 to-white p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <div className="flex items-center justify-center gap-2 mb-2">
              <span className="text-4xl">📊</span>
              <span className="text-3xl font-bold text-gray-900">SIMEI Contador</span>
            </div>
          </Link>
          <p className="text-gray-500 text-sm">Sistema de Contabilidade - Simples Nacional</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          {/* Seletor de Perfil */}
          <div className="p-6 pb-0">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
              Selecione seu perfil
            </p>
            <div className="grid grid-cols-2 gap-3 mb-6">
              {(Object.keys(PERFIS) as Perfil[]).map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => selecionarPerfil(p)}
                  className={`flex flex-col items-center gap-1 p-4 rounded-xl border-2 transition-all cursor-pointer text-left ${
                    perfil === p
                      ? PERFIS[p].color + ' shadow-sm'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <span className="text-2xl">{PERFIS[p].icon}</span>
                  <span className={`font-semibold text-sm ${perfil === p ? 'text-gray-800' : 'text-gray-600'}`}>
                    {PERFIS[p].label}
                  </span>
                  <span className="text-xs text-gray-400 text-center leading-tight">
                    {PERFIS[p].desc}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Formulário */}
          <form onSubmit={handleSubmit(onSubmit)} className="px-6 pb-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-sm"
                placeholder="seu@email.com"
                {...register('email', {
                  required: 'Email é obrigatório',
                  pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Email inválido' },
                })}
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Senha</label>
              <input
                type="password"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-sm"
                placeholder="••••••••"
                {...register('senha', { required: 'Senha é obrigatória' })}
              />
              {errors.senha && <p className="text-red-500 text-xs mt-1">{errors.senha.message}</p>}
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 rounded-xl text-white font-semibold transition-all text-sm ${perfilAtual.btn} disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  Entrando...
                </span>
              ) : (
                `Entrar como ${perfilAtual.label}`
              )}
            </button>

            {/* Dica de credenciais */}
            <div className="mt-2 p-3 bg-gray-50 rounded-xl border border-gray-100">
              <p className="text-xs text-gray-400 font-medium mb-1">🔑 Demo - {perfilAtual.label}</p>
              <p className="text-xs font-mono text-gray-600">{perfilAtual.email}</p>
              <p className="text-xs font-mono text-gray-600">{perfilAtual.senha}</p>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
