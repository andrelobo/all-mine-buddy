import React, { useMemo, useState, useCallback, useRef, useEffect } from 'react';
import { Responsive, WidthProvider, Layout } from 'react-grid-layout';
import { DollarSign, FileText, Shield, BarChart3, Gauge, Lock, Unlock } from 'lucide-react';
import type { NotaDashboard } from '@/hooks/useDashboardData';
import { FAIXAS_ANEXO_III, formatCurrency, formatPercent, calcularSimplesAnexoIII } from '@/utils/simples-nacional';
import type { CalculoSimplesResult } from '@/utils/simples-nacional';
import type { MesData } from '@/hooks/useDashboardData';
import DashboardCard from './DashboardCard';
import FaixaThermometer from './FaixaThermometer';
import EmissoesResumoMini from './EmissoesResumoMini';

const ResponsiveGridLayout = WidthProvider(Responsive);

const STORAGE_KEY = 'sn-dashboard-layout';

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
  simuladorContent?: React.ReactNode;
}

const PIE_COLORS = [
  'hsl(160, 60%, 45%)', 'hsl(160, 40%, 60%)', 'hsl(160, 30%, 72%)',
  'hsl(38, 80%, 55%)', 'hsl(220, 60%, 55%)', 'hsl(280, 50%, 55%)',
];

const DEFAULT_LAYOUTS = {
  lg: [
    { i: 'financeiro', x: 0, y: 0, w: 5, h: 2 },
    { i: 'policia', x: 5, y: 0, w: 3, h: 2 },
    { i: 'emitidas', x: 8, y: 0, w: 4, h: 2 },
    { i: 'partilha', x: 0, y: 2, w: 6, h: 2 },
    { i: 'termometro', x: 6, y: 2, w: 6, h: 2 },
  ],
  md: [
    { i: 'financeiro', x: 0, y: 0, w: 4, h: 2 },
    { i: 'policia', x: 4, y: 0, w: 4, h: 2 },
    { i: 'emitidas', x: 0, y: 2, w: 4, h: 2 },
    { i: 'partilha', x: 4, y: 2, w: 4, h: 2 },
    { i: 'termometro', x: 0, y: 4, w: 8, h: 2 },
  ],
  sm: [
    { i: 'financeiro', x: 0, y: 0, w: 6, h: 2 },
    { i: 'policia', x: 0, y: 2, w: 6, h: 2 },
    { i: 'emitidas', x: 0, y: 4, w: 6, h: 2 },
    { i: 'partilha', x: 0, y: 6, w: 6, h: 2 },
    { i: 'termometro', x: 0, y: 8, w: 6, h: 2 },
  ],
};

function loadLayouts() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch {}
  return DEFAULT_LAYOUTS;
}

