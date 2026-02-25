import React, { useMemo } from 'react';
import { Calculator, AlertTriangle, Info, TrendingUp } from 'lucide-react';
import { type CalculoSimplesResult, formatCurrency, formatPercent, distanciaProximaFaixa, FAIXAS_ANEXO_III } from '@/utils/simples-nacional';

interface Props {
  cnaePrincipal: string;
  cnaeDescricao: string;
  cnaeAnexo: string;
  rbt12: number;
  onRbt12Change: (value: number) => void;
  calculo: CalculoSimplesResult;
  alertas: string[];
  permiteFatorR: boolean;
}

function applyCurrencyMask(value: string): string {
  const digits = value.replace(/\D/g, '');
  if (!digits) return '';
  const num = parseInt(digits, 10) / 100;
  return num.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

const SimplesNacionalSection: React.FC<Props> = ({
  cnaePrincipal,
  cnaeDescricao,
  cnaeAnexo,
  rbt12,
  onRbt12Change,
  calculo,
  alertas,
  permiteFatorR,
}) => {
  const rbt12Display = useMemo(() => {
    if (rbt12 === 0) return '';
    return rbt12.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }, [rbt12]);

  const distancia = useMemo(() => distanciaProximaFaixa(rbt12), [rbt12]);

  const handleRbt12Change = (e: React.ChangeEvent<HTMLInputElement>) => {
    const masked = applyCurrencyMask(e.target.value);
    const numValue = parseFloat(masked.replace(/\./g, '').replace(',', '.')) || 0;
    onRbt12Change(numValue);
  };

  const formatCNAECode = (codigo: string): string => {
    const str = codigo.replace(/\D/g, '').padStart(7, '0');
    if (str.length >= 7) return `${str.slice(0, 4)}-${str.slice(4, 5)}/${str.slice(5, 7)}`;
    return str;
  };

  return (
    <div className="section-card">
      <h2 className="section-title">
        <Calculator className="w-5 h-5 text-primary" />
        Simples Nacional – Anexo III
      </h2>

      {/* CNAE Info */}
      {cnaePrincipal && (
        <div className="mb-4 p-3 rounded-lg bg-muted/30 border border-border">
          <p className="text-xs text-muted-foreground mb-1">CNAE Principal</p>
          <p className="text-sm font-medium text-foreground">
            <span className="font-mono text-primary">{formatCNAECode(cnaePrincipal)}</span>
            {cnaeDescricao && <span className="text-muted-foreground mx-1.5">·</span>}
            {cnaeDescricao}
          </p>
          {cnaeAnexo && (
            <p className="text-xs mt-1">
              <span className="font-medium text-foreground/70">Anexo:</span>{' '}
              <span className={cnaeAnexo === 'III' ? 'text-primary font-semibold' : 'text-destructive font-semibold'}>{cnaeAnexo}</span>
            </p>
          )}
        </div>
      )}

      {/* RBT12 Input */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="field-label">RBT12 – Receita Bruta 12 meses (R$)*</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">R$</span>
            <input
              className="field-input pl-10"
              placeholder="0,00"
              value={rbt12Display}
              onChange={handleRbt12Change}
            />
          </div>
        </div>

        <div>
          <label className="field-label">Anexo do Simples</label>
          <input
            className="field-input bg-muted/50"
            value={cnaeAnexo ? `Anexo ${cnaeAnexo}` : 'Não identificado'}
            readOnly
          />
        </div>
      </div>

      {/* Resultados calculados */}
      {calculo.valido && calculo.faixa && (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-4">
          <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Faixa</p>
            <p className="text-lg font-bold text-primary">{calculo.faixa.faixa}ª</p>
            <p className="text-[10px] text-muted-foreground">
              até {formatCurrency(calculo.faixa.limiteSuperior)}
            </p>
          </div>

          <div className="p-3 rounded-lg bg-muted/30 border border-border">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Alíq. Nominal</p>
            <p className="text-lg font-bold text-foreground">{formatPercent(calculo.faixa.aliquotaNominal)}</p>
          </div>

          <div className="p-3 rounded-lg bg-muted/30 border border-border">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Parcela Deduzir</p>
            <p className="text-lg font-bold text-foreground">{formatCurrency(calculo.faixa.parcelaDeduzir)}</p>
          </div>

          <div className="p-3 rounded-lg bg-primary/10 border border-primary/30">
            <p className="text-[10px] uppercase tracking-wider text-primary mb-1">Alíq. Efetiva</p>
            <p className="text-xl font-bold text-primary">{formatPercent(calculo.aliquotaEfetiva)}</p>
          </div>

          <div className="p-3 rounded-lg bg-muted/30 border border-border">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">% ISS (ref.)</p>
            <p className="text-lg font-bold text-foreground">{formatPercent(calculo.issReferencia)}</p>
          </div>
        </div>
      )}

      {/* Distância próxima faixa */}
      {calculo.valido && distancia && (
        <div className="flex items-center gap-2 p-3 rounded-lg bg-accent/30 border border-accent/50 mb-4">
          <TrendingUp className="w-4 h-4 text-accent-foreground shrink-0" />
          <p className="text-sm text-accent-foreground">
            Faltam <strong>{formatCurrency(distancia.valor)}</strong> para mudar da {distancia.faixaAtual}ª para a {distancia.faixaProxima}ª faixa.
          </p>
        </div>
      )}

      {/* Alertas */}
      {alertas.length > 0 && (
        <div className="space-y-2">
          {alertas.map((alerta, i) => {
            const isWarning = alerta.includes('desenquadramento') || alerta.includes('não pertence');
            const isInfo = alerta.includes('Fator R') || alerta.includes('Informe');
            return (
              <div
                key={i}
                className={`flex items-start gap-2 p-3 rounded-lg border text-sm ${
                  isWarning
                    ? 'bg-destructive/10 border-destructive/20 text-destructive'
                    : isInfo
                    ? 'bg-blue-500/10 border-blue-500/20 text-blue-700 dark:text-blue-300'
                    : 'bg-yellow-500/10 border-yellow-500/20 text-yellow-700 dark:text-yellow-300'
                }`}
              >
                {isWarning ? <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" /> : <Info className="w-4 h-4 shrink-0 mt-0.5" />}
                <span>{alerta}</span>
              </div>
            );
          })}
        </div>
      )}

      {/* Tabela de referência */}
      {!cnaePrincipal && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground py-4 justify-center">
          <Info className="w-4 h-4 shrink-0" />
          <span>Selecione um CNAE principal na seção de Parametrização de CNAE para calcular automaticamente.</span>
        </div>
      )}
    </div>
  );
};

export default SimplesNacionalSection;
