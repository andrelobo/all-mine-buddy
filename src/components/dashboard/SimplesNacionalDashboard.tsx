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
      {/* Row 1: Financeiro + Termômetro */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
        <DashboardCard title={`PGDAS-D — ${kpis.competenciaLabel}`} headerColor="green">
          <div className="h-full flex flex-col gap-1.5">
            {/* Seção: Período e Enquadramento */}
            <div className="bg-muted/30 rounded px-2 py-1">
              <span className="text-[8px] text-muted-foreground uppercase tracking-wider font-semibold">Enquadramento</span>
              <div className="grid grid-cols-3 gap-x-3 mt-1">
                <FinField label="Período" value={kpis.competenciaLabel} />
                <FinField label="Anexo" value={cnaeAnexo || 'III'} />
                <FinField label="Faixa" value={calculo.valido ? `${calculo.faixa?.faixa}ª` : '–'} />
              </div>
            </div>

            {/* Seção: RBT12 e Alíquotas */}
            <div className="bg-muted/30 rounded px-2 py-1">
              <span className="text-[8px] text-muted-foreground uppercase tracking-wider font-semibold">Cálculo</span>
              <div className="grid grid-cols-2 gap-x-3 mt-1">
                <FinField label="RBT12" value={formatCurrency(rbt12)} />
                <FinField label="Alíq. Nominal" value={calculo.valido ? formatPercent(calculo.faixa?.aliquotaNominal ?? 0) : '–'} />
                <FinField label="Parcela a Deduzir" value={calculo.valido ? formatCurrency(calculo.faixa?.parcelaDeduzir ?? 0) : '–'} />
                <FinField label="Alíq. Efetiva" value={formatPercent(kpis.aliquotaEfetiva)} accent="text-primary" />
              </div>
            </div>

            {/* Seção: Apuração */}
            <div className="bg-muted/30 rounded px-2 py-1">
              <span className="text-[8px] text-muted-foreground uppercase tracking-wider font-semibold">Apuração</span>
              <div className="flex flex-col gap-0.5 mt-1">
                <FinRow label="Receita Bruta (PA)" value={formatCurrency(kpis.faturamentoMes)} accent="text-foreground" />
                <FinRow label="Tributo Devido" value={formatCurrency(kpis.dasEstimado)} accent="text-destructive" />
                <FinRow label="(−) ISS Retido" value={`(${formatCurrency(kpis.issRetidoMes)})`} accent="text-accent" />
                <FinRow label="(−) Retenções" value={`(${formatCurrency(kpis.totalRetencoes)})`} accent="text-muted-foreground" />
              </div>
            </div>

            {/* Rodapé: Valor a Recolher */}
            <div className="border-t border-border pt-1 flex items-center gap-2 text-[9px] font-bold mt-auto">
              <span className="shrink-0">VALOR A RECOLHER (DAS)</span>
              <div className="flex-1" />
              <span className="tabular-nums text-destructive">{formatCurrency(kpis.dasAPagar)}</span>
            </div>
          </div>
        </DashboardCard>

        <DashboardCard title="Termômetro de Faixa — Simples Nacional" headerColor="blue">
          <FaixaThermometer rbt12={rbt12} calculo={calculo} />
        </DashboardCard>
      </div>

      {/* Row 2: Emitidas + Partilha */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
        <DashboardCard title={`EMITIDAS NFSE ${kpis.competenciaLabel.toUpperCase()}`} headerColor="green">
          <EmissoesResumoMini
            notas={notas}
            tomadores={tomadores}
            aliquotaEfetiva={kpis.aliquotaEfetiva}
            mesCompetencia={kpis.mesCompetencia}
          />
        </DashboardCard>

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
    </div>
  );
};

/* Sub-component for Financeiro rows — matches Partilha row style */
const FinRow: React.FC<{ label: string; value: string; accent?: string }> = ({ label, value, accent = 'text-foreground' }) => (
  <div className="flex items-center gap-2 text-[9px]">
    <span className="w-28 font-semibold text-muted-foreground shrink-0">{label}</span>
    <div className="flex-1" />
    <span className={`tabular-nums font-bold ${accent}`}>{value}</span>
  </div>
);

/* Sub-component for PGDAS field (label + value stacked) */
const FinField: React.FC<{ label: string; value: string; accent?: string }> = ({ label, value, accent = 'text-foreground' }) => (
  <div className="py-0.5">
    <span className="text-[7px] text-muted-foreground uppercase tracking-wide block">{label}</span>
    <span className={`text-[10px] font-bold tabular-nums ${accent}`}>{value}</span>
  </div>
);

export default SimplesNacionalDashboard;
