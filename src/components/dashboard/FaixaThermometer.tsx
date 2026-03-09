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
  const svgW = 160;
  const svgH = 90;
  const cx = svgW / 2;
  const cy = 82;
  const radius = 64;
  const strokeWidth = 16;
  const startAngle = 180;
  const totalAngle = 180;

  const faixaArcs = FAIXAS_ANEXO_III.map((f, i) => {
    const startPct = f.limiteInferior / maxRbt;
    const endPct = f.limiteSuperior / maxRbt;
    const arcStart = startAngle - startPct * totalAngle;
    const arcEnd = startAngle - endPct * totalAngle;
    return { ...f, index: i, arcStart, arcEnd, color: FAIXA_COLORS[i] };
  });

  // Needle
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

  const falta = faixaAtual ? faixaAtual.limiteSuperior - rbt12 : 0;

  return (
    <div className="h-full flex flex-col justify-between gap-1">
      {/* Gauge centrado */}
      <div className="flex justify-center">
        <div className="relative" style={{ width: svgW, height: svgH }}>
          <svg width={svgW} height={svgH} viewBox={`0 0 ${svgW} ${svgH}`}>
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
            <line x1={cx} y1={cy} x2={nx} y2={ny} stroke="hsl(var(--foreground))" strokeWidth={2} strokeLinecap="round" />
            <circle cx={cx} cy={cy} r={3} fill="hsl(var(--foreground))" />
            <circle cx={cx} cy={cy} r={1.5} fill="hsl(var(--background))" />
          </svg>
          {/* RBT12 value */}
          <div className="absolute left-1/2 -translate-x-1/2" style={{ bottom: 0 }}>
            <p className="text-xs font-black text-foreground text-center leading-none tabular-nums">{formatCurrency(rbt12)}</p>
            <p className="text-[7px] text-muted-foreground text-center">RBT12</p>
          </div>
          <span className="absolute left-0 text-[7px] text-muted-foreground" style={{ bottom: 0 }}>R$ 0</span>
          <span className="absolute right-0 text-[7px] text-muted-foreground" style={{ bottom: 0 }}>{formatCurrency(maxRbt)}</span>
        </div>
      </div>

      {/* Faixas legend — same row style as Partilha/Financeiro */}
      {FAIXAS_ANEXO_III.map((f, i) => {
        const isAtual = faixaAtual?.faixa === f.faixa;
        return (
          <div key={f.faixa} className={`flex items-center gap-2 text-[9px] ${isAtual ? 'font-bold' : ''}`}>
            <span className="w-2 h-2 rounded-sm flex-shrink-0" style={{ backgroundColor: FAIXA_COLORS[i], opacity: isAtual ? 1 : 0.45 }} />
            <span className={`w-14 shrink-0 ${isAtual ? 'text-foreground' : 'text-muted-foreground'}`}>
              {f.faixa}ª Faixa
            </span>
            <div className="flex-1" />
            <span className="w-10 text-right tabular-nums text-muted-foreground">{(f.aliquotaNominal * 100).toFixed(1)}%</span>
            {isAtual ? (
              <span className="w-12 text-right text-[7px] bg-accent text-accent-foreground px-1 py-0.5 rounded font-bold leading-none">ATUAL</span>
            ) : (
              <span className="w-12" />
            )}
          </div>
        );
      })}

      {/* Footer — margem */}
      {faixaAtual && (
        <div className="border-t border-border pt-1 flex items-center gap-2 text-[9px] font-bold mt-auto">
          <span className="shrink-0">MARGEM P/ PRÓXIMA FAIXA</span>
          <div className="flex-1" />
          <span className={`tabular-nums ${falta < 50000 ? 'text-destructive' : 'text-accent'}`}>{formatCurrency(falta)}</span>
        </div>
      )}
    </div>
  );
};

export default FaixaThermometer;
