import React, { useEffect, useState, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, Users, Trash2 } from 'lucide-react';
import {
  Table, TableHeader, TableBody, TableFooter, TableHead, TableRow, TableCell,
} from '@/components/ui/table';

import { toast } from 'sonner';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from '@/components/ui/alert-dialog';



interface NotaRow {
  id: string;
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
  id: string;
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

  const fetchData = React.useCallback(async () => {
    setLoading(true);

    const notasQuery = supabase
      .from('notas_fiscais')
      .select('id, valor_servico, iss_valor, iss_retido, aliquota, data_emissao, numero_nfse, tomador:tomadores(nome_razao_social, cnpj_cpf)')
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
  }, [prestadorId]);

  useEffect(() => { fetchData(); }, [fetchData]);

  useEffect(() => {
    const channel = supabase
      .channel('fingest-notas')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'notas_fiscais' }, () => fetchData())
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [fetchData]);

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
        id: (n as any).id,
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

  const handleDelete = async (id: string) => {
    setNotas(prev => prev.filter(n => n.id !== id));
    const { error } = await supabase.from('notas_fiscais').delete().eq('id', id);
    if (error) {
      toast.error('Erro ao deletar nota fiscal');
      fetchData();
    } else {
      toast.success('Nota fiscal deletada');
    }
  };

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
          <col className="w-[22%]" />
          <col className="w-[15%]" />
          <col className="w-[14%]" />
          <col className="w-[13%]" />
          <col className="w-[13%]" />
          <col className="w-[9%]" />
          <col className="w-[7%]" />
        </colgroup>
        <TableHeader>
          <TableRow>
            <TableHead className="text-left">Data</TableHead>
            <TableHead className="text-left">Tomador(a)</TableHead>
            <TableHead className="text-right">Receita R$</TableHead>
            <TableHead className="text-right">ISSQN (R)</TableHead>
            <TableHead className="text-right">AliqSn%</TableHead>
            <TableHead className="text-right">DASN</TableHead>
            <TableHead className="text-right">% Fat.</TableHead>
            <TableHead className="text-center"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {linhas.map((c, i) => (
            <TableRow key={c.id}>
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
              <TableCell className="text-right text-sm tabular-nums">
                <span className="inline-flex flex-col items-end">
                  <span className="text-[10px] bg-muted text-muted-foreground rounded-full px-1.5 py-0.5 leading-none mb-0.5">{fmt(aliquotaEfetiva * 100)}%</span>
                  <span>R$ {fmt(c.valorSimples)}</span>
                </span>
              </TableCell>
              <TableCell className="text-right text-sm tabular-nums font-medium">R$ {fmt(c.dasAPagar)}</TableCell>
              <TableCell className="text-right text-sm tabular-nums">{fmt(c.percentual)}%</TableCell>
              <TableCell className="text-center">
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <button className="p-1 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Deletar nota fiscal?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Nota de {c.dataEmissao} — {c.nome} — R$ {fmt(c.valorServico)}. Esta ação não pode ser desfeita.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction onClick={() => handleDelete(c.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                        Deletar
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </TableCell>
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
            <TableCell />
          </TableRow>
        </TableFooter>
      </Table>
    </div>
    </>
  );
};

export default FingestClientesTabela;
