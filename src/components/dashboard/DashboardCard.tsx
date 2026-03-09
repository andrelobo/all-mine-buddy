import React from 'react';

interface DashboardCardProps {
  title: string;
  headerColor?: 'blue' | 'green' | 'red' | 'orange' | 'purple';
  children: React.ReactNode;
  className?: string;
  subtitle?: string;
  rightHeader?: React.ReactNode;
}

const colorMap = {
  blue: 'bg-primary',
  green: 'bg-accent',
  red: 'bg-destructive',
  orange: 'bg-warning',
  purple: 'bg-[hsl(280,60%,55%)]',
};

const DashboardCard: React.FC<DashboardCardProps> = ({
  title,
  headerColor = 'blue',
  children,
  className = '',
  subtitle,
  rightHeader,
}) => (
  <div className={`rounded-lg border border-border bg-card text-card-foreground shadow-sm overflow-hidden ${className}`}>
    <div className={`${colorMap[headerColor]} px-3 py-2 flex items-center justify-between`}>
      <div>
        <h3 className="text-xs font-bold text-primary-foreground uppercase tracking-wide">{title}</h3>
        {subtitle && <p className="text-[10px] text-primary-foreground/70">{subtitle}</p>}
      </div>
      {rightHeader && <div>{rightHeader}</div>}
    </div>
    <div className="p-3">{children}</div>
  </div>
);

export default DashboardCard;
