import React, { useState, useMemo } from 'react';
import { AlertTriangle, TrendingUp, TrendingDown, Shield, DollarSign, Users } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  PieChart as RechartsPie, Pie, Cell,
  XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, Legend,
  BarChart, Bar,
} from 'recharts';
import { formatCurrency, formatPercent, FAIXAS_ANEXO_III, calcularSimplesAnexoIII } from '@/utils/simples-nacional';
import { useDashboardData } from '@/hooks/useDashboardData';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import SimplesNacionalDashboard from '@/components/dashboard/SimplesNacionalDashboard';
import DashboardCard from '@/components/dashboard/DashboardCard';
import DashboardHeader from '@/components/dashboard/DashboardHeader';

interface DashboardProps {
  prestadorId: string | null;
  nomeEmpresa: string;
  rbt12: number;
  cnaeAnexo: string;
  regime: string | null;
}

const PIE_COLORS = [
  'hsl(160, 60%, 45%)', 'hsl(160, 40%, 60%)', 'hsl(160, 30%, 72%)',
  'hsl(38, 80%, 55%)', 'hsl(220, 60%, 55%)', 'hsl(280, 50%, 55%)',
  'hsl(340, 60%, 55%)', 'hsl(200, 50%, 55%)',
];

const Dashboard: React.FC<DashboardProps> = ({ prestadorId, nomeEmpresa, rbt12, cnaeAnexo, regime }) => {
  const { loading, notas, tomadores: tomadoresMap, kpis, calculo, dadosMensais, analiseClientes, alertas, fluxoCaixa, splits } = useDashboardData(prestadorId, rbt12, cnaeAnexo);
  const [simulacaoExtra, setSimulacaoExtra] = useState<string>('');

  const formatCurrencyInput = (value: string) => {
    const digits = value.replace(/\D/g, '');
    if (!digits) return '';
    const num = parseInt(digits, 10) / 100;
    return num.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const parseCurrencyInput = (formatted: string): number => {
    if (!formatted) return 0;
    return parseFloat(formatted.replace(/\./g, '').replace(',', '.')) || 0;
  };

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

  // Revenue by client pie data
  const pieClientes = analiseClientes.slice(0, 6).map(c => ({
    name: c.nome.length > 18 ? c.nome.substring(0, 18) + '…' : c.nome,
    value: c.faturamento,
    percentual: c.percentual,
  }));

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

  // Simulação de faixa
  const extraVal = parseCurrencyInput(simulacaoExtra);
  const rbt12Simulado = rbt12 + extraVal;
  const calculoSimulado = extraVal > 0 ? calcularSimplesAnexoIII(rbt12Simulado, cnaeAnexo || 'III') : null;
  const mudouFaixa = calculoSimulado?.faixa && calculo.faixa && calculoSimulado.faixa.faixa !== calculo.faixa.faixa;

  return (
    <div className="space-y-3">

      {/* SMART ALERTS */}
      {smartAlerts.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {smartAlerts.map((a, i) => (
            <Badge
              key={i}
              variant="outline"
              className={`text-[10px] gap-1 py-1 ${
                a.tipo === 'danger' ? 'border-destructive text-destructive' :
                a.tipo === 'warning' ? 'border-[hsl(38,80%,55%)] text-[hsl(38,80%,45%)]' :
                a.tipo === 'success' ? 'border-accent text-accent' : 'border-primary text-primary'
              }`}
            >
              {a.icon} {a.mensagem}
            </Badge>
          ))}
        </div>
      )}

      {/* SIMPLES NACIONAL SECTION */}
      <SimplesNacionalDashboard
        rbt12={rbt12}
        cnaeAnexo={cnaeAnexo}
        calculo={calculo}
        kpis={kpis}
        dadosMensais={dadosMensais}
        notas={notas}
        tomadores={tomadoresMap}
      />

      {/* ROW: Split Payment + Receita por Cliente */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        {/* Split Payment */}
        <DashboardCard title="Split Payment — Reserva Tributária" headerColor="green">
          <div className="space-y-3">
            <div className="grid grid-cols-3 gap-2">
              <div className="text-center p-2.5 rounded-lg bg-muted/50">
                <p className="text-[9px] text-muted-foreground uppercase">Recebido</p>
                <p className="text-sm font-bold text-foreground">{formatCurrency(kpis.faturamentoMes)}</p>
              </div>
              <div className="text-center p-2.5 rounded-lg bg-destructive/5">
                <p className="text-[9px] text-muted-foreground uppercase">Reservado</p>
                <p className="text-sm font-bold text-destructive">{formatCurrency(kpis.dasEstimado)}</p>
              </div>
              <div className="text-center p-2.5 rounded-lg bg-accent/5">
                <p className="text-[9px] text-muted-foreground uppercase">Liberado</p>
                <p className="text-sm font-bold text-accent">{formatCurrency(fluxoCaixa.saldo)}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-accent" />
              <div className="flex-1">
                <div className="h-3 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-accent rounded-full transition-all"
                    style={{ width: `${kpis.faturamentoMes > 0 ? Math.min((kpis.dasEstimado / kpis.faturamentoMes) * 100, 100) : 0}%` }}
                  />
                </div>
              </div>
              <span className="text-[10px] font-bold text-accent">
                {kpis.faturamentoMes > 0 ? ((kpis.dasEstimado / kpis.faturamentoMes) * 100).toFixed(1) : 0}% protegido
              </span>
            </div>
            {splits.length > 0 && (
              <div className="overflow-x-auto max-h-32">
                <table className="w-full text-[10px]">
                  <thead>
                    <tr className="border-b text-muted-foreground">
                      <th className="text-left py-1 px-1">NF</th>
                      <th className="text-right py-1 px-1">Bruto</th>
                      <th className="text-right py-1 px-1">Reservado</th>
                      <th className="text-center py-1 px-1">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {splits.slice(0, 5).map(s => (
                      <tr key={s.id} className="border-b border-border/50">
                        <td className="py-1 px-1 font-mono">{s.nota_fiscal_id?.substring(0, 8)}</td>
                        <td className="text-right py-1 px-1">{formatCurrency(s.valor_bruto)}</td>
                        <td className="text-right py-1 px-1 text-destructive">{formatCurrency(s.valor_reservado)}</td>
                        <td className="text-center py-1 px-1">
                          <Badge variant={s.status === 'pago' ? 'default' : 'outline'} className="text-[8px]">{s.status}</Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </DashboardCard>
      </div>
    </div>
  );
};

export default Dashboard;
