import React from 'react';
import { Building2, MapPin, Mail } from 'lucide-react';
import { formatCNPJ, formatCEP, formatPhone } from '@/utils/validators';

interface PrestadorData {
  nomeEmpresarial: string;
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

const PrestadorSection: React.FC<Props> = ({ data, onChange, onAutosave }) => {
  const update = (field: keyof PrestadorData, value: string) => {
    onChange({ ...data, [field]: value });
    onAutosave();
  };

  return (
    <div className="section-card">
      <h2 className="section-title">
        <Building2 className="w-5 h-5 text-primary" />
        Dados do Prestador
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <label className="field-label">Nome Empresarial / Razão Social</label>
          <input
            className="field-input"
            placeholder="Razão social da empresa"
            value={data.nomeEmpresarial}
            onChange={(e) => update('nomeEmpresarial', e.target.value)}
          />
        </div>

        <div>
          <label className="field-label">CNPJ *</label>
          <input
            className="field-input"
            placeholder="00.000.000/0000-00"
            value={data.cnpj}
            onChange={(e) => update('cnpj', formatCNPJ(e.target.value))}
            maxLength={18}
          />
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
