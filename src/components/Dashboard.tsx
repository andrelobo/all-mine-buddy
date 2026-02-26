import React from 'react';
import { DollarSign, FileText, Calculator, Percent, Bell, TrendingUp, TrendingDown } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, PieChart, Pie, Cell, BarChart, Bar, ResponsiveContainer } from 'recharts';
import { Badge } from '@/components/ui/badge';
import { formatCurrency, formatPercent, type CalculoSimplesResult } from '@/utils/simples-nacional';

interface DashboardProps {
  nomeEmpresa: string;
  rbt12: number;
  calculo: CalculoSimplesResult;
  cnaeAnexo: string;
  regime: string | null;
}

// Mock data for charts — will be replaced with real data later
const receitaMensal = [
  { mes: 'Mar', valor: 6200 },
  { mes: 'Abr', valor: 7100 },
  { mes: 'Mai', valor: 6800 },
  { mes: 'Jun', valor: 7500 },
  { mes: 'Jul', valor: 8200 },
  { mes: 'Ago', valor: 7900 },
  { mes: 'Set', valor: 8500 },
  { mes: 'Out', valor: 7600 },
  { mes: 'Nov', valor: 8100 },
  { mes: 'Dez', valor: 9200 },
  { mes: 'Jan', valor: 8800 },
  { mes: 'Fev', valor: 8450 },
];

const servicosCategoria = [
  { name: 'Consultoria', value: 42, color: 'hsl(220, 70%, 50%)' },
  { name: 'Desenvolvimento', value: 28, color: 'hsl(160, 60%, 45%)' },
  { name: 'Suporte', value: 18, color: 'hsl(38, 92%, 50%)' },
  { name: 'Outros', value: 12, color: 'hsl(215, 15%, 50%)' },
];

const chartConfig = {
  valor: { label: 'Receita', color: 'hsl(var(--primary))' },
  das: { label: 'DAS', color: 'hsl(var(--destructive))' },
  consultoria: { label: 'Consultoria', color: 'hsl(220, 70%, 50%)' },
  desenvolvimento: { label: 'Desenvolvimento', color: 'hsl(160, 60%, 45%)' },
  suporte: { label: 'Suporte', color: 'hsl(38, 92%, 50%)' },
  outros: { label: 'Outros', color: 'hsl(215, 15%, 50%)' },
};

