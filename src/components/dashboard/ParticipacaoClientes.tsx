import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import type { ClienteAnalise } from '@/hooks/useDashboardData';
import { formatCurrency } from '@/utils/simples-nacional';

const BAR_COLORS = [
  'hsl(160, 60%, 45%)',
  'hsl(220, 60%, 55%)',
  'hsl(38, 80%, 55%)',
  'hsl(280, 50%, 55%)',
  'hsl(340, 60%, 55%)',
  'hsl(200, 50%, 55%)',
];

interface Props {
  analiseClientes: ClienteAnalise[];
}

const ParticipacaoClientes: React.FC<Props> = ({ analiseClientes }) => {
  const top = analiseClientes.slice(0, 6).map((c, i) => ({
    nome: c.nome.length > 10 ? c.nome.substring(0, 10) + '…' : c.nome,
    nomeCompleto: c.nome,
    percentual: +c.percentual.toFixed(1),
    faturamento: c.faturamento,
    cor: BAR_COLORS[i % BAR_COLORS.length],
  }));

  if (top.length === 0) {
    return <p className="text-[9px] text-muted-foreground text-center py-4">Sem dados de clientes</p>;
  }

  const CustomTooltip = ({ active, payload }: any) => {
    if (!active || !payload?.[0]) return null;
    const d = payload[0].payload;
    return (
      <div className="rounded-md border border-border bg-popover px-2.5 py-1.5 shadow-md text-[10px]">
        <p className="font-bold text-foreground">{d.nomeCompleto}</p>
        <p className="text-muted-foreground">{d.percentual}% — {formatCurrency(d.faturamento)}</p>
      </div>
    );
  };

  return (
    <div className="w-full" style={{ height: Math.max(160, top.length * 10 + 60) }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={top} margin={{ top: 28, right: 8, bottom: 4, left: 0 }}>
          <XAxis
            dataKey="nome"
            tick={{ fontSize: 8, fill: 'hsl(var(--muted-foreground))' }}
            axisLine={false}
            tickLine={false}
            interval={0}
          />
          <YAxis
            tick={{ fontSize: 8, fill: 'hsl(var(--muted-foreground))' }}
            axisLine={false}
            tickLine={false}
            unit="%"
            width={32}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'hsl(var(--muted) / 0.3)' }} />
          <Bar dataKey="percentual" radius={[4, 4, 0, 0]} animationDuration={800} animationBegin={100} barSize={14}
            label={({ x, y, width, value, index }: any) => {
              const entry = top[index];
              if (!entry) return null;
              return (
                <g>
                  <text x={x + width / 2} y={y - 14} textAnchor="middle" fontSize={7} fontWeight="bold" fill="hsl(var(--foreground))">
                    {entry.nome}
                  </text>
                  <text x={x + width / 2} y={y - 5} textAnchor="middle" fontSize={7} fill="hsl(var(--muted-foreground))">
                    {value}%
                  </text>
                </g>
              );
            }}
          >
            {top.map((entry, idx) => (
              <Cell key={idx} fill={entry.cor} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ParticipacaoClientes;
