import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, Receipt, AlertCircle, CheckCircle2, ArrowDownCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface NotaFiscalRow {
  id: string;
  numero_nfse: string | null;
  status: string;
  codigo_servico: string | null;
  descricao_servico: string | null;
  valor_servico: number | null;
  desconto: number | null;
  base_calculo: number | null;
  aliquota: number | null;
  iss_valor: number | null;
  iss_retido: boolean | null;
  ret_pis: number | null;
  ret_cofins: number | null;
  ret_csll: number | null;
  ret_ir: number | null;
  ret_inss: number | null;
  valor_liquido: number | null;
  data_emissao: string | null;
  created_at: string;
  tomador?: { nome_razao_social: string; cnpj_cpf: string } | null;
}

function fmt(v: number | null | undefined) {
  return (v ?? 0).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function fmtDate(d: string | null) {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('pt-BR');
}

const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const map: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
    emitida: { label: 'Emitida', variant: 'default' },
    rascunho: { label: 'Rascunho', variant: 'secondary' },
    cancelada: { label: 'Cancelada', variant: 'destructive' },
  };
  const info = map[status] || { label: status, variant: 'outline' as const };
  return <Badge variant={info.variant}>{info.label}</Badge>;
};

const NotasFiscaisLista: React.FC<{ prestadorId: string | null }> = ({ prestadorId }) => {
  const [notas, setNotas] = useState<NotaFiscalRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetch() {
      setLoading(true);
      let query = supabase
        .from('notas_fiscais')
        .select('*, tomador:tomadores(nome_razao_social, cnpj_cpf)')
        .order('created_at', { ascending: false });

      if (prestadorId) {
        query = query.eq('prestador_id', prestadorId);
      }

      const { data, error } = await query;
      if (!error && data) {
        setNotas(data as any);
      }
      setLoading(false);
    }
    fetch();
  }, [prestadorId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  if (notas.length === 0) {
    return (
      <div className="section-card flex flex-col items-center justify-center py-12 text-muted-foreground">
        <Receipt className="w-10 h-10 mb-3 opacity-40" />
        <p className="text-sm">Nenhuma nota fiscal emitida ainda.</p>
        <p className="text-xs mt-1">Emita sua primeira nota na aba DANFSE.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {notas.map((nota) => {
        const issRetidoValor = nota.iss_retido ? (nota.iss_valor ?? 0) : 0;
        const totalRetencoes =
          issRetidoValor +
          (nota.ret_pis ?? 0) +
          (nota.ret_cofins ?? 0) +
          (nota.ret_csll ?? 0) +
          (nota.ret_ir ?? 0) +
          (nota.ret_inss ?? 0);
        const impostoAPagar = nota.iss_retido ? 0 : (nota.iss_valor ?? 0);
        const tomadorNome = (nota as any).tomador?.nome_razao_social || '—';
        const tomadorDoc = (nota as any).tomador?.cnpj_cpf || '';

        return (
          <div key={nota.id} className="section-card p-4 space-y-3">
            {/* Header */}
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-3">
                <Receipt className="w-4 h-4 text-primary shrink-0" />
                <div>
                  <span className="text-sm font-semibold text-foreground">
                    NFS-e {nota.numero_nfse || '(sem número)'}
                  </span>
                  <span className="text-xs text-muted-foreground ml-2">
                    {fmtDate(nota.data_emissao || nota.created_at)}
                  </span>
                </div>
              </div>
              <StatusBadge status={nota.status} />
            </div>

            {/* Tomador */}
            <div className="text-xs text-muted-foreground">
              <span className="font-medium text-foreground">Tomador:</span> {tomadorNome}
              {tomadorDoc && <span className="ml-1">({tomadorDoc})</span>}
            </div>

            {/* Serviço */}
            <div className="text-xs text-muted-foreground line-clamp-2">
              <span className="font-medium text-foreground">Serviço:</span>{' '}
              {nota.codigo_servico && <span className="mr-1">[{nota.codigo_servico}]</span>}
              {nota.descricao_servico || '—'}
            </div>

            {/* Valores grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-border">
              <ValorCell label="Valor Bruto" value={fmt(nota.valor_servico)} />
              <ValorCell label="Desconto" value={fmt(nota.desconto)} />
              <ValorCell label="Base de Cálculo" value={fmt(nota.base_calculo)} />
              <ValorCell label="Alíquota" value={`${fmt(nota.aliquota)}%`} />
            </div>

            {/* ISS e Retenções */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <ValorCell label="ISS Calculado" value={fmt(nota.iss_valor)} />
              <div className="flex flex-col">
                <span className="text-[10px] text-muted-foreground uppercase tracking-wide">ISS Retido</span>
                <div className="flex items-center gap-1.5">
                  {nota.iss_retido ? (
                    <>
                      <ArrowDownCircle className="w-3.5 h-3.5 text-amber-500" />
                      <span className="text-sm font-medium text-amber-600">SIM — R$ {fmt(issRetidoValor)}</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                      <span className="text-sm font-medium text-muted-foreground">NÃO</span>
                    </>
                  )}
                </div>
              </div>
              <ValorCell label="Total Retenções" value={fmt(totalRetencoes)} highlight={totalRetencoes > 0} />
              <ValorCell label="Valor Líquido" value={fmt(nota.valor_liquido)} bold />
            </div>

            {/* Retenções federais detalhadas */}
            {totalRetencoes > 0 && (
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 pt-2 border-t border-border/50">
                <ValorCell label="PIS" value={fmt(nota.ret_pis)} small />
                <ValorCell label="COFINS" value={fmt(nota.ret_cofins)} small />
                <ValorCell label="CSLL" value={fmt(nota.ret_csll)} small />
                <ValorCell label="IR" value={fmt(nota.ret_ir)} small />
                <ValorCell label="INSS" value={fmt(nota.ret_inss)} small />
              </div>
            )}

            {/* Imposto a pagar */}
            <div className="flex items-center justify-between pt-2 border-t border-border bg-muted/30 rounded-md px-3 py-2 -mx-1">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-primary" />
                <span className="text-xs font-medium text-foreground uppercase tracking-wide">Imposto a Pagar (ISS)</span>
              </div>
              <span className={`text-base font-bold ${impostoAPagar > 0 ? 'text-destructive' : 'text-emerald-600'}`}>
                R$ {fmt(impostoAPagar)}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

const ValorCell: React.FC<{ label: string; value: string; bold?: boolean; highlight?: boolean; small?: boolean }> = ({
  label, value, bold, highlight, small,
}) => (
  <div className="flex flex-col">
    <span className={`text-muted-foreground uppercase tracking-wide ${small ? 'text-[9px]' : 'text-[10px]'}`}>{label}</span>
    <span className={`${small ? 'text-xs' : 'text-sm'} ${bold ? 'font-bold text-foreground' : ''} ${highlight ? 'text-amber-600 font-medium' : 'text-foreground'}`}>
      R$ {value}
    </span>
  </div>
);

export default NotasFiscaisLista;
