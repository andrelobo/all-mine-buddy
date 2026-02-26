import React from 'react';
import { Table as TableIcon } from 'lucide-react';
import { FAIXAS_ANEXO_III, formatCurrency, formatPercent } from '@/utils/simples-nacional';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/table';

interface Props {
  faixaAtual?: number | null;
}

const TabelaAnexoIII: React.FC<Props> = ({ faixaAtual }) => {
  return (
    <div className="section-card">
      <h2 className="section-title">
        <TableIcon className="w-5 h-5 text-primary" />
        Tabela Anexo III – Simples Nacional
      </h2>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-center">Faixa</TableHead>
            <TableHead>Receita Bruta (12 meses)</TableHead>
            <TableHead className="text-center">Alíq. Nominal</TableHead>
            <TableHead className="text-right">Parcela a Deduzir</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {FAIXAS_ANEXO_III.map((f) => (
            <TableRow
              key={f.faixa}
              className={faixaAtual === f.faixa ? 'bg-primary/10 font-semibold' : ''}
            >
              <TableCell className="text-center">{f.faixa}ª</TableCell>
              <TableCell>
                {f.limiteInferior === 0 ? 'Até' : `De ${formatCurrency(f.limiteInferior)} até`}{' '}
                {formatCurrency(f.limiteSuperior)}
              </TableCell>
              <TableCell className="text-center">{formatPercent(f.aliquotaNominal)}</TableCell>
              <TableCell className="text-right">{formatCurrency(f.parcelaDeduzir)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default TabelaAnexoIII;
