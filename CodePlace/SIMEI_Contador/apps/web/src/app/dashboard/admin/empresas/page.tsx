'use client';

import { useEffect, useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { useAuthStore } from '@/store/auth';
import { empresaApi } from '@/lib/api';
import toast from 'react-hot-toast';

interface Empresa {
  id: number; razao_social: string; cnpj: string; nome_fantasia: string; status: string; regime_tributario: string;
}
interface EmpresaForm {
  razao_social: string; cnpj: string; nome_fantasia: string; cnae_principal: string; regime_tributario: string;
  email_responsavel: string; nome_responsavel: string;
}

const fmtCNPJ = (v: string) => v?.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, '$1.$2.$3/$4-$5') || v;

export default function AdminEmpresasPage() {
  const { user } = useAuthStore();
  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [busca, setBusca] = useState('');
  const [salvando, setSalvando] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<EmpresaForm>({
    defaultValues: { regime_tributario: 'simples_nacional' },
  });

  const carregar = useCallback(async () => {
    setCarregando(true);
    try {
      const res = await empresaApi.list({ search: busca, limit: 50 });
      setEmpresas(res.data.data || []);
    } catch { toast.error('Erro ao carregar empresas'); }
    finally { setCarregando(false); }
  }, [busca]);

  useEffect(() => { carregar(); }, [carregar]);

  const onSubmit = async (data: EmpresaForm) => {
    setSalvando(true);
    try {
      await empresaApi.create(data);
      toast.success('Empresa criada com sucesso!');
      setShowModal(false);
      reset();
      carregar();
    } catch (err: any) {
      toast.error(err?.response?.data?.error || 'Erro ao criar empresa');
    } finally {
      setSalvando(false);
    }
  };

  const excluir = async (id: number, razao: string) => {
    if (!confirm(`Excluir a empresa "${razao}"? Esta ação não pode ser desfeita.`)) return;
    try {
      await empresaApi.delete(id);
      toast.success('Empresa excluída!');
      carregar();
    } catch { toast.error('Erro ao excluir empresa'); }
  };

  const empresasFiltradas = empresas.filter(e =>
    e.razao_social.toLowerCase().includes(busca.toLowerCase()) ||
    e.cnpj?.includes(busca)
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestão de Empresas</h1>
          <p className="text-gray-500 text-sm mt-1">Administre todas as empresas cadastradas</p>
        </div>
        <button onClick={() => { setShowModal(true); reset(); }}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors">
          + Nova Empresa
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total de Empresas', value: empresas.length, icon: '🏢' },
          { label: 'Ativas', value: empresas.filter(e => e.status === 'ativo').length, icon: '✅' },
          { label: 'Inativas', value: empresas.filter(e => e.status !== 'ativo').length, icon: '⏸️' },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-2xl border border-gray-200 p-4 flex items-center gap-3">
            <span className="text-2xl">{s.icon}</span>
            <div>
              <p className="text-xs text-gray-500">{s.label}</p>
              <p className="text-xl font-bold text-gray-800">{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Busca */}
      <div className="bg-white rounded-2xl border border-gray-200 p-4 flex gap-3 items-center">
        <span className="text-gray-400">🔍</span>
        <input value={busca} onChange={e => setBusca(e.target.value)}
          placeholder="Buscar por razão social ou CNPJ..." 
          className="flex-1 text-sm outline-none text-gray-700 placeholder-gray-400" />
        <button onClick={carregar} className="px-4 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200 transition-colors">🔄</button>
      </div>

      {/* Tabela */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        {carregando ? (
          <div className="flex items-center justify-center h-40 text-gray-400 text-sm">Carregando...</div>
        ) : empresasFiltradas.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-40 text-gray-400 gap-2">
            <span className="text-3xl">🏢</span>
            <span className="text-sm">Nenhuma empresa encontrada.</span>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Empresa</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">CNPJ</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Regime</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {empresasFiltradas.map(e => (
                <tr key={e.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <p className="font-medium text-gray-800">{e.razao_social}</p>
                    {e.nome_fantasia && <p className="text-xs text-gray-500">{e.nome_fantasia}</p>}
                  </td>
                  <td className="px-4 py-3 text-gray-600 font-mono text-xs">{fmtCNPJ(e.cnpj)}</td>
                  <td className="px-4 py-3 text-gray-600 capitalize">{e.regime_tributario?.replace('_', ' ')}</td>
                  <td className="px-4 py-3 text-center">
                    <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${e.status === 'ativo' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                      {e.status === 'ativo' ? 'Ativa' : 'Inativa'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button onClick={() => excluir(e.id, e.razao_social)} title="Excluir"
                      className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors">🗑️</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal Nova Empresa */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-800">Nova Empresa</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600 text-xl">✕</button>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Razão Social *</label>
                <input {...register('razao_social', { required: 'Obrigatório' })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
                {errors.razao_social && <p className="text-red-500 text-xs mt-1">{errors.razao_social.message}</p>}
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">CNPJ *</label>
                <input {...register('cnpj', { required: 'Obrigatório', minLength: { value: 14, message: 'CNPJ inválido' } })}
                  placeholder="00000000000000" maxLength={18}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
                {errors.cnpj && <p className="text-red-500 text-xs mt-1">{errors.cnpj.message}</p>}
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Nome Fantasia</label>
                <input {...register('nome_fantasia')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">CNAE Principal</label>
                <input {...register('cnae_principal')} placeholder="Ex: 6201-5/00"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Nome do Responsável *</label>
                <input {...register('nome_responsavel', { required: 'Obrigatório' })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
                {errors.nome_responsavel && <p className="text-red-500 text-xs mt-1">{errors.nome_responsavel.message}</p>}
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">E-mail do Responsável *</label>
                <input type="email" {...register('email_responsavel', { required: 'Obrigatório' })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
                {errors.email_responsavel && <p className="text-red-500 text-xs mt-1">{errors.email_responsavel.message}</p>}
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Regime Tributário</label>
                <select {...register('regime_tributario')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none">
                  <option value="simples_nacional">Simples Nacional</option>
                  <option value="lucro_presumido">Lucro Presumido</option>
                  <option value="lucro_real">Lucro Real</option>
                </select>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)}
                  className="flex-1 py-2.5 bg-gray-100 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-200 transition-colors">
                  Cancelar
                </button>
                <button type="submit" disabled={salvando}
                  className="flex-1 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors">
                  {salvando ? 'Criando...' : 'Criar Empresa'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
