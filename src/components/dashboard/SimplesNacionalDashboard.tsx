import React, { useMemo } from 'react';
import { Badge } from '@/components/ui/badge';
import type { NotaDashboard } from '@/hooks/useDashboardData';
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
import EmissoesResumoMini from './EmissoesResumoMini';

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
    mesCompetencia: string;
  };
  dadosMensais: MesData[];
  notas: NotaDashboard[];
  tomadores: Record<string, { nome: string; subTrib: boolean }>;
}

const CHART_GREEN = 'hsl(160, 60%, 45%)';

const PIE_COLORS = [
  'hsl(160, 60%, 45%)', 'hsl(160, 40%, 60%)', 'hsl(160, 30%, 72%)',
  'hsl(38, 80%, 55%)', 'hsl(220, 60%, 55%)', 'hsl(280, 50%, 55%)',
];

const SimplesNacionalDashboard: React.FC<Props> = ({ rbt12, cnaeAnexo, calculo, kpis, dadosMensais, notas, tomadores }) => {
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
    aliquota: c.aliquota,
  }));

  const renderPieLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, payload }: any) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.55;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    const aliq = payload?.aliquota ?? 0;
    if (aliq < 0.001) return null;
    return (
      <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={7} fontWeight="bold">
        {`${(aliq * 100).toFixed(2)}%`}
      </text>
    );
  };

  return (
    <div className="space-y-2">
      {/* Row 1: NFSE + Financeiro */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
        <DashboardCard title={`NFSE ${kpis.competenciaLabel.toUpperCase()}`} headerColor="green">
          <EmissoesResumoMini
            notas={notas}
            tomadores={tomadores}
            aliquotaEfetiva={kpis.aliquotaEfetiva}
            mesCompetencia={kpis.mesCompetencia}
          />
        </DashboardCard>

        <DashboardCard title={`Financeiro ${kpis.competenciaLabel}`} headerColor="green">
          <div className="h-full flex flex-col justify-between gap-1">
            <div className="space-y-1 flex-1">
              <div className="flex items-center gap-2 text-[9px]">
                <span className="w-28 font-semibold text-muted-foreground shrink-0">Faturamento Bruto</span>
                <div className="flex-1" />
                <span className="w-20 text-right tabular-nums font-bold text-foreground">{formatCurrency(kpis.faturamentoMes)}</span>
              </div>
              <div className="flex items-center gap-2 text-[9px]">
                <span className="w-28 font-semibold text-muted-foreground shrink-0">DAS Estimado</span>
                <div className="flex-1" />
                <span className="w-20 text-right tabular-nums font-bold text-destructive">{formatCurrency(kpis.dasEstimado)}</span>
              </div>
              <div className="flex items-center gap-2 text-[9px]">
                <span className="w-28 font-semibold text-muted-foreground shrink-0">Alíquota Efetiva</span>
                <div className="flex-1" />
                <span className="w-20 text-right tabular-nums font-bold text-primary">{formatPercent(kpis.aliquotaEfetiva)}</span>
              </div>
              <div className="flex items-center gap-2 text-[9px]">
                <span className="w-28 font-semibold text-muted-foreground shrink-0">Retido ISS (T)</span>
                <div className="flex-1" />
                <span className="w-20 text-right tabular-nums font-bold text-accent">({formatCurrency(kpis.issRetidoMes)})</span>
              </div>
              <div className="flex items-center gap-2 text-[9px]">
                <span className="w-28 font-semibold text-muted-foreground shrink-0">Alíquota ISS</span>
                <div className="flex-1" />
                <span className="w-20 text-right tabular-nums font-bold text-foreground">{calculo.valido ? formatPercent(calculo.issReferencia) : '–'}</span>
              </div>
              <div className="flex items-center gap-2 text-[9px]">
                <span className="w-28 font-semibold text-muted-foreground shrink-0">Retenções</span>
                <div className="flex-1" />
                <span className="w-20 text-right tabular-nums font-bold text-muted-foreground">{formatCurrency(kpis.totalRetencoes)}</span>
              </div>
            </div>
            <div className="border-t border-border pt-1 flex items-center gap-2 text-[9px] font-bold mt-auto">
              <span className="shrink-0">A RECOLHER PGDAS</span>
              <div className="flex-1" />
              <span className="w-20 text-right tabular-nums text-destructive">{formatCurrency(kpis.dasAPagar)}</span>
            </div>
          </div>
        </DashboardCard>
      </div>

      {/* Row 2: Partilha */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
        <DashboardCard title="Partilha Pgdas" headerColor="blue">
          {composicaoTributaria.length > 0 && kpis.faturamentoMes > 0 ? (
            <div className="h-full flex flex-col justify-between gap-1">
              {composicaoTributaria.map(c => {
                const maxPerc = Math.max(...composicaoTributaria.map(t => t.percentual));
                const barWidth = maxPerc > 0 ? (c.percentual / maxPerc) * 100 : 0;
                return (
                  <div key={c.tributo} className="flex items-center gap-2 text-[9px]">
                    <span className="w-10 font-semibold text-muted-foreground shrink-0">{c.tributo}</span>
                    <div className="flex-1 h-3.5 bg-muted/40 rounded-sm overflow-hidden relative">
                      <div
                        className="h-full rounded-sm transition-all"
                        style={{ width: `${barWidth}%`, backgroundColor: c.cor }}
                      />
                    </div>
                    <span className="w-12 text-right tabular-nums text-muted-foreground">{formatPercent(c.aliquota)}</span>
                    <span className="w-16 text-right tabular-nums font-bold text-foreground">{formatCurrency(c.valor)}</span>
                  </div>
                );
              })}
              <div className="border-t border-border pt-1 flex items-center gap-2 text-[9px] font-bold mt-auto">
                <span className="shrink-0">TOTAL PGDAS</span>
                <div className="flex-1" />
                <span className="w-12 text-right tabular-nums">{formatPercent(kpis.aliquotaEfetiva)}</span>
                <span className="w-16 text-right tabular-nums text-destructive">{formatCurrency(kpis.dasEstimado)}</span>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground text-xs">Sem dados para exibir</div>
          )}
        </DashboardCard>
      </div>

      {/* Termômetro de Faixa */}
      <DashboardCard title="Termômetro de Faixa — Simples Nacional" headerColor="blue">
        <FaixaThermometer rbt12={rbt12} calculo={calculo} />
      </DashboardCard>
    </div>
  );
};

/* Sub-component for Resumo items */
const ResumoItem: React.FC<{ label: string; value: string; accent?: string }> = ({ label, value, accent = 'text-foreground' }) => (
  <div className="leading-none">
    <p className="text-[9px] text-muted-foreground uppercase tracking-wide leading-none">{label}</p>
    <p className={`text-xs font-bold ${accent} tabular-nums leading-tight`}>{value}</p>
  </div>
);

export default SimplesNacionalDashboard;
