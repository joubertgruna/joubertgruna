'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuthStore } from '@/store/auth';
import { relatorioApi } from '@/lib/api';
import toast from 'react-hot-toast';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const fmt = (v: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v || 0);

type Tab = 'dre' | 'balancete' | 'fluxo';

export default function RelatoriosPage() {
  const { user } = useAuthStore();
  const [tab, setTab] = useState<Tab>('dre');
  const [carregando, setCarregando] = useState(false);
  const [dre, setDre] = useState<any>(null);
  const [balancete, setBalancete] = useState<any[]>([]);
  const [fluxo, setFluxo] = useState<any[]>([]);

  const now = new Date();
  const [ano, setAno] = useState(now.getFullYear());
  const [mes, setMes] = useState(now.getMonth() + 1);

  const carregarDre = useCallback(async () => {
    if (!user?.empresa_id) return;
    setCarregando(true);
    try {
      const res = await relatorioApi.dre({ empresa_id: user.empresa_id, ano, mes });
      setDre(res.data);
    } catch { toast.error('Erro ao carregar DRE'); }
    finally { setCarregando(false); }
  }, [user?.empresa_id, ano, mes]);

  const carregarBalancete = useCallback(async () => {
    if (!user?.empresa_id) return;
    setCarregando(true);
    try {
      const res = await relatorioApi.balancete({ empresa_id: user.empresa_id, ano, mes });
      setBalancete(res.data?.linhas || []);
    } catch { toast.error('Erro ao carregar Balancete'); }
    finally { setCarregando(false); }
  }, [user?.empresa_id, ano, mes]);

  const carregarFluxo = useCallback(async () => {
    if (!user?.empresa_id) return;
    setCarregando(true);
    try {
      const res = await relatorioApi.fluxoCaixa({ empresa_id: user.empresa_id, ano });
      setFluxo(res.data?.meses || []);
    } catch { toast.error('Erro ao carregar Fluxo de Caixa'); }
    finally { setCarregando(false); }
  }, [user?.empresa_id, ano]);

  useEffect(() => {
    if (tab === 'dre') carregarDre();
    else if (tab === 'balancete') carregarBalancete();
    else carregarFluxo();
  }, [tab, carregarDre, carregarBalancete, carregarFluxo]);

  const TABS: { id: Tab; label: string }[] = [
    { id: 'dre', label: '📊 DRE' },
    { id: 'balancete', label: '📋 Balancete' },
    { id: 'fluxo', label: '📈 Fluxo de Caixa' },
  ];

  const meses = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Relatórios</h1>
        <p className="text-gray-500 text-sm mt-1">Demonstrações financeiras da empresa</p>
      </div>

      {/* Filtros de período */}
      <div className="bg-white rounded-2xl border border-gray-200 p-4 flex gap-4 items-center">
        <span className="text-sm text-gray-600 font-medium">Período:</span>
        <select value={mes} onChange={e => setMes(Number(e.target.value))}
          className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none">
          {meses.map((m, i) => <option key={i} value={i + 1}>{m}</option>)}
        </select>
        <select value={ano} onChange={e => setAno(Number(e.target.value))}
          className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none">
          {[2023, 2024, 2025].map(y => <option key={y} value={y}>{y}</option>)}
        </select>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-200 pb-0">
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors border-b-2 ${tab === t.id ? 'border-blue-600 text-blue-600 bg-blue-50' : 'border-transparent text-gray-500 hover:text-gray-800'}`}>
            {t.label}
          </button>
        ))}
      </div>

      {carregando && <div className="flex items-center justify-center h-40 text-gray-400 text-sm">Carregando relatório...</div>}

      {/* DRE */}
      {!carregando && tab === 'dre' && (
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
            <h2 className="font-semibold text-gray-700">Demonstração do Resultado — {meses[mes - 1]}/{ano}</h2>
          </div>
          {!dre ? (
            <div className="flex items-center justify-center h-32 text-gray-400 text-sm">Nenhum dado encontrado.</div>
          ) : (
            <table className="w-full text-sm">
              <tbody>
                {[
                  { label: 'Receita Bruta', value: dre.receita_bruta, bold: true },
                  { label: '(-) Deduções', value: -(dre.deducoes || 0) },
                  { label: 'Receita Líquida', value: dre.receita_liquida, bold: true },
                  { label: '(-) Custo das Vendas', value: -(dre.custo_vendas || 0) },
                  { label: 'Lucro Bruto', value: dre.lucro_bruto, bold: true },
                  { label: '(-) Despesas Operacionais', value: -(dre.despesas_operacionais || 0) },
                  { label: '(-) DAS', value: -(dre.das || 0) },
                  { label: 'Resultado Líquido', value: dre.resultado_liquido, bold: true, highlight: true },
                ].map((row, i) => (
                  <tr key={i} className={`border-b border-gray-100 ${row.highlight ? 'bg-blue-50' : ''}`}>
                    <td className={`px-6 py-3 ${row.bold ? 'font-semibold text-gray-800' : 'text-gray-600 pl-10'}`}>{row.label}</td>
                    <td className={`px-6 py-3 text-right font-medium ${(row.value || 0) >= 0 ? 'text-gray-800' : 'text-red-600'}`}>{fmt(row.value || 0)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* Balancete */}
      {!carregando && tab === 'balancete' && (
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
            <h2 className="font-semibold text-gray-700">Balancete — {meses[mes - 1]}/{ano}</h2>
          </div>
          {balancete.length === 0 ? (
            <div className="flex items-center justify-center h-32 text-gray-400 text-sm">Nenhuma conta encontrada.</div>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Conta</th>
                  <th className="text-right px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Débito</th>
                  <th className="text-right px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Crédito</th>
                  <th className="text-right px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Saldo</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {balancete.map((linha: any, i: number) => (
                  <tr key={i} className="hover:bg-gray-50">
                    <td className="px-6 py-3 text-gray-800">{linha.conta}</td>
                    <td className="px-6 py-3 text-right text-gray-600">{fmt(linha.debito)}</td>
                    <td className="px-6 py-3 text-right text-gray-600">{fmt(linha.credito)}</td>
                    <td className={`px-6 py-3 text-right font-medium ${linha.saldo >= 0 ? 'text-blue-600' : 'text-red-600'}`}>{fmt(linha.saldo)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* Fluxo de Caixa */}
      {!carregando && tab === 'fluxo' && (
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <h2 className="font-semibold text-gray-800 mb-4">Fluxo de Caixa — {ano}</h2>
          {fluxo.length === 0 ? (
            <div className="flex items-center justify-center h-40 text-gray-400 text-sm">Nenhum dado para exibir.</div>
          ) : (
            <Bar
              data={{
                labels: fluxo.map((m: any) => meses[m.mes - 1] || m.mes),
                datasets: [
                  { label: 'Receitas', data: fluxo.map((m: any) => m.receitas), backgroundColor: 'rgba(34,197,94,0.7)', borderRadius: 6 },
                  { label: 'Despesas', data: fluxo.map((m: any) => m.despesas), backgroundColor: 'rgba(239,68,68,0.7)', borderRadius: 6 },
                ],
              }}
              options={{
                responsive: true,
                plugins: { legend: { position: 'top' } },
                scales: { y: { beginAtZero: true, ticks: { callback: (v) => `R$ ${Number(v).toLocaleString('pt-BR')}` } } },
              }}
            />
          )}
        </div>
      )}
    </div>
  );
}
