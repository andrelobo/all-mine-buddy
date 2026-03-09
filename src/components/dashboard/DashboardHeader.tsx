import React from 'react';
import KpiCard from './KpiCard';

interface Props {
  nomeEmpresa: string;
  titulo: string;
  kpis: { label: string; value: string; accent?: string }[];
  navItems?: string[];
}

const DashboardHeader: React.FC<Props> = ({ nomeEmpresa, titulo, kpis, navItems = [] }) => (
  <div className="rounded-xl bg-[hsl(216,60%,16%)] text-white px-8 py-5 shadow-lg">
    {/* Top row: company + nav items */}
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-4">
        <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center">
          <span className="text-base font-black text-accent">⚡</span>
        </div>
        <div>
          <h1 className="text-base font-extrabold tracking-tight">{nomeEmpresa}</h1>
          <p className="text-[10px] font-medium text-white/50 tracking-wide uppercase">{titulo}</p>
        </div>
      </div>
      {navItems.length > 0 && (
        <div className="flex items-center gap-1">
          {navItems.map((item, i) => (
            <span
              key={i}
              className="px-3 py-1.5 rounded-md text-[10px] font-semibold uppercase tracking-wide text-white/70 bg-white/5 hover:bg-white/10 transition-colors cursor-default"
            >
              {item}
            </span>
          ))}
        </div>
      )}
    </div>
    {/* Bottom row: KPIs */}
    <div className="flex items-center gap-6 bg-white/5 rounded-lg px-6 py-3">
      {kpis.map((k, i) => (
        <React.Fragment key={i}>
          {i > 0 && <div className="h-8 w-px bg-white/10" />}
          <KpiCard label={k.label} value={k.value} accent={k.accent} />
        </React.Fragment>
      ))}
    </div>
  </div>
);

export default DashboardHeader;
