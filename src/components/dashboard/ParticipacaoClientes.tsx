import React from 'react';
import type { ClienteAnalise } from '@/hooks/useDashboardData';
import { formatCurrency } from '@/utils/simples-nacional';

const BAR_COLORS = [
  'hsl(160, 60%, 45%)', 'hsl(160, 40%, 60%)', 'hsl(220, 60%, 55%)',
  'hsl(38, 80%, 55%)', 'hsl(280, 50%, 55%)', 'hsl(340, 60%, 55%)',
];

interface Props {
  analiseClientes: ClienteAnalise[];
}

const ParticipacaoClientes: React.FC<Props> = ({ analiseClientes }) => {
  const top = analiseClientes.slice(0, 6);
  const maxPct = top.length > 0 ? Math.max(...top.map(c => c.percentual)) : 0;

  if (top.length === 0) {
    return <p className="text-[9px] text-muted-foreground text-center py-4">Sem dados de clientes</p>;
  }

  return (
    <div className="flex flex-col gap-1.5">
      {top.map((c, i) => {
        const barWidth = maxPct > 0 ? (c.percentual / maxPct) * 100 : 0;
        return (
          <div key={c.tomadorId} className="flex items-center gap-2 text-[9px]">
            <span className="w-24 truncate font-medium text-muted-foreground shrink-0" title={c.nome}>
              {c.nome.length > 14 ? c.nome.substring(0, 14) + '…' : c.nome}
            </span>
            <div className="flex-1 h-3.5 bg-muted/40 rounded-sm overflow-hidden">
              <div
                className="h-full rounded-sm transition-all"
                style={{ width: `${barWidth}%`, backgroundColor: BAR_COLORS[i % BAR_COLORS.length] }}
              />
            </div>
            <span className="w-10 text-right tabular-nums font-bold text-foreground">{c.percentual.toFixed(1)}%</span>
            <span className="w-16 text-right tabular-nums text-muted-foreground">{formatCurrency(c.faturamento)}</span>
          </div>
        );
      })}
    </div>
  );
};

export default ParticipacaoClientes;
