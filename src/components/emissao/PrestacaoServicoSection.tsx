import React from 'react';
import { Briefcase, Percent } from 'lucide-react';

export interface PrestacaoServicoData {
  codigoServico: string;
  descricaoServico: string;
  valorServico: string;
  aliquota: string;
  baseCalculo: string;
  issRetido: boolean;
  desconto: string;
  retPis: string;
  retCofins: string;
  retCsll: string;
  retIr: string;
  retInss: string;
}

interface Props {
  data: PrestacaoServicoData;
  onChange: (data: PrestacaoServicoData) => void;
  mostrarRetencoesFederais: boolean;
}

function formatCurrency(value: string): string {
  const digits = value.replace(/\D/g, '');
  if (!digits) return '';
  const num = parseInt(digits, 10) / 100;
  return num.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function formatPercent(value: string): string {
  let v = value.replace(/[^\d]/g, '').slice(0, 4);
  if (v.length > 2) v = v.slice(0, -2) + ',' + v.slice(-2);
  return v;
}

const PrestacaoServicoSection: React.FC<Props> = ({ data, onChange, mostrarRetencoesFederais }) => {
  const update = (field: keyof PrestacaoServicoData, value: string | boolean) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <div className="section-card">
      <h2 className="section-title">
        <Briefcase className="w-5 h-5 text-primary" />
        Serviço Prestado
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-[1fr_3fr] gap-4">
        <div>
          <label className="field-label">Código Nacional Ctn*</label>
          <input
            className="field-input"
            placeholder="Ex: 01.01"
            value={data.codigoServico}
            onChange={(e) => update('codigoServico', e.target.value)}
          />
        </div>
        <div>
          <label className="field-label">Descrição do Serviço*</label>
          <textarea
            className="field-input min-h-[80px] resize-y"
            placeholder="Descreva o serviço prestado conforme a NFS-e..."
            value={data.descricaoServico}
            onChange={(e) => update('descricaoServico', e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
        <div>
          <label className="field-label">Valor do Serviço* (R$)</label>
          <input
            className="field-input text-right"
            placeholder="0,00"
            value={data.valorServico}
            onChange={(e) => update('valorServico', formatCurrency(e.target.value))}
          />
        </div>
        <div>
          <label className="field-label flex items-center gap-1">
            <Percent className="w-3.5 h-3.5" />Alíquota (%)*
          </label>
          <input
            className="field-input text-right"
            placeholder="0,00"
            value={data.aliquota}
            onChange={(e) => update('aliquota', formatPercent(e.target.value))}
            maxLength={5}
          />
        </div>
        <div>
          <label className="field-label">Base de Cálculo (R$)</label>
          <input
            className="field-input text-right bg-muted/30"
            placeholder="0,00"
            value={data.baseCalculo}
            readOnly
          />
        </div>
        <div>
          <label className="field-label">Desconto (R$)</label>
          <input
            className="field-input text-right"
            placeholder="0,00"
            value={data.desconto}
            onChange={(e) => update('desconto', formatCurrency(e.target.value))}
          />
        </div>
      </div>

      {/* ISS Retido */}
      <div className="mt-4 flex items-center gap-3">
        <label className="flex items-center gap-3 cursor-pointer select-none">
          <button
            type="button"
            role="switch"
            aria-checked={data.issRetido}
            onClick={() => update('issRetido', !data.issRetido)}
            className={`switch-track ${data.issRetido ? 'switch-track-on' : 'switch-track-off'}`}
          >
            <span className={`switch-thumb ${data.issRetido ? 'translate-x-4' : 'translate-x-0'}`} />
          </button>
          <span className="text-sm text-foreground font-medium">ISS Retido</span>
        </label>
      </div>

      {/* Retenções Federais */}
      {mostrarRetencoesFederais && (
        <div className="mt-5 pt-5 border-t border-border">
          <label className="field-label flex items-center gap-1 mb-4">
            <Percent className="w-3.5 h-3.5" />
            Retenções Federais
          </label>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {([
              ['retPis', 'PIS'],
              ['retCofins', 'COFINS'],
              ['retCsll', 'CSLL'],
              ['retIr', 'IR'],
              ['retInss', 'INSS'],
            ] as [keyof PrestacaoServicoData, string][]).map(([field, label]) => (
              <div key={field}>
                <label className="field-label">{label} (R$)</label>
                <input
                  className="field-input text-right"
                  placeholder="0,00"
                  value={data[field] as string}
                  onChange={(e) => update(field, formatCurrency(e.target.value))}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PrestacaoServicoSection;
