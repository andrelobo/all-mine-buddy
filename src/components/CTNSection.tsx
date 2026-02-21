import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Settings, Search, CheckCircle2, AlertCircle, X } from 'lucide-react';
import { CTN_DATA, getCTNByCode, isValidCTN, type CTNEntry } from '@/utils/ctn-data';
import { Input } from '@/components/ui/input';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

type SearchMode = 'codigo' | 'descricao';

interface Props {
  ctnSelecionado: string | null;
  onCtnChange: (codigo: string, descricao: string, itemFormatado: string) => void;
}

const CTNSection: React.FC<Props> = ({ ctnSelecionado, onCtnChange }) => {
  const [mode, setMode] = useState<SearchMode>('codigo');
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const results = useMemo(() => {
    const q = query.trim();
    if (!q) return [];
    const normalized = q.toLowerCase();
    const matches: CTNEntry[] = [];
    for (const entry of CTN_DATA) {
      if (matches.length >= 30) break;
      if (mode === 'codigo') {
        const digits = q.replace(/\D/g, '');
        if (digits && (entry.codigo.startsWith(digits) || entry.itemFormatado.includes(q))) {
          matches.push(entry);
        }
      } else {
        if (entry.descricao.toLowerCase().includes(normalized)) {
          matches.push(entry);
        }
      }
    }
    return matches;
  }, [query, mode]);

  const selectedEntry = ctnSelecionado ? getCTNByCode(ctnSelecionado) : null;
  const isValid = ctnSelecionado ? isValidCTN(ctnSelecionado) : null;

  // Close dropdown on outside click
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
          onClick={() => { setMode('codigo'); setQuery(''); setIsOpen(false); }}
          className={`text-xs px-3 py-1.5 rounded-md transition-colors font-medium ${
            mode === 'codigo'
              ? 'bg-background text-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          Por código
        </button>
        <button
          type="button"
          onClick={() => { setMode('descricao'); setQuery(''); setIsOpen(false); }}
          className={`text-xs px-3 py-1.5 rounded-md transition-colors font-medium ${
            mode === 'descricao'
              ? 'bg-background text-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          Por descrição
        </button>
      </div>

      {/* Search */}
      <div ref={containerRef} className="relative">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder={mode === 'codigo' ? 'Digite o código CTN (ex: 010101 ou 1.01)' : 'Digite parte da descrição do serviço'}
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
            {results.map((entry) => {
              const isSelected = ctnSelecionado === entry.codigo;
              return (
                <button
                  key={entry.codigo}
                  type="button"
                  onClick={() => handleSelect(entry)}
                  className={`w-full text-left px-3 py-2.5 border-b border-border/50 last:border-b-0 transition-colors ${
                    isSelected
                      ? 'bg-primary/5'
                      : 'hover:bg-muted/50'
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
            })}
          </div>
        )}

        {isOpen && query.trim() && results.length === 0 && (
          <div className="absolute z-20 top-full mt-1 w-full rounded-lg border border-border bg-card shadow-lg p-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>Nenhum CTN encontrado. Verifique o {mode === 'codigo' ? 'código' : 'termo'} informado.</span>
            </div>
          </div>
        )}
      </div>

      {/* Selected CTN Display */}
      {selectedEntry && (
        <TooltipProvider delayDuration={200}>
          <div className="mt-4 pt-4 border-t border-border">
            <p className="text-xs text-muted-foreground mb-1.5">CTN selecionado para NFS-e</p>
            <div className={`flex items-start gap-2 p-3 rounded-lg border ${
              isValid
                ? 'bg-primary/5 border-primary/20'
                : 'bg-destructive/5 border-destructive/20'
            }`}>
              {isValid ? (
                <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-4 h-4 text-destructive shrink-0 mt-0.5" />
              )}
              <div className="flex-1 min-w-0 space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-mono text-sm font-bold text-primary">
                    {formatCTNDisplay(selectedEntry.codigo)}
                  </span>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span className="text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded cursor-help">
                        Item {selectedEntry.itemFormatado}
                      </span>
                    </TooltipTrigger>
                    <TooltipContent side="top" className="max-w-xs text-xs">
                      <p className="font-semibold mb-0.5">Item da LC 116/2003</p>
                      <p>Código do item da Lista de Serviços da Lei Complementar nº 116/2003, correspondente ao serviço tributável pelo ISS.</p>
                    </TooltipContent>
                  </Tooltip>
                  {isValid && (
                    <span className="text-xs text-primary/80 bg-primary/10 px-1.5 py-0.5 rounded font-medium">
                      ✓ Validado Portal Nacional NFS-e
                    </span>
                  )}
                </div>
                <p className="text-sm text-foreground leading-snug">
                  {selectedEntry.descricao}
                </p>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <p className="text-xs text-muted-foreground cursor-help">
                      <span className="font-semibold text-foreground/70">Formato IISSDD:</span>
                      <span className="ml-1">
                        Item {selectedEntry.item} · Subitem {selectedEntry.subitem} · Desdobro {selectedEntry.desdobro}
                      </span>
                    </p>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="max-w-xs text-xs">
                    <p className="font-semibold mb-0.5">Código de Tributação Nacional (CTN)</p>
                    <p>Código de 6 dígitos no padrão ABRASF/SPED, composto por Item (II), Subitem (SS) e Desdobro Nacional (DD). Utilizado na NFS-e para identificar o tipo de serviço prestado.</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </div>
          </div>
        </TooltipProvider>
      )}

      {!selectedEntry && !isOpen && (
        <div className="flex items-center gap-2 text-xs text-muted-foreground mt-3">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>Nenhum CTN selecionado. Use a busca acima para localizar o código de tributação.</span>
        </div>
      )}
    </div>
  );
};

export default CTNSection;
