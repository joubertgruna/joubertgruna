'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/auth';
import { empresaApi } from '@/lib/api';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

interface DashboardData {
  periodo: string;
  receitas: number;
  despesas: number;
  resultado: number;
  faturamento_acumulado_12m: number;
  historico_mensal: { mes: string; total: string }[];
}

export default function DashboardPage() {
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      if (user?.empresa_id) {
        try {
          const response = await empresaApi.dashboard(user.empresa_id);
          setDashboard(response.data);
        } catch (error) {
          console.error('Erro ao carregar dashboard:', error);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, [user]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  const barChartData = {
    labels: dashboard?.historico_mensal?.map((m) => m.mes) || [],
    datasets: [
      {
        label: 'Faturamento',
        data: dashboard?.historico_mensal?.map((m) => Number(m.total)) || [],
        backgroundColor: 'rgba(37, 99, 235, 0.8)',
        borderRadius: 8,
      },
    ],
  };

  const doughnutData = {
    labels: ['Receitas', 'Despesas'],
    datasets: [
      {
        data: [dashboard?.receitas || 0, dashboard?.despesas || 0],
        backgroundColor: ['rgba(16, 185, 129, 0.8)', 'rgba(239, 68, 68, 0.8)'],
        borderWidth: 0,
      },
    ],
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">
          Visão geral financeira • {dashboard?.periodo || 'Carregando...'}
        </p>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card">
          <p className="text-sm text-gray-500 mb-1">Receitas do mês</p>
          <p className="text-2xl font-bold text-success">
            {formatCurrency(dashboard?.receitas || 0)}
          </p>
        </div>

        <div className="card">
          <p className="text-sm text-gray-500 mb-1">Despesas do mês</p>
          <p className="text-2xl font-bold text-danger">
            {formatCurrency(dashboard?.despesas || 0)}
          </p>
        </div>

        <div className="card">
          <p className="text-sm text-gray-500 mb-1">Resultado</p>
          <p
            className={`text-2xl font-bold ${
              (dashboard?.resultado || 0) >= 0 ? 'text-success' : 'text-danger'
            }`}
          >
            {formatCurrency(dashboard?.resultado || 0)}
          </p>
        </div>

        <div className="card">
          <p className="text-sm text-gray-500 mb-1">Faturamento 12 meses</p>
          <p className="text-2xl font-bold text-primary-600">
            {formatCurrency(dashboard?.faturamento_acumulado_12m || 0)}
          </p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="card lg:col-span-2">
          <h3 className="text-lg font-semibold mb-4">Faturamento mensal</h3>
          <Bar
            data={barChartData}
            options={{
              responsive: true,
              plugins: {
                legend: { display: false },
              },
              scales: {
                y: {
                  beginAtZero: true,
                  ticks: {
                    callback: (value) => formatCurrency(value as number),
                  },
                },
              },
            }}
          />
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold mb-4">Receitas vs Despesas</h3>
          <Doughnut
            data={doughnutData}
            options={{
              responsive: true,
              plugins: {
                legend: {
                  position: 'bottom',
                },
              },
            }}
          />
        </div>
      </div>
    </div>
  );
}
