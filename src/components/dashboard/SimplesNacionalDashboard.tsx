import React, { useMemo } from 'react';
import { Badge } from '@/components/ui/badge';
import {
  PieChart as RechartsPie, Pie, Cell,
  XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, Legend,
  Bar, BarChart, Line, ComposedChart,
} from 'recharts';
import { FAIXAS_ANEXO_III, formatCurrency, formatPercent, calcularSimplesAnexoIII } from '@/utils/simples-nacional';
import type { CalculoSimplesResult } from '@/utils/simples-nacional';
import type { MesData } from '@/hooks/useDashboardData';
import DashboardCard from './DashboardCard';
import FaixaThermometer from './FaixaThermometer';

interface Props {
  rbt12: number;
  cnaeAnexo: string;
  calculo: CalculoSimplesResult;
  kpis: {
    faturamentoMes: number;
    dasEstimado: number;
    dasAPagar: number;
    issRetidoMes: number;
    totalRetencoes: number;
    aliquotaEfetiva: number;
    competenciaLabel: string;
  };
  dadosMensais: MesData[];
}

const CHART_GREEN = 'hsl(160, 60%, 45%)';

const PIE_COLORS = [
  'hsl(160, 60%, 45%)', 'hsl(160, 40%, 60%)', 'hsl(160, 30%, 72%)',
  'hsl(38, 80%, 55%)', 'hsl(220, 60%, 55%)', 'hsl(280, 50%, 55%)',
];

