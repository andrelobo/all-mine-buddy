import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, Legend } from 'recharts';
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
    nome: c.nome.length > 10 ? c.nome.substring(0, 10) + '…' : c.nome,
    nomeCompleto: c.nome,
    receita: c.faturamento,
    tributos: +(c.faturamento * aliquotaEfetiva).toFixed(2),
    percentual: c.percentual,
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
        <p style={{ color: COR_TRIBUTO }}>Tributos: {formatCurrency(d.tributos)} ({(aliquotaEfetiva * 100).toFixed(2)}%)</p>
        <p className="text-muted-foreground">Participação: {d.percentual.toFixed(1)}%</p>
      </div>
    );
  };

  return (
    <div className="w-full" style={{ height: 160 }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={top} margin={{ top: 16, right: 4, bottom: 2, left: 0 }} barGap={1} barCategoryGap="20%">
          <XAxis
            dataKey="nome"
            tick={{ fontSize: 7, fill: 'hsl(var(--muted-foreground))' }}
            axisLine={false}
            tickLine={false}
            interval={0}
          />
          <YAxis
            tick={{ fontSize: 7, fill: 'hsl(var(--muted-foreground))' }}
            axisLine={false}
            tickLine={false}
            width={32}
            tickFormatter={(v: number) => v >= 1000 ? `${(v / 1000).toFixed(0)}k` : String(v)}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'hsl(var(--muted) / 0.3)' }} />
          <Legend iconSize={6} wrapperStyle={{ fontSize: 8, paddingTop: 2 }} />
          <Bar
            dataKey="receita"
            name="Receita"
            fill={COR_RECEITA}
            radius={[3, 3, 0, 0]}
            barSize={10}
            animationDuration={800}
          />
          <Bar
            dataKey="tributos"
            name="Tributos"
            fill={COR_TRIBUTO}
            radius={[3, 3, 0, 0]}
            barSize={10}
            animationDuration={800}
            animationBegin={200}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ParticipacaoClientes;
