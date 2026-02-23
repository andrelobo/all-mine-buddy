import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Users, FileText, MapPin, Loader2, Search, Plus, Globe, ChevronDown } from 'lucide-react';
import { formatCNPJ, formatCEP, formatPhone, validateCNPJ } from '@/utils/validators';
import { formatCPF, validateCPF } from '@/components/TomadorSection';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import type { TomadorDB } from '@/hooks/useTomadores';
export interface TomadorEmissaoData {
  cnpjCpf: string;
  nomeRazaoSocial: string;
  inscricaoMunicipal: string;
  cep: string;
  logradouro: string;
  numero: string;
  complemento: string;
  bairro: string;
  localidadeUf: string;
  email: string;
  pais: string;
}

interface Props {
  data: TomadorEmissaoData;
  onChange: (data: TomadorEmissaoData) => void;
  prestadorId?: string;
}

async function fetchCNPJData(cnpj: string) {
  const cleaned = cnpj.replace(/\D/g, '');
  try {
    const res = await fetch(`https://receitaws.com.br/v1/cnpj/${cleaned}`, {
      headers: { Accept: 'application/json' },
    });
    if (res.ok) {
      const d = await res.json();
      if (d.status !== 'ERROR') {
        return {
          razao_social: d.nome || '',
          cep: d.cep?.replace(/[.\-]/g, '') || '',
          logradouro: d.logradouro || '',
          numero: d.numero || '',
          complemento: d.complemento || '',
          bairro: d.bairro || '',
          municipio: d.municipio || '',
          uf: d.uf || '',
          email: d.email || '',
        };
      }
    }
  } catch { /* fallback */ }
  const res = await fetch(`https://brasilapi.com.br/api/cnpj/v1/${cleaned}`);
  if (!res.ok) throw new Error('CNPJ não encontrado');
  const data = await res.json();
  return {
    razao_social: data.razao_social || '',
    cep: data.cep || '',
    logradouro: data.logradouro || '',
    numero: data.numero || '',
    complemento: data.complemento || '',
    bairro: data.bairro || '',
    municipio: data.municipio || '',
    uf: data.uf || '',
    email: data.email || '',
  };
}

async function fetchCEPData(cep: string) {
  const cleaned = cep.replace(/\D/g, '');
  const res = await fetch(`https://brasilapi.com.br/api/cep/v2/${cleaned}`);
  if (!res.ok) throw new Error('CEP não encontrado');
  const data = await res.json();
  return {
    logradouro: data.street || '',
    bairro: data.neighborhood || '',
    municipio: data.city || '',
    uf: data.state || '',
  };
}

const INITIAL_TOMADOR: TomadorEmissaoData = {
  cnpjCpf: '',
  nomeRazaoSocial: '',
  inscricaoMunicipal: '',
  cep: '',
  logradouro: '',
  numero: '',
  complemento: '',
  bairro: '',
  localidadeUf: '',
  email: '',
  pais: 'Brasil',
};

