import React, { useState, useCallback, useRef } from 'react';
import { Building2, MapPin, Mail, Loader2 } from 'lucide-react';
import { formatCNPJ, formatCEP, formatPhone, validateCNPJ } from '@/utils/validators';
import { toast } from 'sonner';

export interface TomadorData {
  nomeEmpresarial: string;
  nomeFantasia: string;
  cnpjCpf: string;
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

interface Props {
  data: TomadorData;
  onChange: (data: TomadorData) => void;
  onAutosave: () => void;
}

function formatCPF(value: string): string {
  const cleaned = value.replace(/\D/g, '').slice(0, 11);
  return cleaned
    .replace(/^(\d{3})(\d)/, '$1.$2')
    .replace(/^(\d{3})\.(\d{3})(\d)/, '$1.$2.$3')
    .replace(/\.(\d{3})(\d)/, '.$1-$2');
}

function validateCPF(cpf: string): boolean {
  const cleaned = cpf.replace(/\D/g, '');
  if (cleaned.length !== 11) return false;
  if (/^(\d)\1+$/.test(cleaned)) return false;
  let sum = 0;
  for (let i = 0; i < 9; i++) sum += parseInt(cleaned[i]) * (10 - i);
  let rest = (sum * 10) % 11;
  if (rest === 10) rest = 0;
  if (parseInt(cleaned[9]) !== rest) return false;
  sum = 0;
  for (let i = 0; i < 10; i++) sum += parseInt(cleaned[i]) * (11 - i);
  rest = (sum * 10) % 11;
  if (rest === 10) rest = 0;
  return parseInt(cleaned[10]) === rest;
}

function isCPF(value: string): boolean {
  return value.replace(/\D/g, '').length <= 11;
}

async function fetchCNPJData(cnpj: string) {
  const cleaned = cnpj.replace(/\D/g, '');
  try {
    const res = await fetch(`https://receitaws.com.br/v1/cnpj/${cleaned}`, {
      headers: { 'Accept': 'application/json' },
    });
    if (res.ok) {
      const d = await res.json();
      if (d.status !== 'ERROR') {
        return {
          razao_social: d.nome || '',
          nome_fantasia: d.fantasia || '',
          cep: d.cep?.replace(/[.\-]/g, '') || '',
          logradouro: d.logradouro || '',
          numero: d.numero || '',
          complemento: d.complemento || '',
          bairro: d.bairro || '',
          municipio: d.municipio || '',
          uf: d.uf || '',
          email: d.email || '',
          telefone: d.telefone?.replace(/\D/g, '') || '',
        };
      }
    }
  } catch {
    // fallback
  }
  const res = await fetch(`https://brasilapi.com.br/api/cnpj/v1/${cleaned}`);
  if (!res.ok) throw new Error('CNPJ não encontrado');
  const data = await res.json();
  return {
    razao_social: data.razao_social || '',
    nome_fantasia: data.nome_fantasia || '',
    cep: data.cep || '',
    logradouro: data.logradouro || '',
    numero: data.numero || '',
    complemento: data.complemento || '',
    bairro: data.bairro || '',
    municipio: data.municipio || '',
    uf: data.uf || '',
    email: data.email || '',
    telefone: data.ddd_telefone_1?.replace(/\D/g, '') || '',
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

const TomadorSection: React.FC<Props> = ({ data, onChange, onAutosave }) => {
  const [loadingCNPJ, setLoadingCNPJ] = useState(false);
  const [loadingCEP, setLoadingCEP] = useState(false);
  const lastFetchedCNPJ = useRef('');
  const lastFetchedCEP = useRef('');
  const dataRef = useRef(data);
  dataRef.current = data;

  const update = (field: keyof TomadorData, value: string) => {
    onChange({ ...data, [field]: value });
    onAutosave();
  };

  const buscarCNPJ = useCallback(async (cnpjValue: string) => {
    const cleaned = cnpjValue.replace(/\D/g, '');
    if (cleaned.length !== 14 || !validateCNPJ(cleaned)) return;
    if (lastFetchedCNPJ.current === cleaned) return;
    lastFetchedCNPJ.current = cleaned;
    setLoadingCNPJ(true);
    try {
      const result = await fetchCNPJData(cleaned);
      const current = dataRef.current;
      const updated: TomadorData = {
        ...current,
        nomeEmpresarial: result.razao_social || current.nomeEmpresarial,
        nomeFantasia: result.nome_fantasia || current.nomeFantasia,
        cep: result.cep ? formatCEP(result.cep) : current.cep,
        logradouro: result.logradouro || current.logradouro,
        numero: result.numero || current.numero,
        complemento: result.complemento || current.complemento,
        bairro: result.bairro || current.bairro,
        localidadeUf: result.municipio && result.uf
          ? `${result.municipio} - ${result.uf}`
          : current.localidadeUf,
        email: result.email || current.email,
        whatsapp: result.telefone ? formatPhone(result.telefone) : current.whatsapp,
      };
      onChange(updated);
      onAutosave();
      toast.success('Dados do CNPJ preenchidos automaticamente!');
    } catch {
      toast.error('Não foi possível consultar o CNPJ.');
    } finally {
      setLoadingCNPJ(false);
    }
  }, [onChange, onAutosave]);

  const buscarCEP = useCallback(async (cepValue: string) => {
    const cleaned = cepValue.replace(/\D/g, '');
    if (cleaned.length !== 8) return;
    if (lastFetchedCEP.current === cleaned) return;
    lastFetchedCEP.current = cleaned;
    setLoadingCEP(true);
    try {
      const result = await fetchCEPData(cleaned);
      const current = dataRef.current;
      const updated: TomadorData = {
        ...current,
        logradouro: result.logradouro || current.logradouro,
        bairro: result.bairro || current.bairro,
        localidadeUf: result.municipio && result.uf
          ? `${result.municipio} - ${result.uf}`
          : current.localidadeUf,
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

  const handleCNPJCPFChange = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    let formatted: string;
    if (cleaned.length <= 11) {
      formatted = formatCPF(value);
    } else {
      formatted = formatCNPJ(value);
    }
    onChange({ ...data, cnpjCpf: formatted });
    onAutosave();
    if (cleaned.length === 14) {
      buscarCNPJ(formatted);
    }
  };

  const handleCEPChange = (value: string) => {
    const formatted = formatCEP(value);
    onChange({ ...data, cep: formatted });
    onAutosave();
    buscarCEP(formatted);
  };

  const currentIsCPF = isCPF(data.cnpjCpf);

  return (
    <div className="section-card">
      <h2 className="section-title">
        <Building2 className="w-5 h-5 text-primary" />
        Tomadores
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-[1.2fr_1fr_1fr] gap-4">
        <div>
          <label className="field-label">CNPJ/CPF*</label>
          <div className="flex gap-2">
            <input
              className="field-input"
              placeholder={currentIsCPF ? '000.000.000-00' : '00.000.000/0000-00'}
              value={data.cnpjCpf}
              onChange={(e) => handleCNPJCPFChange(e.target.value)}
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
          <label className="field-label">Inscrição Estadual</label>
          <input
            className="field-input"
            placeholder="Inscrição"
            value={data.inscricaoEstadual}
            onChange={(e) => update('inscricaoEstadual', e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 mt-4">
        <div>
          <label className="field-label">Tomador(a)</label>
          <input
            className="field-input"
            placeholder={currentIsCPF ? 'Nome completo do tomador' : 'Razão social da empresa'}
            value={data.nomeEmpresarial}
            onChange={(e) => update('nomeEmpresarial', e.target.value)}
          />
        </div>
      </div>

      {/* Endereço */}
      <div className="mt-5 pt-5 border-t border-border">
        <h3 className="text-sm font-medium text-muted-foreground flex items-center gap-2 mb-4">
          <MapPin className="w-4 h-4" />
          Endereço
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-[0.7fr_2fr_0.3fr_0.8fr_1fr] gap-4">
          <div>
            <label className="field-label">CEP</label>
            <input
              className="field-input"
              placeholder="00000-000"
              value={data.cep}
              onChange={(e) => handleCEPChange(e.target.value)}
              maxLength={9}
            />
            {loadingCEP && (
              <Loader2 className="w-4 h-4 animate-spin text-primary mt-2" />
            )}
          </div>
          <div>
            <label className="field-label">Logradouro</label>
            <input
              className="field-input"
              placeholder="Rua, Av., etc."
              value={data.logradouro}
              onChange={(e) => update('logradouro', e.target.value)}
            />
          </div>
          <div>
            <label className="field-label">Número</label>
            <input
              className="field-input"
              placeholder="Nº"
              value={data.numero}
              onChange={(e) => update('numero', e.target.value)}
            />
          </div>
          <div>
            <label className="field-label">Bairro/Distrito</label>
            <input
              className="field-input"
              placeholder="Bairro"
              value={data.bairro}
              onChange={(e) => update('bairro', e.target.value)}
            />
          </div>
          <div>
            <label className="field-label">Localidade / UF</label>
            <input
              className="field-input"
              placeholder="Cidade - UF"
              value={data.localidadeUf}
              onChange={(e) => update('localidadeUf', e.target.value)}
            />
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4 mt-4">
          <div>
            <label className="field-label">Complemento</label>
            <input
              className="field-input"
              placeholder="Sala, andar, etc."
              value={data.complemento}
              onChange={(e) => update('complemento', e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Contato */}
      <div className="mt-5 pt-5 border-t border-border">
        <h3 className="text-sm font-medium text-muted-foreground flex items-center gap-2 mb-4">
          <Mail className="w-4 h-4" />
          Contato
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="field-label">E-mail</label>
            <input
              className="field-input"
              type="email"
              placeholder="contato@empresa.com.br"
              value={data.email}
              onChange={(e) => update('email', e.target.value)}
            />
          </div>
          <div>
            <label className="field-label">WhatsApp</label>
            <input
              className="field-input"
              placeholder="(00) 00000-0000"
              value={data.whatsapp}
              onChange={(e) => update('whatsapp', formatPhone(e.target.value))}
              maxLength={15}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export { validateCPF, formatCPF };
export default TomadorSection;