const SimplesNacionalDashboard: React.FC<Props> = ({ rbt12, cnaeAnexo, calculo, kpis, dadosMensais }) => {
  const composicaoTributaria = useMemo(() => {
    if (!calculo.faixa || !calculo.valido) return [];
    const aliqEfetiva = calculo.aliquotaEfetiva;
    const percISS = calculo.faixa.percentualIss;
    const percIRPJ = 0.04;
    const percCSLL = 0.035;
    const percCOFINS = 0.1282;
    const percPIS = 0.0278;
    const percCPP = 1 - percISS - percIRPJ - percCSLL - percCOFINS - percPIS;
    return [
      { tributo: 'ISS', percentual: percISS, aliquota: aliqEfetiva * percISS, valor: kpis.faturamentoMes * aliqEfetiva * percISS, cor: PIE_COLORS[0] },
      { tributo: 'CPP', percentual: percCPP, aliquota: aliqEfetiva * percCPP, valor: kpis.faturamentoMes * aliqEfetiva * percCPP, cor: PIE_COLORS[1] },
      { tributo: 'IRPJ', percentual: percIRPJ, aliquota: aliqEfetiva * percIRPJ, valor: kpis.faturamentoMes * aliqEfetiva * percIRPJ, cor: PIE_COLORS[2] },
      { tributo: 'CSLL', percentual: percCSLL, aliquota: aliqEfetiva * percCSLL, valor: kpis.faturamentoMes * aliqEfetiva * percCSLL, cor: PIE_COLORS[3] },
      { tributo: 'COFINS', percentual: percCOFINS, aliquota: aliqEfetiva * percCOFINS, valor: kpis.faturamentoMes * aliqEfetiva * percCOFINS, cor: PIE_COLORS[4] },
      { tributo: 'PIS', percentual: percPIS, aliquota: aliqEfetiva * percPIS, valor: kpis.faturamentoMes * aliqEfetiva * percPIS, cor: PIE_COLORS[5] },
    ];
  }, [calculo, kpis.faturamentoMes]);

  const evolucaoMensal = useMemo(() => {
    return dadosMensais.map(m => ({
      label: m.label,
      receita: m.faturamento,
      das: m.tributoEstimado,
      cargaTributaria: m.faturamento > 0 ? +((m.tributoEstimado / m.faturamento) * 100).toFixed(2) : 0,
    }));
  }, [dadosMensais]);

  const pieComposicao = composicaoTributaria.map(c => ({
    name: c.tributo,
    value: c.valor,
    percentual: c.percentual,
  }));

  const renderPieLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    if (percent < 0.05) return null;
    return (
      <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={9} fontWeight="bold">
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <div className="space-y-4">
      {/* ROW 1: Termômetro de Faixa */}
      <DashboardCard title="Termômetro de Faixa — Simples Nacional" headerColor="blue">
        <FaixaThermometer rbt12={rbt12} calculo={calculo} />
      </DashboardCard>

      {/* ROW 2: Resumo Tributário + Composição DAS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Resumo Tributário */}
        <DashboardCard title={`Resumo Tributário — ${kpis.competenciaLabel}`} headerColor="green">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-3">
              <ResumoItem label="Faturamento Bruto" value={formatCurrency(kpis.faturamentoMes)} accent="text-foreground" />
              <ResumoItem label="Alíquota Efetiva" value={formatPercent(kpis.aliquotaEfetiva)} accent="text-primary" />
              <ResumoItem label="Alíquota ISS" value={calculo.valido ? formatPercent(calculo.issReferencia) : '–'} accent="text-foreground" />
            </div>
            <div className="space-y-3">
              <ResumoItem label="DAS Estimado" value={formatCurrency(kpis.dasEstimado)} accent="text-destructive" />
              <ResumoItem label="ISS Retido (dedução)" value={`- ${formatCurrency(kpis.issRetidoMes)}`} accent="text-accent" />
              <ResumoItem label="Retenções Federais" value={formatCurrency(kpis.totalRetencoes)} accent="text-muted-foreground" />
            </div>
            <div className="col-span-2 bg-destructive/10 rounded-lg px-3 py-2.5 flex items-center justify-between">
              <span className="text-xs font-semibold text-muted-foreground">DAS a Recolher</span>
              <span className="text-lg font-extrabold text-destructive">{formatCurrency(kpis.dasAPagar)}</span>
            </div>
          </div>
        </DashboardCard>

        {/* Composição do DAS — Gráfico de Pizza */}
        <DashboardCard title="Composição do DAS" headerColor="blue">
          {pieComposicao.length > 0 && kpis.faturamentoMes > 0 ? (
            <div className="flex items-start gap-4">
              <div className="flex-1 h-52">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPie>
                    <Pie
                      data={pieComposicao}
                      cx="50%" cy="50%" outerRadius={90} innerRadius={35}
                      dataKey="value" nameKey="name"
                      labelLine={false} label={renderPieLabel}
                    >
                      {pieComposicao.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                    </Pie>
                    <Tooltip formatter={(v: number) => formatCurrency(v)} />
                  </RechartsPie>
                </ResponsiveContainer>
              </div>
              <div className="w-36 space-y-1.5 pt-2">
                {composicaoTributaria.map(c => (
                  <div key={c.tributo} className="flex items-center justify-between text-[10px]">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: c.cor }} />
                      <span className="text-muted-foreground">{c.tributo}</span>
                    </div>
                    <span className="font-bold text-foreground">{formatCurrency(c.valor)}</span>
                  </div>
                ))}
                <div className="border-t border-border pt-1 flex items-center justify-between text-[10px] font-bold">
                  <span>Total</span>
                  <span className="text-destructive">{formatCurrency(kpis.dasEstimado)}</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-52 text-muted-foreground text-sm">Sem dados para exibir</div>
          )}
        </DashboardCard>
      </div>

      {/* ROW 3: Evolução Mensal */}
      <DashboardCard title="Evolução Mensal — Receita × Carga Tributária" headerColor="default">
        <div className="h-56">
          {evolucaoMensal.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={evolucaoMensal}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="label" tick={{ fontSize: 10 }} />
                <YAxis yAxisId="left" tick={{ fontSize: 10 }} tickFormatter={v => `${(v / 1000).toFixed(0)}k`} />
                <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 10 }} tickFormatter={v => `${v}%`} />
                <Tooltip formatter={(v: number, name: string) => name === 'Carga %' ? `${v}%` : formatCurrency(v)} />
                <Legend wrapperStyle={{ fontSize: 10 }} />
                <Bar yAxisId="left" dataKey="receita" fill={CHART_GREEN} name="Receita" radius={[3, 3, 0, 0]} opacity={0.4} />
                <Bar yAxisId="left" dataKey="das" fill={CHART_GREEN} name="DAS" radius={[3, 3, 0, 0]} />
                <Line yAxisId="right" type="monotone" dataKey="cargaTributaria" stroke="hsl(38, 80%, 55%)" name="Carga %" strokeWidth={2} dot={{ r: 3 }} />
              </ComposedChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground text-sm">Sem dados mensais</div>
          )}
        </div>
      </DashboardCard>
    </div>
  );
};

/* Sub-component for Resumo items */
const ResumoItem: React.FC<{ label: string; value: string; accent?: string }> = ({ label, value, accent = 'text-foreground' }) => (
  <div>
    <p className="text-[10px] text-muted-foreground uppercase tracking-wide">{label}</p>
    <p className={`text-sm font-bold ${accent}`}>{value}</p>
  </div>
);

export default SimplesNacionalDashboard;