const KPICard: React.FC<{
  title: string;
  value: string;
  icon: React.ReactNode;
  trend?: { value: string; up: boolean };
  accent?: 'primary' | 'success' | 'warning' | 'destructive';
}> = ({ title, value, icon, trend, accent = 'primary' }) => {
  const accentMap = {
    primary: 'bg-primary/10 text-primary',
    success: 'bg-success/10 text-success',
    warning: 'bg-warning/10 text-warning',
    destructive: 'bg-destructive/10 text-destructive',
  };

  return (
    <Card className="relative overflow-hidden">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{title}</p>
            <p className="text-2xl font-bold text-foreground">{value}</p>
            {trend && (
              <div className={`flex items-center gap-1 text-xs font-medium ${trend.up ? 'text-success' : 'text-destructive'}`}>
                {trend.up ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                {trend.value}
              </div>
            )}
          </div>
          <div className={`p-2.5 rounded-lg ${accentMap[accent]}`}>
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const Dashboard: React.FC<DashboardProps> = ({ nomeEmpresa, rbt12, calculo, cnaeAnexo, regime }) => {
  const receitaMes = receitaMensal[receitaMensal.length - 1]?.valor || 0;
  const nfseEmitidas = 37;
  const aliquotaEfetiva = calculo.valido ? calculo.aliquotaEfetiva : 0;
  const dasEstimado = receitaMes * aliquotaEfetiva;

  const faixaData = calculo.faixa
    ? [
        { name: `Faixa ${calculo.faixa.faixa}`, atual: rbt12, limite: calculo.faixa.limiteSuperior },
      ]
    : [];

  const competencia = new Date().toLocaleDateString('pt-BR', { month: '2-digit', year: 'numeric' });

  return (
    <div className="space-y-4">
      {/* Top info bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-1">
        <div className="flex items-center gap-3">
          <h1 className="text-lg font-bold text-foreground">{nomeEmpresa || 'Empresa'}</h1>
          <Badge variant="outline" className="text-xs">
            Competência: {competencia}
          </Badge>
        </div>
        <div className="flex items-center gap-3">
          <Badge className="bg-success/15 text-success border-success/20 hover:bg-success/20">
            <span className="w-1.5 h-1.5 rounded-full bg-success mr-1.5 inline-block" />
            Regular
          </Badge>
          <button className="relative p-1.5 rounded-lg hover:bg-muted transition-colors">
            <Bell className="w-4 h-4 text-muted-foreground" />
            <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-destructive text-destructive-foreground text-[9px] font-bold flex items-center justify-center">3</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <KPICard
          title="Receita Mês"
          value={formatCurrency(receitaMes)}
          icon={<DollarSign className="w-5 h-5" />}
          trend={{ value: '+4,2%', up: true }}
          accent="success"
        />
        <KPICard
          title="NFSe Emitidas"
          value={String(nfseEmitidas)}
          icon={<FileText className="w-5 h-5" />}
          trend={{ value: '+12%', up: true }}
          accent="primary"
        />
        <KPICard
          title="DAS Estimado"
          value={formatCurrency(dasEstimado)}
          icon={<Calculator className="w-5 h-5" />}
          accent="warning"
        />
        <KPICard
          title="Alíquota Efetiva"
          value={calculo.valido ? formatPercent(aliquotaEfetiva) : '—'}
          icon={<Percent className="w-5 h-5" />}
          trend={calculo.faixa ? { value: `Faixa ${calculo.faixa.faixa}`, up: calculo.faixa.faixa <= 3 } : undefined}
          accent="destructive"
        />
      </div>

      {/* Revenue line chart */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-primary" />
            Receita 12 Meses
          </CardTitle>
        </CardHeader>
        <CardContent className="pb-3">
          <ChartContainer config={chartConfig} className="h-[220px] w-full">
            <LineChart data={receitaMensal} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border/50" />
              <XAxis dataKey="mes" tick={{ fontSize: 11 }} className="text-muted-foreground" />
              <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} className="text-muted-foreground" />
              <ChartTooltip content={<ChartTooltipContent formatter={(value) => formatCurrency(Number(value))} />} />
              <Line
                type="monotone"
                dataKey="valor"
                stroke="hsl(var(--primary))"
                strokeWidth={2.5}
                dot={{ r: 3, fill: 'hsl(var(--primary))' }}
                activeDot={{ r: 5 }}
              />
            </LineChart>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Bottom row: Donut + Bar */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        {/* Services donut */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold">Serviços por Categoria</CardTitle>
          </CardHeader>
          <CardContent className="pb-3">
            <ChartContainer config={chartConfig} className="h-[200px] w-full">
              <PieChart>
                <Pie
                  data={servicosCategoria}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {servicosCategoria.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <ChartTooltip content={<ChartTooltipContent formatter={(value) => `${value}%`} />} />
              </PieChart>
            </ChartContainer>
            <div className="flex flex-wrap justify-center gap-3 mt-2">
              {servicosCategoria.map((s) => (
                <div key={s.name} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: s.color }} />
                  {s.name} ({s.value}%)
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Tax projection bar */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold">Projeção de Imposto</CardTitle>
          </CardHeader>
          <CardContent className="pb-3">
            {calculo.faixa ? (
              <>
                <ChartContainer config={chartConfig} className="h-[200px] w-full">
                  <BarChart data={faixaData} layout="vertical" margin={{ top: 5, right: 10, left: 10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border/50" />
                    <XAxis type="number" tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} tick={{ fontSize: 11 }} />
                    <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} width={60} />
                    <ChartTooltip content={<ChartTooltipContent formatter={(value) => formatCurrency(Number(value))} />} />
                    <Bar dataKey="atual" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} name="RBT12 Atual" />
                    <Bar dataKey="limite" fill="hsl(var(--muted-foreground))" radius={[0, 4, 4, 0]} opacity={0.3} name="Limite Faixa" />
                  </BarChart>
                </ChartContainer>
                <div className="mt-2 text-xs text-muted-foreground text-center">
                  Falta {formatCurrency(calculo.faixa.limiteSuperior - rbt12)} para a próxima faixa
                </div>
              </>
            ) : (
              <div className="h-[200px] flex items-center justify-center text-sm text-muted-foreground">
                Configure o Simples Nacional para visualizar projeções
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
