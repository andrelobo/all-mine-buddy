import React from 'react';
import { FAIXAS_ANEXO_III, formatCurrency } from '@/utils/simples-nacional';
import type { CalculoSimplesResult } from '@/utils/simples-nacional';

interface Props {
  rbt12: number;
  calculo: CalculoSimplesResult;
}

const FAIXA_COLORS = [
  'hsl(160, 60%, 50%)',
  'hsl(160, 50%, 60%)',
  'hsl(38, 70%, 55%)',
  'hsl(30, 80%, 50%)',
  'hsl(15, 70%, 50%)',
  'hsl(0, 65%, 50%)',
];

const FaixaThermometer: React.FC<Props> = ({ rbt12, calculo }) => {
  const maxRbt = FAIXAS_ANEXO_III[FAIXAS_ANEXO_III.length - 1].limiteSuperior;
  const posicaoPct = Math.min((rbt12 / maxRbt) * 100, 100);
  const faixaAtual = calculo.faixa;

  return (
    <div className="space-y-3">
      {/* Thermometer bar */}
      <div className="relative">
        <div className="flex h-6 rounded-full overflow-hidden border border-border">
          {FAIXAS_ANEXO_III.map((f, i) => {
            const width = ((f.limiteSuperior - f.limiteInferior) / maxRbt) * 100;
            const isAtual = faixaAtual?.faixa === f.faixa;
            return (
              <div
                key={f.faixa}
                className={`relative flex items-center justify-center text-[8px] font-bold text-white transition-all ${isAtual ? 'ring-2 ring-foreground ring-inset' : ''}`}
                style={{ width: `${width}%`, backgroundColor: FAIXA_COLORS[i] }}
                title={`${f.faixa}ª Faixa: ${formatCurrency(f.limiteInferior)} - ${formatCurrency(f.limiteSuperior)}`}
              >
                {f.faixa}ª
              </div>
            );
          })}
        </div>
        {/* Needle indicator */}
        <div
          className="absolute -top-1 w-0.5 h-8 bg-foreground rounded-full transition-all"
          style={{ left: `${posicaoPct}%` }}
        >
          <div className="absolute -top-5 left-1/2 -translate-x-1/2 whitespace-nowrap bg-foreground text-background text-[9px] font-bold px-1.5 py-0.5 rounded">
            {formatCurrency(rbt12)}
          </div>
        </div>
      </div>

      {/* Faixa details */}
      <div className="grid grid-cols-6 gap-1">
        {FAIXAS_ANEXO_III.map((f, i) => {
          const isAtual = faixaAtual?.faixa === f.faixa;
          return (
            <div
              key={f.faixa}
              className={`text-center p-1.5 rounded text-[9px] ${isAtual ? 'bg-accent/15 ring-1 ring-accent font-bold' : 'bg-muted/50'}`}
            >
              <div className="font-bold" style={{ color: FAIXA_COLORS[i] }}>{(f.aliquotaNominal * 100).toFixed(1)}%</div>
              <div className="text-muted-foreground mt-0.5">até {(f.limiteSuperior / 1000).toFixed(0)}k</div>
            </div>
          );
        })}
      </div>

      {/* Distance to next */}
      {faixaAtual && (() => {
        const proxima = FAIXAS_ANEXO_III.find(f => f.faixa === faixaAtual.faixa + 1);
        const falta = faixaAtual.limiteSuperior - rbt12;
        const progressoPct = ((rbt12 - faixaAtual.limiteInferior) / (faixaAtual.limiteSuperior - faixaAtual.limiteInferior)) * 100;
        return (
          <div className="flex items-center gap-3 text-xs">
            <div className="flex-1">
              <div className="flex justify-between text-[10px] text-muted-foreground mb-1">
                <span>Faixa {faixaAtual.faixa}ª</span>
                <span>{progressoPct.toFixed(0)}% utilizado</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${Math.min(progressoPct, 100)}%`,
                    backgroundColor: progressoPct > 85 ? 'hsl(0, 65%, 50%)' : 'hsl(160, 60%, 45%)',
                  }}
                />
              </div>
            </div>
            {proxima && (
              <div className="text-right">
                <span className="text-muted-foreground text-[10px]">Margem: </span>
                <span className={`font-bold ${falta < 50000 ? 'text-destructive' : 'text-accent'}`}>
                  {formatCurrency(falta)}
                </span>
              </div>
            )}
          </div>
        );
      })()}
    </div>
  );
};

export default FaixaThermometer;
