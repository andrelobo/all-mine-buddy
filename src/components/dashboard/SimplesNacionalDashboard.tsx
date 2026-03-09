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
import SimuladorCenario from './SimuladorCenario';

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
    <div className="space-y-3">
      {/* 1: Resumo Tributário + 2: Composição DAS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        <DashboardCard title={`QFiscal ${kpis.competenciaLabel}`} headerColor="green">
          <div className="space-y-2">
            <div className="grid grid-cols-2 gap-x-3 gap-y-1.5">
              <ResumoItem label="Faturamento Bruto" value={formatCurrency(kpis.faturamentoMes)} accent="text-foreground" />
              <ResumoItem label="DAS Estimado" value={formatCurrency(kpis.dasEstimado)} accent="text-destructive" />
              <ResumoItem label="Alíquota Efetiva" value={formatPercent(kpis.aliquotaEfetiva)} accent="text-primary" />
              <ResumoItem label="ISS Retido (dedução)" value={`- ${formatCurrency(kpis.issRetidoMes)}`} accent="text-accent" />
              <ResumoItem label="Alíquota ISS" value={calculo.valido ? formatPercent(calculo.issReferencia) : '–'} accent="text-foreground" />
              <ResumoItem label="Retenções Federais" value={formatCurrency(kpis.totalRetencoes)} accent="text-muted-foreground" />
            </div>
            <div className="bg-destructive/10 rounded-md px-2.5 py-1.5 flex items-center justify-between">
              <span className="text-[9px] font-semibold text-muted-foreground">DAS a Recolher</span>
              <span className="text-base font-extrabold text-destructive tabular-nums">{formatCurrency(kpis.dasAPagar)}</span>
            </div>
          </div>
        </DashboardCard>

        <DashboardCard title="Composição do DAS" headerColor="blue">
          {pieComposicao.length > 0 && kpis.faturamentoMes > 0 ? (
            <div className="flex items-center gap-3">
              <div className="flex-1 aspect-square max-h-44">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPie>
                    <Pie
                      data={pieComposicao}
                      cx="50%" cy="50%" outerRadius="78%" innerRadius="34%"
                      dataKey="value" nameKey="name"
                      labelLine={false} label={renderPieLabel}
                    >
                      {pieComposicao.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                    </Pie>
                    <Tooltip formatter={(v: number) => formatCurrency(v)} />
                  </RechartsPie>
                </ResponsiveContainer>
              </div>
              <div className="w-32 space-y-1">
                {composicaoTributaria.map(c => (
                  <div key={c.tributo} className="flex items-center justify-between text-[9px]">
                    <div className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-sm shrink-0" style={{ backgroundColor: c.cor }} />
                      <span className="text-muted-foreground">{c.tributo}</span>
                    </div>
                    <span className="font-bold text-foreground tabular-nums">{formatCurrency(c.valor)}</span>
                  </div>
                ))}
                <div className="border-t border-border pt-1 flex items-center justify-between text-[9px] font-bold">
                  <span>Total</span>
                  <span className="text-destructive tabular-nums">{formatCurrency(kpis.dasEstimado)}</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-40 text-muted-foreground text-xs">Sem dados para exibir</div>
          )}
        </DashboardCard>
      </div>

      {/* 3: Termômetro de Faixa + 4: Simulador de Cenário */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        <DashboardCard title="Termômetro de Faixa — Simples Nacional" headerColor="blue">
          <FaixaThermometer rbt12={rbt12} calculo={calculo} />
        </DashboardCard>

        <DashboardCard title="Simulador de Cenário" headerColor="default">
          <SimuladorCenario rbt12={rbt12} cnaeAnexo={cnaeAnexo} faturamentoAtual={kpis.faturamentoMes} />
        </DashboardCard>
      </div>
    </div>
  );
};

/* Sub-component for Resumo items */
const ResumoItem: React.FC<{ label: string; value: string; accent?: string }> = ({ label, value, accent = 'text-foreground' }) => (
  <div>
    <p className="text-[9px] text-muted-foreground uppercase tracking-wide leading-tight">{label}</p>
    <p className={`text-xs font-bold ${accent} tabular-nums`}>{value}</p>
  </div>
);

export default SimplesNacionalDashboard;
