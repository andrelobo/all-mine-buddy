import React from 'react';
import { DollarSign, FileText, Calculator, Percent, Bell } from 'lucide-react';
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
  accent?: 'primary' | 'success' | 'warning' | 'destructive';
}> = ({ title, value, icon, accent = 'primary' }) => {
  const accentMap = {
    primary: 'text-primary',
    success: 'text-success',
    warning: 'text-warning',
    destructive: 'text-destructive',
  };

  return (
    <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-muted/50 shrink-0">
      <span className={accentMap[accent]}>{icon}</span>
      <div className="flex flex-col leading-none">
        <span className="text-[9px] uppercase tracking-wide text-muted-foreground">{title}</span>
        <span className="text-xs font-bold text-foreground">{value}</span>
      </div>
    </div>
  );
};

const Dashboard: React.FC<DashboardProps> = ({ nomeEmpresa, rbt12, calculo, cnaeAnexo, regime }) => {
  const receitaMes = 8450;
  const nfseEmitidas = 37;
  const aliquotaEfetiva = calculo.valido ? calculo.aliquotaEfetiva : 0;
  const dasEstimado = receitaMes * aliquotaEfetiva;

  const competencia = new Date().toLocaleDateString('pt-BR', { month: '2-digit', year: 'numeric' });

  return (
    <div className="flex items-center gap-3 flex-wrap">
      {/* Info */}
      <div className="flex items-center gap-2 shrink-0">
        <h1 className="text-sm font-bold text-foreground truncate max-w-[180px]">{nomeEmpresa || 'Empresa'}</h1>
        <Badge variant="outline" className="text-[10px] py-0 px-1.5">{competencia}</Badge>
        <Badge className="bg-success/15 text-success border-success/20 hover:bg-success/20 text-[10px] py-0 px-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-success mr-1 inline-block" />
          Regular
        </Badge>
      </div>

      <span className="text-border">│</span>

      {/* KPIs inline */}
      <KPICard title="Receita Mês" value={formatCurrency(receitaMes)} icon={<DollarSign className="w-4 h-4" />} accent="success" />
      <KPICard title="NFSe Emit." value={String(nfseEmitidas)} icon={<FileText className="w-4 h-4" />} accent="primary" />
      <KPICard title="DAS Estimado" value={formatCurrency(dasEstimado)} icon={<Calculator className="w-4 h-4" />} accent="warning" />
      <KPICard title="Alíquota" value={calculo.valido ? formatPercent(aliquotaEfetiva) : '—'} icon={<Percent className="w-4 h-4" />} accent="destructive" />

      <span className="text-border">│</span>

      <button className="relative p-1 rounded-lg hover:bg-muted transition-colors shrink-0">
        <Bell className="w-4 h-4 text-muted-foreground" />
        <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-destructive text-destructive-foreground text-[9px] font-bold flex items-center justify-center">3</span>
      </button>
    </div>
  );
};

export default Dashboard;
