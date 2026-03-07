import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface NotaFiscalDB {
  id: string;
  prestador_id: string | null;
  tomador_id: string | null;
  numero_nfse: string;
  status: string;
  codigo_servico: string;
  descricao_servico: string;
  local_prestacao_pais: string;
  local_prestacao_uf: string;
  local_prestacao_municipio: string;
  valor_servico: number;
  aliquota: number;
  base_calculo: number;
  desconto: number;
  iss_retido: boolean;
  iss_valor: number;
  ret_pis: number;
  ret_cofins: number;
  ret_csll: number;
  ret_ir: number;
  ret_inss: number;
  valor_liquido: number;
  data_emissao: string;
}

function parseCurrency(value: string): number {
  if (!value) return 0;
  return parseFloat(value.replace(/\./g, '').replace(',', '.')) || 0;
}

function parsePercent(value: string): number {
  if (!value) return 0;
  return parseFloat(value.replace(',', '.')) || 0;
}

export function useNotasFiscais() {
  const [saving, setSaving] = useState(false);

  const obterProximoNumeroNfse = useCallback(async (prestadorId: string | null): Promise<string> => {
    try {
      let query = supabase
        .from('notas_fiscais')
        .select('numero_nfse')
        .order('numero_nfse', { ascending: false })
        .limit(1);
      if (prestadorId) query = query.eq('prestador_id', prestadorId);
      const { data } = await query;
      const ultimo = data?.[0]?.numero_nfse;
      const proximoNum = ultimo ? parseInt(ultimo, 10) + 1 : 1;
      return String(proximoNum);
    } catch {
      return '1';
    }
  }, []);

  const salvarNota = useCallback(async (params: {
    prestadorId: string | null;
    tomadorId: string | null;
    prestacao: {
      codigoServico: string;
      descricaoServico: string;
      valorServico: string;
      aliquota: string;
      baseCalculo: string;
      desconto: string;
      issRetido: boolean;
      retPis: string;
      retCofins: string;
      retCsll: string;
      retIr: string;
      retInss: string;
    };
    localPrestacao: { pais: string; uf: string; municipio: string };
    status?: string;
    dataEmissao?: string;
  }) => {
    setSaving(true);
    try {
      const valorServico = parseCurrency(params.prestacao.valorServico);
      const desconto = parseCurrency(params.prestacao.desconto);
      const aliquota = parsePercent(params.prestacao.aliquota);
      const baseCalculo = valorServico - desconto;
      const issValor = baseCalculo * (aliquota / 100);
      const retPis = parseCurrency(params.prestacao.retPis);
      const retCofins = parseCurrency(params.prestacao.retCofins);
      const retCsll = parseCurrency(params.prestacao.retCsll);
      const retIr = parseCurrency(params.prestacao.retIr);
      const retInss = parseCurrency(params.prestacao.retInss);
      const totalRetencoes = retPis + retCofins + retCsll + retIr + retInss + (params.prestacao.issRetido ? issValor : 0);
      const valorLiquido = valorServico - desconto - totalRetencoes;

      const numeroNfse = await obterProximoNumeroNfse(params.prestadorId);

      const row = {
        prestador_id: params.prestadorId || null,
        tomador_id: params.tomadorId || null,
        numero_nfse: numeroNfse,
        status: params.status || 'rascunho',
        codigo_servico: params.prestacao.codigoServico,
        descricao_servico: params.prestacao.descricaoServico,
        local_prestacao_pais: params.localPrestacao.pais,
        local_prestacao_uf: params.localPrestacao.uf,
        local_prestacao_municipio: params.localPrestacao.municipio,
        valor_servico: valorServico,
        aliquota,
        base_calculo: baseCalculo,
        desconto,
        iss_retido: params.prestacao.issRetido,
        iss_valor: issValor,
        ret_pis: retPis,
        ret_cofins: retCofins,
        ret_csll: retCsll,
        ret_ir: retIr,
        ret_inss: retInss,
        valor_liquido: valorLiquido,
        ...(params.dataEmissao ? { data_emissao: new Date(params.dataEmissao + 'T12:00:00').toISOString() } : {}),
      };

      const { data, error } = await supabase
        .from('notas_fiscais')
        .insert(row)
        .select()
        .single();

      if (error) throw error;
      toast.success(`NFS-e Nº ${numeroNfse} emitida com sucesso!`);
      return data.id;
    } catch (err: any) {
      toast.error('Erro ao salvar nota fiscal: ' + (err.message || ''));
      return null;
    } finally {
      setSaving(false);
    }
  }, [obterProximoNumeroNfse]);

  return { saving, salvarNota, obterProximoNumeroNfse };
}
