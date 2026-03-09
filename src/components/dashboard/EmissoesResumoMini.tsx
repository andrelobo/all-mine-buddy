import React, { useMemo } from 'react';
import type { NotaDashboard } from '@/hooks/useDashboardData';

interface Props {
  notas: NotaDashboard[];
  tomadores: Record<string, string>;
  aliquotaEfetiva: number;
  mesCompetencia: string;
}

function fmt(v: number) {
  return v.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

const EmissoesResumoMini: React.FC<Props> = ({ notas, tomadores, aliquotaEfetiva, mesCompetencia }) => {
  const linhas = useMemo(() => {
    // Filter notas for the current competência
    const notasMes = notas.filter(n => {
      const d = new Date(n.data_emissao);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      return key === mesCompetencia;
    });

    const totalGeral = notasMes.reduce((s, n) => s + n.valor_servico, 0);

    return notasMes.map(n => {
      const d = new Date(n.data_emissao);
      const dataFmt = `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}`;
      const nome = tomadores[n.tomador_id || ''] || 'Sem tomador';
      const vs = n.valor_servico;
      const issRet = n.iss_retido ? n.iss_valor : 0;
      const aliqIss = n.iss_retido ? n.aliquota : 0;
      const simples = vs * aliquotaEfetiva;
      const das = Math.max(simples - issRet, 0);
      const percentual = totalGeral > 0 ? (vs / totalGeral) * 100 : 0;

      return { dataFmt, nome, vs, issRet, aliqIss, simples, das, percentual };
    });
  }, [notas, tomadores, aliquotaEfetiva, mesCompetencia]);

  if (linhas.length === 0) return null;

  const totais = linhas.reduce(
    (acc, l) => ({
      vs: acc.vs + l.vs,
      issRet: acc.issRet + l.issRet,
      simples: acc.simples + l.simples,
      das: acc.das + l.das,
      percentual: acc.percentual + l.percentual,
    }),
    { vs: 0, issRet: 0, simples: 0, das: 0, percentual: 0 },
  );

  return (
    <div className="border-t border-border pt-1.5 mt-1.5">
      <p className="text-[8px] font-bold text-muted-foreground uppercase tracking-wide mb-1">Emissões</p>
      <div className="space-y-0.5">
        {/* Header */}
        <div className="flex items-center gap-1 text-[7px] font-semibold text-muted-foreground uppercase">
          <span className="w-8 shrink-0">Data</span>
          <span className="flex-1 truncate">Tomador</span>
          <span className="w-14 text-right">Receita</span>
          <span className="w-12 text-right">ISSQN(R)</span>
          <span className="w-10 text-right">AliqSn</span>
          <span className="w-12 text-right">DASN</span>
          
        </div>

        {/* Rows */}
        {linhas.map((l, i) => (
          <div key={i} className="flex items-center gap-1 text-[8px] tabular-nums">
            <span className="w-8 shrink-0 text-muted-foreground">{l.dataFmt}</span>
            <span className="flex-1 truncate text-foreground font-medium">{l.nome}</span>
            <span className="w-14 text-right text-foreground">{fmt(l.vs)}</span>
            <span className="w-12 text-right text-foreground">
              {l.issRet > 0 ? `(${fmt(l.issRet)})` : '—'}
            </span>
            <span className="w-10 text-right text-muted-foreground">{fmt(aliquotaEfetiva * 100)}%</span>
            <span className="w-12 text-right font-bold text-destructive">{fmt(l.das)}</span>
            <span className="w-8 text-right text-muted-foreground">{fmt(l.percentual)}%</span>
          </div>
        ))}

        {/* Footer */}
        <div className="flex items-center gap-1 text-[8px] font-bold border-t border-border/50 pt-0.5 tabular-nums">
          <span className="w-8 shrink-0" />
          <span className="flex-1 text-foreground">Total</span>
          <span className="w-14 text-right text-foreground">{fmt(totais.vs)}</span>
          <span className="w-12 text-right text-foreground">{totais.issRet > 0 ? `(${fmt(totais.issRet)})` : '—'}</span>
          <span className="w-10 text-right" />
          <span className="w-12 text-right text-destructive">{fmt(totais.das)}</span>
          <span className="w-8 text-right text-muted-foreground">{fmt(totais.percentual)}%</span>
        </div>
      </div>
    </div>
  );
};

export default EmissoesResumoMini;
