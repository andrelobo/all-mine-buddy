import React from 'react';
import {
  AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid,
} from 'recharts';
import { formatCurrency } from '@/utils/simples-nacional';
import DashboardCard from './DashboardCard';
import type { MesData } from '@/hooks/useDashboardData';

interface Props {
  dadosMensais: MesData[];
}

const FluxoReceitaChart: React.FC<Props> = ({ dadosMensais }) => {
  const chartData = dadosMensais.slice(-8).map(m => ({
    label: m.label.substring(0, 5),
    receita: m.faturamento,
  }));

  return (
    <DashboardCard title="Fluxo de Receita Mensal" headerColor="default">
      <div className="h-40">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="label" tick={{ fontSize: 9 }} stroke="hsl(var(--muted-foreground))" />
            <YAxis tick={{ fontSize: 9 }} stroke="hsl(var(--muted-foreground))" width={45} tickFormatter={v => `${(v / 1000).toFixed(0)}k`} />
            <Tooltip formatter={(v: number) => formatCurrency(v)} />
            <Area
              type="monotone"
              dataKey="receita"
              stroke="hsl(220, 60%, 55%)"
              fill="hsl(220, 60%, 55%)"
              fillOpacity={0.15}
              strokeWidth={2}
              name="Receita"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </DashboardCard>
  );
};

export default FluxoReceitaChart;
