import React from 'react';
import { BarChart3, TrendingUp } from 'lucide-react';
import { type CalculoSimplesResult, formatCurrency, formatPercent, distanciaProximaFaixa } from '@/utils/simples-nacional';

interface Props {
  rbt12: number;
  cnaeAnexo: string;
  calculo: CalculoSimplesResult;
  visible: boolean;
}

const ResumoTributario: React.FC<Props> = ({ rbt12, cnaeAnexo, calculo, visible }) => {
  if (!visible || !calculo.valido || !calculo.faixa) return null;

  const distancia = distanciaProximaFaixa(rbt12);

  return (
    <div className="section-card">
      <h2 className="section-title">
        <BarChart3 className="w-5 h-5 text-primary" />
        Resumo Tributário
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="p-3 rounded-lg bg-muted/30 border border-border text-center">
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Anexo</p>
          <p className="text-lg font-bold text-primary">{cnaeAnexo || 'III'}</p>
        </div>

        <div className="p-3 rounded-lg bg-muted/30 border border-border text-center">
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Faixa</p>
          <p className="text-lg font-bold text-foreground">{calculo.faixa.faixa}ª</p>
        </div>

        <div className="p-3 rounded-lg bg-muted/30 border border-border text-center">
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">RBT12</p>
          <p className="text-sm font-bold text-foreground">{formatCurrency(rbt12)}</p>
        </div>

        <div className="p-3 rounded-lg bg-primary/10 border border-primary/30 text-center">
          <p className="text-[10px] uppercase tracking-wider text-primary mb-1">Alíq. Efetiva</p>
          <p className="text-xl font-bold text-primary">{formatPercent(calculo.aliquotaEfetiva)}</p>
        </div>

        <div className="p-3 rounded-lg bg-muted/30 border border-border text-center">
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">ISS Estimado</p>
          <p className="text-sm font-bold text-foreground">{formatPercent(calculo.issReferencia)}</p>
        </div>

        {distancia && (
          <div className="p-3 rounded-lg bg-accent/20 border border-accent/40 text-center">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Próx. Faixa</p>
            <div className="flex items-center justify-center gap-1">
              <TrendingUp className="w-3 h-3 text-accent-foreground" />
              <p className="text-sm font-bold text-accent-foreground">{formatCurrency(distancia.valor)}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResumoTributario;
