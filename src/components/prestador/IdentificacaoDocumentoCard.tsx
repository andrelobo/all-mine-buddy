import React from 'react';
import { FileText } from 'lucide-react';

interface Props {
  competencia: string;
  onCompetenciaChange: (v: string) => void;
  dataEmissao: string;
  onDataEmissaoChange: (v: string) => void;
  nfseNum: string;
  onNfseNumChange: (v: string) => void;
  dpsNum: string;
  onDpsNumChange: (v: string) => void;
  serieDpsNum: string;
  onSerieDpsNumChange: (v: string) => void;
}

const IdentificacaoDocumentoCard: React.FC<Props> = ({
  competencia, onCompetenciaChange,
  dataEmissao, onDataEmissaoChange,
  nfseNum, onNfseNumChange,
  dpsNum, onDpsNumChange,
  serieDpsNum, onSerieDpsNumChange,
}) => (
  <div className="section-card">
    <h2 className="section-title">
      <FileText className="w-5 h-5 text-primary" />
      Identificação do Documento
    </h2>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
      <div>
        <label className="field-label">Competência</label>
        <input
          className="field-input"
          placeholder="mm/aaaa"
          value={competencia}
          onChange={e => {
            let v = e.target.value.replace(/[^0-9]/g, '');
            if (v.length > 2) v = v.slice(0, 2) + '/' + v.slice(2, 6);
            onCompetenciaChange(v);
          }}
          maxLength={7}
        />
      </div>
      <div>
        <label className="field-label">Data de Emissão</label>
        <input className="field-input" type="date" value={dataEmissao} onChange={e => onDataEmissaoChange(e.target.value)} />
      </div>
      <div>
        <label className="field-label">NFS-e Nº</label>
        <input className="field-input" placeholder="Número" value={nfseNum} onChange={e => onNfseNumChange(e.target.value.replace(/\D/g, ''))} />
      </div>
      <div>
        <label className="field-label">DPS Nº</label>
        <input className="field-input" placeholder="Número" value={dpsNum} onChange={e => onDpsNumChange(e.target.value.replace(/\D/g, ''))} />
      </div>
      <div>
        <label className="field-label">Série DPS Nº</label>
        <input className="field-input" placeholder="Número" value={serieDpsNum} onChange={e => onSerieDpsNumChange(e.target.value.replace(/\D/g, ''))} />
      </div>
    </div>
  </div>
);

export default IdentificacaoDocumentoCard;