const TomadorEmissao: React.FC<Props> = ({ data, onChange, prestadorId }) => {
  const [loadingCNPJ, setLoadingCNPJ] = useState(false);
  const [loadingCEP, setLoadingCEP] = useState(false);
  const [tomadoresCadastrados, setTomadoresCadastrados] = useState<TomadorDB[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const lastFetchedCNPJ = useRef('');
  const lastFetchedCEP = useRef('');
  const dataRef = useRef(data);
  dataRef.current = data;

  // Load registered tomadores
  useEffect(() => {
    const load = async () => {
      let query = supabase.from('tomadores').select('*').order('nome_razao_social');
      if (prestadorId) query = query.eq('prestador_id', prestadorId);
      const { data: rows } = await query;
      if (rows) setTomadoresCadastrados(rows as TomadorDB[]);
    };
    load();
  }, [prestadorId]);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const selecionarTomador = (t: TomadorDB) => {
    lastFetchedCNPJ.current = t.cnpj_cpf.replace(/\D/g, '');
    lastFetchedCEP.current = t.cep?.replace(/\D/g, '') || '';
    onChange({
      cnpjCpf: t.cnpj_cpf,
      nomeRazaoSocial: t.nome_razao_social,
      inscricaoMunicipal: t.inscricao_municipal || '',
      cep: t.cep || '',
      logradouro: t.logradouro || '',
      numero: t.numero || '',
      complemento: t.complemento || '',
      bairro: t.bairro || '',
      localidadeUf: t.localidade_uf || '',
      email: t.email || '',
      pais: t.pais || 'Brasil',
    });
    setShowDropdown(false);
    toast.success(`Tomador "${t.nome_razao_social}" selecionado!`);
  };

  const update = (field: keyof TomadorEmissaoData, value: string) => {
    onChange({ ...data, [field]: value });
  };

  const isCPF = data.cnpjCpf.replace(/\D/g, '').length <= 11;

  const buscarCNPJ = useCallback(async (cnpjValue: string) => {
    const cleaned = cnpjValue.replace(/\D/g, '');
    if (cleaned.length !== 14 || !validateCNPJ(cleaned)) return;
    if (lastFetchedCNPJ.current === cleaned) return;
    lastFetchedCNPJ.current = cleaned;
    setLoadingCNPJ(true);
    try {
      const result = await fetchCNPJData(cleaned);
      const current = dataRef.current;
      onChange({
        ...current,
        nomeRazaoSocial: result.razao_social || current.nomeRazaoSocial,
        cep: result.cep ? formatCEP(result.cep) : current.cep,
        logradouro: result.logradouro || current.logradouro,
        numero: result.numero || current.numero,
        complemento: result.complemento || current.complemento,
        bairro: result.bairro || current.bairro,
        localidadeUf: result.municipio && result.uf ? `${result.municipio} - ${result.uf}` : current.localidadeUf,
        email: result.email || current.email,
      });
      toast.success('Dados do tomador preenchidos!');
    } catch {
      toast.error('Não foi possível consultar o CNPJ.');
    } finally {
      setLoadingCNPJ(false);
    }
  }, [onChange]);

  const buscarCEP = useCallback(async (cepValue: string) => {
    const cleaned = cepValue.replace(/\D/g, '');
    if (cleaned.length !== 8) return;
    if (lastFetchedCEP.current === cleaned) return;
    lastFetchedCEP.current = cleaned;
    setLoadingCEP(true);
    try {
      const result = await fetchCEPData(cleaned);
      const current = dataRef.current;
      onChange({
        ...current,
        logradouro: result.logradouro || current.logradouro,
        bairro: result.bairro || current.bairro,
        localidadeUf: result.municipio && result.uf ? `${result.municipio} - ${result.uf}` : current.localidadeUf,
      });
      toast.success('Endereço preenchido!');
    } catch {
      toast.error('Não foi possível consultar o CEP.');
    } finally {
      setLoadingCEP(false);
    }
  }, [onChange]);

  const handleDocChange = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    const formatted = cleaned.length <= 11 ? formatCPF(value) : formatCNPJ(value);
    onChange({ ...data, cnpjCpf: formatted });
    if (cleaned.length === 14) buscarCNPJ(formatted);
  };

  const handleCEPChange = (value: string) => {
    const formatted = formatCEP(value);
    onChange({ ...data, cep: formatted });
    buscarCEP(formatted);
  };

  return (
    <div className="section-card">
      <div className="flex items-center justify-between mb-4">
        <h2 className="section-title mb-0">
          <Users className="w-5 h-5 text-primary" />
          Tomador(a)
        </h2>
        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center gap-1 text-[11px] py-1 px-2 rounded-md border border-destructive text-destructive hover:bg-destructive/10 transition-colors font-bold animate-pulse"
          >
            <Search className="w-3.5 h-3.5" />
            Selecione ({tomadoresCadastrados.length})
            <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
          </button>
          {showDropdown && tomadoresCadastrados.length > 0 && (
            <div className="absolute right-0 top-full mt-1 w-80 max-h-60 overflow-y-auto bg-card border border-border rounded-lg shadow-lg z-20">
              {tomadoresCadastrados.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => selecionarTomador(t)}
                  className="w-full text-left px-3 py-2.5 hover:bg-muted/50 transition-colors border-b border-border/50 last:border-0"
                >
                  <p className="text-sm font-medium text-foreground truncate">{t.nome_razao_social}</p>
                  <p className="text-xs text-muted-foreground">{t.cnpj_cpf} · {t.localidade_uf || '—'}</p>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[1fr_0.8fr_4fr] gap-4">
        <div>
          <label className="field-label flex items-center gap-1">
            <FileText className="w-3.5 h-3.5" />CNPJ/CPF*
          </label>
          <div className="flex gap-2">
            <input
              className="field-input"
              placeholder="00.000.000/0000-00"
              value={data.cnpjCpf}
              onChange={(e) => handleDocChange(e.target.value)}
              maxLength={18}
            />
            {loadingCNPJ && (
              <div className="flex items-center px-2">
                <Loader2 className="w-4 h-4 animate-spin text-primary" />
              </div>
            )}
          </div>
        </div>
        <div>
          <label className="field-label">Inscrição Municipal</label>
          <input
            className="field-input"
            placeholder="Inscrição"
            value={data.inscricaoMunicipal}
            onChange={(e) => update('inscricaoMunicipal', e.target.value)}
          />
        </div>
        <div>
          <label className="field-label">TOMADOR(A)*</label>
          <input
            className="field-input"
            placeholder={isCPF ? 'Nome completo' : 'Razão social'}
            value={data.nomeRazaoSocial}
            onChange={(e) => update('nomeRazaoSocial', e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};

export { INITIAL_TOMADOR };
export default TomadorEmissao;
