import React, { useState, useMemo } from 'react';
import { calcularSimplesAnexoIII, formatCurrency, formatPercent } from '@/utils/simples-nacional';
import { Slider } from '@/components/ui/slider';

interface Props {
  rbt12: number;
  cnaeAnexo: string;
  faturamentoAtual: number;
}

const SimuladorCenario: React.FC<Props> = ({ rbt12, cnaeAnexo, faturamentoAtual }) => {
  const [simulado, setSimulado] = useState(faturamentoAtual);

  const resultado = useMemo(() => {
    const novoRbt12 = rbt12 - faturamentoAtual + simulado;
    return calcularSimplesAnexoIII(novoRbt12);
  }, [rbt12, faturamentoAtual, simulado]);

  const dasSimulado = resultado.valido ? simulado * resultado.aliquotaEfetiva : 0;
  const diff = dasSimulado - (faturamentoAtual * (calcularSimplesAnexoIII(rbt12).aliquotaEfetiva || 0));

  return (
    <div className="space-y-4">
      <div>
        <label className="text-[10px] text-muted-foreground uppercase tracking-wide">Faturamento Simulado</label>
        <p className="text-lg font-bold text-foreground">{formatCurrency(simulado)}</p>
      </div>
      <Slider
        value={[simulado]}
        onValueChange={([v]) => setSimulado(v)}
        min={0}
        max={Math.max(faturamentoAtual * 3, 30000)}
        step={100}
        className="w-full"
      />
      <div className="grid grid-cols-2 gap-3">
        <div>
          <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Alíq. Efetiva</p>
          <p className="text-sm font-bold text-primary">{resultado.valido ? formatPercent(resultado.aliquotaEfetiva) : '–'}</p>
        </div>
        <div>
          <p className="text-[10px] text-muted-foreground uppercase tracking-wide">DAS Estimado</p>
          <p className="text-sm font-bold text-destructive">{formatCurrency(dasSimulado)}</p>
        </div>
        <div>
          <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Faixa</p>
          <p className="text-sm font-bold text-foreground">{resultado.valido ? `${resultado.faixa?.faixa}ª` : '–'}</p>
        </div>
        <div>
          <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Impacto</p>
          <p className={`text-sm font-bold ${diff > 0 ? 'text-destructive' : 'text-primary'}`}>
            {diff >= 0 ? '+' : ''}{formatCurrency(diff)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default SimuladorCenario;
