import React, { useState, useMemo, useCallback } from 'react';
import { calcularSimplesAnexoIII, formatCurrency, formatPercent } from '@/utils/simples-nacional';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';

interface Props {
  rbt12: number;
  cnaeAnexo: string;
  faturamentoAtual: number;
}

const formatBRL = (value: number): string =>
  value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const parseBRL = (raw: string): number => {
  const cleaned = raw.replace(/[^\d]/g, '');
  return cleaned ? parseInt(cleaned, 10) / 100 : 0;
};

const SimuladorCenario: React.FC<Props> = ({ rbt12, cnaeAnexo, faturamentoAtual }) => {
  const [simulado, setSimulado] = useState(faturamentoAtual);
  const [inputValue, setInputValue] = useState(formatBRL(faturamentoAtual));
  const [editing, setEditing] = useState(false);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const num = parseBRL(e.target.value);
    setInputValue(formatBRL(num));
    setSimulado(num);
  }, []);

  const handleSliderChange = useCallback(([v]: number[]) => {
    setSimulado(v);
    if (!editing) setInputValue(formatBRL(v));
  }, [editing]);

  const resultado = useMemo(() => {
    const novoRbt12 = rbt12 - faturamentoAtual + simulado;
    return calcularSimplesAnexoIII(novoRbt12, cnaeAnexo);
  }, [rbt12, faturamentoAtual, simulado, cnaeAnexo]);

  const dasSimulado = resultado.valido ? simulado * resultado.aliquotaEfetiva : 0;
  const diff = dasSimulado - (faturamentoAtual * (calcularSimplesAnexoIII(rbt12, cnaeAnexo).aliquotaEfetiva || 0));

  return (
    <div className="space-y-3">
      <div>
        <label className="text-[9px] text-muted-foreground uppercase tracking-wide">Faturamento Simulado</label>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-xs font-semibold text-muted-foreground">R$</span>
          <Input
            value={inputValue}
            onChange={handleInputChange}
            onFocus={() => setEditing(true)}
            onBlur={() => { setEditing(false); setInputValue(formatBRL(simulado)); }}
            className="h-7 text-sm font-bold tabular-nums text-foreground max-w-[160px]"
            inputMode="numeric"
          />
        </div>
      </div>
      <Slider
        value={[simulado]}
        onValueChange={handleSliderChange}
        min={0}
        max={Math.max(faturamentoAtual * 3, 30000)}
        step={100}
        className="w-full"
      />
      <div className="grid grid-cols-2 gap-2">
        <div>
          <p className="text-[9px] text-muted-foreground uppercase tracking-wide">Alíq. Efetiva</p>
          <p className="text-xs font-bold text-primary tabular-nums">{resultado.valido ? formatPercent(resultado.aliquotaEfetiva) : '–'}</p>
        </div>
        <div>
          <p className="text-[9px] text-muted-foreground uppercase tracking-wide">DAS Estimado</p>
          <p className="text-xs font-bold text-destructive tabular-nums">{formatCurrency(dasSimulado)}</p>
        </div>
        <div>
          <p className="text-[9px] text-muted-foreground uppercase tracking-wide">Faixa</p>
          <p className="text-xs font-bold text-foreground">{resultado.valido ? `${resultado.faixa?.faixa}ª` : '–'}</p>
        </div>
        <div>
          <p className="text-[9px] text-muted-foreground uppercase tracking-wide">Impacto</p>
          <p className={`text-xs font-bold tabular-nums ${diff > 0 ? 'text-destructive' : 'text-primary'}`}>
            {diff >= 0 ? '+' : ''}{formatCurrency(diff)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default SimuladorCenario;
