import React, { useState, useCallback } from 'react';
import { Building2, MapPin, Mail, Loader2, Search } from 'lucide-react';
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
  return res.json();
}

const PrestadorSection: React.FC<Props> = ({ data, onChange, onAutosave }) => {
  const [loading, setLoading] = useState(false);

  const update = (field: keyof PrestadorData, value: string) => {
    onChange({ ...data, [field]: value });
    onAutosave();
  };

  const handleCNPJChange = (value: string) => {
    const formatted = formatCNPJ(value);
    onChange({ ...data, cnpj: formatted });
    onAutosave();
  };

  const buscarCNPJ = useCallback(async () => {
    const cleaned = data.cnpj.replace(/\D/g, '');
    if (!validateCNPJ(cleaned)) {
      toast.error('Informe um CNPJ válido para buscar.');
      return;
    }
    setLoading(true);
    try {
      const result = await fetchCNPJData(cleaned);
      const updated: PrestadorData = {
        ...data,
        nomeEmpresarial: result.razao_social || data.nomeEmpresarial,
        nomeFantasia: result.nome_fantasia || data.nomeFantasia,
        cep: result.cep ? formatCEP(result.cep) : data.cep,
        logradouro: result.logradouro || data.logradouro,
        numero: result.numero || data.numero,
        complemento: result.complemento || data.complemento,
        bairro: result.bairro || data.bairro,
        localidadeUf: result.municipio && result.uf
          ? `${result.municipio} - ${result.uf}`
          : data.localidadeUf,
        email: result.email || data.email,
        whatsapp: result.ddd_telefone_1
          ? formatPhone(result.ddd_telefone_1.replace(/\D/g, ''))
          : data.whatsapp,
      };
      onChange(updated);
      onAutosave();
      toast.success('Dados preenchidos automaticamente!');
    } catch {
      toast.error('Não foi possível consultar o CNPJ. Verifique e tente novamente.');
    } finally {
      setLoading(false);
    }
  }, [data, onChange, onAutosave]);

  return (
    <div className="section-card">
      <h2 className="section-title">
        <Building2 className="w-5 h-5 text-primary" />
        Dados do Prestador
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-[1.5fr_3fr_2fr] gap-4">
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
            <button
              type="button"
              onClick={buscarCNPJ}
              disabled={loading}
              className="btn-outline shrink-0 flex items-center gap-1.5 px-3"
              title="Buscar dados do CNPJ"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Search className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        <div className="md:col-span-2 lg:col-span-2">
          <label className="field-label">Nome Empresarial</label>
          <input
            className="field-input"
            placeholder="Razão social da empresa"
            value={data.nomeEmpresarial}
            onChange={(e) => update('nomeEmpresarial', e.target.value)}
          />
        </div>

        <div>
          <label className="field-label">Nome Fantasia</label>
          <input
            className="field-input"
            placeholder="Nome fantasia"
            value={data.nomeFantasia}
            onChange={(e) => update('nomeFantasia', e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mt-4">
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
          <label className="field-label">Inscrição Estadual</label>
          <input
            className="field-input"
            placeholder="Nº inscrição estadual"
            value={data.inscricaoEstadual}
            onChange={(e) => update('inscricaoEstadual', e.target.value)}
          />
        </div>
        <div>
          <label className="field-label">SUFRAMA</label>
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="field-label">CEP</label>
            <input
              className="field-input"
              placeholder="00000-000"
              value={data.cep}
              onChange={(e) => update('cep', formatCEP(e.target.value))}
              maxLength={9}
            />
          </div>
          <div className="lg:col-span-2">
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
          <div className="lg:col-span-2">
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
