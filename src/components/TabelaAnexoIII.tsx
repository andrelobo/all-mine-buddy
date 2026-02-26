import React, { useState } from 'react';
import { Table as TableIcon, ChevronDown } from 'lucide-react';
import { FAIXAS_ANEXO_III, formatCurrency, formatPercent } from '@/utils/simples-nacional';

interface Props {
  faixaAtual?: number | null;
}

const TabelaAnexoIII: React.FC<Props> = ({ faixaAtual }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="section-card">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full text-left"
      >
        <h2 className="section-title mb-0">
          <TableIcon className="w-5 h-5 text-primary" />
          Tabela Anexo III – Simples Nacional
        </h2>
        <ChevronDown
          className={`w-4 h-4 text-muted-foreground transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open && (
        <div className="overflow-auto mt-4">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-border text-muted-foreground">
                <th className="py-2 px-3 text-center font-medium">Faixa</th>
                <th className="py-2 px-3 text-left font-medium">Receita Bruta (12 meses)</th>
                <th className="py-2 px-3 text-center font-medium">Alíq. Nominal</th>
                <th className="py-2 px-3 text-right font-medium">Parcela a Deduzir</th>
              </tr>
            </thead>
            <tbody>
              {FAIXAS_ANEXO_III.map((f) => (
                <tr
                  key={f.faixa}
                  className={`border-b border-border/50 ${
                    faixaAtual === f.faixa
                      ? 'bg-primary/10 font-semibold text-primary'
                      : 'text-foreground'
                  }`}
                >
                  <td className="py-2 px-3 text-center">{f.faixa}ª</td>
                  <td className="py-2 px-3">
                    {f.limiteInferior === 0 ? 'Até' : `${formatCurrency(f.limiteInferior)} –`}{' '}
                    {formatCurrency(f.limiteSuperior)}
                  </td>
                  <td className="py-2 px-3 text-center">{formatPercent(f.aliquotaNominal)}</td>
                  <td className="py-2 px-3 text-right">{formatCurrency(f.parcelaDeduzir)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default TabelaAnexoIII;
