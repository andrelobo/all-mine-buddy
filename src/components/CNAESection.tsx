import React, { useState, useEffect, useRef } from 'react';
import { Tag, Star, Loader2, AlertCircle } from 'lucide-react';
import { validateCNPJ } from '@/utils/validators';

interface CNAEAtividade {
  codigo: number | string;
  descricao: string;
}

interface CNAEData {
  principal: CNAEAtividade | null;
  secundarias: CNAEAtividade[];
}

interface Props {
  cnpj: string;
  cnaeEscolhido: string | null;
  onCnaeEscolhidoChange: (codigo: string, descricao: string) => void;
}

async function fetchCNAEFromCNPJ(cnpj: string): Promise<CNAEData> {
  const cleaned = cnpj.replace(/\D/g, '');

  // Tenta BrasilAPI
  const res = await fetch(`https://brasilapi.com.br/api/cnpj/v1/${cleaned}`);
  if (!res.ok) throw new Error('Não foi possível obter os dados do CNPJ.');
  const data = await res.json();

  const principal: CNAEAtividade | null = data.cnae_fiscal
    ? { codigo: data.cnae_fiscal, descricao: data.cnae_fiscal_descricao || '' }
    : null;

  const secundarias: CNAEAtividade[] = (data.cnaes_secundarios || []).map((c: any) => ({
    codigo: c.codigo,
    descricao: c.descricao || '',
  }));

  return { principal, secundarias };
}

function formatCNAECode(codigo: number | string): string {
  const str = String(codigo).replace(/\D/g, '').padStart(7, '0');
  // Format: 0000-0/00
  if (str.length >= 7) {
    return `${str.slice(0, 4)}-${str.slice(4, 5)}/${str.slice(5, 7)}`;
  }
  return str;
}

const CNAESection: React.FC<Props> = ({ cnpj, cnaeEscolhido, onCnaeEscolhidoChange }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cnaeData, setCnaeData] = useState<CNAEData | null>(null);
  const lastFetchedCNPJ = useRef('');

  useEffect(() => {
    const cleaned = cnpj.replace(/\D/g, '');
    if (cleaned.length !== 14 || !validateCNPJ(cleaned)) return;
    if (lastFetchedCNPJ.current === cleaned) return;
    lastFetchedCNPJ.current = cleaned;

    setLoading(true);
    setError(null);

    fetchCNAEFromCNPJ(cleaned)
      .then((data) => {
        setCnaeData(data);
        // Seleciona automaticamente o CNAE principal se ainda não houver seleção
        if (!cnaeEscolhido && data.principal) {
          onCnaeEscolhidoChange(
            String(data.principal.codigo),
            data.principal.descricao
          );
        }
      })
      .catch(() => setError('Não foi possível carregar as atividades econômicas.'))
      .finally(() => setLoading(false));
  }, [cnpj]);

  const allActivities = cnaeData
    ? [
        ...(cnaeData.principal ? [{ ...cnaeData.principal, isPrincipal: true }] : []),
        ...cnaeData.secundarias.map((s) => ({ ...s, isPrincipal: false })),
      ]
    : [];

  const cleanedCnpj = cnpj.replace(/\D/g, '');
  const cnpjValido = cleanedCnpj.length === 14 && validateCNPJ(cleanedCnpj);

  return (
    <div className="section-card">
      <h2 className="section-title">
        <Tag className="w-5 h-5 text-primary" />
        Parametrização de CNAE
      </h2>

      {!cnpjValido && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground py-6 justify-center">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>Informe um CNPJ válido para carregar as atividades econômicas.</span>
        </div>
      )}

      {cnpjValido && loading && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground py-6 justify-center">
          <Loader2 className="w-4 h-4 animate-spin text-primary" />
          <span>Buscando atividades econômicas...</span>
        </div>
      )}

      {cnpjValido && error && !loading && (
        <div className="flex items-center gap-2 text-sm text-destructive py-4">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {cnpjValido && cnaeData && !loading && (
        <div className="space-y-3">
          <p className="text-xs text-muted-foreground">
            Selecione o CNAE que será utilizado para a emissão de NFS-e. O CNAE principal é selecionado automaticamente.
          </p>

          <div className="space-y-2">
            {allActivities.map((atividade) => {
              const codigo = String(atividade.codigo);
              const isSelected = cnaeEscolhido === codigo;
              return (
                <button
                  key={codigo}
                  type="button"
                  onClick={() => onCnaeEscolhidoChange(codigo, atividade.descricao)}
                  className={`w-full text-left flex items-start gap-3 p-3 rounded-lg border transition-all ${
                    isSelected
                      ? 'border-primary bg-primary/5'
                      : 'border-border bg-background hover:border-primary/40 hover:bg-muted/40'
                  }`}
                >
                  <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 ${
                    isSelected ? 'border-primary' : 'border-muted-foreground/40'
                  }`}>
                    {isSelected && <div className="w-2 h-2 rounded-full bg-primary" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-mono font-semibold text-primary bg-primary/10 px-1.5 py-0.5 rounded">
                        {formatCNAECode(atividade.codigo)}
                      </span>
                      {atividade.isPrincipal && (
                        <span className="flex items-center gap-1 text-xs text-warning bg-warning/10 px-1.5 py-0.5 rounded font-medium">
                          <Star className="w-3 h-3" />
                          Principal
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-foreground mt-1 leading-snug">{atividade.descricao}</p>
                  </div>
                </button>
              );
            })}
          </div>

          {cnaeEscolhido && (
            <div className="mt-4 pt-4 border-t border-border">
              <p className="text-xs text-muted-foreground mb-1">CNAE selecionado para emissão</p>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-semibold text-primary bg-primary/10 px-2 py-1 rounded">
                  {formatCNAECode(cnaeEscolhido)}
                </span>
                <span className="text-sm text-foreground truncate">
                  {allActivities.find((a) => String(a.codigo) === cnaeEscolhido)?.descricao || ''}
                </span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CNAESection;
