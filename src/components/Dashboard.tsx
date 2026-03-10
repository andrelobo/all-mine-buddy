import React, { useState, useMemo } from 'react';
import { AlertTriangle, TrendingUp, TrendingDown, Shield, DollarSign, Users, PieChart as PieIcon, BarChart3 } from 'lucide-react';
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
        simuladorContent={
          <div className="space-y-3">
            <p className="text-[10px] text-muted-foreground">Simule o impacto de receita adicional na sua faixa do Simples Nacional.</p>
            <div className="flex items-end gap-3">
              <div className="flex-1">
                <label className="text-[10px] text-muted-foreground">Faturamento adicional</label>
                <div className="relative mt-1">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">R$</span>
                  <Input
                    type="text"
                    inputMode="numeric"
                    placeholder="0,00"
                    value={simulacaoExtra}
                    onChange={e => setSimulacaoExtra(formatCurrencyInput(e.target.value))}
                    className="h-8 text-sm pl-9"
                  />
                </div>
              </div>
              {calculoSimulado && (
                <div className="flex-1 space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">RBT12 simulado:</span>
                    <span className="font-bold">{formatCurrency(rbt12Simulado)}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Faixa:</span>
                    <span className={`font-bold ${mudouFaixa ? 'text-destructive' : ''}`}>
                      {calculoSimulado.faixa?.faixa}ª {mudouFaixa && '⚠️'}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Alíquota:</span>
                    <span className={`font-bold ${mudouFaixa ? 'text-destructive' : 'text-accent'}`}>
                      {formatPercent(calculoSimulado.aliquotaEfetiva)}
                    </span>
                  </div>
                </div>
              )}
            </div>
            {mudouFaixa && (
              <div className="p-2.5 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-xs flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>
                  <strong>Alerta:</strong> Mudança da {calculo.faixa!.faixa}ª para a {calculoSimulado!.faixa!.faixa}ª faixa.
                  Alíquota efetiva: {formatPercent(calculo.aliquotaEfetiva)} → {formatPercent(calculoSimulado!.aliquotaEfetiva)}.
                </span>
              </div>
            )}
          </div>
        }
      />

      {/* ROW: Split Payment + Receita por Cliente */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        {/* Split Payment */}
        <DashboardCard title="Split Payment — Reserva Tributária" headerColor="green" icon={<Shield className="w-4 h-4" />}>
          <div className="space-y-3">
            <div className="grid grid-cols-3 gap-2">
              <div className="text-center p-3 rounded-lg bg-accent/5 border border-accent/10">
                <p className="text-[9px] text-muted-foreground uppercase font-semibold">Recebido</p>
                <p className="text-sm font-extrabold text-foreground tabular-nums">{formatCurrency(kpis.faturamentoMes)}</p>
              </div>
              <div className="text-center p-3 rounded-lg bg-destructive/5 border border-destructive/10">
                <p className="text-[9px] text-muted-foreground uppercase font-semibold">Reservado</p>
                <p className="text-sm font-extrabold text-destructive tabular-nums">{formatCurrency(kpis.dasEstimado)}</p>
              </div>
              <div className="text-center p-3 rounded-lg bg-primary/5 border border-primary/10">
                <p className="text-[9px] text-muted-foreground uppercase font-semibold">Liberado</p>
                <p className="text-sm font-extrabold text-primary tabular-nums">{formatCurrency(fluxoCaixa.saldo)}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-accent" />
              <div className="flex-1">
                <div className="h-3.5 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-accent to-[hsl(160,50%,55%)] rounded-full transition-all"
                    style={{ width: `${kpis.faturamentoMes > 0 ? Math.min((kpis.dasEstimado / kpis.faturamentoMes) * 100, 100) : 0}%` }}
                  />
                </div>
              </div>
              <span className="text-[10px] font-bold text-accent tabular-nums">
                {kpis.faturamentoMes > 0 ? ((kpis.dasEstimado / kpis.faturamentoMes) * 100).toFixed(1) : 0}% protegido
              </span>
            </div>
            {splits.length > 0 && (
              <div className="overflow-x-auto max-h-32">
                <table className="w-full text-[10px]">
                  <thead>
                    <tr className="border-b text-muted-foreground">
                      <th className="text-left py-1.5 px-1 font-semibold">NF</th>
                      <th className="text-right py-1.5 px-1 font-semibold">Bruto</th>
                      <th className="text-right py-1.5 px-1 font-semibold">Reservado</th>
                      <th className="text-center py-1.5 px-1 font-semibold">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {splits.slice(0, 5).map(s => (
                      <tr key={s.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                        <td className="py-1.5 px-1 font-mono">{s.nota_fiscal_id?.substring(0, 8)}</td>
                        <td className="text-right py-1.5 px-1 tabular-nums">{formatCurrency(s.valor_bruto)}</td>
                        <td className="text-right py-1.5 px-1 text-destructive tabular-nums">{formatCurrency(s.valor_reservado)}</td>
                        <td className="text-center py-1.5 px-1">
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

        {/* Receita por Cliente — Pie */}
        <DashboardCard title="Composição de Receita por Cliente" headerColor="blue" icon={<PieIcon className="w-4 h-4" />}>
          {pieClientes.length > 0 ? (
            <div className="flex items-start gap-3">
              <div className="flex-1 aspect-square max-h-44">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPie>
                    <Pie
                      data={pieClientes}
                      cx="50%" cy="50%" outerRadius="78%" innerRadius="34%"
                      dataKey="value" nameKey="name"
                      labelLine={false}
                      label={({ percent }) => percent > 0.05 ? `${(percent * 100).toFixed(0)}%` : ''}
                    >
                      {pieClientes.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                    </Pie>
                    <Tooltip formatter={(v: number) => formatCurrency(v)} />
                  </RechartsPie>
                </ResponsiveContainer>
              </div>
              <div className="w-40 space-y-1.5 pt-2">
                {analiseClientes.slice(0, 6).map((c, i) => (
                  <div key={c.tomadorId} className="flex items-center justify-between text-[10px]">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-sm" style={{ backgroundColor: PIE_COLORS[i % PIE_COLORS.length] }} />
                      <span className="text-muted-foreground truncate max-w-[80px]">{c.nome}</span>
                    </div>
                    <span className="font-bold">{c.percentual.toFixed(0)}%</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-40 text-muted-foreground text-xs">Sem clientes</div>
          )}
        </DashboardCard>
      </div>

      {/* ROW: Análise de Clientes */}
      <div className="grid grid-cols-1 lg:grid-cols-1 gap-3">
        {/* Análise por Cliente — Tabela */}
        <DashboardCard title="Análise por Cliente — Curva ABC" headerColor="default">
          {analiseClientes.length > 0 ? (
            <div className="overflow-x-auto max-h-48">
              <table className="w-full text-[10px]">
                <thead>
                  <tr className="border-b text-muted-foreground">
                    <th className="text-left py-1.5 px-1">Cliente</th>
                    <th className="text-right py-1.5 px-1">Receita</th>
                    <th className="text-right py-1.5 px-1">NFs</th>
                    <th className="text-right py-1.5 px-1">%</th>
                    <th className="text-center py-1.5 px-1">Curva</th>
                  </tr>
                </thead>
                <tbody>
                  {analiseClientes.map(c => (
                    <tr key={c.tomadorId} className="border-b border-border/50">
                      <td className="py-1.5 px-1 font-medium truncate max-w-[140px]">{c.nome}</td>
                      <td className="text-right py-1.5 px-1">{formatCurrency(c.faturamento)}</td>
                      <td className="text-right py-1.5 px-1">{c.quantidadeNf}</td>
                      <td className="text-right py-1.5 px-1">{c.percentual.toFixed(1)}%</td>
                      <td className="text-center py-1.5 px-1">
                        <Badge
                          variant={c.classificacao === 'A' ? 'default' : 'outline'}
                          className={`text-[8px] ${c.classificacao === 'A' ? 'bg-accent' : c.classificacao === 'B' ? 'border-[hsl(38,80%,55%)] text-[hsl(38,80%,45%)]' : ''}`}
                        >
                          {c.classificacao}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-center text-sm text-muted-foreground py-4">Nenhuma nota emitida.</p>
          )}
        </DashboardCard>
      </div>
    </div>
  );
};

export default Dashboard;
