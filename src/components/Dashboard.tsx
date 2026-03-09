import React, { useState } from 'react';
import { AlertTriangle, TrendingUp, TrendingDown } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { formatCurrency, formatPercent, calcularSimplesAnexoIII } from '@/utils/simples-nacional';
import { useDashboardData } from '@/hooks/useDashboardData';
import { Skeleton } from '@/components/ui/skeleton';
import SimplesNacionalDashboard from '@/components/dashboard/SimplesNacionalDashboard';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import FluxoReceitaChart from '@/components/dashboard/FluxoReceitaChart';
import FinanceiroSkaleCard from '@/components/dashboard/FinanceiroSkaleCard';
import SplitImpostosCard from '@/components/dashboard/SplitImpostosCard';
import ScoreEmpresarialCard from '@/components/dashboard/ScoreEmpresarialCard';

interface DashboardProps {
  prestadorId: string | null;
  nomeEmpresa: string;
  rbt12: number;
  cnaeAnexo: string;
  regime: string | null;
}

const Dashboard: React.FC<DashboardProps> = ({ prestadorId, nomeEmpresa, rbt12, cnaeAnexo, regime }) => {
  const { loading, notas, tomadores: tomadoresMap, kpis, calculo, dadosMensais, analiseClientes, alertas, fluxoCaixa, splits } = useDashboardData(prestadorId, rbt12, cnaeAnexo);

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-16 rounded-lg" />
        <div className="grid grid-cols-3 gap-3">
          {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-20 rounded-lg" />)}
        </div>
        <Skeleton className="h-64 rounded-lg" />
      </div>
    );
  }

  // Smart alerts
  const smartAlerts: { tipo: string; mensagem: string; icon: React.ReactNode }[] = [];
  alertas.forEach(a => {
    smartAlerts.push({
      tipo: a.tipo,
      mensagem: a.mensagem,
      icon: a.tipo === 'danger' ? <AlertTriangle className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />,
    });
  });
  if (kpis.faturamentoMes > 0 && dadosMensais.length >= 2) {
    const prev = dadosMensais[dadosMensais.length - 2]?.faturamento || 0;
    if (prev > 0) {
      const change = ((kpis.faturamentoMes - prev) / prev) * 100;
      if (Math.abs(change) > 5) {
        smartAlerts.push({
          tipo: change > 0 ? 'success' : 'warning',
          mensagem: `Receita ${change > 0 ? '↑' : '↓'} ${Math.abs(change).toFixed(0)}% vs mês anterior`,
          icon: change > 0 ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />,
        });
      }
    }
  }

  return (
    <div className="space-y-3">

      {/* ROW 1: Dashboard Header com KPIs */}
      <DashboardHeader
        nomeEmpresa={nomeEmpresa}
        titulo="Dashboard"
        kpis={[
          { label: 'Faturamento Mês', value: formatCurrency(kpis.faturamentoMes) },
          { label: 'Impostos Provisionados', value: formatCurrency(kpis.dasEstimado), accent: 'text-red-400' },
          { label: 'Caixa Disponível', value: formatCurrency(fluxoCaixa.saldo), accent: 'text-emerald-400' },
        ]}
      />

      {/* ROW 2: Fluxo de Receita + Alertas */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        <div className="lg:col-span-2">
          <FluxoReceitaChart dadosMensais={dadosMensais} />
        </div>
        <div className="flex flex-col gap-2">
          {smartAlerts.length > 0 ? (
            smartAlerts.map((a, i) => (
              <div
                key={i}
                className={`flex items-start gap-2 p-2.5 rounded-lg border text-[10px] ${
                  a.tipo === 'danger' ? 'border-destructive/30 bg-destructive/5 text-destructive' :
                  a.tipo === 'warning' ? 'border-[hsl(38,80%,55%)]/30 bg-[hsl(38,80%,55%)]/5 text-[hsl(38,80%,45%)]' :
                  a.tipo === 'success' ? 'border-primary/30 bg-primary/5 text-primary' :
                  'border-border bg-muted/30 text-muted-foreground'
                }`}
              >
                {a.icon}
                <span className="font-medium">{a.mensagem}</span>
              </div>
            ))
          ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground text-xs rounded-lg border border-border bg-muted/20 p-4">
              ✅ Sem alertas no momento
            </div>
          )}
        </div>
      </div>

      {/* ROW 3: Financeiro + Split de Impostos + Score */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        <FinanceiroSkaleCard
          faturamentoMes={kpis.faturamentoMes}
          dasEstimado={kpis.dasEstimado}
          fluxoCaixaSaldo={fluxoCaixa.saldo}
          dadosMensais={dadosMensais}
        />
        <SplitImpostosCard
          recebimentos={kpis.faturamentoMes}
          separadoImpostos={kpis.dasEstimado}
          disponivelUso={fluxoCaixa.saldo}
        />
        <ScoreEmpresarialCard
          aliquotaEfetiva={kpis.aliquotaEfetiva}
          margemLiquida={kpis.margemLiquida}
          faturamentoMes={kpis.faturamentoMes}
          dasAPagar={kpis.dasAPagar}
          totalRetencoes={kpis.totalRetencoes}
          rbt12={rbt12}
        />
      </div>

      {/* ROW 4: PGDAS-D + Emitidas + Partilha + Termômetro */}
      <SimplesNacionalDashboard
        rbt12={rbt12}
        cnaeAnexo={cnaeAnexo}
        calculo={calculo}
        kpis={kpis}
        dadosMensais={dadosMensais}
        notas={notas}
        tomadores={tomadoresMap}
      />
    </div>
  );
};

export default Dashboard;
