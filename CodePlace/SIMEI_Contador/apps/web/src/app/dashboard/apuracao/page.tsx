'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuthStore } from '@/store/auth';
import { apuracaoApi } from '@/lib/api';
import toast from 'react-hot-toast';

interface DASForm {
  faturamento_mensal: number;
  faturamento_12m: number;
  anexo: string;
  folha_12m: number;
}

interface DASResult {
  aliquota_efetiva: number;
  valor_das: number;
  faixa: number;
  fator_r: number | null;
  detalhamento: { descricao: string; valor: number }[];
}

const fmt = (v: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);
const fmtPct = (v: number) => `${Number(v).toFixed(2)}%`;

export default function ApuracaoPage() {
  const { user } = useAuthStore();
  const [resultado, setResultado] = useState<DASResult | null>(null);
  const [calculando, setCalculando] = useState(false);
  const { register, handleSubmit, watch, formState: { errors } } = useForm<DASForm>({
    defaultValues: { anexo: 'I', folha_12m: 0 },
  });
  const anexo = watch('anexo');

  const onSubmit = async (data: DASForm) => {
    setCalculando(true);
    try {
      const res = await apuracaoApi.calcularDAS({
        empresa_id: user?.empresa_id,
        faturamento_mensal: Number(data.faturamento_mensal),
        faturamento_12m: Number(data.faturamento_12m),
        anexo: data.anexo,
        folha_12m: Number(data.folha_12m) || 0,
      });
      setResultado(res.data);
      toast.success('DAS calculado com sucesso!');
    } catch (err: any) {
      toast.error(err?.response?.data?.error || 'Erro ao calcular DAS');
    } finally {
      setCalculando(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Apuração DAS</h1>
        <p className="text-gray-500 text-sm mt-1">Calcule o Documento de Arrecadação do Simples Nacional</p>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Formulário */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <h2 className="font-semibold text-gray-800 mb-4">Dados para Cálculo</h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Faturamento do Mês (R$)</label>
              <input type="number" step="0.01" min="0" {...register('faturamento_mensal', { required: 'Obrigatório', min: 0 })}
                placeholder="Ex: 15000.00"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
              {errors.faturamento_mensal && <p className="text-red-500 text-xs mt-1">{errors.faturamento_mensal.message}</p>}
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Faturamento Acumulado 12 meses (R$)</label>
              <input type="number" step="0.01" min="0" {...register('faturamento_12m', { required: 'Obrigatório', min: 0 })}
                placeholder="Ex: 180000.00"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
              {errors.faturamento_12m && <p className="text-red-500 text-xs mt-1">{errors.faturamento_12m.message}</p>}
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Anexo do Simples Nacional</label>
              <select {...register('anexo', { required: true })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none">
                <option value="I">Anexo I — Comércio</option>
                <option value="II">Anexo II — Indústria</option>
                <option value="III">Anexo III — Serviços (Fator R)</option>
                <option value="IV">Anexo IV — Serviços (sem CPP)</option>
                <option value="V">Anexo V — Serviços (Fator R)</option>
              </select>
            </div>
            {(anexo === 'III' || anexo === 'V') && (
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Folha de Pagamento 12 meses (R$) <span className="text-gray-400">— para Fator R</span></label>
                <input type="number" step="0.01" min="0" {...register('folha_12m')}
                  placeholder="Ex: 72000.00"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
            )}
            <button type="submit" disabled={calculando}
              className="w-full py-2.5 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors">
              {calculando ? 'Calculando...' : '🧮 Calcular DAS'}
            </button>
          </form>
        </div>

        {/* Resultado */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 flex flex-col">
          <h2 className="font-semibold text-gray-800 mb-4">Resultado</h2>
          {!resultado ? (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-400 gap-3">
              <span className="text-5xl">🧾</span>
              <p className="text-sm">Preencha os dados e calcule o DAS</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-center">
                  <p className="text-xs text-blue-600 font-medium mb-1">Valor do DAS</p>
                  <p className="text-2xl font-bold text-blue-700">{fmt(resultado.valor_das)}</p>
                </div>
                <div className="bg-purple-50 border border-purple-100 rounded-xl p-4 text-center">
                  <p className="text-xs text-purple-600 font-medium mb-1">Alíquota Efetiva</p>
                  <p className="text-2xl font-bold text-purple-700">{fmtPct(resultado.aliquota_efetiva)}</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="flex-1 bg-gray-50 rounded-xl p-3 text-center">
                  <p className="text-xs text-gray-500 mb-1">Faixa</p>
                  <p className="font-bold text-gray-700">{resultado.faixa}ª</p>
                </div>
                {resultado.fator_r !== null && (
                  <div className="flex-1 bg-gray-50 rounded-xl p-3 text-center">
                    <p className="text-xs text-gray-500 mb-1">Fator R</p>
                    <p className="font-bold text-gray-700">{fmtPct(resultado.fator_r)}</p>
                  </div>
                )}
              </div>
              {resultado.detalhamento?.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Detalhamento por tributo</p>
                  <div className="space-y-1.5">
                    {resultado.detalhamento.map((d, i) => (
                      <div key={i} className="flex justify-between text-sm">
                        <span className="text-gray-600">{d.descricao}</span>
                        <span className="font-medium text-gray-800">{fmt(d.valor)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Info sobre Fator R */}
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-sm text-amber-800">
        <strong>ℹ️ Fator R:</strong> Para empresas nos Anexos III ou V, o Fator R é a relação entre folha de pagamento e faturamento dos últimos 12 meses. Se Fator R ≥ 28%, aplica-se o Anexo III; caso contrário, aplica-se o Anexo V.
      </div>
    </div>
  );
}
