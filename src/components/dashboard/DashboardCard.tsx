import React from 'react';

interface DashboardCardProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
  rightHeader?: React.ReactNode;
}

const DashboardCard: React.FC<DashboardCardProps> = ({
  title,
  children,
  className = '',
  rightHeader,
}) => (
  <div className={`rounded-lg border border-border bg-card shadow-sm overflow-hidden ${className}`}>
    {title && (
      <div className="px-4 py-2.5 border-b border-border flex items-center justify-between">
        <h3 className="text-xs font-bold text-foreground uppercase tracking-wide">{title}</h3>
        {rightHeader && <div>{rightHeader}</div>}
      </div>
    )}
    <div className="p-4">{children}</div>
  </div>
);

export default DashboardCard;
