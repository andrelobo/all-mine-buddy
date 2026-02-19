import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Building2, MapPin, Mail, Loader2, CheckCircle, XCircle, HelpCircle } from 'lucide-react';
import { formatCNPJ, formatCEP, formatPhone, validateCNPJ } from '@/utils/validators';
import { toast } from 'sonner';

interface PrestadorData {
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

interface Props {
  data: PrestadorData;
  onChange: (data: PrestadorData) => void;
  onAutosave: () => void;
}

async function fetchCNPJData(cnpj: string) {
  const cleaned = cnpj.replace(/\D/g, '');
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
    opcao_pelo_simples: data.opcao_pelo_simples ?? null,
    opcao_pelo_mei: data.opcao_pelo_mei ?? null,
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

const PrestadorSection: React.FC<Props> = ({ data, onChange, onAutosave }) => {
  const [loadingCNPJ, setLoadingCNPJ] = useState(false);
  const [loadingCEP, setLoadingCEP] = useState(false);
  const [simplesStatus, setSimplesStatus] = useState<{ simples: boolean | null; mei: boolean | null }>({ simples: null, mei: null });
  const [simplesChecked, setSimplesChecked] = useState(false);
  const lastFetchedCNPJ = useRef('');
  const lastFetchedCEP = useRef('');
  const dataRef = useRef(data);
  dataRef.current = data;

  const update = (field: keyof PrestadorData, value: string) => {
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
      const updated: PrestadorData = {
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
        whatsapp: result.telefone
          ? formatPhone(result.telefone)
          : current.whatsapp,
      };
      onChange(updated);
      onAutosave();
      setSimplesStatus({ simples: result.opcao_pelo_simples, mei: result.opcao_pelo_mei });
      setSimplesChecked(true);
      toast.success('Dados do CNPJ preenchidos automaticamente!');
    } catch {
      setSimplesChecked(false);
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
      const updated: PrestadorData = {
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

  const handleCNPJChange = (value: string) => {
    const formatted = formatCNPJ(value);
    onChange({ ...data, cnpj: formatted });
    onAutosave();
    buscarCNPJ(formatted);
  };

  const handleCEPChange = (value: string) => {
    const formatted = formatCEP(value);
    onChange({ ...data, cep: formatted });
    onAutosave();
    buscarCEP(formatted);
  };

  return (
    <div className="section-card">
      <h2 className="section-title">
        <Building2 className="w-5 h-5 text-primary" />
        O Prestador
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-[1.2fr_1fr_3fr] gap-4">
        <div>
          <label className="field-label">CNPJ *</label>
          <div className="flex gap-2">
            <input
              className="field-input"
              placeholder="00.000.000/0000-00"
              value={data.cnpj}
              onChange={(e) => handleCNPJChange(e.target.value)}
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
            placeholder="Nº inscrição municipal"
            value={data.inscricaoMunicipal}
            onChange={(e) => update('inscricaoMunicipal', e.target.value)}
          />
        </div>

        <div>
          <label className="field-label">Nome Empresarial</label>
          <input
            className="field-input"
            placeholder="Razão social da empresa"
            value={data.nomeEmpresarial}
            onChange={(e) => update('nomeEmpresarial', e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
        <div>
          <label className="field-label">Simples Nacional</label>
          <div className="field-input flex items-center gap-2 cursor-default">
            <span className={`w-3 h-3 rounded-full inline-block ${
              simplesChecked ? (simplesStatus.simples === true ? 'bg-green-500' : 'bg-red-500') : 'bg-muted-foreground/40'
            }`} />
            <span className="text-sm text-foreground">
              {simplesChecked ? (simplesStatus.simples === true ? 'Optante' : 'Não optante') : ''}
            </span>
          </div>
        </div>
        <div>
          <label className="field-label">Inscrição Estadual</label>
          <input
            className="field-input"
            placeholder="Nº inscrição estadual"
            value={data.inscricaoEstadual}
            onChange={(e) => update('inscricaoEstadual', e.target.value)}
          />
        </div>
        <div>
          <label className="field-label">Inscrição Suframa</label>
          <input
            className="field-input"
            placeholder="Nº SUFRAMA (opcional)"
            value={data.suframa}
            onChange={(e) => update('suframa', e.target.value)}
          />
        </div>
      </div>

      {/* Endereço */}
      <div className="mt-5 pt-5 border-t border-border">
        <h3 className="text-sm font-medium text-muted-foreground flex items-center gap-2 mb-4">
          <MapPin className="w-4 h-4" />
          Endereço
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-[1fr_3fr_0.5fr] gap-4">
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
        </div>
        <div className="grid grid-cols-3 gap-4 mt-4">
          <div>
            <label className="field-label">Complemento</label>
            <input
              className="field-input"
              placeholder="Sala, andar, etc."
              value={data.complemento}
              onChange={(e) => update('complemento', e.target.value)}
            />
          </div>
          <div>
            <label className="field-label">Bairro</label>
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

export default PrestadorSection;
