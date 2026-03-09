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

  // Gauge SVG params — compact
  const svgW = 180;
  const svgH = 105;
  const cx = svgW / 2;
  const cy = 95;
  const radius = 72;
  const strokeWidth = 18;
  const startAngle = 180;
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
  const needleLen = radius - 6;
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

  return (
    <div className="flex flex-col items-center gap-2 h-full">
      {/* Gauge */}
      <div className="relative flex-shrink-0" style={{ width: svgW, height: svgH }}>
        <svg width={svgW} height={svgH} viewBox={`0 0 ${svgW} ${svgH}`}>
          {/* Faixa arcs */}
          {faixaArcs.map(f => (
            <path
              key={f.faixa}
              d={describeArc(f.arcStart, f.arcEnd, radius)}
              fill="none"
              stroke={f.color}
              strokeWidth={strokeWidth}
              strokeLinecap="butt"
              opacity={faixaAtual?.faixa === f.faixa ? 1 : 0.35}
            />
          ))}
          {/* Needle */}
          <line x1={cx} y1={cy} x2={nx} y2={ny} stroke="hsl(var(--foreground))" strokeWidth={2} strokeLinecap="round" />
          <circle cx={cx} cy={cy} r={3.5} fill="hsl(var(--foreground))" />
          <circle cx={cx} cy={cy} r={1.5} fill="hsl(var(--background))" />
        </svg>
        {/* Central value */}
        <div className="absolute left-1/2 -translate-x-1/2" style={{ bottom: 2 }}>
          <p className="text-sm font-black text-foreground text-center leading-none tabular-nums">{formatCurrency(rbt12)}</p>
          <p className="text-[7px] text-muted-foreground text-center mt-0.5">RBT12</p>
        </div>
        {/* Min / Max labels */}
        <span className="absolute left-1 text-[7px] text-muted-foreground font-medium" style={{ bottom: 0 }}>
          {formatCurrency(0)}
        </span>
        <span className="absolute right-1 text-[7px] text-muted-foreground font-medium" style={{ bottom: 0 }}>
          {formatCurrency(maxRbt)}
        </span>
      </div>

      {/* Legend */}
      <div className="w-full space-y-0.5">
        {FAIXAS_ANEXO_III.map((f, i) => {
          const isAtual = faixaAtual?.faixa === f.faixa;
          return (
            <div key={f.faixa} className={`flex items-center gap-1.5 text-[9px] ${isAtual ? 'font-bold' : ''}`}>
              <span className="w-2 h-2 rounded-sm flex-shrink-0" style={{ backgroundColor: FAIXA_COLORS[i], opacity: isAtual ? 1 : 0.45 }} />
              <span className={`flex-1 ${isAtual ? 'text-foreground' : 'text-muted-foreground'}`}>
                {f.faixa}ª Faixa
              </span>
              <span className="text-muted-foreground tabular-nums">{(f.aliquotaNominal * 100).toFixed(1)}%</span>
              {isAtual && <span className="text-[7px] bg-accent text-accent-foreground px-1 py-0.5 rounded font-bold leading-none">ATUAL</span>}
            </div>
          );
        })}
        {faixaAtual && (
          <div className="pt-1 border-t border-border mt-0.5">
            <p className="text-[8px] text-muted-foreground">
              Margem p/ próxima faixa: <span className={`font-bold ${falta < 50000 ? 'text-destructive' : 'text-accent'}`}>{formatCurrency(falta)}</span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FaixaThermometer;
