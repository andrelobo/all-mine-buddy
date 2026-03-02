import React, { useEffect, useState, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, Users } from 'lucide-react';
import {
  Table, TableHeader, TableBody, TableFooter, TableHead, TableRow, TableCell,
} from '@/components/ui/table';

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
    <div className="section-card overflow-hidden">
      <Table className="table-fixed w-full">
        <colgroup>
          <col className="w-[7%]" />
          <col className="w-[24%]" />
          <col className="w-[14%]" />
          <col className="w-[7%]" />
          <col className="w-[14%]" />
          <col className="w-[12%]" />
          <col className="w-[13%]" />
          <col className="w-[9%]" />
        </colgroup>
        <TableHeader>
          <TableRow>
            <TableHead className="text-left">Data</TableHead>
            <TableHead className="text-left">Tomador</TableHead>
            <TableHead className="text-right">Serviço R$</TableHead>
            <TableHead className="text-right">Alíq. ISS</TableHead>
            <TableHead className="text-right">Retenção Issqn</TableHead>
            <TableHead className="text-right">TribSn ({fmt(aliquotaEfetiva * 100)}%)</TableHead>
            <TableHead className="text-right">DAS a Pagar</TableHead>
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
              <TableCell className="text-right text-sm tabular-nums">R$ {fmt(c.valorServico)}</TableCell>
              <TableCell className="text-right text-sm tabular-nums">{c.aliquotaIss > 0 ? `${fmt(c.aliquotaIss)}%` : '—'}</TableCell>
              <TableCell className="text-right text-sm tabular-nums">R$ {fmt(c.issRetido)}</TableCell>
              <TableCell className="text-right text-sm tabular-nums">R$ {fmt(c.valorSimples)}</TableCell>
              <TableCell className="text-right text-sm tabular-nums font-medium">R$ {fmt(c.dasAPagar)}</TableCell>
              <TableCell className="text-right text-sm tabular-nums">{fmt(c.percentual)}%</TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow className="font-bold">
            <TableCell className="text-left" colSpan={2}>Total</TableCell>
            <TableCell className="text-right tabular-nums">R$ {fmt(totais.valorServico)}</TableCell>
            <TableCell className="text-right"></TableCell>
            <TableCell className="text-right tabular-nums">R$ {fmt(totais.issRetido)}</TableCell>
            <TableCell className="text-right tabular-nums">R$ {fmt(totais.valorSimples)}</TableCell>
            <TableCell className="text-right tabular-nums">R$ {fmt(totais.dasAPagar)}</TableCell>
            <TableCell className="text-right tabular-nums">{fmt(totais.percentual)}%</TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  );
};

export default FingestClientesTabela;
