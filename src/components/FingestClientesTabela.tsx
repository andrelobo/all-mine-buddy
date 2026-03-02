import React, { useEffect, useState, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, Users } from 'lucide-react';
import {
  Table, TableHeader, TableBody, TableFooter, TableHead, TableRow, TableCell,
} from '@/components/ui/table';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const COLORS = ['hsl(var(--primary))', 'hsl(var(--destructive))', 'hsl(var(--accent))', 'hsl(210 70% 50%)', 'hsl(150 60% 40%)', 'hsl(30 80% 55%)'];

interface NotaRow {
  valor_servico: number | null;
  iss_valor: number | null;
  iss_retido: boolean | null;
  aliquota: number | null;
  data_emissao: string | null;
  numero_nfse: string | null;
  tomador: { nome_razao_social: string; cnpj_cpf: string } | null;
}

function fmt(v: number) {
  return v.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

interface NotaResumo {
  nome: string;
  doc: string;
  dataEmissao: string;
  numeroNfse: string;
  valorServico: number;
  issRetido: number;
  aliquotaIss: number;
  valorSimples: number;
  dasAPagar: number;
  percentual: number;
}

const FingestClientesTabela: React.FC<{ prestadorId: string | null }> = ({ prestadorId }) => {
  const [notas, setNotas] = useState<NotaRow[]>([]);
  const [aliquotaEfetiva, setAliquotaEfetiva] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);

      const notasQuery = supabase
        .from('notas_fiscais')
        .select('valor_servico, iss_valor, iss_retido, aliquota, data_emissao, numero_nfse, tomador:tomadores(nome_razao_social, cnpj_cpf)')
        .order('data_emissao', { ascending: true });

      if (prestadorId) notasQuery.eq('prestador_id', prestadorId);

      const [notasRes, prestadorRes] = await Promise.all([
        notasQuery,
        prestadorId
          ? supabase.from('prestadores').select('simples_aliquota_efetiva').eq('id', prestadorId).single()
          : Promise.resolve({ data: null }),
      ]);

      setNotas((notasRes.data as any) || []);
      setAliquotaEfetiva(Number((prestadorRes.data as any)?.simples_aliquota_efetiva) || 0);
      setLoading(false);
    }
    load();
  }, [prestadorId]);

  const { linhas, totais } = useMemo(() => {
    const totalGeral = notas.reduce((s, n) => s + (n.valor_servico ?? 0), 0);

    const linhas: NotaResumo[] = notas.map(n => {
      const tom = (n as any).tomador;
      const vs = n.valor_servico ?? 0;
      const iss = n.iss_valor ?? 0;
      const issRet = n.iss_retido ? iss : 0;
      const aliqIss = n.iss_retido ? (n.aliquota ?? 0) : 0;
      const simples = vs * aliquotaEfetiva;
      const das = Math.max(simples - issRet, 0);
      const d = n.data_emissao ? new Date(n.data_emissao) : null;
      const dataFmt = d ? `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}` : '—';

      return {
        nome: tom?.nome_razao_social || 'Sem tomador',
        doc: tom?.cnpj_cpf || '',
        dataEmissao: dataFmt,
        numeroNfse: n.numero_nfse || '—',
        valorServico: vs,
        issRetido: issRet,
        aliquotaIss: aliqIss,
        valorSimples: simples,
        dasAPagar: das,
        percentual: totalGeral > 0 ? (vs / totalGeral) * 100 : 0,
      };
    });

    const totais = linhas.reduce(
      (acc, c) => ({
        valorServico: acc.valorServico + c.valorServico,
        issRetido: acc.issRetido + c.issRetido,
        valorSimples: acc.valorSimples + c.valorSimples,
        dasAPagar: acc.dasAPagar + c.dasAPagar,
        percentual: acc.percentual + c.percentual,
      }),
      { valorServico: 0, issRetido: 0, valorSimples: 0, dasAPagar: 0, percentual: 0 },
    );

    return { linhas, totais };
  }, [notas, aliquotaEfetiva]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  if (linhas.length === 0) {
    return (
      <div className="section-card flex flex-col items-center justify-center py-12 text-muted-foreground">
        <Users className="w-10 h-10 mb-3 opacity-40" />
        <p className="text-sm">Nenhuma nota fiscal emitida ainda.</p>
      </div>
    );
  }

  return (
    <>
    <div className="section-card overflow-hidden">
      <Table className="table-fixed w-full">
        <colgroup>
          <col className="w-[7%]" />
          <col className="w-[24%]" />
          <col className="w-[16%]" />
          <col className="w-[15%]" />
          <col className="w-[14%]" />
          <col className="w-[14%]" />
          <col className="w-[10%]" />
        </colgroup>
        <TableHeader>
          <TableRow>
            <TableHead className="text-left">Data</TableHead>
            <TableHead className="text-left">Tomador</TableHead>
            <TableHead className="text-right">Receita R$</TableHead>
            <TableHead className="text-right">ISSQN (R)</TableHead>
            <TableHead className="text-right">AliqSn</TableHead>
            <TableHead className="text-right">DASN</TableHead>
            <TableHead className="text-right">% Fat.</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {linhas.map((c, i) => (
            <TableRow key={i}>
              <TableCell className="text-left text-sm tabular-nums">{c.dataEmissao}</TableCell>
              <TableCell className="text-left truncate">
                <div className="font-medium text-foreground text-sm truncate">{c.nome}</div>
              </TableCell>
              <TableCell className="text-right text-sm tabular-nums">
                <span className="inline-flex justify-end w-full"><span className="text-muted-foreground mr-1">R$</span><span className="inline-block min-w-[5.5rem] text-right">{fmt(c.valorServico)}</span></span>
              </TableCell>
              <TableCell className="text-right text-sm tabular-nums">
                <span className="inline-flex flex-col items-end">
                  {c.aliquotaIss > 0 && (
                    <span className="text-[10px] bg-muted text-muted-foreground rounded-full px-1.5 py-0.5 leading-none mb-0.5">{fmt(c.aliquotaIss)}%</span>
                  )}
                  <span>R$ {fmt(c.issRetido)}</span>
                </span>
              </TableCell>
              <TableCell className="text-right text-sm tabular-nums">R$ {fmt(c.valorSimples)}</TableCell>
              <TableCell className="text-right text-sm tabular-nums font-medium">R$ {fmt(c.dasAPagar)}</TableCell>
              <TableCell className="text-right text-sm tabular-nums">{fmt(c.percentual)}%</TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow className="font-bold">
            <TableCell className="text-left" colSpan={2}>Total</TableCell>
            <TableCell className="text-right tabular-nums">
              <span className="inline-flex justify-end w-full"><span className="text-muted-foreground mr-1">R$</span><span className="inline-block min-w-[5.5rem] text-right">{fmt(totais.valorServico)}</span></span>
            </TableCell>
            <TableCell className="text-right tabular-nums">R$ {fmt(totais.issRetido)}</TableCell>
            <TableCell className="text-right tabular-nums">R$ {fmt(totais.valorSimples)}</TableCell>
            <TableCell className="text-right tabular-nums">R$ {fmt(totais.dasAPagar)}</TableCell>
            <TableCell className="text-right tabular-nums">{fmt(totais.percentual)}%</TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>

    {/* Gráficos Pizza */}
    {totais.valorServico > 0 && (() => {
      const clienteData = linhas.reduce((acc, l) => {
        const existing = acc.find(a => a.name === l.nome);
        if (existing) { existing.value += l.valorServico; }
        else { acc.push({ name: l.nome, value: l.valorServico }); }
        return acc;
      }, [] as { name: string; value: number }[]);

      const chartData = [
        ...clienteData.map((c, i) => ({ name: c.name, value: c.value, fill: COLORS[i % COLORS.length] })),
        { name: 'ISSQN Retido', value: totais.issRetido, fill: 'hsl(var(--destructive))' },
        { name: 'DASN', value: totais.dasAPagar, fill: 'hsl(var(--muted-foreground))' },
      ].filter(d => d.value > 0);

      const total = chartData.reduce((s, d) => s + d.value, 0);

      return (
        <div className="section-card mt-4 p-4">
          <h4 className="text-xs font-semibold text-foreground mb-2 text-center">Receita, Impostos e Clientes</h4>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={chartData} cx="50%" cy="50%" innerRadius={40} outerRadius={70} paddingAngle={2} dataKey="value">
                {chartData.map((d, i) => <Cell key={i} fill={d.fill} />)}
              </Pie>
              <Tooltip formatter={(v: number, name: string) => [`R$ ${fmt(v)} (${fmt(total > 0 ? (v / total) * 100 : 0)}%)`, name]} />
              <Legend iconSize={8} wrapperStyle={{ fontSize: '10px' }} formatter={(value: string, entry: any) => { const v = entry.payload?.value || 0; return `${value}: R$ ${fmt(v)} (${fmt(total > 0 ? (v / total) * 100 : 0)}%)`; }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      );
    })()}
    </>
  );
};

export default FingestClientesTabela;
