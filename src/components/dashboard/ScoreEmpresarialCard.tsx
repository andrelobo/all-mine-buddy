import React, { useMemo } from 'react';
import DashboardCard from './DashboardCard';

interface Props {
  aliquotaEfetiva: number;
  margemLiquida: number;
  faturamentoMes: number;
  dasAPagar: number;
  totalRetencoes: number;
  rbt12: number;
}

const ScoreEmpresarialCard: React.FC<Props> = ({
  aliquotaEfetiva, margemLiquida, faturamentoMes, dasAPagar, totalRetencoes, rbt12,
}) => {
  const score = useMemo(() => {
    let s = 500;
    // Margem líquida: maior = melhor
    if (margemLiquida > 40) s += 100;
    else if (margemLiquida > 25) s += 60;
    else if (margemLiquida > 15) s += 30;
    else if (margemLiquida < 10) s -= 40;

    // Alíquota efetiva baixa = bom
    if (aliquotaEfetiva < 0.06) s += 80;
    else if (aliquotaEfetiva < 0.10) s += 40;
    else if (aliquotaEfetiva > 0.15) s -= 30;

    // Faturamento ativo
    if (faturamentoMes > 0) s += 50;

    // Retenções controladas
    if (totalRetencoes < dasAPagar * 0.3) s += 20;

    return Math.max(300, Math.min(900, s));
  }, [aliquotaEfetiva, margemLiquida, faturamentoMes, dasAPagar, totalRetencoes]);

  const scoreLabel = score >= 750 ? 'Excelente' : score >= 650 ? 'Saudável' : score >= 500 ? 'Regular' : 'Atenção';
  const scoreColor = score >= 750 ? 'text-primary' : score >= 650 ? 'text-accent' : score >= 500 ? 'text-[hsl(38,80%,55%)]' : 'text-destructive';

  const risco = aliquotaEfetiva < 0.08 ? 'Baixo' : aliquotaEfetiva < 0.13 ? 'Médio' : 'Alto';
  const riscoColor = risco === 'Baixo' ? 'text-primary' : risco === 'Médio' ? 'text-[hsl(38,80%,55%)]' : 'text-destructive';

  const endividamento = dasAPagar > faturamentoMes * 0.2 ? 'Alto' : dasAPagar > faturamentoMes * 0.1 ? 'Médio' : 'Baixo';
  const endividamentoColor = endividamento === 'Baixo' ? 'text-primary' : endividamento === 'Médio' ? 'text-[hsl(38,80%,55%)]' : 'text-destructive';

  const crescimento = margemLiquida > 30 ? 'Alto' : margemLiquida > 15 ? 'Médio' : 'Baixo';
  const crescimentoColor = crescimento === 'Alto' ? 'text-primary' : crescimento === 'Médio' ? 'text-[hsl(38,80%,55%)]' : 'text-destructive';

  const compliance = totalRetencoes >= 0 ? 'Excelente' : 'Regular';
  const complianceColor = compliance === 'Excelente' ? 'text-primary' : 'text-[hsl(38,80%,55%)]';

  // Gauge arc
  const gaugeAngle = ((score - 300) / 600) * 180; // 300-900 mapped to 0-180

  return (
    <DashboardCard title="Score Empresarial Fiscal" headerColor="blue">
      <div className="flex flex-col items-center gap-3">
        {/* Gauge */}
        <div className="relative w-40 h-24">
          <svg viewBox="0 0 200 110" className="w-full h-full">
            {/* Background arc */}
            <path
              d="M 20 100 A 80 80 0 0 1 180 100"
              fill="none"
              stroke="hsl(var(--muted))"
              strokeWidth="16"
              strokeLinecap="round"
            />
            {/* Colored segments */}
            <path d="M 20 100 A 80 80 0 0 1 60 38" fill="none" stroke="hsl(0, 70%, 55%)" strokeWidth="16" strokeLinecap="round" />
            <path d="M 60 38 A 80 80 0 0 1 100 20" fill="none" stroke="hsl(38, 80%, 55%)" strokeWidth="16" />
            <path d="M 100 20 A 80 80 0 0 1 140 38" fill="none" stroke="hsl(48, 80%, 55%)" strokeWidth="16" />
            <path d="M 140 38 A 80 80 0 0 1 180 100" fill="none" stroke="hsl(160, 60%, 45%)" strokeWidth="16" strokeLinecap="round" />
            {/* Needle */}
            <line
              x1="100" y1="100"
              x2={100 + 65 * Math.cos(Math.PI - (gaugeAngle * Math.PI) / 180)}
              y2={100 - 65 * Math.sin(Math.PI - (gaugeAngle * Math.PI) / 180)}
              stroke="hsl(var(--foreground))"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            <circle cx="100" cy="100" r="5" fill="hsl(var(--foreground))" />
          </svg>
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 text-center">
            <span className={`text-2xl font-black tabular-nums ${scoreColor}`}>{score}</span>
          </div>
        </div>
        <span className={`text-xs font-bold ${scoreColor} -mt-1`}>{scoreLabel}</span>

        {/* Indicadores */}
        <div className="w-full space-y-1.5 pt-1 border-t border-border">
          <IndicatorRow icon="🛡️" label="Risco Tributário" value={risco} color={riscoColor} />
          <IndicatorRow icon="📊" label="Endividamento" value={endividamento} color={endividamentoColor} />
          <IndicatorRow icon="📈" label="Crescimento" value={crescimento} color={crescimentoColor} />
          <IndicatorRow icon="✅" label="Compliance" value={compliance} color={complianceColor} />
        </div>
      </div>
    </DashboardCard>
  );
};

const IndicatorRow: React.FC<{ icon: string; label: string; value: string; color: string }> = ({ icon, label, value, color }) => (
  <div className="flex items-center justify-between text-[10px]">
    <span className="text-muted-foreground flex items-center gap-1.5">
      <span className="text-xs">{icon}</span> {label}
    </span>
    <span className={`font-bold ${color}`}>{value}</span>
  </div>
);

export default ScoreEmpresarialCard;
