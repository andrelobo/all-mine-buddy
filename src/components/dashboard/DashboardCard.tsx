import React from 'react';

interface DashboardCardProps {
  title?: string;
  borderColor?: 'blue' | 'green' | 'red' | 'orange' | 'purple' | 'none';
  children: React.ReactNode;
  className?: string;
  rightHeader?: React.ReactNode;
}

const borderMap = {
  blue: 'border-l-4 border-l-primary',
  green: 'border-l-4 border-l-accent',
  red: 'border-l-4 border-l-destructive',
  orange: 'border-l-4 border-l-warning',
  purple: 'border-l-4 border-l-[hsl(280,60%,55%)]',
  none: '',
};

const DashboardCard: React.FC<DashboardCardProps> = ({
  title,
  borderColor = 'none',
  children,
  className = '',
  rightHeader,
}) => (
  <div className={`rounded-lg border border-border bg-card text-card-foreground shadow-sm overflow-hidden ${borderMap[borderColor]} ${className}`}>
    {title && (
      <div className="px-4 py-2.5 border-b border-border flex items-center justify-between">
        <h3 className="text-sm font-semibold text-foreground">{title}</h3>
        {rightHeader && <div>{rightHeader}</div>}
      </div>
    )}
    <div className="p-4">{children}</div>
  </div>
);

export default DashboardCard;
