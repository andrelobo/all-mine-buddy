import React, { useState } from 'react';
import { Scale, ChevronDown, ChevronUp } from 'lucide-react';

export type ParametroISSOption = 
  | 'iss_outro_municipio'
  | 'iss_proprio_municipio'
  | 'iss_retencao_substituicao'
  | '';

interface Props {
  value: ParametroISSOption;
  onChange: (v: ParametroISSOption) => void;
  onAutosave: () => void;
  disabled?: boolean;
}

const OPTIONS: { value: ParametroISSOption; label: string }[] = [
  {
    value: 'iss_outro_municipio',
    label: 'Não sujeitos ao fator "r" e tributados pelo Anexo III, sem retenção/substituição tributária de ISS, com ISS devido a outro(s) Município(s)',
  },
  {
    value: 'iss_proprio_municipio',
    label: 'Não sujeitos ao fator "r" e tributados pelo Anexo III, sem retenção/substituição tributária de ISS, com ISS devido ao próprio Município do estabelecimento',
  },
  {
    value: 'iss_retencao_substituicao',
    label: 'Não sujeitos ao fator "r" e tributados pelo Anexo III, com retenção/substituição tributária de ISS',
  },
];

const ParametrosTributariosSNCard: React.FC<Props> = ({ value, onChange, onAutosave, disabled = false }) => {
  const [open, setOpen] = useState(true);

  const handleSelect = (opt: ParametroISSOption) => {
    if (disabled) return;
    onChange(opt);
    onAutosave();
  };

  return (
    <div className="section-card p-3">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="section-title text-sm w-full flex items-center justify-between cursor-pointer"
      >
        <span className="flex items-center gap-2">
          <Scale className="w-4 h-4 text-primary" />
          Prestação Serviço, exceto para o exterior
        </span>
        {open ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
      </button>

      {open && (
        <div className="space-y-2 mt-3">
          {OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => handleSelect(opt.value)}
              className={`radio-card text-left p-2.5 w-full ${value === opt.value ? 'radio-card-selected' : ''}`}
            >
              <div className={`w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 ${
                value === opt.value ? 'border-primary' : 'border-muted-foreground/40'
              }`}>
                {value === opt.value && <div className="w-1.5 h-1.5 rounded-full bg-primary" />}
              </div>
              <span className="text-xs text-foreground leading-snug">{opt.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ParametrosTributariosSNCard;
