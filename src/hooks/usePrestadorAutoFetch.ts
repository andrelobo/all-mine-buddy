import { useState, useCallback, useRef } from 'react';
import { formatCNPJ, formatCEP, formatPhone, validateCNPJ } from '@/utils/validators';
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
  dataOpcaoSimples?: string;
}

async function fetchCNPJData(cnpj: string) {
  const cleaned = cnpj.replace(/\D/g, '');
  try {
    const res = await fetch(`https://brasilapi.com.br/api/cnpj/v1/${cleaned}`);
    if (res.ok) {
      const data = await res.json();
      let logradouroCompleto = data.logradouro || '';
      if (data.descricao_tipo_de_logradouro && logradouroCompleto && !logradouroCompleto.toUpperCase().startsWith(data.descricao_tipo_de_logradouro.toUpperCase())) {
        logradouroCompleto = `${data.descricao_tipo_de_logradouro} ${logradouroCompleto}`;
      }
      return {
        razao_social: data.razao_social || '',
        nome_fantasia: data.nome_fantasia || '',
        cep: data.cep || '',
        logradouro: logradouroCompleto,
        numero: data.numero || '',
        complemento: data.complemento || '',
        bairro: data.bairro || '',
        municipio: data.municipio || '',
        uf: data.uf || '',
        email: data.email || '',
        telefone: data.ddd_telefone_1?.replace(/\D/g, '') || '',
        opcao_pelo_simples: data.opcao_pelo_simples ?? null,
        data_opcao_simples: data.data_opcao_pelo_simples || null,
      };
    }
  } catch { /* fallback */ }

  const res = await fetch(`https://receitaws.com.br/v1/cnpj/${cleaned}`, { headers: { 'Accept': 'application/json' } });
  if (!res.ok) throw new Error('CNPJ não encontrado');
  const d = await res.json();
  if (d.status === 'ERROR') throw new Error('CNPJ não encontrado');
  let logradouroCompleto = d.logradouro || '';
  if (d.tipo && logradouroCompleto && !logradouroCompleto.toUpperCase().startsWith(d.tipo.toUpperCase())) {
    logradouroCompleto = `${d.tipo} ${logradouroCompleto}`;
  }
  return {
    razao_social: d.nome || '',
    nome_fantasia: d.fantasia || '',
    cep: d.cep?.replace(/[.\-]/g, '') || '',
    logradouro: logradouroCompleto,
    numero: d.numero || '',
    complemento: d.complemento || '',
    bairro: d.bairro || '',
    municipio: d.municipio || '',
    uf: d.uf || '',
    email: d.email || '',
    telefone: d.telefone?.replace(/\D/g, '') || '',
    opcao_pelo_simples: d.simples?.optante ?? null,
    data_opcao_simples: d.simples?.data_opcao || null,
  };
}

async function fetchCEPData(cep: string) {
  const cleaned = cep.replace(/\D/g, '');
  const res = await fetch(`https://brasilapi.com.br/api/cep/v2/${cleaned}`);
  if (!res.ok) throw new Error('CEP não encontrado');
  const data = await res.json();
  return { logradouro: data.street || '', bairro: data.neighborhood || '', municipio: data.city || '', uf: data.state || '' };
}

export function usePrestadorAutoFetch(
  data: PrestadorData,
  onChange: (data: PrestadorData) => void,
  onAutosave: () => void,
  onSimplesDetected?: (isOptante: boolean) => void,
) {
  const [loadingCNPJ, setLoadingCNPJ] = useState(false);
  const [loadingCEP, setLoadingCEP] = useState(false);
  const [simplesStatus, setSimplesStatus] = useState<boolean | null>(null);
  const lastFetchedCNPJ = useRef('');
  const lastFetchedCEP = useRef('');
  const dataRef = useRef(data);
  dataRef.current = data;

  const buscarCNPJ = useCallback(async (cnpjValue: string) => {
    const cleaned = cnpjValue.replace(/\D/g, '');
    if (cleaned.length !== 14 || !validateCNPJ(cleaned)) return;
    if (lastFetchedCNPJ.current === cleaned) return;
    lastFetchedCNPJ.current = cleaned;
    setLoadingCNPJ(true);
    try {
      const result = await fetchCNPJData(cleaned);
      const current = dataRef.current;
      const updated: PrestadorData = {
        ...current,
        nomeEmpresarial: result.razao_social || current.nomeEmpresarial,
        nomeFantasia: result.nome_fantasia || current.nomeFantasia,
        cep: result.cep ? formatCEP(result.cep) : current.cep,
        logradouro: result.logradouro || current.logradouro,
        numero: result.numero || current.numero,
        complemento: result.complemento || current.complemento,
        bairro: result.bairro || current.bairro,
        localidadeUf: result.municipio && result.uf ? `${result.municipio} - ${result.uf}` : current.localidadeUf,
        email: result.email || current.email,
        whatsapp: result.telefone ? formatPhone(result.telefone) : current.whatsapp,
      };
      onChange(updated);
      onAutosave();
      const isSimples = result.opcao_pelo_simples === true;
      const dataOpcao = result.data_opcao_simples
        ? new Date(result.data_opcao_simples).toLocaleDateString('pt-BR')
        : undefined;
      onChange({ ...updated, dataOpcaoSimples: dataOpcao });
      setSimplesStatus(isSimples);
      onSimplesDetected?.(isSimples);
      toast.success('Dados do CNPJ preenchidos automaticamente!');
    } catch {
      toast.error('Não foi possível consultar o CNPJ.');
    } finally {
      setLoadingCNPJ(false);
    }
  }, [onChange, onAutosave, onSimplesDetected]);

  const buscarCEP = useCallback(async (cepValue: string) => {
    const cleaned = cepValue.replace(/\D/g, '');
    if (cleaned.length !== 8) return;
    if (lastFetchedCEP.current === cleaned) return;
    lastFetchedCEP.current = cleaned;
    setLoadingCEP(true);
    try {
      const result = await fetchCEPData(cleaned);
      const current = dataRef.current;
      const updated: PrestadorData = {
        ...current,
        logradouro: result.logradouro || current.logradouro,
        bairro: result.bairro || current.bairro,
        localidadeUf: result.municipio && result.uf ? `${result.municipio} - ${result.uf}` : current.localidadeUf,
      };
      onChange(updated);
      onAutosave();
      toast.success('Endereço preenchido automaticamente!');
    } catch {
      toast.error('Não foi possível consultar o CEP.');
    } finally {
      setLoadingCEP(false);
    }
  }, [onChange, onAutosave]);

  const handleCNPJChange = useCallback((value: string) => {
    const formatted = formatCNPJ(value);
    onChange({ ...dataRef.current, cnpj: formatted });
    onAutosave();
    buscarCNPJ(formatted);
  }, [onChange, onAutosave, buscarCNPJ]);

  const handleCEPChange = useCallback((value: string) => {
    const formatted = formatCEP(value);
    onChange({ ...dataRef.current, cep: formatted });
    onAutosave();
    buscarCEP(formatted);
  }, [onChange, onAutosave, buscarCEP]);

  const handleFieldChange = useCallback((field: string, value: string) => {
    onChange({ ...dataRef.current, [field]: value });
    onAutosave();
  }, [onChange, onAutosave]);

  return {
    loadingCNPJ, loadingCEP, simplesStatus, setSimplesStatus,
    handleCNPJChange, handleCEPChange, handleFieldChange,
  };
}
