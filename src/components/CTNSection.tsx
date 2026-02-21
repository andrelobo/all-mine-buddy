import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Settings, Search, CheckCircle2, AlertCircle, X, Plus, Trash2 } from 'lucide-react';
import { CTN_DATA, getCTNByCode, isValidCTN, type CTNEntry } from '@/utils/ctn-data';
import { CNAE_LIST, formatCNAECode, type CNAEEntry } from '@/utils/cnae-lc116';
import { Input } from '@/components/ui/input';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

type SearchMode = 'codigo' | 'descricao' | 'cnae';

interface CnaeAdicionado {
  codigo: string;
  descricao: string;
  ctn: string | undefined;
}

interface Props {
  ctnSelecionado: string | null;
  onCtnChange: (codigo: string, descricao: string, itemFormatado: string) => void;
}

const CTNSection: React.FC<Props> = ({ ctnSelecionado, onCtnChange }) => {
  const [mode, setMode] = useState<SearchMode>('cnae');
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [cnaes, setCnaes] = useState<CnaeAdicionado[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  const results = useMemo(() => {
    const q = query.trim();
    if (!q) return [];
    const normalized = q.toLowerCase();

    if (mode === 'cnae') {
      const digits = q.replace(/\D/g, '');
      const addedCodes = new Set(cnaes.map(c => c.codigo));
      const matches: CNAEEntry[] = [];
      for (const entry of CNAE_LIST) {
        if (matches.length >= 30) break;
        if (addedCodes.has(entry.codigo)) continue;
        if (digits && entry.codigo.startsWith(digits)) {
          matches.push(entry);
        } else if (!digits && entry.descricao.toLowerCase().includes(normalized)) {
          matches.push(entry);
        }
      }
      return matches;
    }

    const ctnMatches: CTNEntry[] = [];
    for (const entry of CTN_DATA) {
      if (ctnMatches.length >= 30) break;
      if (mode === 'codigo') {
        const digits = q.replace(/\D/g, '');
        if (digits && (entry.codigo.startsWith(digits) || entry.itemFormatado.includes(q))) {
          ctnMatches.push(entry);
        }
      } else {
        if (entry.descricao.toLowerCase().includes(normalized)) {
          ctnMatches.push(entry);
        }
      }
    }
    return ctnMatches;
  }, [query, mode, cnaes]);

  const selectedEntry = ctnSelecionado ? getCTNByCode(ctnSelecionado) : null;
  const isValid = ctnSelecionado ? isValidCTN(ctnSelecionado) : null;

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSelect = (entry: CTNEntry) => {
    onCtnChange(entry.codigo, entry.descricao, entry.itemFormatado);
    setQuery('');
    setIsOpen(false);
  };

  const handleAddCNAE = (entry: CNAEEntry) => {
    const novo: CnaeAdicionado = {
      codigo: entry.codigo,
      descricao: entry.lc116.descricao,
      ctn: entry.lc116.ctn,
    };
    setCnaes(prev => [...prev, novo]);

    // Auto-select CTN if it's the first CNAE and no CTN selected
    if (!ctnSelecionado && entry.lc116.ctn) {
      const ctnEntry = getCTNByCode(entry.lc116.ctn);
      if (ctnEntry) {
        onCtnChange(ctnEntry.codigo, ctnEntry.descricao, ctnEntry.itemFormatado);
      } else {
        onCtnChange(entry.lc116.ctn, entry.lc116.descricao, entry.lc116.item);
      }
    }

    setQuery('');
    setIsOpen(false);
  };

  const handleRemoveCNAE = (codigo: string) => {
    setCnaes(prev => prev.filter(c => c.codigo !== codigo));
  };

  const handleSelectCNAEForCTN = (cnae: CnaeAdicionado) => {
    if (cnae.ctn) {
      const ctnEntry = getCTNByCode(cnae.ctn);
      if (ctnEntry) {
        onCtnChange(ctnEntry.codigo, ctnEntry.descricao, ctnEntry.itemFormatado);
      }
    }
  };

  const formatCTNDisplay = (codigo: string) => {
    if (codigo.length === 6) {
      return `${codigo.slice(0, 2)}.${codigo.slice(2, 4)}.${codigo.slice(4, 6)}`;
    }
    return codigo;
  };

  return (
    <div className="section-card">
      <h2 className="section-title">
        <Settings className="w-5 h-5 text-primary" />
        Parâmetro Fiscal
      </h2>

      {/* Mode Toggle */}
      <div className="flex items-center gap-1 mb-3 bg-muted/50 rounded-lg p-1 w-fit">
        <button
          type="button"
          onClick={() => { setMode('cnae'); setQuery(''); setIsOpen(false); }}
          className={`text-xs px-3 py-1.5 rounded-md transition-colors font-medium ${
            mode === 'cnae'
              ? 'bg-background text-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          Busque CNAE
        </button>
        <button
          type="button"
          onClick={() => { setMode('codigo'); setQuery(''); setIsOpen(false); }}
          className={`text-xs px-3 py-1.5 rounded-md transition-colors font-medium ${
            mode === 'codigo' || mode === 'descricao'
              ? 'bg-background text-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          CodTribNac NFS
        </button>
      </div>

      {/* Search */}
      <div ref={containerRef} className="relative">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder={
              mode === 'cnae'
                ? 'Buscar CNAE para adicionar (ex: 6201500)'
                : mode === 'codigo'
                  ? 'Digite o código CTN (ex: 010101 ou 1.01)'
                  : 'Digite parte da descrição do serviço'
            }
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setIsOpen(true);
            }}
            onFocus={() => query.trim() && setIsOpen(true)}
            className="h-9 text-sm pl-9 pr-8"
          />
          {query && (
            <button
              type="button"
              onClick={() => { setQuery(''); setIsOpen(false); }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Dropdown Results */}
        {isOpen && results.length > 0 && (
          <div className="absolute z-20 top-full mt-1 w-full max-h-64 overflow-y-auto rounded-lg border border-border bg-card shadow-lg">
            {mode === 'cnae' ? (
              (results as CNAEEntry[]).map((entry) => (
                <button
                  key={entry.codigo}
                  type="button"
                  onClick={() => handleAddCNAE(entry)}
                  className="w-full text-left px-3 py-2.5 border-b border-border/50 last:border-b-0 transition-colors hover:bg-muted/50"
                >
                  <div className="flex items-center gap-2">
                    <Plus className="w-3.5 h-3.5 text-primary shrink-0" />
                    <span className="font-mono text-xs font-semibold text-primary shrink-0">
                      {formatCNAECode(entry.codigo)}
                    </span>
                    {entry.lc116.ctn && (
                      <span className="text-xs text-muted-foreground shrink-0">
                        → CTN {formatCTNDisplay(entry.lc116.ctn)}
                      </span>
                    )}
                    {!entry.lc116.ctn && (
                      <span className="text-xs text-destructive/70 shrink-0">Sem CTN vinculado</span>
                    )}
                  </div>
                  <p className="text-xs text-foreground/80 mt-0.5 leading-snug line-clamp-2 pl-5">
                    {entry.descricao}
                  </p>
                </button>
              ))
            ) : (
              (results as CTNEntry[]).map((entry) => {
                const isSelected = ctnSelecionado === entry.codigo;
                return (
                  <button
                    key={entry.codigo}
                    type="button"
                    onClick={() => handleSelect(entry)}
                    className={`w-full text-left px-3 py-2.5 border-b border-border/50 last:border-b-0 transition-colors ${
                      isSelected ? 'bg-primary/5' : 'hover:bg-muted/50'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-semibold text-primary shrink-0">
                        {formatCTNDisplay(entry.codigo)}
                      </span>
                      <span className="text-xs text-muted-foreground shrink-0">
                        Item {entry.itemFormatado}
                      </span>
                      {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-primary shrink-0 ml-auto" />}
                    </div>
                    <p className="text-xs text-foreground/80 mt-0.5 leading-snug line-clamp-2">
                      {entry.descricao}
                    </p>
                  </button>
                );
              })
            )}
          </div>
        )}

        {isOpen && query.trim() && results.length === 0 && (
          <div className="absolute z-20 top-full mt-1 w-full rounded-lg border border-border bg-card shadow-lg p-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>
                {mode === 'cnae'
                  ? 'Nenhum CNAE encontrado. Verifique o código informado.'
                  : `Nenhum CTN encontrado. Verifique o ${mode === 'codigo' ? 'código' : 'termo'} informado.`
                }
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Lista de CNAEs adicionados */}
      {cnaes.length > 0 && (
        <div className="mt-4 space-y-2">
          <p className="text-xs text-muted-foreground font-medium">CNAEs adicionados</p>
          <div className="space-y-1.5">
            {cnaes.map((cnae) => {
              const isLinked = cnae.ctn === ctnSelecionado;
              return (
                <div
                  key={cnae.codigo}
                  className={`group flex items-center gap-2 p-2.5 rounded-lg border transition-colors ${
                    isLinked
                      ? 'border-primary/30 bg-primary/5'
                      : 'border-border bg-background hover:border-primary/20'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => handleSelectCNAEForCTN(cnae)}
                    disabled={!cnae.ctn}
                    className="flex-1 min-w-0 text-left"
                    title={cnae.ctn ? 'Clique para vincular este CNAE ao CTN' : 'Sem CTN vinculado'}
                  >
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-xs font-semibold text-primary">
                        {formatCNAECode(cnae.codigo)}
                      </span>
                      {cnae.ctn && (
                        <span className="text-xs text-muted-foreground">
                          → CTN {formatCTNDisplay(cnae.ctn)}
                        </span>
                      )}
                      {isLinked && (
                        <span className="flex items-center gap-1 text-xs text-primary bg-primary/10 px-1.5 py-0.5 rounded font-medium">
                          <CheckCircle2 className="w-3 h-3" />
                          Vinculado
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-foreground/70 mt-0.5 leading-snug line-clamp-1">
                      {cnae.descricao}
                    </p>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRemoveCNAE(cnae.codigo)}
                    title="Remover CNAE"
                    className="shrink-0 p-1.5 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}


      {!selectedEntry && !isOpen && cnaes.length === 0 && (
        <div className="flex items-center gap-2 text-xs text-muted-foreground mt-3">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>Nenhum CTN selecionado. Use a busca acima para localizar o código de tributação.</span>
        </div>
      )}
    </div>
  );
};

export default CTNSection;
