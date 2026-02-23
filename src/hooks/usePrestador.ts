import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface PrestadorData {
  nomeEmpresarial: string;
  nomeFantasia: string;
  cnpj: string;
  inscricaoMunicipal: string;
  inscricaoEstadual: string;
  suframa: string;
  cep: string;
  logradouro: string;
  numero: string;
  complemento: string;
  bairro: string;
  localidadeUf: string;
  email: string;
  whatsapp: string;
}

export interface PrestadorConfig {
  id?: string;
  regimeTributario: string | null;
  optanteSimples: boolean;
  aliquotaSimples: string;
  ctnCodigo: string;
  ctnDescricao: string;
  ctnItem: string;
}

const INITIAL_PRESTADOR: PrestadorData = {
  nomeEmpresarial: '',
  nomeFantasia: '',
  cnpj: '',
  inscricaoMunicipal: '',
  inscricaoEstadual: '',
  suframa: '',
  cep: '',
  logradouro: '',
  numero: '',
  complemento: '',
  bairro: '',
  localidadeUf: '',
  email: '',
  whatsapp: '',
};

const INITIAL_CONFIG: PrestadorConfig = {
  regimeTributario: null,
  optanteSimples: false,
  aliquotaSimples: '',
  ctnCodigo: '',
  ctnDescricao: '',
  ctnItem: '',
};

export function usePrestador() {
  const [prestador, setPrestador] = useState<PrestadorData>(INITIAL_PRESTADOR);
  const [config, setConfig] = useState<PrestadorConfig>(INITIAL_CONFIG);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Load first prestador on mount
  useEffect(() => {
    loadPrestador();
  }, []);

  const loadPrestador = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('prestadores')
        .select('*')
        .order('created_at', { ascending: true })
        .limit(1)
        .maybeSingle();

      if (error) throw error;
      if (data) {
        setPrestador({
          nomeEmpresarial: data.nome_empresarial || '',
          nomeFantasia: data.nome_fantasia || '',
          cnpj: data.cnpj || '',
          inscricaoMunicipal: data.inscricao_municipal || '',
          inscricaoEstadual: data.inscricao_estadual || '',
          suframa: data.suframa || '',
          cep: data.cep || '',
          logradouro: data.logradouro || '',
          numero: data.numero || '',
          complemento: data.complemento || '',
          bairro: data.bairro || '',
          localidadeUf: data.localidade_uf || '',
          email: data.email || '',
          whatsapp: data.whatsapp || '',
        });
        setConfig({
          id: data.id,
          regimeTributario: data.regime_tributario,
          optanteSimples: data.optante_simples || false,
          aliquotaSimples: data.aliquota_simples || '',
          ctnCodigo: data.ctn_codigo || '',
          ctnDescricao: data.ctn_descricao || '',
          ctnItem: data.ctn_item || '',
        });
      }
    } catch (err) {
      console.error('Erro ao carregar prestador:', err);
    } finally {
      setLoading(false);
    }
  };

  const salvarPrestador = useCallback(async (
    dados: PrestadorData,
    cfg: PrestadorConfig
  ) => {
    const cnpjClean = dados.cnpj.replace(/\D/g, '');
    if (cnpjClean.length !== 14) {
      toast.error('CNPJ inválido para salvar.');
      return null;
    }

    setSaving(true);
    try {
      const row = {
        cnpj: cnpjClean,
        nome_empresarial: dados.nomeEmpresarial,
        nome_fantasia: dados.nomeFantasia,
        inscricao_municipal: dados.inscricaoMunicipal,
        inscricao_estadual: dados.inscricaoEstadual,
        suframa: dados.suframa,
        cep: dados.cep,
        logradouro: dados.logradouro,
        numero: dados.numero,
        complemento: dados.complemento,
        bairro: dados.bairro,
        localidade_uf: dados.localidadeUf,
        email: dados.email,
        whatsapp: dados.whatsapp,
        regime_tributario: cfg.regimeTributario,
        optante_simples: cfg.optanteSimples,
        aliquota_simples: cfg.aliquotaSimples,
        ctn_codigo: cfg.ctnCodigo,
        ctn_descricao: cfg.ctnDescricao,
        ctn_item: cfg.ctnItem,
      };

      let result;
      if (cfg.id) {
        result = await supabase
          .from('prestadores')
          .update(row)
          .eq('id', cfg.id)
          .select()
          .single();
      } else {
        result = await supabase
          .from('prestadores')
          .upsert(row, { onConflict: 'cnpj' })
          .select()
          .single();
      }

      if (result.error) throw result.error;
      
      setConfig(prev => ({ ...prev, id: result.data.id }));
      toast.success('Prestador salvo com sucesso!');
      return result.data.id;
    } catch (err: any) {
      console.error('Erro ao salvar prestador:', err);
      toast.error('Erro ao salvar prestador: ' + (err.message || ''));
      return null;
    } finally {
      setSaving(false);
    }
  }, []);

  return {
    prestador,
    setPrestador,
    config,
    setConfig,
    loading,
    saving,
    salvarPrestador,
    loadPrestador,
  };
}
