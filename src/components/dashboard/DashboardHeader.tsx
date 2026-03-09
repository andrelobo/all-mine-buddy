import React from 'react';
import KpiCard from './KpiCard';

interface Props {
  nomeEmpresa: string;
  titulo: string;
  kpis: { label: string; value: string; accent?: string }[];
}

const DashboardHeader: React.FC<Props> = ({ nomeEmpresa, titulo, kpis }) => (
  <div className="rounded-xl bg-gradient-to-r from-sidebar-background via-sidebar-background to-sidebar-background/90 text-sidebar-foreground px-8 py-6 shadow-lg border border-sidebar-border">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center">
          <span className="text-lg font-black text-accent">⚡</span>
        </div>
        <div>
          <h1 className="text-lg font-extrabold tracking-tight">{nomeEmpresa}</h1>
          <p className="text-xs font-medium text-sidebar-foreground/60 tracking-wide uppercase">{titulo}</p>
        </div>
      </div>
      <div className="flex items-center gap-6 bg-sidebar-foreground/5 rounded-xl px-6 py-3 backdrop-blur-sm">
        {kpis.map((k, i) => (
          <React.Fragment key={i}>
            {i > 0 && <div className="h-8 w-px bg-sidebar-foreground/15" />}
            <KpiCard label={k.label} value={k.value} accent={k.accent} />
          </React.Fragment>
        ))}
      </div>
    </div>
  </div>
);

export default DashboardHeader;
