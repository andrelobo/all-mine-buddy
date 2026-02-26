import React from 'react';
import { BarChart3 } from 'lucide-react';
import { type CalculoSimplesResult, formatCurrency, formatPercent } from '@/utils/simples-nacional';

interface Props {
  rbt12: number;
  cnaeAnexo: string;
  calculo: CalculoSimplesResult;
  visible: boolean;
}

const TickerItem: React.FC<{ label: string; value: string; highlight?: boolean }> = ({ label, value, highlight }) => (
  <div className={`flex items-center gap-1.5 px-3 py-0.5 whitespace-nowrap ${highlight ? 'bg-primary/10 rounded' : ''}`}>
    <span className={`text-[9px] uppercase tracking-wide ${highlight ? 'text-primary' : 'text-muted-foreground'}`}>{label}</span>
    <span className={`text-xs font-bold ${highlight ? 'text-primary text-sm' : 'text-foreground'}`}>{value}</span>
  </div>
);

const Separator = () => <span className="text-muted-foreground/30 select-none">│</span>;

const ResumoTributario: React.FC<Props> = ({ rbt12, cnaeAnexo, calculo, visible }) => {
  if (!visible || !calculo.valido || !calculo.faixa) return null;

  const items = (
    <>
      <div className="flex items-center gap-1.5 px-3">
        <BarChart3 className="w-3.5 h-3.5 text-primary" />
        <span className="text-[10px] font-semibold text-primary uppercase tracking-wider whitespace-nowrap">Analytics Dashboard</span>
      </div>
      <Separator />
      <TickerItem label="Anexo" value={cnaeAnexo || 'III'} highlight />
      <Separator />
      <TickerItem label="Faixa" value={`${calculo.faixa.faixa}ª`} />
      <Separator />
      <TickerItem label="RBT12" value={formatCurrency(rbt12)} />
      <Separator />
      <TickerItem label="ISS (%)" value={formatPercent(calculo.issReferencia)} />
      <Separator />
      <TickerItem label="Alíq. Efetiva" value={formatPercent(calculo.aliquotaEfetiva)} highlight />
    </>
  );

  return (
    <div className="w-full border-y border-primary/20 bg-gradient-to-r from-primary/5 via-card to-primary/5 overflow-hidden">
      <div className="ticker-track flex items-center py-1">
        <div className="ticker-content flex items-center gap-1 animate-ticker">
          {items}
        </div>
        <div className="ticker-content flex items-center gap-1 animate-ticker" aria-hidden>
          {items}
        </div>
      </div>
    </div>
  );
};

export default ResumoTributario;
