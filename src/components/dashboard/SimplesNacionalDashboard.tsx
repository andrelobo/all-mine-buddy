import React, { useMemo } from 'react';
import {
  Percent, DollarSign, Scale, Calculator, ShieldCheck, Receipt,
  PieChart as PieIcon,
} from 'lucide-react';
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
import BigNumber from './BigNumber';

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

const PIE_COLORS = [
  'hsl(220, 70%, 50%)', 'hsl(160, 60%, 45%)', 'hsl(38, 92%, 50%)',
  'hsl(0, 72%, 55%)', 'hsl(280, 60%, 55%)', 'hsl(190, 70%, 45%)',
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

  const faixasComparativo = useMemo(() => {
    return FAIXAS_ANEXO_III.map(f => {
      const rbtMeio = (f.limiteInferior + f.limiteSuperior) / 2;
      const calc = calcularSimplesAnexoIII(rbtMeio > 0 ? rbtMeio : 90000, 'III');
      return {
        faixa: `${f.faixa}ª`,
        aliqNominal: +(f.aliquotaNominal * 100).toFixed(2),
        aliqEfetiva: +(calc.aliquotaEfetiva * 100).toFixed(2),
        issEfetivo: +(calc.issReferencia * 100).toFixed(2),
        atual: calculo.faixa?.faixa === f.faixa,
      };
    });
  }, [calculo]);

  const evolucaoMensal = useMemo(() => {
    return dadosMensais.map(m => ({
      label: m.label,
      receita: m.faturamento,
      das: m.tributoEstimado,
      issRetido: m.issRetido,
      dasLiquido: Math.max(m.tributoEstimado - m.issRetido, 0),
      cargaTributaria: m.faturamento > 0 ? +((m.tributoEstimado / m.faturamento) * 100).toFixed(2) : 0,
    }));
  }, [dadosMensais]);

  const pieComposicao = composicaoTributaria.map(c => ({ name: c.tributo, value: c.valor }));

  const renderCenterLabel = ({ viewBox }: any) => {
    const { cx, cy } = viewBox;
    return (
      <text x={cx} y={cy} textAnchor="middle" dominantBaseline="central">
        <tspan x={cx} dy="-6" className="fill-foreground text-lg font-extrabold">
          {formatPercent(kpis.aliquotaEfetiva)}
        </tspan>
        <tspan x={cx} dy="16" className="fill-muted-foreground text-[9px]">
          ALÍQ. EFETIVA
        </tspan>
      </text>
    );
  };

  return (
    <div className="space-y-4">
      {/* ROW 1: RBA Big Numbers + Composição Pie */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* RBA Card with big numbers */}
        <DashboardCard
          title={`RBA ${kpis.competenciaLabel}`}
          subtitle="Receita Bruta Acumulada"
          headerColor="blue"
          className="lg:col-span-2"
        >
          <div className="grid grid-cols-3 gap-4 py-2">
            <BigNumber
              value={formatCurrency(kpis.faturamentoMes)}
              label="Faturamento"
              accent="text-primary"
              size="md"
            />
            <BigNumber
              value={formatCurrency(kpis.dasEstimado)}
              label="DAS Estimado"
              accent="text-destructive"
              size="md"
            />
            <BigNumber
              value={formatCurrency(kpis.dasAPagar)}
              label="A Recolher"
              accent="text-destructive"
              badge="A PAGAR"
              badgeVariant="destructive"
              size="md"
            />
          </div>
          <div className="border-t border-border mt-2 pt-3 grid grid-cols-3 gap-4">
            <BigNumber
              value={formatPercent(kpis.aliquotaEfetiva)}
              label="Alíq. Efetiva"
              accent="text-primary"
              size="sm"
            />
            <BigNumber
              value={calculo.valido ? formatPercent(calculo.issReferencia) : '–'}
              label="Alíq. ISS"
              accent="text-foreground"
              size="sm"
            />
            <BigNumber
              value={`- ${formatCurrency(kpis.issRetidoMes)}`}
              label="ISS Retido"
              accent="text-accent"
              size="sm"
            />
          </div>
        </DashboardCard>

        {/* Pie Chart Donut with center % */}
        <DashboardCard title="Composição do DAS" headerColor="blue">
          {pieComposicao.length > 0 && kpis.faturamentoMes > 0 ? (
            <div className="flex flex-col items-center gap-2">
              <div className="w-full h-44">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPie>
                    <Pie
                      data={pieComposicao}
                      cx="50%" cy="50%" outerRadius={75} innerRadius={40}
                      dataKey="value" nameKey="name"
                      labelLine={false} label={false}
                    >
                      {pieComposicao.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                    </Pie>
                    <Tooltip formatter={(v: number) => formatCurrency(v)} />
                  </RechartsPie>
                </ResponsiveContainer>
              </div>
              <div className="w-full space-y-1">
                {composicaoTributaria.map(c => (
                  <div key={c.tributo} className="flex items-center justify-between text-[10px]">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ backgroundColor: c.cor }} />
                      <span className="text-muted-foreground font-semibold">{c.tributo}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-muted-foreground">{(c.aliquota * 100).toFixed(2)}%</span>
                      <span className="font-bold text-foreground w-16 text-right">{formatCurrency(c.valor)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-40 text-muted-foreground text-sm">Sem dados</div>
          )}
        </DashboardCard>
      </div>

      {/* ROW 2: Detalhamento + Evolução */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Detalhamento por Tributo */}
        <DashboardCard title="Detalhamento por Tributo" headerColor="green">
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b text-muted-foreground">
                  <th className="text-left py-1.5 px-2">Tributo</th>
                  <th className="text-right py-1.5 px-2">% no DAS</th>
                  <th className="text-right py-1.5 px-2">Alíq. Efetiva</th>
                  <th className="text-right py-1.5 px-2">Valor Est.</th>
                </tr>
              </thead>
              <tbody>
                {composicaoTributaria.map(c => (
                  <tr key={c.tributo} className="border-b border-border/50">
                    <td className="py-1.5 px-2 font-medium flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-sm inline-block" style={{ backgroundColor: c.cor }} />
                      {c.tributo}
                    </td>
                    <td className="text-right py-1.5 px-2">{(c.percentual * 100).toFixed(2)}%</td>
                    <td className="text-right py-1.5 px-2">{(c.aliquota * 100).toFixed(4)}%</td>
                    <td className="text-right py-1.5 px-2">{formatCurrency(c.valor)}</td>
                  </tr>
                ))}
                <tr className="font-bold bg-muted/30">
                  <td className="py-1.5 px-2">Total DAS</td>
                  <td className="text-right py-1.5 px-2">100%</td>
                  <td className="text-right py-1.5 px-2">{calculo.valido ? formatPercent(calculo.aliquotaEfetiva) : '–'}</td>
                  <td className="text-right py-1.5 px-2">{formatCurrency(kpis.dasEstimado)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </DashboardCard>

        {/* Comparativo de Faixas */}
        <DashboardCard title="Comparativo de Alíquotas por Faixa" headerColor="orange">
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={faixasComparativo}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="faixa" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} tickFormatter={v => `${v}%`} />
                <Tooltip formatter={(v: number) => `${v}%`} />
                <Legend wrapperStyle={{ fontSize: 10 }} />
                <Bar dataKey="aliqNominal" fill="hsl(220, 70%, 50%)" name="Nominal" radius={[4, 4, 0, 0]} opacity={0.4} />
                <Bar dataKey="aliqEfetiva" fill="hsl(220, 70%, 50%)" name="Efetiva" radius={[4, 4, 0, 0]} />
                <Bar dataKey="issEfetivo" fill="hsl(160, 60%, 45%)" name="ISS Efetivo" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </DashboardCard>
      </div>

      {/* ROW 3: Evolução Mensal full width */}
      <DashboardCard title="Evolução Mensal – Receita × Tributos" headerColor="blue">
        <div className="h-60">
          {evolucaoMensal.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={evolucaoMensal}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="label" tick={{ fontSize: 10 }} />
                <YAxis yAxisId="left" tick={{ fontSize: 10 }} tickFormatter={v => `${(v / 1000).toFixed(0)}k`} />
                <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 10 }} tickFormatter={v => `${v}%`} />
                <Tooltip
                  formatter={(v: number, name: string) =>
                    name === 'Carga %' ? `${v}%` : formatCurrency(v)
                  }
                />
                <Legend wrapperStyle={{ fontSize: 10 }} />
                <Bar yAxisId="left" dataKey="receita" fill="hsl(220, 70%, 50%)" name="Receita" radius={[4, 4, 0, 0]} opacity={0.3} />
                <Bar yAxisId="left" dataKey="das" fill="hsl(0, 72%, 55%)" name="DAS Total" radius={[4, 4, 0, 0]} opacity={0.7} />
                <Bar yAxisId="left" dataKey="issRetido" fill="hsl(160, 60%, 45%)" name="ISS Retido" radius={[4, 4, 0, 0]} />
                <Line yAxisId="right" type="monotone" dataKey="cargaTributaria" stroke="hsl(38, 92%, 50%)" name="Carga %" strokeWidth={2} dot={{ r: 3 }} />
              </ComposedChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground text-sm">Sem dados mensais</div>
          )}
        </div>
      </DashboardCard>

      {/* ROW 4: Tabela Faixas */}
      <DashboardCard title="Tabela Anexo III – Faixas do Simples Nacional" headerColor="purple">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b text-muted-foreground">
                <th className="text-center py-1.5 px-2">Faixa</th>
                <th className="text-right py-1.5 px-2">De</th>
                <th className="text-right py-1.5 px-2">Até</th>
                <th className="text-right py-1.5 px-2">Alíq. Nominal</th>
                <th className="text-right py-1.5 px-2">Parcela Ded.</th>
                <th className="text-right py-1.5 px-2">Alíq. Efetiva*</th>
                <th className="text-right py-1.5 px-2">% ISS</th>
              </tr>
            </thead>
            <tbody>
              {FAIXAS_ANEXO_III.map(f => {
                const rbtRef = (f.limiteInferior + f.limiteSuperior) / 2;
                const c = calcularSimplesAnexoIII(rbtRef > 0 ? rbtRef : 90000, 'III');
                const isAtual = calculo.faixa?.faixa === f.faixa;
                return (
                  <tr key={f.faixa} className={`border-b border-border/50 ${isAtual ? 'bg-primary/10 font-bold' : ''}`}>
                    <td className="text-center py-1.5 px-2">
                      {f.faixa}ª {isAtual && <Badge variant="default" className="text-[8px] ml-1">Atual</Badge>}
                    </td>
                    <td className="text-right py-1.5 px-2">{formatCurrency(f.limiteInferior)}</td>
                    <td className="text-right py-1.5 px-2">{formatCurrency(f.limiteSuperior)}</td>
                    <td className="text-right py-1.5 px-2">{(f.aliquotaNominal * 100).toFixed(2)}%</td>
                    <td className="text-right py-1.5 px-2">{formatCurrency(f.parcelaDeduzir)}</td>
                    <td className="text-right py-1.5 px-2 text-primary">{formatPercent(c.aliquotaEfetiva)}</td>
                    <td className="text-right py-1.5 px-2">{(f.percentualIss * 100).toFixed(1)}%</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <p className="text-[9px] text-muted-foreground mt-1">*Alíquota efetiva calculada no ponto médio da faixa</p>
        </div>
      </DashboardCard>
    </div>
  );
};

export default SimplesNacionalDashboard;
