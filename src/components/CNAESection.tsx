import React, { useState, useEffect, useRef } from 'react';
import { Landmark, Star, Loader2, AlertCircle, Trash2, CheckCircle2, Plus, X } from 'lucide-react';
import { validateCNPJ } from '@/utils/validators';
import { getLC116Item } from '@/utils/cnae-lc116';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Input } from '@/components/ui/input';

interface CNAEAtividade {
  codigo: number | string;
  descricao: string;
  isPrincipal: boolean;
  isManual?: boolean;
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

function applyCNAEMask(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 7);
  if (digits.length <= 4) return digits;
  if (digits.length <= 5) return `${digits.slice(0, 4)}-${digits.slice(4)}`;
  return `${digits.slice(0, 4)}-${digits.slice(4, 5)}/${digits.slice(5)}`;
}

const CNAESection: React.FC<Props> = ({ cnpj, cnaeEscolhido, onCnaeEscolhidoChange }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [allActivities, setAllActivities] = useState<CNAEAtividade[]>([]);
  const [manualActivities, setManualActivities] = useState<CNAEAtividade[]>([]);
  const [removedCodes, setRemovedCodes] = useState<Set<string>>(new Set());
  const [showManualForm, setShowManualForm] = useState(false);
  const [manualCodigo, setManualCodigo] = useState('');
  const [manualDescricao, setManualDescricao] = useState('');
  const lastFetchedCNPJ = useRef('');

  useEffect(() => {
    const cleaned = cnpj.replace(/\D/g, '');
    if (cleaned.length !== 14 || !validateCNPJ(cleaned)) return;
    if (lastFetchedCNPJ.current === cleaned) return;
    lastFetchedCNPJ.current = cleaned;

    setLoading(true);
    setError(null);
    setRemovedCodes(new Set());
    setManualActivities([]);

    fetchCNAEFromCNPJ(cleaned)
      .then((data) => {
        const allRaw: CNAEAtividade[] = [
          ...(data.principal ? [{ ...data.principal, isPrincipal: true }] : []),
          ...data.secundarias.map((s) => ({ ...s, isPrincipal: false })),
        ];
        // Filtra apenas atividades de serviço (com mapeamento LC 116) e limita a 3
        const serviceOnly = allRaw.filter((a) => getLC116Item(a.codigo) !== null);
        const limited = serviceOnly.slice(0, 3);
        setAllActivities(limited);

        if (!cnaeEscolhido && data.principal) {
          onCnaeEscolhidoChange(String(data.principal.codigo), data.principal.descricao);
        }
      })
      .catch(() => setError('Não foi possível carregar as atividades econômicas.'))
      .finally(() => setLoading(false));
  }, [cnpj]);

  const combinedActivities = [...allActivities, ...manualActivities];
  const visibleActivities = combinedActivities.filter(
    (a) => !removedCodes.has(String(a.codigo))
  );

  const handleRemove = (e: React.MouseEvent, codigo: string) => {
    e.stopPropagation();
    setRemovedCodes((prev) => {
      const next = new Set(prev);
      next.add(codigo);
      return next;
    });
    if (cnaeEscolhido === codigo) {
      const next = combinedActivities.find(
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

  const handleAddManual = () => {
    const cleaned = manualCodigo.replace(/\D/g, '');
    if (cleaned.length < 7) return;
    if (!manualDescricao.trim()) return;

    // Evitar duplicata
    if (combinedActivities.some((a) => String(a.codigo).replace(/\D/g, '') === cleaned)) return;

    const nova: CNAEAtividade = {
      codigo: cleaned,
      descricao: manualDescricao.trim(),
      isPrincipal: false,
      isManual: true,
    };
    setManualActivities((prev) => [...prev, nova]);
    setManualCodigo('');
    setManualDescricao('');
    setShowManualForm(false);

    if (!cnaeEscolhido) {
      onCnaeEscolhidoChange(cleaned, nova.descricao);
    }
  };

  const cleanedCnpj = cnpj.replace(/\D/g, '');
  const cnpjValido = cleanedCnpj.length === 14 && validateCNPJ(cleanedCnpj);
  const selectedActivity = combinedActivities.find((a) => String(a.codigo) === cnaeEscolhido);

  const renderLC116Info = (codigo: number | string) => {
    const lc = getLC116Item(codigo);
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
              <p>Item da lista de serviços tributáveis pelo ISS conforme a Lei Complementar nº 116/2003.</p>
            </TooltipContent>
          </Tooltip>
          {lc.ctn && (
            <Tooltip>
              <TooltipTrigger asChild>
                <p className="text-xs text-muted-foreground leading-snug cursor-help">
                  <span className="font-semibold text-foreground/70">CTN {lc.ctn}:</span>
                  <span className="ml-1">{lc.descricao}</span>
                </p>
              </TooltipTrigger>
              <TooltipContent side="top" className="max-w-xs text-xs">
                <p className="font-semibold mb-0.5">Código de Tributação Nacional (CTN)</p>
                <p>Código de 6 dígitos do governo federal (TabCtneNbs) utilizado na NFS-e para identificar o tipo de serviço prestado.</p>
              </TooltipContent>
            </Tooltip>
          )}
        </div>
      </TooltipProvider>
    );
  };

  return (
    <div className="section-card">
      <h2 className="section-title">
        <Landmark className="w-5 h-5 text-primary" />
        Código Cnae
      </h2>

      {!cnpjValido && !showManualForm && visibleActivities.length === 0 && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground py-4 justify-center">
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

      {(visibleActivities.length > 0 || manualActivities.length > 0) && !loading && (
        <div className="space-y-3">
          <p className="text-xs text-muted-foreground">
            Selecione o CNAE para configuração tributária.
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
                      <div className="flex items-center gap-2 flex-wrap">
                        {atividade.isPrincipal && (
                          <span className="flex items-center gap-1 text-xs text-warning bg-warning/10 px-1.5 py-0.5 rounded font-medium">
                            <Star className="w-3 h-3" />
                            Principal
                          </span>
                        )}
                        {atividade.isManual && (
                          <span className="text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded font-medium">
                            Manual
                          </span>
                        )}
                        {isSelected && (
                          <span className="flex items-center gap-1 text-xs text-primary bg-primary/10 px-1.5 py-0.5 rounded font-medium">
                            <CheckCircle2 className="w-3 h-3" />
                            Configuração tributária
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-foreground leading-snug">
                        <span className="font-semibold text-primary font-mono">{formatCNAECode(atividade.codigo)}</span>
                        <span className="text-muted-foreground mx-1.5">·</span>
                        {atividade.descricao}
                      </p>
                      {renderLC116Info(atividade.codigo)}
                    </div>
                  </button>

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
                  <p className="text-sm text-foreground leading-snug">
                    <span className="font-semibold text-primary font-mono">{formatCNAECode(selectedActivity.codigo)}</span>
                    <span className="text-muted-foreground mx-1.5">·</span>
                    {selectedActivity.descricao}
                  </p>
                  {(() => {
                    const lc = getLC116Item(selectedActivity.codigo);
                    if (!lc) return (
                      <p className="text-xs text-muted-foreground/60 italic">Sem correspondência mapeada na LC 116/2003</p>
                    );
                    return renderLC116Info(selectedActivity.codigo);
                  })()}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Formulário de inclusão manual */}
      {showManualForm ? (
        <div className="mt-4 p-3 rounded-lg border border-border bg-muted/20 space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-foreground">Adicionar CNAE manualmente</p>
            <button
              type="button"
              onClick={() => { setShowManualForm(false); setManualCodigo(''); setManualDescricao(''); }}
              className="p-1 rounded text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="space-y-2">
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Código CNAE</label>
              <Input
                placeholder="0000-0/00"
                value={manualCodigo}
                onChange={(e) => setManualCodigo(applyCNAEMask(e.target.value))}
                className="h-8 text-sm font-mono"
                maxLength={9}
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Descrição</label>
              <Input
                placeholder="Descrição da atividade econômica"
                value={manualDescricao}
                onChange={(e) => setManualDescricao(e.target.value)}
                className="h-8 text-sm"
              />
            </div>
          </div>
          <div className="flex gap-2 justify-end">
            <button
              type="button"
              onClick={() => { setShowManualForm(false); setManualCodigo(''); setManualDescricao(''); }}
              className="text-xs px-3 py-1.5 rounded-md border border-border text-muted-foreground hover:bg-muted transition-colors"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleAddManual}
              disabled={manualCodigo.replace(/\D/g, '').length < 7 || !manualDescricao.trim()}
              className="text-xs px-3 py-1.5 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Adicionar
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setShowManualForm(true)}
          className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          Adicionar CNAE manualmente
        </button>
      )}
    </div>
  );
};

export default CNAESection;
