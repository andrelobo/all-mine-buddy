import React from 'react';
import KpiCard from './KpiCard';

interface Props {
  nomeEmpresa: string;
  titulo: string;
  kpis: { label: string; value: string; accent?: string }[];
}

const DashboardHeader: React.FC<Props> = ({ nomeEmpresa, titulo, kpis }) => (
  <div className="rounded-lg bg-sidebar-background text-sidebar-foreground px-6 py-4 flex items-center justify-between shadow-md">
    <div className="flex items-center gap-3">
      <h1 className="text-base font-bold tracking-tight">{nomeEmpresa}</h1>
      <div className="h-5 w-px bg-sidebar-foreground/30" />
      <span className="text-sm font-medium text-sidebar-foreground/80">{titulo}</span>
    </div>
    <div className="flex items-center gap-8">
      {kpis.map((k, i) => (
        <KpiCard key={i} label={k.label} value={k.value} accent={k.accent} />
      ))}
    </div>
  </div>
);

export default DashboardHeader;
