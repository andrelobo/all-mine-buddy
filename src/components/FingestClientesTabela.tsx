import React, { useEffect, useState, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, Users } from 'lucide-react';
import {
  Table, TableHeader, TableBody, TableHead, TableRow, TableCell,
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
  valorImposto: number;
  issRetido: number;
  percentual: number;
}

const FingestClientesTabela: React.FC<{ prestadorId: string | null }> = ({ prestadorId }) => {
  const [notas, setNotas] = useState<NotaRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      let query = supabase
        .from('notas_fiscais')
        .select('valor_servico, iss_valor, iss_retido, tomador:tomadores(nome_razao_social, cnpj_cpf)')
        .order('created_at', { ascending: false });

      if (prestadorId) query = query.eq('prestador_id', prestadorId);

      const { data } = await query;
      setNotas((data as any) || []);
      setLoading(false);
    }
    load();
  }, [prestadorId]);

  const clientes = useMemo<ClienteResumo[]>(() => {
    const map = new Map<string, { nome: string; doc: string; valorServico: number; valorImposto: number; issRetido: number }>();
    let totalGeral = 0;

    for (const n of notas) {
      const tom = (n as any).tomador;
      const key = tom?.cnpj_cpf || '_sem_tomador';
      const nome = tom?.nome_razao_social || 'Sem tomador';
      const doc = tom?.cnpj_cpf || '';
      const vs = n.valor_servico ?? 0;
      const iss = n.iss_valor ?? 0;
      const issRet = n.iss_retido ? iss : 0;
      totalGeral += vs;

      const cur = map.get(key) || { nome, doc, valorServico: 0, valorImposto: 0, issRetido: 0 };
      cur.valorServico += vs;
      cur.valorImposto += iss;
      cur.issRetido += issRet;
      map.set(key, cur);
    }

    return Array.from(map.values())
      .map(c => ({ ...c, percentual: totalGeral > 0 ? (c.valorServico / totalGeral) * 100 : 0 }))
      .sort((a, b) => b.valorServico - a.valorServico);
  }, [notas]);

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
            <TableHead className="text-right">Valor Imposto</TableHead>
            <TableHead className="text-right">ISS Retido</TableHead>
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
              <TableCell className="text-right text-sm">R$ {fmt(c.valorImposto)}</TableCell>
              <TableCell className="text-right text-sm">R$ {fmt(c.issRetido)}</TableCell>
              <TableCell className="text-right text-sm font-medium">{fmt(c.percentual)}%</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default FingestClientesTabela;
