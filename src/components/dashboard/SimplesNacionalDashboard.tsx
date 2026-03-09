import React, { useMemo } from 'react';
import {
  ShieldCheck, Percent, DollarSign, TrendingUp, Scale, BarChart3, PieChart as PieIcon,
  ArrowUpRight, AlertTriangle, Gauge, Receipt, Calculator,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  LineChart, Line, BarChart, Bar, PieChart as RechartsPie, Pie, Cell,
  XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, Legend, Area, AreaChart,
  ComposedChart,
} from 'recharts';
import { FAIXAS_ANEXO_III, formatCurrency, formatPercent, calcularSimplesAnexoIII } from '@/utils/simples-nacional';
import type { CalculoSimplesResult, FaixaAnexoIII } from '@/utils/simples-nacional';
import type { MesData } from '@/hooks/useDashboardData';

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

const KPI: React.FC<{ title: string; value: string; icon: React.ReactNode; accent?: string; sub?: string }> = ({ title, value, icon, accent, sub }) => (
  <Card className="relative overflow-hidden">
    <CardContent className="p-3">
      <div className="flex items-start justify-between">
        <div className="space-y-0.5">
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">{title}</p>
          <p className={`text-sm font-bold ${accent || 'text-foreground'}`}>{value}</p>
          {sub && <p className="text-[10px] text-muted-foreground">{sub}</p>}
        </div>
        <div className="p-1.5 rounded-md bg-primary/10 text-primary shrink-0">{icon}</div>
      </div>
    </CardContent>
  </Card>
);

const SectionTitle: React.FC<{ icon: React.ReactNode; title: string }> = ({ icon, title }) => (
  <div className="flex items-center gap-2 mb-2">
    <div className="p-1 rounded-md bg-primary/10 text-primary">{icon}</div>
    <h3 className="text-xs font-bold text-foreground uppercase tracking-wide">{title}</h3>
  </div>
);

