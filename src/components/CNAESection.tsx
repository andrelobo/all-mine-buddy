import React, { useState, useEffect, useRef } from 'react';
import { Tag, Star, Loader2, AlertCircle, Trash2, CheckCircle2, FileText } from 'lucide-react';
import { validateCNPJ } from '@/utils/validators';
import { getLC116Item } from '@/utils/cnae-lc116';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface CNAEAtividade {
  codigo: number | string;
  descricao: string;
  isPrincipal: boolean;
}

interface CNAEData {
  principal: Omit<CNAEAtividade, 'isPrincipal'> | null;
  secundarias: Omit<CNAEAtividade, 'isPrincipal'>[];
}

interface Props {
  cnpj: string;
  cnaeEscolhido: string | null;
  onCnaeEscolhidoChange: (codigo: string, descricao: string) => void;
}

async function fetchCNAEFromCNPJ(cnpj: string): Promise<CNAEData> {
  const cleaned = cnpj.replace(/\D/g, '');
  const res = await fetch(`https://brasilapi.com.br/api/cnpj/v1/${cleaned}`);
  if (!res.ok) throw new Error('Não foi possível obter os dados do CNPJ.');
  const data = await res.json();

  const principal = data.cnae_fiscal
    ? { codigo: data.cnae_fiscal, descricao: data.cnae_fiscal_descricao || '' }
    : null;

  const secundarias = (data.cnaes_secundarios || []).map((c: any) => ({
    codigo: c.codigo,
    descricao: c.descricao || '',
  }));

  return { principal, secundarias };
}

function formatCNAECode(codigo: number | string): string {
  const str = String(codigo).replace(/\D/g, '').padStart(7, '0');
  if (str.length >= 7) {
    return `${str.slice(0, 4)}-${str.slice(4, 5)}/${str.slice(5, 7)}`;
  }
  return str;
}

