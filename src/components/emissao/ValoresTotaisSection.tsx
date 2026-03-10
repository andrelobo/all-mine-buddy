import React from 'react';
import { Calculator } from 'lucide-react';

interface Props {
  valorBruto: number;
  desconto: number;
  issValor: number;
  issRetido: boolean;
  retPis: number;
  retCofins: number;
  retCsll: number;
  retIr: number;
  retInss: number;
}

function fmt(value: number): string {
  return value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

const ValoresTotaisSection: React.FC<Props> = ({
  valorBruto, desconto, issValor, issRetido,
  retPis, retCofins, retCsll, retIr, retInss,
}) => {
  const totalRetencoes = (issRetido ? issValor : 0) + retPis + retCofins + retCsll + retIr + retInss;
  const valorLiquido = valorBruto - desconto - totalRetencoes;

  return (
    <div className="section-card p-2">
      <h2 className="section-title text-xs mb-1">
        <Calculator className="w-4 h-4 text-primary" />
        Valores e Totais
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        <div className="p-2.5 rounded-lg bg-muted/30 border border-border">
          <span className="text-xs text-muted-foreground">Valor Bruto</span>
          <p className="text-base font-bold text-foreground">R$ {fmt(valorBruto)}</p>
        </div>
        <div className="p-2.5 rounded-lg bg-muted/30 border border-border">
          <span className="text-xs text-muted-foreground">Deduções</span>
          <p className="text-base font-bold text-foreground">R$ {fmt(desconto)}</p>
        </div>
        <div className="p-2.5 rounded-lg bg-muted/30 border border-border">
          <span className="text-xs text-muted-foreground">Impostos / Retenções</span>
          <p className="text-base font-bold text-foreground">R$ {fmt(totalRetencoes)}</p>
        </div>
        <div className="p-2.5 rounded-lg bg-primary/10 border border-primary/20">
          <span className="text-xs text-primary">Valor Líquido</span>
          <p className="text-base font-bold text-primary">R$ {fmt(Math.max(0, valorLiquido))}</p>
        </div>
      </div>
    </div>
  );
};

export default ValoresTotaisSection;
