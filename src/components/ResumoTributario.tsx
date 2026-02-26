import React from 'react';
import { BarChart3 } from 'lucide-react';
import { type CalculoSimplesResult, formatCurrency, formatPercent } from '@/utils/simples-nacional';

interface Props {
  rbt12: number;
  cnaeAnexo: string;
  calculo: CalculoSimplesResult;
  visible: boolean;
}

const ResumoTributario: React.FC<Props> = ({ rbt12, cnaeAnexo, calculo, visible }) => {
  if (!visible || !calculo.valido || !calculo.faixa) return null;

  return (
    <div className="rounded-lg border border-primary/20 bg-gradient-to-r from-primary/5 via-card to-primary/5 px-3 py-1.5 shadow-sm">
      <div className="flex items-center gap-4 flex-wrap">
        <div className="flex items-center gap-1.5">
          <BarChart3 className="w-3.5 h-3.5 text-primary" />
          <span className="text-[10px] font-semibold text-primary uppercase tracking-wider">Dashboard</span>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-1">
            <span className="text-[9px] uppercase text-muted-foreground">Anexo</span>
            <span className="text-xs font-bold text-primary">{cnaeAnexo || 'III'}</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-[9px] uppercase text-muted-foreground">Faixa</span>
            <span className="text-xs font-bold text-foreground">{calculo.faixa.faixa}ª</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-[9px] uppercase text-muted-foreground">RBT12</span>
            <span className="text-xs font-bold text-foreground">{formatCurrency(rbt12)}</span>
          </div>
          <div className="flex items-center gap-1 bg-primary/10 rounded px-1.5 py-0.5">
            <span className="text-[9px] uppercase text-primary">Alíq.</span>
            <span className="text-sm font-bold text-primary">{formatPercent(calculo.aliquotaEfetiva)}</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-[9px] uppercase text-muted-foreground">ISS</span>
            <span className="text-xs font-bold text-foreground">{formatPercent(calculo.issReferencia)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumoTributario;
