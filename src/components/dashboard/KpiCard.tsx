import React from 'react';

interface KpiCardProps {
  label: string;
  value: string;
  borderColor?: 'blue' | 'green' | 'red' | 'orange';
  accent?: string;
  sub?: string;
}

const borderMap = {
  blue: 'border-t-4 border-t-primary',
  green: 'border-t-4 border-t-accent',
  red: 'border-t-4 border-t-destructive',
  orange: 'border-t-4 border-t-warning',
};

const KpiCard: React.FC<KpiCardProps> = ({ label, value, borderColor = 'blue', accent, sub }) => (
  <div className={`rounded-lg border border-border bg-card shadow-sm overflow-hidden ${borderMap[borderColor]}`}>
    <div className="px-4 py-3 text-center">
      <p className="text-[11px] text-muted-foreground font-medium mb-1">{label}</p>
      <p className={`text-xl font-extrabold leading-tight ${accent || 'text-foreground'}`}>{value}</p>
      {sub && <p className="text-[10px] text-muted-foreground mt-0.5">{sub}</p>}
    </div>
  </div>
);

export default KpiCard;
