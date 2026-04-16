'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useAuthStore } from '@/store/auth';
import { agenteApi } from '@/lib/api';
import toast from 'react-hot-toast';

interface Mensagem {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  ferramentas?: string[];
  timestamp: Date;
  carregando?: boolean;
}

const SUGESTOES = [
  'Qual é o meu faturamento deste mês?',
  'Calcule o DAS com faturamento de R$ 15.000 (Anexo I, 12m acumulado R$ 180.000)',
  'Liste os últimos lançamentos da empresa',
  'Crie uma receita de R$ 5.000 por "Venda de produtos" para hoje',
  'Gere o DRE do mês atual',
];

const ICONES_FERRAMENTA: Record<string, string> = {
  buscar_dashboard: '📊',
  listar_lancamentos: '📋',
  criar_lancamento: '✏️',
  calcular_das: '💰',
  buscar_empresa: '🏢',
  listar_empresas: '🏭',
  buscar_relatorio_dre: '📈',
};

function BolhaMensagem({ msg }: { msg: Mensagem }) {
  const isUser = msg.role === 'user';

  if (msg.carregando) {
    return (
      <div className="flex items-end gap-3 justify-start">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
          IA
        </div>
        <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce [animation-delay:0ms]" />
            <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce [animation-delay:150ms]" />
            <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce [animation-delay:300ms]" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex items-end gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
      {/* Avatar */}
      <div
        className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0 ${
          isUser
            ? 'bg-gradient-to-br from-emerald-400 to-teal-600'
            : 'bg-gradient-to-br from-blue-500 to-indigo-600'
        }`}
      >
        {isUser ? 'EU' : 'IA'}
      </div>

      <div className={`max-w-[75%] flex flex-col gap-1 ${isUser ? 'items-end' : 'items-start'}`}>
        {/* Ferramentas usadas */}
        {msg.ferramentas && msg.ferramentas.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-1">
            {msg.ferramentas.map((f) => (
              <span
                key={f}
                className="inline-flex items-center gap-1 text-xs bg-blue-50 text-blue-700 border border-blue-100 rounded-full px-2 py-0.5"
              >
                {ICONES_FERRAMENTA[f] || '🔧'} {f.replace(/_/g, ' ')}
              </span>
            ))}
          </div>
        )}

        {/* Bolha */}
        <div
          className={`px-4 py-3 rounded-2xl shadow-sm text-sm leading-relaxed whitespace-pre-wrap ${
            isUser
              ? 'bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-br-sm'
              : 'bg-white border border-gray-200 text-gray-800 rounded-bl-sm'
          }`}
        >
          {msg.content}
        </div>

        {/* Horário */}
        <span className="text-xs text-gray-400 px-1">
          {msg.timestamp.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>
    </div>
  );
}

export default function AgentePage() {
  const { user } = useAuthStore();
  const [mensagens, setMensagens] = useState<Mensagem[]>([
    {
      id: 'boas-vindas',
      role: 'assistant',
      content: `Olá, ${user?.nome?.split(' ')[0] || 'bem-vindo'}! 👋\n\nSou o **SIMEI Assistente**, seu agente contábil inteligente. Posso ajudar você a:\n\n• 📊 Consultar faturamento e resultados\n• 💰 Calcular o DAS do Simples Nacional\n• 📝 Registrar receitas e despesas\n• 📈 Gerar relatórios financeiros\n\nO que você gostaria de fazer hoje?`,
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [agentePronto, setAgentePronto] = useState<boolean | null>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const endRef = useRef<HTMLDivElement>(null);

  // Verifica status do agente na montagem
  useEffect(() => {
    agenteApi
      .status()
      .then((r) => setAgentePronto(r.data.configurado))
      .catch(() => setAgentePronto(false));
  }, []);

  // Auto-scroll
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [mensagens]);

  const enviar = useCallback(
    async (texto?: string) => {
      const conteudo = (texto ?? input).trim();
      if (!conteudo || enviando) return;

      const novaMsgUsuario: Mensagem = {
        id: Date.now().toString(),
        role: 'user',
        content: conteudo,
        timestamp: new Date(),
      };

      const idCarregando = `loading-${Date.now()}`;
      const msgCarregando: Mensagem = {
        id: idCarregando,
        role: 'assistant',
        content: '',
        timestamp: new Date(),
        carregando: true,
      };

      setInput('');
      setMensagens((prev) => [...prev, novaMsgUsuario, msgCarregando]);
      setEnviando(true);

      // Monta histórico sem a mensagem de boas-vindas e sem a de carregando
      const historico = [...mensagens, novaMsgUsuario]
        .filter((m) => m.id !== 'boas-vindas' && !m.carregando)
        .map(({ role, content }) => ({ role, content }));

      try {
        const res = await agenteApi.chat(
          historico,
          user?.empresa_id || undefined
        );

        const resposta: Mensagem = {
          id: `ai-${Date.now()}`,
          role: 'assistant',
          content: res.data.content,
          ferramentas: res.data.ferramentas_usadas,
          timestamp: new Date(),
        };

        setMensagens((prev) => [
          ...prev.filter((m) => m.id !== idCarregando),
          resposta,
        ]);
      } catch (err: any) {
        setMensagens((prev) => prev.filter((m) => m.id !== idCarregando));
        const msg =
          err?.response?.data?.error ||
          'Erro ao se comunicar com o agente. Tente novamente.';
        toast.error(msg);
      } finally {
        setEnviando(false);
        inputRef.current?.focus();
      }
    },
    [input, enviando, mensagens, user]
  );

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      enviar();
    }
  };

  const limparConversa = () => {
    setMensagens([
      {
        id: 'boas-vindas-reset',
        role: 'assistant',
        content: 'Conversa reiniciada. Como posso ajudar?',
        timestamp: new Date(),
      },
    ]);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-2rem)] max-h-[900px]">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-200 rounded-t-2xl flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow">
            <span className="text-white text-lg">🤖</span>
          </div>
          <div>
            <h1 className="text-base font-bold text-gray-900">SIMEI Assistente</h1>
            <div className="flex items-center gap-1.5">
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  agentePronto === null
                    ? 'bg-yellow-400 animate-pulse'
                    : agentePronto
                    ? 'bg-emerald-400'
                    : 'bg-red-400'
                }`}
              />
              <span className="text-xs text-gray-500">
                {agentePronto === null
                  ? 'Verificando...'
                  : agentePronto
                  ? 'Online · GitHub Models'
                  : 'GITHUB_TOKEN não configurado'}
              </span>
            </div>
          </div>
        </div>

        <button
          onClick={limparConversa}
          className="text-xs text-gray-400 hover:text-gray-600 transition-colors px-3 py-1.5 rounded-lg hover:bg-gray-100"
        >
          🗑 Limpar conversa
        </button>
      </div>

      {/* Aviso se não configurado */}
      {agentePronto === false && (
        <div className="mx-4 mt-3 flex-shrink-0 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-sm text-amber-800">
          <strong>⚠️ Agente não configurado.</strong> Adicione{' '}
          <code className="bg-amber-100 px-1 rounded">GITHUB_TOKEN=ghp_...</code> no arquivo{' '}
          <code className="bg-amber-100 px-1 rounded">apps/api/.env</code> e reinicie a API.{' '}
          <a
            href="https://github.com/settings/tokens"
            target="_blank"
            rel="noreferrer"
            className="underline hover:text-amber-900"
          >
            Gerar token →
          </a>
        </div>
      )}

      {/* Área de mensagens */}
      <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5 bg-gray-50">
        {mensagens.map((msg) => (
          <BolhaMensagem key={msg.id} msg={msg} />
        ))}
        <div ref={endRef} />
      </div>

      {/* Sugestões rápidas */}
      {mensagens.length <= 2 && (
        <div className="px-6 py-3 bg-gray-50 border-t border-gray-100 flex-shrink-0">
          <p className="text-xs text-gray-400 mb-2 font-medium">Sugestões:</p>
          <div className="flex flex-wrap gap-2">
            {SUGESTOES.map((s) => (
              <button
                key={s}
                onClick={() => enviar(s)}
                disabled={enviando}
                className="text-xs bg-white border border-gray-200 text-gray-600 px-3 py-1.5 rounded-full hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700 transition-colors disabled:opacity-50"
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="px-4 py-4 bg-white border-t border-gray-200 rounded-b-2xl flex-shrink-0">
        <div className="flex items-end gap-3 bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Digite sua pergunta ou pedido... (Enter para enviar, Shift+Enter para nova linha)"
            disabled={enviando || agentePronto === false}
            rows={1}
            className="flex-1 bg-transparent resize-none outline-none text-sm text-gray-800 placeholder-gray-400 max-h-40 disabled:opacity-50"
            style={{ lineHeight: '1.5' }}
          />
          <button
            onClick={() => enviar()}
            disabled={!input.trim() || enviando || agentePronto === false}
            className="w-9 h-9 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl flex items-center justify-center text-white shadow hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0"
          >
            {enviando ? (
              <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
            ) : (
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
              </svg>
            )}
          </button>
        </div>
        <p className="text-center text-xs text-gray-400 mt-2">
          O agente pode consultar dados, criar lançamentos e calcular impostos automaticamente.
        </p>
      </div>
    </div>
  );
}
