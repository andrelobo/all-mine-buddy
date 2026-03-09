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
  'hsl(80, 55%, 50%)',
  'hsl(38, 70%, 55%)',
  'hsl(15, 70%, 50%)',
  'hsl(0, 65%, 50%)',
];

const FaixaThermometer: React.FC<Props> = ({ rbt12, calculo }) => {
  const maxRbt = FAIXAS_ANEXO_III[FAIXAS_ANEXO_III.length - 1].limiteSuperior;
  const faixaAtual = calculo.faixa;

  // Gauge SVG params
  const cx = 110;
  const cy = 110;
  const radius = 85;
  const strokeWidth = 22;
  const startAngle = 180;
  const endAngle = 0;
  const totalAngle = 180;

  // Build arcs for each faixa
  const faixaArcs = FAIXAS_ANEXO_III.map((f, i) => {
    const startPct = f.limiteInferior / maxRbt;
    const endPct = f.limiteSuperior / maxRbt;
    const arcStart = startAngle - startPct * totalAngle;
    const arcEnd = startAngle - endPct * totalAngle;
    return { ...f, index: i, arcStart, arcEnd, color: FAIXA_COLORS[i] };
  });

  // Needle angle
  const needlePct = Math.min(rbt12 / maxRbt, 1);
  const needleAngle = startAngle - needlePct * totalAngle;
  const needleRad = (needleAngle * Math.PI) / 180;
  const needleLen = radius - 8;
  const nx = cx + needleLen * Math.cos(needleRad);
  const ny = cy - needleLen * Math.sin(needleRad);

  const describeArc = (startA: number, endA: number, r: number) => {
    const s = (startA * Math.PI) / 180;
    const e = (endA * Math.PI) / 180;
    const x1 = cx + r * Math.cos(s);
    const y1 = cy - r * Math.sin(s);
    const x2 = cx + r * Math.cos(e);
    const y2 = cy - r * Math.sin(e);
    const largeArc = Math.abs(startA - endA) > 180 ? 1 : 0;
    return `M ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2}`;
  };

  // Margem para próxima faixa
  const falta = faixaAtual ? faixaAtual.limiteSuperior - rbt12 : 0;
  const limiteInf = faixaAtual ? formatCurrency(faixaAtual.limiteInferior) : '';
  const limiteSup = faixaAtual ? formatCurrency(faixaAtual.limiteSuperior) : '';

  return (
    <div className="flex items-center gap-4">
      {/* Gauge */}
      <div className="relative flex-shrink-0" style={{ width: 220, height: 130 }}>
        <svg width="220" height="130" viewBox="0 0 220 130">
          {/* Faixa arcs */}
          {faixaArcs.map(f => (
            <path
              key={f.faixa}
              d={describeArc(f.arcStart, f.arcEnd, radius)}
              fill="none"
              stroke={f.color}
              strokeWidth={strokeWidth}
              strokeLinecap="butt"
              opacity={faixaAtual?.faixa === f.faixa ? 1 : 0.4}
            />
          ))}
          {/* Needle */}
          <line x1={cx} y1={cy} x2={nx} y2={ny} stroke="hsl(var(--foreground))" strokeWidth={2} strokeLinecap="round" />
          <circle cx={cx} cy={cy} r={4} fill="hsl(var(--foreground))" />
          <circle cx={cx} cy={cy} r={2} fill="hsl(var(--background))" />
        </svg>
        {/* Central value */}
        <div className="absolute left-1/2 -translate-x-1/2" style={{ bottom: 6 }}>
          <p className="text-base font-black text-foreground text-center leading-none tabular-nums">{formatCurrency(rbt12)}</p>
          <p className="text-[8px] text-muted-foreground text-center mt-0.5">RBT12</p>
        </div>
        {/* Min / Max labels */}
        <span className="absolute left-0.5 text-[8px] text-muted-foreground font-medium" style={{ bottom: 0 }}>
          {formatCurrency(0)}
        </span>
        <span className="absolute right-0.5 text-[8px] text-muted-foreground font-medium" style={{ bottom: 0 }}>
          {formatCurrency(maxRbt)}
        </span>
      </div>

      {/* Legend + info */}
      <div className="flex-1 space-y-2">
        <p className="text-[10px] text-muted-foreground uppercase font-semibold tracking-wide">Faixas</p>
        {FAIXAS_ANEXO_III.map((f, i) => {
          const isAtual = faixaAtual?.faixa === f.faixa;
          return (
            <div key={f.faixa} className={`flex items-center gap-2 text-xs ${isAtual ? 'font-bold' : ''}`}>
              <span className="w-3 h-3 rounded-sm flex-shrink-0" style={{ backgroundColor: FAIXA_COLORS[i], opacity: isAtual ? 1 : 0.5 }} />
              <span className={`flex-1 ${isAtual ? 'text-foreground' : 'text-muted-foreground'}`}>
                {f.faixa}ª Faixa
              </span>
              <span className="text-muted-foreground">{(f.aliquotaNominal * 100).toFixed(1)}%</span>
              {isAtual && <span className="text-[8px] bg-accent text-accent-foreground px-1.5 py-0.5 rounded font-bold">ATUAL</span>}
            </div>
          );
        })}
        {faixaAtual && (
          <div className="pt-2 border-t border-border mt-1">
            <p className="text-[10px] text-muted-foreground">
              Margem: <span className={`font-bold ${falta < 50000 ? 'text-destructive' : 'text-accent'}`}>{formatCurrency(falta)}</span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FaixaThermometer;
