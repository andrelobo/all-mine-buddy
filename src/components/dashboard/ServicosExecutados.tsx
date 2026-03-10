import React, { useMemo } from 'react';
import type { NotaDashboard } from '@/hooks/useDashboardData';
import { formatCurrency } from '@/utils/simples-nacional';

interface Props {
  notas: NotaDashboard[];
  mesCompetencia: string;
}

const COR_BAR = 'hsl(220, 60%, 55%)';

interface ServicoAgregado {
  descricao: string;
  qtd: number;
  receita: number;
  percentual: number;
}

const ServicosExecutados: React.FC<Props> = ({ notas, mesCompetencia }) => {
  const dados = useMemo<ServicoAgregado[]>(() => {
    const notasMes = notas.filter(n => {
      const d = new Date(n.data_emissao);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      return key === mesCompetencia;
    });

    const map = new Map<string, { qtd: number; receita: number }>();
    notasMes.forEach(n => {
      // Use first ~40 chars of description as key for grouping
      const desc = (n as any).descricao_servico || 'Serviço não especificado';
      const key = desc.length > 50 ? desc.substring(0, 50) : desc;
      if (!map.has(key)) map.set(key, { qtd: 0, receita: 0 });
      const entry = map.get(key)!;
      entry.qtd += 1;
      entry.receita += n.valor_servico;
    });

    const totalReceita = Array.from(map.values()).reduce((s, e) => s + e.receita, 0);

    return Array.from(map.entries())
      .map(([desc, e]) => ({
        descricao: desc,
        qtd: e.qtd,
        receita: e.receita,
        percentual: totalReceita > 0 ? (e.receita / totalReceita) * 100 : 0,
      }))
      .sort((a, b) => b.receita - a.receita);
  }, [notas, mesCompetencia]);

  if (dados.length === 0) {
    return <p className="text-[9px] text-muted-foreground text-center py-4">Sem serviços no período</p>;
  }

  const maxReceita = Math.max(...dados.map(d => d.receita));

  return (
    <div className="flex flex-col gap-2">
      {dados.map((s, i) => {
        const barWidth = maxReceita > 0 ? (s.receita / maxReceita) * 100 : 0;
        return (
          <div key={i} className="space-y-0.5">
            <div className="flex items-start justify-between gap-2">
              <span className="text-[8px] font-semibold text-foreground leading-tight flex-1">{s.descricao}</span>
              <span className="text-[8px] text-muted-foreground shrink-0">{s.qtd} NF{s.qtd > 1 ? 's' : ''}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="flex-1 h-2.5 bg-muted/40 rounded-sm overflow-hidden">
                <div className="h-full rounded-sm transition-all" style={{ width: `${barWidth}%`, backgroundColor: COR_BAR }} />
              </div>
              <span className="text-[7px] font-bold tabular-nums shrink-0" style={{ color: COR_BAR }}>
                {formatCurrency(s.receita)}
              </span>
              <span className="text-[7px] text-muted-foreground tabular-nums shrink-0">
                {s.percentual.toFixed(0)}%
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ServicosExecutados;
