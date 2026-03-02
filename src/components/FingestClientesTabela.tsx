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
  tomador: { nome_razao_social: string; cnpj_cpf: string } | null;
}

function fmt(v: number) {
  return v.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

interface ClienteResumo {
  nome: string;
  doc: string;
  valorServico: number;
  issRetido: number;
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
        .select('valor_servico, iss_valor, iss_retido, tomador:tomadores(nome_razao_social, cnpj_cpf)')
        .order('created_at', { ascending: false });

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

  const { clientes, totais } = useMemo(() => {
    const map = new Map<string, Omit<ClienteResumo, 'percentual' | 'dasAPagar'>>();
    let totalGeral = 0;

    for (const n of notas) {
      const tom = (n as any).tomador;
      const key = tom?.cnpj_cpf || '_sem_tomador';
      const nome = tom?.nome_razao_social || 'Sem tomador';
      const doc = tom?.cnpj_cpf || '';
      const vs = n.valor_servico ?? 0;
      const iss = n.iss_valor ?? 0;
      const issRet = n.iss_retido ? iss : 0;
      const simples = vs * aliquotaEfetiva;
      totalGeral += vs;

      const cur = map.get(key) || { nome, doc, valorServico: 0, issRetido: 0, valorSimples: 0 };
      cur.valorServico += vs;
      cur.issRetido += issRet;
      cur.valorSimples += simples;
      map.set(key, cur);
    }

    const list = Array.from(map.values())
      .map(c => ({
        ...c,
        dasAPagar: Math.max(c.valorSimples - c.issRetido, 0),
        percentual: totalGeral > 0 ? (c.valorServico / totalGeral) * 100 : 0,
      }))
      .sort((a, b) => b.valorServico - a.valorServico);

    const totais = list.reduce(
      (acc, c) => ({
        valorServico: acc.valorServico + c.valorServico,
        issRetido: acc.issRetido + c.issRetido,
        valorSimples: acc.valorSimples + c.valorSimples,
        dasAPagar: acc.dasAPagar + c.dasAPagar,
        percentual: acc.percentual + c.percentual,
      }),
      { valorServico: 0, issRetido: 0, valorSimples: 0, dasAPagar: 0, percentual: 0 },
    );

    return { clientes: list, totais };
  }, [notas, aliquotaEfetiva]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  if (clientes.length === 0) {
    return (
      <div className="section-card flex flex-col items-center justify-center py-12 text-muted-foreground">
        <Users className="w-10 h-10 mb-3 opacity-40" />
        <p className="text-sm">Nenhuma nota fiscal emitida ainda.</p>
      </div>
    );
  }

  return (
    <div className="section-card overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Tomador</TableHead>
            <TableHead className="text-right">Valor Serviço</TableHead>
            <TableHead className="text-right">ISS Retido</TableHead>
            <TableHead className="text-right">Simples ({fmt(aliquotaEfetiva * 100)}%)</TableHead>
            <TableHead className="text-right">DAS a Pagar</TableHead>
            <TableHead className="text-right">% Faturamento</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {clientes.map((c) => (
            <TableRow key={c.doc || c.nome}>
              <TableCell>
                <div className="font-medium text-foreground text-sm">{c.nome}</div>
                {c.doc && <div className="text-xs text-muted-foreground">{c.doc}</div>}
              </TableCell>
              <TableCell className="text-right text-sm">R$ {fmt(c.valorServico)}</TableCell>
              <TableCell className="text-right text-sm">R$ {fmt(c.issRetido)}</TableCell>
              <TableCell className="text-right text-sm">R$ {fmt(c.valorSimples)}</TableCell>
              <TableCell className="text-right text-sm font-medium">R$ {fmt(c.dasAPagar)}</TableCell>
              <TableCell className="text-right text-sm">{fmt(c.percentual)}%</TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow className="font-bold">
            <TableCell>Total</TableCell>
            <TableCell className="text-right">R$ {fmt(totais.valorServico)}</TableCell>
            <TableCell className="text-right">R$ {fmt(totais.issRetido)}</TableCell>
            <TableCell className="text-right">R$ {fmt(totais.valorSimples)}</TableCell>
            <TableCell className="text-right">R$ {fmt(totais.dasAPagar)}</TableCell>
            <TableCell className="text-right">{fmt(totais.percentual)}%</TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  );
};

export default FingestClientesTabela;
