import React from 'react';

interface KpiCardProps {
  label: string;
  value: string;
  accent?: string;
}

const KpiCard: React.FC<KpiCardProps> = ({ label, value, accent }) => (
  <div className="flex flex-col items-center justify-center">
    <p className="text-[10px] text-sidebar-foreground/60 font-medium uppercase tracking-wide">{label}</p>
    <p className={`text-lg font-extrabold leading-tight ${accent || 'text-sidebar-foreground'}`}>{value}</p>
  </div>
);

export default KpiCard;
