import React from 'react';

interface DashboardCardProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
  rightHeader?: React.ReactNode;
  headerColor?: 'blue' | 'green' | 'red' | 'orange' | 'default' | 'navy';
  icon?: React.ReactNode;
}

const headerColorMap: Record<string, string> = {
  blue: 'bg-gradient-to-r from-[hsl(220,60%,48%)] to-[hsl(220,55%,58%)] text-white',
  green: 'bg-gradient-to-r from-[hsl(160,60%,38%)] to-[hsl(160,50%,48%)] text-white',
  red: 'bg-gradient-to-r from-[hsl(0,65%,48%)] to-[hsl(0,60%,55%)] text-white',
  orange: 'bg-gradient-to-r from-[hsl(25,85%,50%)] to-[hsl(38,80%,55%)] text-white',
  navy: 'bg-gradient-to-r from-[hsl(216,60%,16%)] to-[hsl(216,50%,25%)] text-white',
  default: 'bg-muted text-foreground',
};

const DashboardCard: React.FC<DashboardCardProps> = ({
  title,
  children,
  className = '',
  rightHeader,
  headerColor = 'default',
  icon,
}) => (
  <div className={`rounded-xl border border-border bg-card shadow-md overflow-hidden flex flex-col ${className}`}>
    {title && (
      <div className={`px-3 py-2 flex items-center justify-between gap-2 ${headerColorMap[headerColor]}`}>
        <div className="flex items-center gap-2">
          {icon && <div className="w-5 h-5 flex items-center justify-center opacity-90">{icon}</div>}
          <h3 className="text-[11px] font-bold uppercase tracking-wider">{title}</h3>
        </div>
        {rightHeader && <div>{rightHeader}</div>}
      </div>
    )}
    <div className="p-3 flex-1">{children}</div>
  </div>
);

export default DashboardCard;
