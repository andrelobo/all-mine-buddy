import React from 'react';
import { Settings, Percent } from 'lucide-react';

export type RegimeTributario = 'simples' | 'presumido' | 'real' | null;

interface Props {
  regime: RegimeTributario;
  onRegimeChange: (r: RegimeTributario) => void;
  regimeApuracaoSN: boolean;
  onRegimeApuracaoChange: (v: boolean) => void;
  informarAliquotaSN: boolean;
  onInformarAliquotaChange: (v: boolean) => void;
  aliquotaSN: string;
  onAliquotaSNChange: (v: string) => void;
  preencherValores: boolean;
  onPreencherValoresChange: (v: boolean) => void;
  configurarPercentuais: boolean;
  onConfigurarPercentuaisChange: (v: boolean) => void;
  federal: string;
  onFederalChange: (v: string) => void;
  estadual: string;
  onEstadualChange: (v: string) => void;
  municipal: string;
  onMunicipalChange: (v: string) => void;
  onAutosave: () => void;
}

const Toggle: React.FC<{ checked: boolean; onChange: (v: boolean) => void; label: string }> = ({
  checked, onChange, label,
}) => (
  <label className="flex items-center gap-3 cursor-pointer select-none">
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`switch-track ${checked ? 'switch-track-on' : 'switch-track-off'}`}
    >
      <span className={`switch-thumb ${checked ? 'translate-x-4' : 'translate-x-0'}`} />
    </button>
    <span className="text-sm text-foreground">{label}</span>
  </label>
);

const RegimeEParametrosSection: React.FC<Props> = ({
  regime, onRegimeChange,
  regimeApuracaoSN, onRegimeApuracaoChange,
  informarAliquotaSN, onInformarAliquotaChange,
  aliquotaSN, onAliquotaSNChange,
  preencherValores, onPreencherValoresChange,
  configurarPercentuais, onConfigurarPercentuaisChange,
  federal, onFederalChange,
  estadual, onEstadualChange,
  municipal, onMunicipalChange,
  onAutosave,
}) => {
  const regimes: { value: RegimeTributario; label: string; desc: string }[] = [
    { value: 'simples', label: 'Simples Nacional', desc: 'MEI, ME e EPP optantes pelo Simples' },
    { value: 'presumido', label: 'Lucro Presumido', desc: 'Tributação com base na presunção de lucro' },
    { value: 'real', label: 'Lucro Real', desc: 'Apuração com base no lucro efetivo' },
  ];

  const handleRegimeChange = (r: RegimeTributario) => {
    onRegimeChange(r);
    onAutosave();
  };

  return (
    <div className="section-card">
      <h2 className="section-title">
        <Settings className="w-5 h-5 text-primary" />
        Parâmetros Tributários
      </h2>

      {/* Regime selection */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-5">
        {regimes.map((r) => (
          <button
            key={r.value}
            type="button"
            onClick={() => handleRegimeChange(r.value)}
            className={`radio-card text-left ${regime === r.value ? 'radio-card-selected' : ''}`}
          >
            <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${
              regime === r.value ? 'border-primary' : 'border-muted-foreground/40'
            }`}>
              {regime === r.value && <div className="w-2 h-2 rounded-full bg-primary" />}
            </div>
            <div>
              <div className="text-sm font-medium text-foreground">{r.label}</div>
              <div className="text-xs text-muted-foreground">{r.desc}</div>
            </div>
          </button>
        ))}
      </div>

      {/* Simples Nacional options */}
      {regime === 'simples' && (
        <div className="space-y-4 p-4 rounded-lg bg-muted/50 border border-border mb-5">
          <Toggle
            checked={preencherValores}
            onChange={(v) => { onPreencherValoresChange(v); onAutosave(); }}
            label="Preencher os valores monetários em cada NFS-e emitida"
          />
          <Toggle
            checked={configurarPercentuais}
            onChange={(v) => { onConfigurarPercentuaisChange(v); onAutosave(); }}
            label="Configurar os valores percentuais correspondentes"
          />
          <Toggle
            checked={informarAliquotaSN}
            onChange={(v) => { onInformarAliquotaChange(v); onAutosave(); }}
            label="Informar alíquota do Simples Nacional"
          />
          {informarAliquotaSN && (
            <div className="pl-[52px]">
              <label className="field-label whitespace-nowrap">Alíquota Simples Nacional</label>
              <div className="relative w-[72px]">
                <input
                  className="field-input pr-7"
                  type="text"
                  placeholder="00,00"
                  maxLength={5}
                  value={aliquotaSN}
                  onChange={(e) => {
                    let v = e.target.value.replace(/[^\d]/g, '').slice(0, 4);
                    if (v.length > 2) v = v.slice(0, -2) + ',' + v.slice(-2);
                    onAliquotaSNChange(v);
                    onAutosave();
                  }}
                />
                <span className="absolute right-2 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">%</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Parâmetros adicionais */}
      <div className="space-y-4 pt-4 border-t border-border">
        <h3 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
          <Percent className="w-4 h-4" />
          Parâmetros de Valores e Percentuais
        </h3>

        <Toggle
          checked={preencherValores}
          onChange={(v) => { onPreencherValoresChange(v); onAutosave(); }}
          label="Preencher valores de deduções automaticamente"
        />

        <Toggle
          checked={configurarPercentuais}
          onChange={(v) => { onConfigurarPercentuaisChange(v); onAutosave(); }}
          label="Configurar percentuais de tributos manualmente"
        />

        {configurarPercentuais && (
          <div className="ml-12 grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl">
            <div>
              <label className="field-label">Federal (%)</label>
              <input
                className="field-input"
                placeholder="0.00"
                value={federal}
                onChange={(e) => { onFederalChange(e.target.value); onAutosave(); }}
              />
            </div>
            <div>
              <label className="field-label">Estadual (%)</label>
              <input
                className="field-input"
                placeholder="0.00"
                value={estadual}
                onChange={(e) => { onEstadualChange(e.target.value); onAutosave(); }}
              />
            </div>
            <div>
              <label className="field-label">Municipal (%)</label>
              <input
                className="field-input"
                placeholder="0.00"
                value={municipal}
                onChange={(e) => { onMunicipalChange(e.target.value); onAutosave(); }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RegimeEParametrosSection;
