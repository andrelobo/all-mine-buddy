import React from 'react';
import { DollarSign, FileText, Calculator, Percent, Bell, TrendingUp, TrendingDown } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatCurrency, formatPercent, type CalculoSimplesResult } from '@/utils/simples-nacional';

interface DashboardProps {
  nomeEmpresa: string;
  rbt12: number;
  calculo: CalculoSimplesResult;
  cnaeAnexo: string;
  regime: string | null;
}

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
  const receitaMes = 8450;
  const nfseEmitidas = 37;
  const aliquotaEfetiva = calculo.valido ? calculo.aliquotaEfetiva : 0;
  const dasEstimado = receitaMes * aliquotaEfetiva;

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
    </div>
  );
};

export default Dashboard;