const CNAESection: React.FC<Props> = ({ cnpj, cnaeEscolhido, onCnaeEscolhidoChange }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [allActivities, setAllActivities] = useState<CNAEAtividade[]>([]);
  const [removedCodes, setRemovedCodes] = useState<Set<string>>(new Set());
  const lastFetchedCNPJ = useRef('');

  useEffect(() => {
    const cleaned = cnpj.replace(/\D/g, '');
    if (cleaned.length !== 14 || !validateCNPJ(cleaned)) return;
    if (lastFetchedCNPJ.current === cleaned) return;
    lastFetchedCNPJ.current = cleaned;

    setLoading(true);
    setError(null);
    setRemovedCodes(new Set());

    fetchCNAEFromCNPJ(cleaned)
      .then((data) => {
        const activities: CNAEAtividade[] = [
          ...(data.principal ? [{ ...data.principal, isPrincipal: true }] : []),
          ...data.secundarias.map((s) => ({ ...s, isPrincipal: false })),
        ];
        setAllActivities(activities);

        if (!cnaeEscolhido && data.principal) {
          onCnaeEscolhidoChange(String(data.principal.codigo), data.principal.descricao);
        }
      })
      .catch(() => setError('Não foi possível carregar as atividades econômicas.'))
      .finally(() => setLoading(false));
  }, [cnpj]);

  const visibleActivities = allActivities.filter(
    (a) => !removedCodes.has(String(a.codigo))
  );

  const handleRemove = (e: React.MouseEvent, codigo: string) => {
    e.stopPropagation();
    setRemovedCodes((prev) => {
      const next = new Set(prev);
      next.add(codigo);
      return next;
    });
    // Se o removido era o selecionado, seleciona o próximo visível
    if (cnaeEscolhido === codigo) {
      const next = allActivities.find(
        (a) => String(a.codigo) !== codigo && !removedCodes.has(String(a.codigo))
      );
      if (next) {
        onCnaeEscolhidoChange(String(next.codigo), next.descricao);
      }
    }
  };

  const handleSelect = (atividade: CNAEAtividade) => {
    onCnaeEscolhidoChange(String(atividade.codigo), atividade.descricao);
  };

  const cleanedCnpj = cnpj.replace(/\D/g, '');
  const cnpjValido = cleanedCnpj.length === 14 && validateCNPJ(cleanedCnpj);
  const selectedActivity = allActivities.find((a) => String(a.codigo) === cnaeEscolhido);

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

      {cnpjValido && allActivities.length > 0 && !loading && (
        <div className="space-y-3">
          <p className="text-xs text-muted-foreground">
            Selecione o CNAE para configuração tributária. Remova atividades que não devem ser consideradas.
          </p>

          <div className="space-y-2">
            {visibleActivities.map((atividade) => {
              const codigo = String(atividade.codigo);
              const isSelected = cnaeEscolhido === codigo;
              return (
                <div
                  key={codigo}
                  className={`group flex items-start gap-3 p-3 rounded-lg border transition-all ${
                    isSelected
                      ? 'border-primary bg-primary/5'
                      : 'border-border bg-background hover:border-primary/30 hover:bg-muted/30'
                  }`}
                >
                  {/* Radio + content — clicável para selecionar */}
                  <button
                    type="button"
                    onClick={() => handleSelect(atividade)}
                    className="flex items-start gap-3 flex-1 min-w-0 text-left"
                  >
                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                      isSelected ? 'border-primary' : 'border-muted-foreground/40'
                    }`}>
                      {isSelected && <div className="w-2 h-2 rounded-full bg-primary" />}
                    </div>
                    <div className="flex-1 min-w-0 space-y-1">
                      {/* Badges topo */}
                      <div className="flex items-center gap-2 flex-wrap">
                        {atividade.isPrincipal && (
                          <span className="flex items-center gap-1 text-xs text-warning bg-warning/10 px-1.5 py-0.5 rounded font-medium">
                            <Star className="w-3 h-3" />
                            Principal
                          </span>
                        )}
                        {isSelected && (
                          <span className="flex items-center gap-1 text-xs text-primary bg-primary/10 px-1.5 py-0.5 rounded font-medium">
                            <CheckCircle2 className="w-3 h-3" />
                            Configuração tributária
                          </span>
                        )}
                      </div>

                      {/* Linha CNAE */}
                      <p className="text-sm text-foreground leading-snug">
                        <span className="font-semibold text-primary font-mono">{formatCNAECode(atividade.codigo)}</span>
                        <span className="text-muted-foreground mx-1.5">·</span>
                        {atividade.descricao}
                      </p>

                      {/* Linhas LC 116 / CTN / NBS */}
                      {(() => {
                        const lc = getLC116Item(atividade.codigo);
                        if (!lc) return null;
                        return (
                          <TooltipProvider delayDuration={200}>
                            <div className="space-y-0.5 pt-0.5">
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <p className="text-xs text-muted-foreground leading-snug cursor-help">
                                    <span className="font-semibold text-foreground/70">LC 116 Item {lc.item}:</span>
                                    <span className="ml-1">{lc.descricao}</span>
                                  </p>
                                </TooltipTrigger>
                                <TooltipContent side="top" className="max-w-xs text-xs">
                                  <p className="font-semibold mb-0.5">Lista de Serviços – LC 116/2003</p>
                                  <p>Item da lista de serviços tributáveis pelo ISS conforme a Lei Complementar nº 116/2003. Define o enquadramento legal do serviço para fins de incidência do imposto municipal.</p>
                                </TooltipContent>
                              </Tooltip>
                              {lc.ctn && (
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <p className="text-xs text-muted-foreground leading-snug cursor-help">
                                      <span className="font-semibold text-foreground/70">CTN {lc.ctn}:</span>
                                      <span className="ml-1">Código de Tributação Nacional</span>
                                    </p>
                                  </TooltipTrigger>
                                  <TooltipContent side="top" className="max-w-xs text-xs">
                                    <p className="font-semibold mb-0.5">Código de Tributação Nacional (CTN)</p>
                                    <p>Código de 6 dígitos utilizado na NFS-e padrão nacional para identificar o tipo de serviço prestado. Derivado do item da LC 116/2003 e exigido pelas prefeituras que adotam o modelo ABRASF.</p>
                                  </TooltipContent>
                                </Tooltip>
                              )}
                              {lc.nbs && (
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <p className="text-xs text-muted-foreground leading-snug cursor-help">
                                      <span className="font-semibold text-foreground/70">NBS {lc.nbs}:</span>
                                      <span className="ml-1">Nomenclatura Brasileira de Serviços</span>
                                    </p>
                                  </TooltipTrigger>
                                  <TooltipContent side="top" className="max-w-xs text-xs">
                                    <p className="font-semibold mb-0.5">Nomenclatura Brasileira de Serviços (NBS)</p>
                                    <p>Classificação oficial brasileira de serviços, intangíveis e outras operações que produzam variações no patrimônio. Utilizada para fins fiscais, estatísticos e de comércio exterior de serviços.</p>
                                  </TooltipContent>
                                </Tooltip>
                              )}
                            </div>
                          </TooltipProvider>
                        );
                      })()}
                    </div>
                  </button>

                  {/* Botão excluir */}
                  <button
                    type="button"
                    onClick={(e) => handleRemove(e, codigo)}
                    title="Remover atividade"
                    className="shrink-0 p-1.5 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors opacity-0 group-hover:opacity-100 mt-0.5"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              );
            })}

            {visibleActivities.length === 0 && (
              <div className="text-center py-4 text-sm text-muted-foreground">
                Todas as atividades foram removidas.
              </div>
            )}
          </div>

          {removedCodes.size > 0 && (
            <button
              type="button"
              onClick={() => setRemovedCodes(new Set())}
              className="text-xs text-muted-foreground hover:text-foreground underline transition-colors"
            >
              Restaurar {removedCodes.size} atividade{removedCodes.size > 1 ? 's' : ''} removida{removedCodes.size > 1 ? 's' : ''}
            </button>
          )}

          {selectedActivity && (
            <div className="mt-4 pt-4 border-t border-border">
              <p className="text-xs text-muted-foreground mb-1.5">CNAE para configuração tributária</p>
              <div className="flex items-start gap-2 p-2.5 rounded-lg bg-primary/5 border border-primary/20">
                <div className="flex-1 min-w-0 space-y-1">
                  {/* Linha CNAE */}
                  <p className="text-sm text-foreground leading-snug">
                    <span className="font-semibold text-primary font-mono">{formatCNAECode(selectedActivity.codigo)}</span>
                    <span className="text-muted-foreground mx-1.5">·</span>
                    {selectedActivity.descricao}
                  </p>
                  {/* Linhas LC 116 / CTN / NBS */}
                  {(() => {
                    const lc = getLC116Item(selectedActivity.codigo);
                    if (!lc) return (
                      <p className="text-xs text-muted-foreground/60 italic">Sem correspondência mapeada na LC 116/2003</p>
                    );
                    return (
                      <TooltipProvider delayDuration={200}>
                        <div className="space-y-0.5">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <p className="text-xs text-muted-foreground leading-snug cursor-help">
                                <span className="font-semibold text-foreground/70">LC 116 Item {lc.item}:</span>
                                <span className="ml-1">{lc.descricao}</span>
                              </p>
                            </TooltipTrigger>
                            <TooltipContent side="top" className="max-w-xs text-xs">
                              <p className="font-semibold mb-0.5">Lista de Serviços – LC 116/2003</p>
                              <p>Item da lista de serviços tributáveis pelo ISS conforme a Lei Complementar nº 116/2003. Define o enquadramento legal do serviço para fins de incidência do imposto municipal.</p>
                            </TooltipContent>
                          </Tooltip>
                          {lc.ctn && (
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <p className="text-xs text-muted-foreground leading-snug cursor-help">
                                  <span className="font-semibold text-foreground/70">CTN {lc.ctn}:</span>
                                  <span className="ml-1">Código de Tributação Nacional</span>
                                </p>
                              </TooltipTrigger>
                              <TooltipContent side="top" className="max-w-xs text-xs">
                                <p className="font-semibold mb-0.5">Código de Tributação Nacional (CTN)</p>
                                <p>Código de 6 dígitos utilizado na NFS-e padrão nacional para identificar o tipo de serviço prestado. Derivado do item da LC 116/2003 e exigido pelas prefeituras que adotam o modelo ABRASF.</p>
                              </TooltipContent>
                            </Tooltip>
                          )}
                          {lc.nbs && (
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <p className="text-xs text-muted-foreground leading-snug cursor-help">
                                  <span className="font-semibold text-foreground/70">NBS {lc.nbs}:</span>
                                  <span className="ml-1">Nomenclatura Brasileira de Serviços</span>
                                </p>
                              </TooltipTrigger>
                              <TooltipContent side="top" className="max-w-xs text-xs">
                                <p className="font-semibold mb-0.5">Nomenclatura Brasileira de Serviços (NBS)</p>
                                <p>Classificação oficial brasileira de serviços, intangíveis e outras operações que produzam variações no patrimônio. Utilizada para fins fiscais, estatísticos e de comércio exterior de serviços.</p>
                              </TooltipContent>
                            </Tooltip>
                          )}
                        </div>
                      </TooltipProvider>
                    );
                  })()}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CNAESection;
