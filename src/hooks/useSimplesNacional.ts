import { useState, useEffect, useCallback, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { calcularSimplesAnexoIII, type CalculoSimplesResult } from '@/utils/simples-nacional';

export interface CnaeCatalogo {
  id: string;
  codigo_cnae: string;
  descricao: string;
  anexo: string;
  permite_fator_r: boolean;
}

export interface SimplesNacionalState {
  cnaePrincipal: string;
  cnaeDescricao: string;
  cnaeAnexo: string;
  permiteFatorR: boolean;
  rbt12: number;
  calculo: CalculoSimplesResult;
  alertas: string[];
}

export function useSimplesNacional(cnaePrincipalInicial: string, rbt12Inicial: number) {
  const [cnaePrincipal, setCnaePrincipal] = useState(cnaePrincipalInicial);
  const [cnaeDescricao, setCnaeDescricao] = useState('');
  const [cnaeAnexo, setCnaeAnexo] = useState('');
  const [permiteFatorR, setPermiteFatorR] = useState(false);
  const [rbt12, setRbt12] = useState(rbt12Inicial);
  const [catalogoLoaded, setCatalogoLoaded] = useState(false);

  // Buscar info do CNAE no catálogo
  const buscarCnaeCatalogo = useCallback(async (codigo: string) => {
    if (!codigo) {
      setCnaeDescricao('');
      setCnaeAnexo('');
      setPermiteFatorR(false);
      return;
    }

    const cleaned = codigo.replace(/\D/g, '');
    const { data, error } = await supabase
      .from('cnae_catalogo')
      .select('*')
      .eq('codigo_cnae', cleaned)
      .maybeSingle();

    if (data && !error) {
      setCnaeDescricao(data.descricao);
      setCnaeAnexo(data.anexo);
      setPermiteFatorR(data.permite_fator_r);
    } else {
      // CNAE não está no catálogo - assume Anexo III
      setCnaeAnexo('');
      setPermiteFatorR(false);
    }
    setCatalogoLoaded(true);
  }, []);

  useEffect(() => {
    if (cnaePrincipal) {
      buscarCnaeCatalogo(cnaePrincipal);
    }
  }, [cnaePrincipal, buscarCnaeCatalogo]);

  // Sync from parent
  useEffect(() => {
    setCnaePrincipal(cnaePrincipalInicial);
  }, [cnaePrincipalInicial]);

  useEffect(() => {
    setRbt12(rbt12Inicial);
  }, [rbt12Inicial]);

  const calculo = useMemo(() => {
    const anexo = cnaeAnexo || 'III';
    return calcularSimplesAnexoIII(rbt12, anexo);
  }, [rbt12, cnaeAnexo]);

  const alertas = useMemo(() => {
    const all = [...calculo.alertas];
    if (cnaeAnexo && cnaeAnexo !== 'III') {
      all.push(`Este CNAE pertence ao Anexo ${cnaeAnexo}, não ao Anexo III.`);
    }
    return all;
  }, [calculo.alertas, cnaeAnexo]);

  return {
    cnaePrincipal,
    setCnaePrincipal,
    cnaeDescricao,
    cnaeAnexo,
    permiteFatorR,
    rbt12,
    setRbt12,
    calculo,
    alertas,
    catalogoLoaded,
  };
}
