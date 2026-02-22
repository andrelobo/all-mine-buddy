import React from 'react';
import { Building2, FileText, MapPin, Landmark } from 'lucide-react';

interface PrestadorResumoData {
  cnpj: string;
  inscricaoMunicipal: string;
  nomeEmpresarial: string;
  nomeFantasia: string;
  logradouro: string;
  numero: string;
  complemento: string;
  bairro: string;
  localidadeUf: string;
  cep: string;
  regime: string;
  cnae: string;
  cnaeDescricao: string;
  codigoServico: string;
}

interface Props {
  data: PrestadorResumoData;
}

const InfoRow: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div>
    <span className="text-xs text-muted-foreground">{label}</span>
    <p className="text-sm text-foreground font-medium truncate">{value || '—'}</p>
  </div>
);

const PrestadorResumo: React.FC<Props> = ({ data }) => {
  const endereco = [data.logradouro, data.numero, data.complemento, data.bairro]
    .filter(Boolean)
    .join(', ');

  return (
    <div className="section-card">
      <h2 className="section-title">
        <Building2 className="w-5 h-5 text-primary" />
        Prestador
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr_2fr] gap-4">
        <InfoRow label="CNPJ" value={data.cnpj} />
        <InfoRow label="Inscrição Municipal" value={data.inscricaoMunicipal} />
        <InfoRow label="Razão Social" value={data.nomeEmpresarial} />
      </div>

      {data.nomeFantasia && (
        <div className="mt-3">
          <InfoRow label="Nome Fantasia" value={data.nomeFantasia} />
        </div>
      )}

      <div className="mt-4 pt-4 border-t border-border">
        <div className="flex items-center gap-1 mb-3">
          <MapPin className="w-3.5 h-3.5 text-muted-foreground" />
          <span className="text-xs font-bold text-foreground">Endereço</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-[3fr_1fr] gap-4">
          <InfoRow label="Logradouro" value={endereco} />
          <InfoRow label="Localidade / UF" value={data.localidadeUf} />
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-border">
        <div className="flex items-center gap-1 mb-3">
          <Landmark className="w-3.5 h-3.5 text-muted-foreground" />
          <span className="text-xs font-bold text-foreground">Configuração Fiscal</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <InfoRow label="Regime Tributário" value={data.regime} />
          <InfoRow label="CNAE" value={data.cnae ? `${data.cnae} - ${data.cnaeDescricao}` : ''} />
          <InfoRow label="Código de Serviço" value={data.codigoServico} />
        </div>
      </div>
    </div>
  );
};

export default PrestadorResumo;
