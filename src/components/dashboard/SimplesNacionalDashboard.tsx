import React, { useMemo } from 'react';
import { Badge } from '@/components/ui/badge';
import {
  PieChart as RechartsPie, Pie, Cell,
  XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, Legend,
  Bar, BarChart, Line, LineChart, ComposedChart,
} from 'recharts';
import { FAIXAS_ANEXO_III, formatCurrency, formatPercent, calcularSimplesAnexoIII } from '@/utils/simples-nacional';
import type { CalculoSimplesResult } from '@/utils/simples-nacional';
import type { MesData } from '@/hooks/useDashboardData';
import DashboardCard from './DashboardCard';
import HorizontalBarItem from './HorizontalBarItem';

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
const CHART_GREEN_LIGHT = 'hsl(160, 50%, 65%)';

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
      cargaTributaria: m.faturamento > 0 ? +((m.tributoEstimado / m.faturamento) * 100).toFixed(2) : 0,
    }));
  }, [dadosMensais]);

  const pieComposicao = composicaoTributaria.map(c => ({ name: c.tributo, value: c.valor }));

  // Horizontal bar data for composição
  const maxComposicao = Math.max(...composicaoTributaria.map(c => c.valor), 1);

  return (
    <div className="space-y-4">
      {/* ROW 1: Composição (horizontal bars) + Pie + Apuração resumo */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Composição como barras horizontais (estilo CredBusiness "Status") */}
        <DashboardCard title={`Apuração ${kpis.competenciaLabel}`}>
          <div className="space-y-2.5">
            {composicaoTributaria.map(c => (
              <HorizontalBarItem
                key={c.tributo}
                label={c.tributo}
                value={c.valor}
                max={maxComposicao}
                formatValue={v => `${(c.percentual * 100).toFixed(0)}%`}
                color={c.cor}
              />
            ))}
          </div>
        </DashboardCard>

        {/* Composição Pie (estilo CredBusiness "Produto") */}
        <DashboardCard title="Composição do DAS">
          {pieComposicao.length > 0 && kpis.faturamentoMes > 0 ? (
            <div className="flex flex-col items-center gap-3">
              <div className="w-full h-44">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPie>
                    <Pie
                      data={pieComposicao}
                      cx="50%" cy="50%" outerRadius={75} innerRadius={30}
                      dataKey="value" nameKey="name"
                      labelLine={false} label={false}
                    >
                      {pieComposicao.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                    </Pie>
                    <Tooltip formatter={(v: number) => formatCurrency(v)} />
                    <Legend wrapperStyle={{ fontSize: 10 }} />
                  </RechartsPie>
                </ResponsiveContainer>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-44 text-muted-foreground text-sm">Sem dados</div>
          )}
        </DashboardCard>

        {/* Resumo da Apuração (valores) */}
        <DashboardCard title="Resumo Tributário">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Faturamento</span>
              <span className="text-sm font-bold text-foreground">{formatCurrency(kpis.faturamentoMes)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">DAS Estimado</span>
              <span className="text-sm font-bold text-destructive">{formatCurrency(kpis.dasEstimado)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Alíq. Efetiva</span>
              <span className="text-sm font-bold text-primary">{formatPercent(kpis.aliquotaEfetiva)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">ISS Retido</span>
              <span className="text-sm font-bold text-accent">- {formatCurrency(kpis.issRetidoMes)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Alíq. ISS</span>
              <span className="text-sm font-bold text-foreground">{calculo.valido ? formatPercent(calculo.issReferencia) : '–'}</span>
            </div>
            <div className="flex items-center justify-between bg-destructive/5 rounded-lg px-2 py-1.5">
              <span className="text-xs font-medium text-muted-foreground">A Recolher</span>
              <span className="text-base font-extrabold text-destructive">{formatCurrency(kpis.dasAPagar)}</span>
            </div>
          </div>
        </DashboardCard>
      </div>

      {/* ROW 2: Comparativo por Faixa (bar chart) + Evolução Mensal (line chart) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <DashboardCard title="Comparativo por Faixa">
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={faixasComparativo}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="faixa" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} tickFormatter={v => `${v}%`} />
                <Tooltip formatter={(v: number) => `${v}%`} />
                <Legend wrapperStyle={{ fontSize: 10 }} />
                <Bar dataKey="aliqNominal" fill={CHART_GREEN_LIGHT} name="Nominal" radius={[3, 3, 0, 0]} />
                <Bar dataKey="aliqEfetiva" fill={CHART_GREEN} name="Efetiva" radius={[3, 3, 0, 0]} />
                <Bar dataKey="issEfetivo" fill="hsl(38, 80%, 55%)" name="ISS Efetivo" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </DashboardCard>

        <DashboardCard title="Evolução Mensal – Receita × Tributos">
          <div className="h-52">
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
                  <Line yAxisId="right" type="monotone" dataKey="cargaTributaria" stroke={CHART_GREEN} name="Carga %" strokeWidth={2} dot={{ r: 3, fill: CHART_GREEN }} />
                </ComposedChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground text-sm">Sem dados</div>
            )}
          </div>
        </DashboardCard>
      </div>

      {/* ROW 3: Tabela Detalhamento + Tabela Faixas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <DashboardCard title="Detalhamento por Tributo">
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

        <DashboardCard title="Tabela Anexo III – Faixas do Simples Nacional">
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b text-muted-foreground">
                  <th className="text-center py-1.5 px-1">Faixa</th>
                  <th className="text-right py-1.5 px-1">De</th>
                  <th className="text-right py-1.5 px-1">Até</th>
                  <th className="text-right py-1.5 px-1">Nom.</th>
                  <th className="text-right py-1.5 px-1">Ded.</th>
                  <th className="text-right py-1.5 px-1">Efet.*</th>
                  <th className="text-right py-1.5 px-1">ISS</th>
                </tr>
              </thead>
              <tbody>
                {FAIXAS_ANEXO_III.map(f => {
                  const rbtRef = (f.limiteInferior + f.limiteSuperior) / 2;
                  const c = calcularSimplesAnexoIII(rbtRef > 0 ? rbtRef : 90000, 'III');
                  const isAtual = calculo.faixa?.faixa === f.faixa;
                  return (
                    <tr key={f.faixa} className={`border-b border-border/50 ${isAtual ? 'bg-accent/10 font-bold' : ''}`}>
                      <td className="text-center py-1.5 px-1">
                        {f.faixa}ª {isAtual && <Badge variant="default" className="text-[8px] ml-0.5 bg-accent">Atual</Badge>}
                      </td>
                      <td className="text-right py-1.5 px-1">{formatCurrency(f.limiteInferior)}</td>
                      <td className="text-right py-1.5 px-1">{formatCurrency(f.limiteSuperior)}</td>
                      <td className="text-right py-1.5 px-1">{(f.aliquotaNominal * 100).toFixed(2)}%</td>
                      <td className="text-right py-1.5 px-1">{formatCurrency(f.parcelaDeduzir)}</td>
                      <td className="text-right py-1.5 px-1 text-accent">{formatPercent(c.aliquotaEfetiva)}</td>
                      <td className="text-right py-1.5 px-1">{(f.percentualIss * 100).toFixed(1)}%</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <p className="text-[9px] text-muted-foreground mt-1">*Alíquota efetiva calculada no ponto médio da faixa</p>
          </div>
        </DashboardCard>
      </div>
    </div>
  );
};

export default SimplesNacionalDashboard;
