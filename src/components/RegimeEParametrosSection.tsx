import React from 'react';
import { Settings, Percent } from 'lucide-react';

export type RegimeTributario = 'simples' | 'presumido' | 'real' | null;

export interface PercentuaisTributarios {
  federal: string;
  estadual: string;
  municipal: string;
}

interface Props {
  regime: RegimeTributario;
  onRegimeChange: (r: RegimeTributario) => void;
  regimeApuracaoSN: string;
  onRegimeApuracaoChange: (v: string) => void;
  informarAliquotaSN: boolean;
  onInformarAliquotaChange: (v: boolean) => void;
  aliquotaSN: string;
  onAliquotaSNChange: (v: string) => void;
  preencherValores: boolean;
  onPreencherValoresChange: (v: boolean) => void;
  regimeApuracaoSNParametro: boolean;
  onRegimeApuracaoSNParametroChange: (v: boolean) => void;
  configurarPercentuais: boolean;
  onConfigurarPercentuaisChange: (v: boolean) => void;
  percentuais: PercentuaisTributarios;
  onPercentuaisChange: (p: PercentuaisTributarios) => void;
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
  regimeApuracaoSNParametro, onRegimeApuracaoSNParametroChange,
  configurarPercentuais, onConfigurarPercentuaisChange,
  percentuais, onPercentuaisChange,
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
        Regime Tributário
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

      {/* Parâmetro Fiscal */}
      {regime && (
        <h3 className="text-sm font-bold text-muted-foreground flex items-center gap-2 mb-3">
          <Settings className="w-4 h-4 text-primary" />
          Parâmetro Fiscal
        </h3>
      )}

      {/* Simples Nacional options */}
      {regime === 'simples' && (
        <div className="space-y-4 p-4 rounded-lg bg-muted/50 border border-border mb-5">
          <Toggle
            checked={preencherValores}
            onChange={(v) => { onPreencherValoresChange(v); onAutosave(); }}
            label="Preencher os valores monetários em cada NFS-e emitida"
          />
          <Toggle
            checked={regimeApuracaoSNParametro}
            onChange={(v) => { onRegimeApuracaoSNParametroChange(v); onAutosave(); }}
            label="Regime de apuração dos tributos federais e municipal pelo Simples Nacional"
          />
          {configurarPercentuais && (
            <div className="grid grid-cols-3 gap-3 pt-1">
              {(['federal', 'estadual', 'municipal'] as const).map((campo) => (
                <div key={campo}>
                  <label className="field-label whitespace-nowrap capitalize">{campo}</label>
                  <div className="relative w-[55px]">
                    <input
                      className="field-input pr-7 border-primary"
                      type="text"
                      placeholder="00,00"
                      maxLength={5}
                      value={percentuais[campo]}
                      onChange={(e) => {
                        let v = e.target.value.replace(/[^\d]/g, '').slice(0, 4);
                        if (v.length > 2) v = v.slice(0, -2) + ',' + v.slice(-2);
                        onPercentuaisChange({ ...percentuais, [campo]: v });
                        onAutosave();
                      }}
                    />
                    <span className="absolute right-2 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">%</span>
                  </div>
                </div>
              ))}
            </div>
          )}
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
            <div>
              <label className="field-label whitespace-nowrap">Alíquota Simples Nacional</label>
              <div className="relative w-[55px]">
                <input
                  className="field-input pr-7 border-primary"
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

      {/* Regime de Apuração */}
      {regime === 'simples' && (
        <>
          <h3 className="text-sm font-bold text-muted-foreground flex items-center gap-2 mb-3">
            <Settings className="w-4 h-4 text-primary" />
            Apuração Simples Nacional
          </h3>
          <div className="space-y-3 p-4 rounded-lg bg-muted/50 border border-border">
            {[
              { value: 'federal_municipal', label: 'Regime de apuração dos tributos federais e municipal pelo Simples Nacional.' },
              { value: 'nfse', label: 'Regime de apuração dos tributos federais e municipal pela NFS-e conforme respectivas legislações federal e municipal de cada tributo.' },
              { value: 'federal_issqn', label: 'Regime de apuração dos tributos federais pelo Simples Nacional e o ISSQN pela NFS-e conforme respectiva legislação municipal do tributo.' },
            ].map((opt) => (
              <label
                key={opt.value}
                className="flex items-center gap-3 cursor-pointer select-none"
                onClick={() => { onRegimeApuracaoChange(opt.value); onAutosave(); }}
              >
                <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${
                  regimeApuracaoSN === opt.value ? 'border-primary' : 'border-muted-foreground/40'
                }`}>
                  {regimeApuracaoSN === opt.value && <div className="w-2 h-2 rounded-full bg-primary" />}
                </div>
                <span className="text-sm text-foreground">{opt.label}</span>
              </label>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default RegimeEParametrosSection;
