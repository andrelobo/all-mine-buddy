import React, { useState } from 'react';
import {
  DollarSign, FileText, TrendingUp, TrendingDown, Percent, ShieldCheck, AlertTriangle,
  BarChart3, Wallet, Users, Gauge,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  LineChart, Line, BarChart, Bar, PieChart as RechartsPie, Pie, Cell,
  XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, Legend,
} from 'recharts';
import { formatCurrency, formatPercent, FAIXAS_ANEXO_III, calcularSimplesAnexoIII } from '@/utils/simples-nacional';
import { useDashboardData } from '@/hooks/useDashboardData';
import type { CalculoSimplesResult } from '@/utils/simples-nacional';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import SimplesNacionalDashboard from '@/components/dashboard/SimplesNacionalDashboard';
import DashboardCard from '@/components/dashboard/DashboardCard';
import BigNumber from '@/components/dashboard/BigNumber';

interface DashboardProps {
  prestadorId: string | null;
  nomeEmpresa: string;
  rbt12: number;
  cnaeAnexo: string;
  regime: string | null;
}

const PIE_COLORS = [
  'hsl(220, 70%, 50%)', 'hsl(160, 60%, 45%)', 'hsl(38, 92%, 50%)',
  'hsl(0, 72%, 55%)', 'hsl(280, 60%, 55%)', 'hsl(190, 70%, 45%)',
];

