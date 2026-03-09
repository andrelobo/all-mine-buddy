import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid,
} from 'recharts';
import { formatCurrency } from '@/utils/simples-nacional';
import DashboardCard from './DashboardCard';
import type { MesData } from '@/hooks/useDashboardData';

interface Props {
  faturamentoMes: number;
  dasEstimado: number;
  fluxoCaixaSaldo: number;
  dadosMensais: MesData[];
}

const CHART_BLUE = 'hsl(220, 60%, 55%)';
const CHART_GREEN = 'hsl(160, 60%, 45%)';

const FinanceiroSkaleCard: React.FC<Props> = ({ faturamentoMes, dasEstimado, fluxoCaixaSaldo, dadosMensais }) => {
  const chartData = dadosMensais.slice(-6).map(m => ({
    label: m.label.substring(0, 5),
    entradas: m.faturamento,
    saidas: m.tributoEstimado,
  }));

  const entradas = faturamentoMes;
  const saidas = dasEstimado;
  const caixaProjetado = fluxoCaixaSaldo;

  return (
    <DashboardCard title="Financeiro" headerColor="blue">
      <div className="space-y-3">
        {/* KPIs top */}
        <div className="grid grid-cols-3 gap-2">
          <KpiBox label="Entradas" value={formatCurrency(entradas)} color="text-foreground" />
          <KpiBox label="Saídas" value={formatCurrency(saidas)} color="text-destructive" />
          <KpiBox label="Caixa Projetado" value={formatCurrency(caixaProjetado)} color="text-primary" />
        </div>

        {/* Chart */}
        <div>
          <p className="text-[9px] text-muted-foreground font-semibold uppercase tracking-wide mb-1">Fluxo de Caixa</p>
          <div className="h-28">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} barGap={2}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="label" tick={{ fontSize: 8 }} stroke="hsl(var(--muted-foreground))" />
                <YAxis tick={{ fontSize: 8 }} stroke="hsl(var(--muted-foreground))" width={40} tickFormatter={v => `${(v / 1000).toFixed(0)}k`} />
                <Tooltip formatter={(v: number) => formatCurrency(v)} />
                <Bar dataKey="entradas" fill={CHART_BLUE} radius={[2, 2, 0, 0]} name="Entradas" />
                <Bar dataKey="saidas" fill="hsl(0, 70%, 55%)" radius={[2, 2, 0, 0]} name="Saídas" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Contas */}
        <div className="space-y-1 border-t border-border pt-2">
          <div className="flex items-center justify-between text-[10px]">
            <span className="text-muted-foreground">Contas a Receber</span>
            <span className="font-bold text-foreground tabular-nums">{formatCurrency(entradas * 0.3)}</span>
          </div>
          <div className="flex items-center justify-between text-[10px]">
            <span className="text-muted-foreground">Contas a Pagar</span>
            <span className="font-bold text-destructive tabular-nums">{formatCurrency(saidas)}</span>
          </div>
        </div>
      </div>
    </DashboardCard>
  );
};

const KpiBox: React.FC<{ label: string; value: string; color: string }> = ({ label, value, color }) => (
  <div className="text-center p-2 rounded-lg bg-muted/40 border border-border/50">
    <p className="text-[8px] text-muted-foreground uppercase tracking-wide">{label}</p>
    <p className={`text-sm font-bold tabular-nums ${color}`}>{value}</p>
  </div>
);

export default FinanceiroSkaleCard;