const SimplesNacionalDashboard: React.FC<Props> = ({ rbt12, cnaeAnexo, calculo, kpis, dadosMensais, notas, tomadores, simuladorContent }) => {
  const [layouts, setLayouts] = useState(loadLayouts);
  const [locked, setLocked] = useState(true);

  const onLayoutChange = useCallback((_: Layout[], allLayouts: any) => {
    setLayouts(allLayouts);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(allLayouts));
  }, []);

  const resetLayout = useCallback(() => {
    setLayouts(DEFAULT_LAYOUTS);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

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

  return (
    <div className="space-y-3">
      {/* KPI Summary Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <KpiBox label="Faturamento" value={formatCurrency(kpis.faturamentoMes)} color="green" icon={<DollarSign className="w-4 h-4" />} />
        <KpiBox label="Tributos Estimados" value={formatCurrency(kpis.dasEstimado)} color="red" icon={<BarChart3 className="w-4 h-4" />} />
        <KpiBox label="Alíquota Efetiva" value={formatPercent(kpis.aliquotaEfetiva)} color="blue" icon={<Gauge className="w-4 h-4" />} />
        <KpiBox label="A Recolher PGDAS" value={formatCurrency(kpis.dasAPagar)} color="orange" icon={<Shield className="w-4 h-4" />} />
      </div>

      {/* Lock/Unlock toggle */}
      <div className="flex items-center justify-end gap-2">
        <button
          onClick={() => setLocked(l => !l)}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-semibold transition-colors ${
            locked
              ? 'bg-muted text-muted-foreground hover:bg-muted/80'
              : 'bg-primary/10 text-primary hover:bg-primary/20'
          }`}
        >
          {locked ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
          {locked ? 'Layout travado' : 'Arraste os cards'}
        </button>
        {!locked && (
          <button
            onClick={resetLayout}
            className="px-2.5 py-1 rounded-md text-[10px] font-semibold bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors"
          >
            Resetar
          </button>
        )}
      </div>

      {/* Draggable Grid */}
      <ResponsiveGridLayout
        className="layout"
        layouts={layouts}
        breakpoints={{ lg: 1024, md: 768, sm: 0 }}
        cols={{ lg: 12, md: 8, sm: 6 }}
        rowHeight={100}
        onLayoutChange={onLayoutChange}
        isDraggable={!locked}
        isResizable={!locked}
        draggableHandle=".drag-handle"
        margin={[12, 12]}
        containerPadding={[0, 0]}
      >
        <div key="financeiro">
          <DashboardCard
            title={`Financeiro ${kpis.competenciaLabel}`}
            headerColor="green"
            icon={<DollarSign className="w-4 h-4" />}
            draggable={!locked}
          >
            <div className="h-full flex flex-col justify-between gap-1.5">
              <FinRow label="Retido ISS (T)" value={`(${formatCurrency(kpis.issRetidoMes)})`} accent="text-accent" />
              <FinRow label="Faturamento Bruto" value={formatCurrency(kpis.faturamentoMes)} accent="text-foreground" bold />
              <FinRow label="Tributos Estimados" value={formatCurrency(kpis.dasEstimado)} accent="text-destructive" />
              <FinRow label="Alíquota Efetiva" value={formatPercent(kpis.aliquotaEfetiva)} accent="text-primary" />
              <FinRow label="Alíquota ISS" value={calculo.valido ? formatPercent(calculo.issReferencia) : '–'} accent="text-foreground" />
              <FinRow label="Retenções" value={formatCurrency(kpis.totalRetencoes)} accent="text-muted-foreground" />
              <div className="border-t-2 border-destructive/20 pt-2 flex items-center gap-2 text-[10px] font-bold mt-auto bg-destructive/5 -mx-3 -mb-3 px-3 py-2 rounded-b-lg">
                <span className="shrink-0 uppercase">A Recolher PGDAS</span>
                <div className="flex-1" />
                <span className="tabular-nums text-destructive text-sm">{formatCurrency(kpis.dasAPagar)}</span>
              </div>
            </div>
          </DashboardCard>
        </div>

        <div key="policia">
          <DashboardCard title="Policia Federal" headerColor="orange" icon={<Shield className="w-4 h-4" />} draggable={!locked}>
            {simuladorContent}
          </DashboardCard>
        </div>

        <div key="emitidas">
          <DashboardCard
            title={`Emitidas NFSe ${kpis.competenciaLabel.toUpperCase()}`}
            headerColor="navy"
            icon={<FileText className="w-4 h-4" />}
            draggable={!locked}
          >
            <EmissoesResumoMini
              notas={notas}
              tomadores={tomadores}
              aliquotaEfetiva={kpis.aliquotaEfetiva}
              mesCompetencia={kpis.mesCompetencia}
            />
          </DashboardCard>
        </div>

        <div key="partilha">
          <DashboardCard title="Partilha Pgdas" headerColor="blue" icon={<BarChart3 className="w-4 h-4" />} draggable={!locked}>
            {composicaoTributaria.length > 0 && kpis.faturamentoMes > 0 ? (
              <div className="h-full flex flex-col justify-between gap-1.5">
                {composicaoTributaria.map(c => {
                  const maxPerc = Math.max(...composicaoTributaria.map(t => t.percentual));
                  const barWidth = maxPerc > 0 ? (c.percentual / maxPerc) * 100 : 0;
                  return (
                    <div key={c.tributo} className="flex items-center gap-2 text-[10px]">
                      <span className="w-12 font-semibold text-muted-foreground shrink-0">{c.tributo}</span>
                      <div className="flex-1 h-4 bg-muted/40 rounded overflow-hidden relative">
                        <div className="h-full rounded transition-all duration-500" style={{ width: `${barWidth}%`, backgroundColor: c.cor }} />
                      </div>
                      <span className="w-14 text-right tabular-nums text-muted-foreground">{formatPercent(c.aliquota)}</span>
                      <span className="w-18 text-right tabular-nums font-bold text-foreground">{formatCurrency(c.valor)}</span>
                    </div>
                  );
                })}
                <div className="border-t-2 border-primary/20 pt-2 flex items-center gap-2 text-[10px] font-bold mt-auto">
                  <span className="shrink-0 uppercase">Total PGDAS</span>
                  <div className="flex-1" />
                  <span className="w-14 text-right tabular-nums">{formatPercent(kpis.aliquotaEfetiva)}</span>
                  <span className="w-18 text-right tabular-nums text-destructive">{formatCurrency(kpis.dasEstimado)}</span>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground text-xs">Sem dados para exibir</div>
            )}
          </DashboardCard>
        </div>

        <div key="termometro">
          <DashboardCard title="Termômetro de Faixa — Simples Nacional" headerColor="navy" icon={<Gauge className="w-4 h-4" />} draggable={!locked}>
            <FaixaThermometer rbt12={rbt12} calculo={calculo} />
          </DashboardCard>
        </div>
      </ResponsiveGridLayout>
    </div>
  );
};

/* KPI Box */
const KpiBox: React.FC<{ label: string; value: string; color: 'green' | 'red' | 'blue' | 'orange'; icon: React.ReactNode }> = ({ label, value, color, icon }) => {
  const colorMap = {
    green: 'border-l-[hsl(160,60%,40%)] bg-[hsl(160,60%,40%)]/5 text-[hsl(160,60%,35%)]',
    red: 'border-l-destructive bg-destructive/5 text-destructive',
    blue: 'border-l-primary bg-primary/5 text-primary',
    orange: 'border-l-[hsl(25,85%,50%)] bg-[hsl(25,85%,50%)]/5 text-[hsl(25,85%,45%)]',
  };
  const iconBgMap = {
    green: 'bg-[hsl(160,60%,40%)]/15 text-[hsl(160,60%,35%)]',
    red: 'bg-destructive/15 text-destructive',
    blue: 'bg-primary/15 text-primary',
    orange: 'bg-[hsl(25,85%,50%)]/15 text-[hsl(25,85%,45%)]',
  };
  return (
    <div className={`rounded-lg border border-border border-l-4 ${colorMap[color]} p-3 flex items-center gap-3 shadow-sm`}>
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${iconBgMap[color]}`}>{icon}</div>
      <div className="flex-1 min-w-0">
        <p className="text-[9px] font-semibold uppercase tracking-wide text-muted-foreground truncate">{label}</p>
        <p className="text-sm font-extrabold tabular-nums leading-tight">{value}</p>
      </div>
    </div>
  );
};

/* Sub-component for Financeiro rows */
const FinRow: React.FC<{ label: string; value: string; accent?: string; bold?: boolean }> = ({ label, value, accent = 'text-foreground', bold }) => (
  <div className="flex items-center gap-2 text-[10px]">
    <span className="w-32 font-semibold text-muted-foreground shrink-0">{label}</span>
    <div className="flex-1 border-b border-dotted border-border" />
    <span className={`tabular-nums ${bold ? 'font-extrabold text-sm' : 'font-bold'} ${accent}`}>{value}</span>
  </div>
);

export default SimplesNacionalDashboard;
