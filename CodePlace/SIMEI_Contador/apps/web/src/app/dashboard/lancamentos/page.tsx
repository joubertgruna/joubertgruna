'use client';

import { useEffect, useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { useAuthStore } from '@/store/auth';
import { lancamentoApi } from '@/lib/api';
import toast from 'react-hot-toast';

interface Lancamento {
  id: number; tipo: 'receita' | 'despesa';
  categoria: string; descricao: string; valor: number; data: string;
}
interface LancamentoForm {
  tipo: 'receita' | 'despesa'; categoria: string;
  descricao: string; valor: number; data: string;
}

const CATEGORIAS_RECEITA = ['Vendas', 'Serviços', 'Comissões', 'Outras Receitas'];
const CATEGORIAS_DESPESA = ['Aluguel', 'Folha', 'Fornecedores', 'Marketing', 'Impostos', 'Outros'];

const fmt = (v: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);
const fmtDate = (d: string) => new Date(d + 'T00:00:00').toLocaleDateString('pt-BR');

export default function LancamentosPage() {
  const { user } = useAuthStore();
  const [lancamentos, setLancamentos] = useState<Lancamento[]>([]);
  const [carregando, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [filtroTipo, setFiltroTipo] = useState('');
  const [editando, setEditando] = useState<Lancamento | null>(null);
  const [salvando, setSalvando] = useState(false);

  const { register, handleSubmit, reset, watch, setValue, formState: { errors } } = useForm<LancamentoForm>({
    defaultValues: { tipo: 'receita', data: new Date().toISOString().split('T')[0] },
  });
  const tipoAtual = watch('tipo');

  const carregar = useCallback(async () => {
    if (!user?.empresa_id) return;
    setLoading(true);
    try {
      const res = await lancamentoApi.list(user.empresa_id, { tipo: filtroTipo || undefined, limit: 50 });
      setLancamentos(res.data.data);
    } catch { toast.error('Erro ao carregar lançamentos'); }
    finally { setLoading(false); }
  }, [user?.empresa_id, filtroTipo]);

  useEffect(() => { carregar(); }, [carregar]);


  const onSubmit = async (data: LancamentoForm) => {
    if (!user?.empresa_id) return;
    setSalvando(true);
    try {
      if (editando) {
        await lancamentoApi.update(editando.id, data);
        toast.success('Lançamento atualizado!');
      } else {
        await lancamentoApi.create({ ...data, empresa_id: user.empresa_id });
        toast.success('Lançamento criado!');
      }
      setShowForm(false); setEditando(null); reset();
      carregar();
    } catch { toast.error('Erro ao salvar lançamento'); }
    finally { setSalvando(false); }
  };

  const excluir = async (id: number) => {
    if (!confirm('Excluir este lançamento?')) return;
    try {
      await lancamentoApi.delete(id);
      toast.success('Lançamento excluído!');
      carregar();
    } catch { toast.error('Erro ao excluir'); }
  };

  const iniciarEdicao = (l: Lancamento) => {
    setEditando(l); setShowForm(true);
    setValue('tipo', l.tipo); setValue('categoria', l.categoria);
    setValue('descricao', l.descricao); setValue('valor', l.valor);
    setValue('data', l.data?.split('T')[0] || l.data);
  };

  const totalReceitas = lancamentos.filter(l => l.tipo === 'receita').reduce((s, l) => s + Number(l.valor), 0);
  const totalDespesas = lancamentos.filter(l => l.tipo === 'despesa').reduce((s, l) => s + Number(l.valor), 0);
  const lancamentosFiltrados = filtroTipo && filtroTipo !== 'todos' ? lancamentos.filter(l => l.tipo === filtroTipo as 'receita' | 'despesa') : lancamentos;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Lançamentos</h1>
          <p className="text-gray-500 text-sm mt-1">Registre receitas e despesas da empresa</p>
        </div>
        <button onClick={() => { setShowForm(!showForm); setEditando(null); reset(); }}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors">
          <span>{showForm ? '✕ Cancelar' : '+ Novo Lançamento'}</span>
        </button>
      </div>

      {/* Cards resumo */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Receitas', value: totalReceitas, color: 'text-green-600', bg: 'bg-green-50 border-green-100' },
          { label: 'Despesas', value: totalDespesas, color: 'text-red-600', bg: 'bg-red-50 border-red-100' },
          { label: 'Resultado', value: totalReceitas - totalDespesas, color: (totalReceitas - totalDespesas) >= 0 ? 'text-blue-600' : 'text-red-600', bg: 'bg-blue-50 border-blue-100' },
        ].map(c => (
          <div key={c.label} className={`p-4 rounded-xl border ${c.bg}`}>
            <p className="text-xs text-gray-500 mb-1">{c.label}</p>
            <p className={`text-xl font-bold ${c.color}`}>{fmt(c.value)}</p>
          </div>
        ))}
      </div>


      {/* Formulário */}
      {showForm && (
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <h2 className="font-semibold text-gray-800 mb-4">{editando ? 'Editar Lançamento' : 'Novo Lançamento'}</h2>
          <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Tipo</label>
              <select {...register('tipo', { required: true })} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none">
                <option value="receita">💚 Receita</option>
                <option value="despesa">🔴 Despesa</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Categoria</label>
              <select {...register('categoria', { required: 'Obrigatório' })} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none">
                <option value="">Selecione...</option>
                {(tipoAtual === 'receita' ? CATEGORIAS_RECEITA : CATEGORIAS_DESPESA).map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              {errors.categoria && <p className="text-red-500 text-xs mt-1">{errors.categoria.message}</p>}
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-medium text-gray-600 mb-1">Descrição</label>
              <input {...register('descricao')} placeholder="Descrição opcional" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Valor (R$)</label>
              <input type="number" step="0.01" min="0.01" {...register('valor', { required: 'Obrigatório', min: 0.01 })} placeholder="0,00" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
              {errors.valor && <p className="text-red-500 text-xs mt-1">Valor inválido</p>}
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Data</label>
              <input type="date" {...register('data', { required: 'Obrigatório' })} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
            <div className="col-span-2 flex justify-end">
              <button type="submit" disabled={salvando} className="px-6 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors">
                {salvando ? 'Salvando...' : editando ? 'Atualizar' : 'Criar Lançamento'}
              </button>
            </div>
          </form>
        </div>
      )}


      {/* Filtros */}
      <div className="bg-white rounded-2xl border border-gray-200 p-4 flex gap-3 items-center">
        <span className="text-sm text-gray-600 font-medium">Filtrar:</span>
        <select value={filtroTipo} onChange={e => setFiltroTipo(e.target.value)} className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none">
          <option value="todos">Todos</option>
          <option value="receita">Receitas</option>
          <option value="despesa">Despesas</option>
        </select>
        <button onClick={carregar} className="ml-auto px-4 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200 transition-colors">🔄 Atualizar</button>
      </div>

      {/* Tabela */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        {carregando ? (
          <div className="flex items-center justify-center h-40 text-gray-400 text-sm">Carregando...</div>
        ) : lancamentosFiltrados.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-40 text-gray-400 gap-2">
            <span className="text-3xl">📭</span>
            <span className="text-sm">Nenhum lançamento encontrado.</span>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Data</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Descrição</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Categoria</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Tipo</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Valor</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {lancamentosFiltrados.map(l => (
                <tr key={l.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 text-gray-500">{fmtDate(l.data)}</td>
                  <td className="px-4 py-3 text-gray-800">{l.descricao || '—'}</td>
                  <td className="px-4 py-3 text-gray-600">{l.categoria || '—'}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${l.tipo === 'receita' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {l.tipo === 'receita' ? '💚 Receita' : '🔴 Despesa'}
                    </span>
                  </td>
                  <td className={`px-4 py-3 text-right font-medium ${l.tipo === 'receita' ? 'text-green-600' : 'text-red-600'}`}>
                    {l.tipo === 'despesa' ? '- ' : ''}{fmt(l.valor)}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button onClick={() => iniciarEdicao(l)} title="Editar" className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors mr-1">✏️</button>
                    <button onClick={() => excluir(l.id)} title="Excluir" className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors">🗑️</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
