import React from 'react';
import { formatCurrency } from '@/utils/simples-nacional';
import DashboardCard from './DashboardCard';
import { Button } from '@/components/ui/button';

interface Props {
  recebimentos: number;
  separadoImpostos: number;
  disponivelUso: number;
}

const SplitImpostosCard: React.FC<Props> = ({ recebimentos, separadoImpostos, disponivelUso }) => {
  return (
    <DashboardCard title="Split de Impostos" headerColor="green">
      <div className="space-y-3">
        <SplitRow label="Recebimentos do Mês" value={formatCurrency(recebimentos)} color="text-foreground" />

        <div className="p-2.5 rounded-lg bg-destructive/5 border border-destructive/10">
          <SplitRow label="Separado para Impostos" value={formatCurrency(separadoImpostos)} color="text-destructive" />
        </div>

        <div className="p-2.5 rounded-lg bg-accent/5 border border-accent/10">
          <SplitRow label="Disponível para Uso" value={formatCurrency(disponivelUso)} color="text-primary" large />
        </div>

        <div className="flex gap-2 pt-1">
          <Button size="sm" variant="outline" className="flex-1 text-[10px] h-8 border-primary text-primary hover:bg-primary/5">
            Transferir Impostos
          </Button>
          <Button size="sm" className="flex-1 text-[10px] h-8 bg-primary hover:bg-primary/90">
            Pagar Guia
          </Button>
        </div>
      </div>
    </DashboardCard>
  );
};

const SplitRow: React.FC<{ label: string; value: string; color: string; large?: boolean }> = ({ label, value, color, large }) => (
  <div className="flex items-center justify-between">
    <span className="text-[10px] text-muted-foreground">{label}</span>
    <span className={`${large ? 'text-base' : 'text-sm'} font-bold tabular-nums ${color}`}>{value}</span>
  </div>
);

export default SplitImpostosCard;
