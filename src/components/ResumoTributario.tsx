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
    <div className="rounded-xl border border-primary/20 bg-gradient-to-r from-primary/5 via-card to-primary/5 p-3 shadow-sm">
      <div className="flex items-center gap-2 mb-2">
        <BarChart3 className="w-4 h-4 text-primary" />
        <h2 className="text-xs font-semibold text-primary uppercase tracking-wider">Dashboard Tributário</h2>
      </div>

      <div className="grid grid-cols-3 md:grid-cols-5 gap-2">
        <div className="p-2 rounded-lg bg-card border border-border text-center">
          <p className="text-[9px] uppercase tracking-wider text-muted-foreground mb-0.5">Anexo</p>
          <p className="text-base font-bold text-primary">{cnaeAnexo || 'III'}</p>
        </div>

        <div className="p-2 rounded-lg bg-card border border-border text-center">
          <p className="text-[9px] uppercase tracking-wider text-muted-foreground mb-0.5">Faixa</p>
          <p className="text-base font-bold text-foreground">{calculo.faixa.faixa}ª</p>
        </div>

        <div className="p-2 rounded-lg bg-card border border-border text-center">
          <p className="text-[9px] uppercase tracking-wider text-muted-foreground mb-0.5">RBT12</p>
          <p className="text-xs font-bold text-foreground">{formatCurrency(rbt12)}</p>
        </div>

        <div className="p-2 rounded-lg bg-primary/10 border border-primary/30 text-center">
          <p className="text-[9px] uppercase tracking-wider text-primary mb-0.5">Alíq. Efetiva</p>
          <p className="text-lg font-bold text-primary">{formatPercent(calculo.aliquotaEfetiva)}</p>
        </div>

        <div className="p-2 rounded-lg bg-card border border-border text-center">
          <p className="text-[9px] uppercase tracking-wider text-muted-foreground mb-0.5">ISS Estimado</p>
          <p className="text-xs font-bold text-foreground">{formatPercent(calculo.issReferencia)}</p>
        </div>
      </div>
    </div>
  );
};

export default ResumoTributario;
