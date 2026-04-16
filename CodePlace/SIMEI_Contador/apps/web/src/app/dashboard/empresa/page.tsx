'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuthStore } from '@/store/auth';
import { empresaApi } from '@/lib/api';
import toast from 'react-hot-toast';

interface EmpresaForm {
  razao_social: string;
  nome_fantasia: string;
  cnae_principal: string;
  regime_tributario: string;
  logradouro: string;
  numero: string;
  complemento: string;
  bairro: string;
  cidade: string;
  estado: string;
  cep: string;
}

export default function EmpresaPage() {
  const { user } = useAuthStore();
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [editando, setEditando] = useState(false);
  const [empresa, setEmpresa] = useState<any>(null);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<EmpresaForm>();

  useEffect(() => {
    if (!user?.empresa_id) return;
    empresaApi.get(user.empresa_id).then(res => {
      setEmpresa(res.data);
      const e = res.data;
      reset({
        razao_social: e.razao_social,
        nome_fantasia: e.nome_fantasia || '',
        cnae_principal: e.cnae_principal || '',
        regime_tributario: e.regime_tributario || 'simples_nacional',
        logradouro: e.endereco?.logradouro || '',
        numero: e.endereco?.numero || '',
        complemento: e.endereco?.complemento || '',
        bairro: e.endereco?.bairro || '',
        cidade: e.endereco?.cidade || '',
        estado: e.endereco?.estado || '',
        cep: e.endereco?.cep || '',
      });
    }).catch(() => toast.error('Erro ao carregar dados da empresa'))
      .finally(() => setCarregando(false));
  }, [user?.empresa_id, reset]);

  const onSubmit = async (data: EmpresaForm) => {
    if (!user?.empresa_id) return;
    setSalvando(true);
    try {
      await empresaApi.update(user.empresa_id, {
        razao_social: data.razao_social,
        nome_fantasia: data.nome_fantasia,
        cnae_principal: data.cnae_principal,
        regime_tributario: data.regime_tributario,
        endereco: {
          logradouro: data.logradouro,
          numero: data.numero,
          complemento: data.complemento,
          bairro: data.bairro,
          cidade: data.cidade,
          estado: data.estado,
          cep: data.cep,
        },
      });
      toast.success('Dados atualizados com sucesso!');
      setEditando(false);
    } catch { toast.error('Erro ao salvar dados'); }
    finally { setSalvando(false); }
  };

  if (carregando) return (
    <div className="flex items-center justify-center h-64 text-gray-400 text-sm">Carregando dados da empresa...</div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Minha Empresa</h1>
          <p className="text-gray-500 text-sm mt-1">Visualize e edite os dados cadastrais</p>
        </div>
        <button onClick={() => setEditando(!editando)}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${editando ? 'bg-gray-200 text-gray-700 hover:bg-gray-300' : 'bg-blue-600 text-white hover:bg-blue-700'}`}>
          {editando ? '✕ Cancelar' : '✏️ Editar'}
        </button>
      </div>

      {/* Header card */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-6 text-white">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center text-3xl">🏢</div>
          <div>
            <h2 className="text-xl font-bold">{empresa?.razao_social}</h2>
            <p className="text-blue-100 text-sm">{empresa?.cnpj}</p>
            <span className="inline-block mt-1 px-2 py-0.5 bg-white/20 rounded-full text-xs">Simples Nacional</span>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Dados principais */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4 mb-4">
          <h3 className="font-semibold text-gray-800">Dados Cadastrais</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-xs font-medium text-gray-600 mb-1">Razão Social</label>
              <input {...register('razao_social', { required: 'Obrigatório' })} disabled={!editando}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm disabled:bg-gray-50 disabled:text-gray-600 focus:ring-2 focus:ring-blue-500 outline-none" />
              {errors.razao_social && <p className="text-red-500 text-xs mt-1">{errors.razao_social.message}</p>}
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Nome Fantasia</label>
              <input {...register('nome_fantasia')} disabled={!editando}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm disabled:bg-gray-50 disabled:text-gray-600 focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">CNAE Principal</label>
              <input {...register('cnae_principal')} disabled={!editando}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm disabled:bg-gray-50 disabled:text-gray-600 focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
          </div>
        </div>

        {/* Endereço */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">
          <h3 className="font-semibold text-gray-800">Endereço</h3>
          <div className="grid grid-cols-4 gap-4">
            <div className="col-span-3">
              <label className="block text-xs font-medium text-gray-600 mb-1">Logradouro</label>
              <input {...register('logradouro')} disabled={!editando}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm disabled:bg-gray-50 disabled:text-gray-600 focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Número</label>
              <input {...register('numero')} disabled={!editando}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm disabled:bg-gray-50 disabled:text-gray-600 focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-medium text-gray-600 mb-1">Bairro</label>
              <input {...register('bairro')} disabled={!editando}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm disabled:bg-gray-50 disabled:text-gray-600 focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Complemento</label>
              <input {...register('complemento')} disabled={!editando}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm disabled:bg-gray-50 disabled:text-gray-600 focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">CEP</label>
              <input {...register('cep')} disabled={!editando}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm disabled:bg-gray-50 disabled:text-gray-600 focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-medium text-gray-600 mb-1">Cidade</label>
              <input {...register('cidade')} disabled={!editando}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm disabled:bg-gray-50 disabled:text-gray-600 focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">UF</label>
              <input {...register('estado')} maxLength={2} disabled={!editando}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm disabled:bg-gray-50 disabled:text-gray-600 focus:ring-2 focus:ring-blue-500 outline-none uppercase" />
            </div>
          </div>

          {editando && (
            <div className="flex justify-end pt-2">
              <button type="submit" disabled={salvando}
                className="px-6 py-2 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors">
                {salvando ? 'Salvando...' : '💾 Salvar Alterações'}
              </button>
            </div>
          )}
        </div>
      </form>
    </div>
  );
}
