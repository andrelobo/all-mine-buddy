import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import type { ClienteAnalise } from '@/hooks/useDashboardData';
import { formatCurrency } from '@/utils/simples-nacional';

const COR_RECEITA = 'hsl(220, 60%, 55%)';
const COR_TRIBUTO = 'hsl(0, 65%, 50%)';

interface Props {
  analiseClientes: ClienteAnalise[];
  aliquotaEfetiva?: number;
}

const ParticipacaoClientes: React.FC<Props> = ({ analiseClientes, aliquotaEfetiva = 0 }) => {
  const top = analiseClientes.slice(0, 6).map(c => ({
    nome: c.nome.length > 12 ? c.nome.substring(0, 12) + '…' : c.nome,
    nomeCompleto: c.nome,
    receita: c.faturamento,
    tributos: +(c.faturamento * aliquotaEfetiva).toFixed(2),
  }));

  if (top.length === 0) {
    return <p className="text-[9px] text-muted-foreground text-center py-4">Sem dados de clientes</p>;
  }

  const CustomTooltip = ({ active, payload }: any) => {
    if (!active || !payload?.[0]) return null;
    const d = payload[0].payload;
    return (
      <div className="rounded-md border border-border bg-popover px-2.5 py-1.5 shadow-md text-[10px] space-y-0.5">
        <p className="font-bold text-foreground">{d.nomeCompleto}</p>
        <p style={{ color: COR_RECEITA }}>Receita: {formatCurrency(d.receita)}</p>
        <p style={{ color: COR_TRIBUTO }}>Tributos: {formatCurrency(d.tributos)}</p>
      </div>
    );
  };

  const chartHeight = Math.max(140, top.length * 36 + 40);

  return (
    <div className="w-full" style={{ height: chartHeight }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={top} layout="vertical" margin={{ top: 4, right: 60, bottom: 4, left: 4 }} barGap={1}>
          <XAxis
            type="number"
            tick={{ fontSize: 7, fill: 'hsl(var(--muted-foreground))' }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v: number) => v >= 1000 ? `${(v / 1000).toFixed(0)}k` : String(v)}
          />
          <YAxis
            type="category"
            dataKey="nome"
            tick={false}
            axisLine={false}
            tickLine={false}
            width={4}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'hsl(var(--muted) / 0.3)' }} />
          <Legend iconSize={8} wrapperStyle={{ fontSize: 9 }} />
          <Bar
            dataKey="receita"
            name="Receita"
            fill={COR_RECEITA}
            radius={[0, 3, 3, 0]}
            barSize={10}
            animationDuration={800}
            label={({ x, y, width, height, value }: any) => (
              <text x={x + width + 3} y={y + height / 2 + 1} textAnchor="start" dominantBaseline="central" fontSize={6} fontWeight="bold" fill={COR_RECEITA}>
                {formatCurrency(value)}
              </text>
            )}
          />
          <Bar
            dataKey="tributos"
            name="Tributos"
            fill={COR_TRIBUTO}
            radius={[0, 3, 3, 0]}
            barSize={10}
            animationDuration={800}
            animationBegin={200}
            label={({ x, y, width, height, value }: any) => (
              <text x={x + width + 3} y={y + height / 2 + 1} textAnchor="start" dominantBaseline="central" fontSize={6} fontWeight="bold" fill={COR_TRIBUTO}>
                {formatCurrency(value)}
              </text>
            )}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ParticipacaoClientes;