const SimplesNacionalDashboard: React.FC<Props> = ({ rbt12, cnaeAnexo, calculo, kpis, dadosMensais }) => {
  // Composição tributária do DAS
  const composicaoTributaria = useMemo(() => {
    if (!calculo.faixa || !calculo.valido) return [];
    const aliqEfetiva = calculo.aliquotaEfetiva;
    // Percentuais internos do Anexo III (LC 123/2006 Art. 18)
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

  // Dados por faixa comparativa
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

  // Evolução tributária mensal (receita vs DAS vs ISS)
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

  return (
    <div className="space-y-4">
      {/* HEADER */}
      <SectionTitle icon={<Scale className="w-4 h-4" />} title="Apuração Simples Nacional – Anexo III" />

      {/* KPIs TRIBUTÁRIOS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <KPI
          title="Alíquota Nominal"
          value={calculo.faixa ? formatPercent(calculo.faixa.aliquotaNominal) : '–'}
          icon={<Percent className="w-4 h-4" />}
          sub={calculo.faixa ? `Faixa ${calculo.faixa.faixa}ª` : ''}
        />
        <KPI
          title="Alíquota Efetiva"
          value={calculo.valido ? formatPercent(calculo.aliquotaEfetiva) : '–'}
          icon={<Calculator className="w-4 h-4" />}
          accent="text-primary"
          sub="(RBT12×Alíq−PD)÷RBT12"
        />
        <KPI
          title="ISS Efetivo"
          value={calculo.valido ? formatPercent(calculo.issReferencia) : '–'}
          icon={<Receipt className="w-4 h-4" />}
          sub={calculo.faixa ? `${(calculo.faixa.percentualIss * 100).toFixed(1)}% do DAS` : ''}
        />
        <KPI
          title="Parcela a Deduzir"
          value={calculo.faixa ? formatCurrency(calculo.faixa.parcelaDeduzir) : '–'}
          icon={<DollarSign className="w-4 h-4" />}
        />
      </div>

      {/* APURAÇÃO DO PERÍODO */}
      <Card className="border-primary/30">
        <CardHeader className="py-2 px-3">
          <CardTitle className="text-xs font-semibold uppercase tracking-wide text-primary flex items-center gap-2">
            <Calculator className="w-4 h-4" />
            RBA {kpis.competenciaLabel}
          </CardTitle>
        </CardHeader>
        <CardContent className="px-3 pb-3 pt-0">
          <div className="grid grid-cols-5 gap-2">
            <div className="text-center p-2 rounded-md bg-muted/50">
              <p className="text-[9px] text-muted-foreground uppercase tracking-wide">Faturamento</p>
              <p className="text-xs font-bold text-foreground mt-0.5">{formatCurrency(kpis.faturamentoMes)}</p>
            </div>
            <div className="text-center p-2 rounded-md bg-muted/50">
              <p className="text-[9px] text-muted-foreground uppercase tracking-wide">DAS Estimado</p>
              <p className="text-xs font-bold text-destructive mt-0.5">{formatCurrency(kpis.dasEstimado)}</p>
            </div>
            <div className="text-center p-2 rounded-md bg-muted/50">
              <p className="text-[9px] text-muted-foreground uppercase tracking-wide">ISS Retido</p>
              <p className="text-xs font-bold text-primary mt-0.5">- {formatCurrency(kpis.issRetidoMes)}</p>
            </div>
            <div className="text-center p-2 rounded-md bg-muted/50">
              <p className="text-[9px] text-muted-foreground uppercase tracking-wide">DAS a Pagar</p>
              <p className="text-xs font-bold text-destructive mt-0.5">{formatCurrency(kpis.dasAPagar)}</p>
            </div>
            <div className="text-center p-2 rounded-md bg-muted/50">
              <p className="text-[9px] text-muted-foreground uppercase tracking-wide">Carga Tributária</p>
              <p className="text-xs font-bold text-primary mt-0.5">
                {kpis.faturamentoMes > 0 ? ((kpis.dasEstimado / kpis.faturamentoMes) * 100).toFixed(2) : '0,00'}%
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* COMPOSIÇÃO TRIBUTÁRIA + GRÁFICOS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        {/* Pizza composição */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Composição do DAS
            </CardTitle>
          </CardHeader>
          <CardContent className="h-56 p-3">
            {pieComposicao.length > 0 && kpis.faturamentoMes > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPie>
                  <Pie
                    data={pieComposicao}
                    cx="50%" cy="50%" outerRadius={75} innerRadius={40}
                    dataKey="value" nameKey="name"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(1)}%`}
                    labelLine={false}
                    style={{ fontSize: 9 }}
                  >
                    {pieComposicao.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                  </Pie>
                  <Tooltip formatter={(v: number) => formatCurrency(v)} />
                </RechartsPie>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground text-sm">Sem dados</div>
            )}
          </CardContent>
        </Card>

        {/* Tabela composição detalhada */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Detalhamento por Tributo
            </CardTitle>
          </CardHeader>
          <CardContent className="p-3">
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
                        <span className="w-2 h-2 rounded-full inline-block" style={{ backgroundColor: c.cor }} />
                        {c.tributo}
                      </td>
                      <td className="text-right py-1.5 px-2">{(c.percentual * 100).toFixed(2)}%</td>
                      <td className="text-right py-1.5 px-2">{(c.aliquota * 100).toFixed(4)}%</td>
                      <td className="text-right py-1.5 px-2">{formatCurrency(c.valor)}</td>
                    </tr>
                  ))}
                  <tr className="font-bold">
                    <td className="py-1.5 px-2">Total DAS</td>
                    <td className="text-right py-1.5 px-2">100%</td>
                    <td className="text-right py-1.5 px-2">{calculo.valido ? formatPercent(calculo.aliquotaEfetiva) : '–'}</td>
                    <td className="text-right py-1.5 px-2">{formatCurrency(kpis.dasEstimado)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* EVOLUÇÃO MENSAL - Receita x DAS x ISS */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Evolução Mensal – Receita × Tributos
          </CardTitle>
        </CardHeader>
        <CardContent className="h-64 p-3">
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
        </CardContent>
      </Card>

      {/* COMPARATIVO DE FAIXAS */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Comparativo de Alíquotas por Faixa
          </CardTitle>
        </CardHeader>
        <CardContent className="h-56 p-3">
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
        </CardContent>
      </Card>

      {/* TABELA FAIXAS */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Tabela Anexo III – Faixas do Simples Nacional
          </CardTitle>
        </CardHeader>
        <CardContent className="p-3">
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
        </CardContent>
      </Card>
    </div>
  );
};

export default SimplesNacionalDashboard;
