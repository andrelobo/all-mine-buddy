import React, { useState } from 'react';
import { Scale, ChevronDown, Info } from 'lucide-react';

export type ParametroISSOption = 
  | 'iss_outro_municipio'
  | 'iss_proprio_municipio'
  | 'iss_retencao_substituicao'
  | '';

interface Props {
  value?: ParametroISSOption;
  onChange?: (v: ParametroISSOption) => void;
  onAutosave?: () => void;
  disabled?: boolean;
}

const PARAMETROS = [
  'Não sujeitos ao fator "r" e tributados pelo Anexo III, sem retenção/substituição tributária de ISS, com ISS devido a outro(s) Município(s).',
  'Não sujeitos ao fator "r" e tributados pelo Anexo III, sem retenção/substituição tributária de ISS, com ISS devido ao próprio Município do estabelecimento.',
  'Não sujeitos ao fator "r" e tributados pelo Anexo III, com retenção/substituição tributária de ISS.',
];

const ParametrosTributariosSNCard: React.FC<Props> = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="section-card p-3">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full text-left"
      >
        <h2 className="section-title text-sm mb-0 flex items-center gap-1.5">
          <Scale className="w-4 h-4 text-primary" />
          Parâmetros Tributários – Anexo III (sem Fator R)
        </h2>
        <ChevronDown
          className={`w-4 h-4 text-muted-foreground transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open && (
        <div className="mt-3 space-y-2">
          <div className="flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
            <span className="text-[10px] text-muted-foreground">
              Regra automática na emissão da nfse por tomador e local.
            </span>
          </div>
          <ul className="space-y-1.5">
            {PARAMETROS.map((texto, i) => (
              <li key={i} className="text-xs text-foreground leading-snug pl-3 border-l-2 border-primary/30">
                {texto}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ParametrosTributariosSNCard;