const Dashboard: React.FC<DashboardProps> = ({ prestadorId, nomeEmpresa, rbt12, cnaeAnexo, regime }) => {
  const { loading, kpis, calculo, dadosMensais, analiseClientes, alertas, fluxoCaixa, splits } = useDashboardData(prestadorId, rbt12, cnaeAnexo);
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
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-28 rounded-lg" />)}
        </div>
      </div>
    );
  }

  const pieData = analiseClientes.slice(0, 6).map(c => ({ name: c.nome.substring(0, 20), value: c.faturamento }));

  return (
    <div className="space-y-4">

      {/* ALERTAS */}
      {alertas.length > 0 && (
        <div className="space-y-2">
          {alertas.map((a, i) => (
            <div
              key={i}
              className={`flex items-center gap-2 p-3 rounded-lg border text-sm ${
                a.tipo === 'danger' ? 'bg-destructive/10 border-destructive/20 text-destructive'
                : a.tipo === 'warning' ? 'bg-warning/10 border-warning/20 text-warning'
                : 'bg-primary/10 border-primary/20 text-primary'
              }`}
            >
              <AlertTriangle className="w-4 h-4 shrink-0" />
              {a.mensagem}
            </div>
          ))}
        </div>
      )}

      {/* SIMPLES NACIONAL */}
      <SimplesNacionalDashboard
        rbt12={rbt12}
        cnaeAnexo={cnaeAnexo}
        calculo={calculo}
        kpis={kpis}
        dadosMensais={dadosMensais}
      />

      {/* ROW: Fiscal IA + Split Payment + Fluxo de Caixa */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Fiscal IA */}
        <DashboardCard title="Fiscal IA" headerColor="blue" subtitle={kpis.competenciaLabel}>
          <div className="space-y-3">
            <BigNumber value={formatCurrency(kpis.faturamentoMes)} label="Receita" accent="text-primary" size="md" />
            <div className="grid grid-cols-2 gap-2">
              <BigNumber value={formatCurrency(kpis.dasAPagar)} label="DAS a Pagar" accent="text-destructive" size="sm" badge="A PAGAR" badgeVariant="destructive" />
              <BigNumber value={formatPercent(kpis.aliquotaEfetiva)} label="Alíq. Efetiva" accent="text-primary" size="sm" />
            </div>
          </div>
        </DashboardCard>

        {/* Split Payment */}
        <DashboardCard title="Split Payment" headerColor="green">
          <div className="space-y-3">
            <BigNumber value={formatCurrency(kpis.totalReservado)} label="Total Reservado" accent="text-accent" size="md" />
            <div className="grid grid-cols-2 gap-2">
              <BigNumber
                value={`${kpis.faturamentoMes > 0 ? ((kpis.totalReservado / kpis.faturamentoMes) * 100).toFixed(1) : '0'}%`}
                label="% Protegido"
                accent="text-foreground"
                size="sm"
              />
              <BigNumber
                value={formatCurrency(kpis.totalReservado - kpis.dasAPagar)}
                label="Saldo Tributário"
                accent={kpis.totalReservado - kpis.dasAPagar >= 0 ? 'text-accent' : 'text-destructive'}
                size="sm"
              />
            </div>
          </div>
        </DashboardCard>

        {/* Fluxo de Caixa */}
        <DashboardCard title="Fluxo de Caixa" headerColor="orange">
          <div className="space-y-3">
            <BigNumber value={formatCurrency(fluxoCaixa.saldo)} label="Saldo Disponível" accent={fluxoCaixa.saldo >= 0 ? 'text-accent' : 'text-destructive'} size="md" />
            <div className="grid grid-cols-2 gap-2">
              <BigNumber value={formatCurrency(fluxoCaixa.operacional)} label="Caixa Operacional" accent="text-accent" size="sm" />
              <BigNumber value={formatCurrency(-fluxoCaixa.tributario)} label="Caixa Tributário" accent="text-destructive" size="sm" />
            </div>
          </div>
        </DashboardCard>
      </div>

      {/* Split Payment Table */}
      {splits.length > 0 && (
        <DashboardCard title="Split Payment – Detalhamento" headerColor="green">
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b text-muted-foreground">
                  <th className="text-left py-1.5 px-2">NF</th>
                  <th className="text-right py-1.5 px-2">Bruto</th>
                  <th className="text-right py-1.5 px-2">Reservado</th>
                  <th className="text-right py-1.5 px-2">Liberado</th>
                  <th className="text-center py-1.5 px-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {splits.slice(0, 10).map(s => (
                  <tr key={s.id} className="border-b border-border/50">
                    <td className="py-1.5 px-2 font-mono">{s.nota_fiscal_id?.substring(0, 8)}...</td>
                    <td className="text-right py-1.5 px-2">{formatCurrency(s.valor_bruto)}</td>
                    <td className="text-right py-1.5 px-2 text-destructive">{formatCurrency(s.valor_reservado)}</td>
                    <td className="text-right py-1.5 px-2 text-accent">{formatCurrency(s.valor_liberado)}</td>
                    <td className="text-center py-1.5 px-2">
                      <Badge variant={s.status === 'pago' ? 'default' : 'outline'} className="text-[9px]">{s.status}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </DashboardCard>
      )}

      {/* MONITORAMENTO DE FAIXA */}
      {calculo.faixa && (() => {
        const faixaAtual = calculo.faixa;
        const limiteSuperior = faixaAtual.limiteSuperior;
        const faltaProxima = limiteSuperior - rbt12;
        const progressoPct = ((rbt12 - faixaAtual.limiteInferior) / (limiteSuperior - faixaAtual.limiteInferior)) * 100;
        const proximaFaixa = FAIXAS_ANEXO_III.find(f => f.faixa === faixaAtual.faixa + 1);

        const extraVal = parseCurrencyInput(simulacaoExtra);
        const rbt12Simulado = rbt12 + extraVal;
        const calculoSimulado = extraVal > 0 ? calcularSimplesAnexoIII(rbt12Simulado, cnaeAnexo || 'III') : null;
        const mudouFaixa = calculoSimulado?.faixa && calculoSimulado.faixa.faixa !== faixaAtual.faixa;

        return (
          <DashboardCard
            title="Monitoramento de Faixa"
            headerColor="red"
            rightHeader={faltaProxima < 50000 && proximaFaixa ? (
              <Badge variant="outline" className="border-primary-foreground/50 text-primary-foreground text-[9px]">
                ⚠️ Próximo da mudança
              </Badge>
            ) : undefined}
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">Faixa atual: <span className="font-bold text-foreground">{faixaAtual.faixa}ª</span> (até {formatCurrency(limiteSuperior)})</p>
                  {proximaFaixa && (
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Faltam <span className="font-bold text-primary">{formatCurrency(faltaProxima)}</span> para a {proximaFaixa.faixa}ª faixa
                    </p>
                  )}
                  {!proximaFaixa && <p className="text-xs text-muted-foreground mt-0.5">Faixa máxima do Simples Nacional.</p>}
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[10px] text-muted-foreground mb-1">
                  <span>{formatCurrency(faixaAtual.limiteInferior)}</span>
                  <span>{formatCurrency(rbt12)} ({progressoPct.toFixed(0)}%)</span>
                  <span>{formatCurrency(limiteSuperior)}</span>
                </div>
                <Progress value={Math.min(progressoPct, 100)} className="h-2.5" />
              </div>

              <div className="border-t border-border pt-3">
                <p className="text-[11px] font-semibold text-foreground mb-2 uppercase tracking-wide">Simulação de Cenário</p>
                <div className="flex items-center gap-3">
                  <div className="flex-1">
                    <label className="text-[10px] text-muted-foreground">Faturamento adicional (R$)</label>
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
                        <span className={`font-bold ${mudouFaixa ? 'text-destructive' : 'text-foreground'}`}>
                          {calculoSimulado.faixa?.faixa}ª {mudouFaixa && '⚠️'}
                        </span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">Alíq. efetiva:</span>
                        <span className={`font-bold ${mudouFaixa ? 'text-destructive' : 'text-primary'}`}>
                          {formatPercent(calculoSimulado.aliquotaEfetiva)}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
                {mudouFaixa && (
                  <div className="mt-2 p-2 rounded bg-destructive/10 border border-destructive/20 text-destructive text-xs">
                    <AlertTriangle className="w-3 h-3 inline mr-1" />
                    Atenção: mudança da {faixaAtual.faixa}ª para a {calculoSimulado!.faixa!.faixa}ª faixa. Alíquota de {formatPercent(calculo.aliquotaEfetiva)} → {formatPercent(calculoSimulado!.aliquotaEfetiva)}.
                  </div>
                )}
              </div>
            </div>
          </DashboardCard>
        );
      })()}

      {/* GRÁFICOS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <DashboardCard title="Faturamento & Tributo Mensal" headerColor="blue">
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dadosMensais}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="label" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} tickFormatter={v => `${(v / 1000).toFixed(0)}k`} />
                <Tooltip formatter={(v: number) => formatCurrency(v)} />
                <Legend wrapperStyle={{ fontSize: 10 }} />
                <Line type="monotone" dataKey="faturamento" stroke="hsl(220, 70%, 50%)" name="Faturamento" strokeWidth={2} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="tributoEstimado" stroke="hsl(0, 72%, 55%)" name="Tributo Est." strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </DashboardCard>

        <DashboardCard title="ISS Retido por Mês" headerColor="green">
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dadosMensais}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="label" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} tickFormatter={v => `${(v / 1000).toFixed(0)}k`} />
                <Tooltip formatter={(v: number) => formatCurrency(v)} />
                <Bar dataKey="issRetido" fill="hsl(160, 60%, 45%)" name="ISS Retido" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </DashboardCard>

        <DashboardCard title="Faturamento por Cliente" headerColor="orange">
          <div className="h-52">
            {pieData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPie>
                  <Pie data={pieData} cx="50%" cy="50%" outerRadius={80} innerRadius={35} dataKey="value" nameKey="name" labelLine={false} label={false}>
                    {pieData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                  </Pie>
                  <Tooltip formatter={(v: number) => formatCurrency(v)} />
                  <Legend wrapperStyle={{ fontSize: 9 }} />
                </RechartsPie>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground text-sm">Sem dados</div>
            )}
          </div>
        </DashboardCard>
      </div>

      {/* ANÁLISE POR CLIENTE */}
      <DashboardCard title="Análise por Cliente – Curva ABC" headerColor="purple">
        {analiseClientes.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b text-muted-foreground">
                  <th className="text-left py-2 px-2">Cliente</th>
                  <th className="text-right py-2 px-2">Faturamento</th>
                  <th className="text-right py-2 px-2">NFs</th>
                  <th className="text-right py-2 px-2">Ticket Médio</th>
                  <th className="text-right py-2 px-2">%</th>
                  <th className="text-center py-2 px-2">Curva</th>
                </tr>
              </thead>
              <tbody>
                {analiseClientes.map(c => (
                  <tr key={c.tomadorId} className="border-b border-border/50">
                    <td className="py-2 px-2 font-medium truncate max-w-[200px]">{c.nome}</td>
                    <td className="text-right py-2 px-2">{formatCurrency(c.faturamento)}</td>
                    <td className="text-right py-2 px-2">{c.quantidadeNf}</td>
                    <td className="text-right py-2 px-2">{formatCurrency(c.ticketMedio)}</td>
                    <td className="text-right py-2 px-2">{c.percentual.toFixed(1)}%</td>
                    <td className="text-center py-2 px-2">
                      <Badge variant={c.classificacao === 'A' ? 'default' : 'outline'} className={`text-[9px] ${
                        c.classificacao === 'A' ? 'bg-accent' : c.classificacao === 'B' ? 'bg-primary' : ''
                      }`}>
                        {c.classificacao}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-center text-sm text-muted-foreground py-4">Nenhuma nota fiscal emitida ainda.</p>
        )}
      </DashboardCard>
    </div>
  );
};

export default Dashboard;
