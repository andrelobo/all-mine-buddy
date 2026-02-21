import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Settings, Search, CheckCircle2, AlertCircle, X, Plus, Trash2, PenLine } from 'lucide-react';
import { getCTNByCode, isValidCTN } from '@/utils/ctn-data';
import { CNAE_LIST, formatCNAECode, type CNAEEntry } from '@/utils/cnae-lc116';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

interface CnaeAdicionado {
  codigo: string;
  descricao: string;
  ctn: string | undefined;
  nbs?: string;
  isManual?: boolean;
}

interface Props {
  ctnSelecionado: string | null;
  onCtnChange: (codigo: string, descricao: string, itemFormatado: string) => void;
}

const CTNSection: React.FC<Props> = ({ ctnSelecionado, onCtnChange }) => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [cnaes, setCnaes] = useState<CnaeAdicionado[]>([]);
  const [showManualForm, setShowManualForm] = useState(false);
  const [manualCnae, setManualCnae] = useState('');
  const [manualCtn, setManualCtn] = useState('');
  const [manualNbs, setManualNbs] = useState('');
  const [manualDescricao, setManualDescricao] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

  const results = useMemo(() => {
    const q = query.trim();
    if (!q) return [];
    const normalized = q.toLowerCase();
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
  }, [query, cnaes]);

  const selectedEntry = ctnSelecionado ? getCTNByCode(ctnSelecionado) : null;

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleAddCNAE = (entry: CNAEEntry) => {
    const novo: CnaeAdicionado = {
      codigo: entry.codigo,
      descricao: entry.lc116.descricao,
      ctn: entry.lc116.ctn,
    };
    setCnaes(prev => [...prev, novo]);
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

  const handleAddManual = () => {
    const codigo = manualCnae.replace(/\D/g, '');
    if (!codigo) return;
    if (cnaes.some(c => c.codigo === codigo)) return;
    const novo: CnaeAdicionado = {
      codigo,
      descricao: manualDescricao || 'Inclusão manual',
      ctn: manualCtn.replace(/\D/g, '') || undefined,
      nbs: manualNbs || undefined,
      isManual: true,
    };
    setCnaes(prev => [...prev, novo]);
    if (!ctnSelecionado && novo.ctn) {
      const ctnEntry = getCTNByCode(novo.ctn);
      if (ctnEntry) {
        onCtnChange(ctnEntry.codigo, ctnEntry.descricao, ctnEntry.itemFormatado);
      } else {
        onCtnChange(novo.ctn, novo.descricao, '');
      }
    }
    setManualCnae('');
    setManualCtn('');
    setManualNbs('');
    setManualDescricao('');
    setShowManualForm(false);
  };

  const formatCTNDisplay = (codigo: string) => {
    if (codigo.length === 6) {
      return `${codigo.slice(0, 2)}.${codigo.slice(2, 4)}.${codigo.slice(4, 6)}`;
    }
    return codigo;
  };

  return (
    <div className="section-card">
      <div className="flex items-center justify-between mb-1">
        <h2 className="section-title">
          <Settings className="w-5 h-5 text-primary" />
          Parâmetro Fiscal
        </h2>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setShowManualForm(v => !v)}
          className="text-xs gap-1.5"
        >
          <PenLine className="w-3.5 h-3.5" />
          {showManualForm ? 'Cancelar' : 'Manual'}
        </Button>
      </div>

      {/* Manual Form */}
      {showManualForm && (
        <div className="mb-4 p-3 rounded-lg border border-border bg-muted/30 space-y-3">
          <p className="text-xs font-medium text-muted-foreground">Inclusão manual</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label className="text-xs">CNAE *</Label>
              <Input
                placeholder="Ex: 6201500"
                value={manualCnae}
                onChange={e => setManualCnae(e.target.value)}
                className="h-8 text-sm"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">CTN (6 dígitos)</Label>
              <Input
                placeholder="Ex: 010101"
                value={manualCtn}
                onChange={e => setManualCtn(e.target.value)}
                className="h-8 text-sm"
                maxLength={6}
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">NBS</Label>
              <Input
                placeholder="Ex: 1.1502.10.00"
                value={manualNbs}
                onChange={e => setManualNbs(e.target.value)}
                className="h-8 text-sm"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Descrição</Label>
              <Input
                placeholder="Descrição da atividade"
                value={manualDescricao}
                onChange={e => setManualDescricao(e.target.value)}
                className="h-8 text-sm"
              />
            </div>
          </div>
          <div className="flex justify-end">
            <Button
              type="button"
              size="sm"
              onClick={handleAddManual}
              disabled={!manualCnae.replace(/\D/g, '')}
              className="text-xs gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              Adicionar
            </Button>
          </div>
        </div>
      )}

      {/* Search */}
      <div ref={containerRef} className="relative">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Buscar Cnaë para adicionar (ex: 6201500)"
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
            {results.map((entry) => (
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
            ))}
          </div>
        )}

        {isOpen && query.trim() && results.length === 0 && (
          <div className="absolute z-20 top-full mt-1 w-full rounded-lg border border-border bg-card shadow-lg p-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>Nenhum Cnaë encontrado. Verifique o código informado.</span>
            </div>
          </div>
        )}
      </div>

      {/* Lista de CNAEs adicionados */}
      {cnaes.length > 0 && (
        <div className="mt-4 space-y-2">
          <p className="text-xs text-muted-foreground font-medium">Cnaës adicionados</p>
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
                    title={cnae.ctn ? 'Clique para vincular este Cnaë ao CTN' : 'Sem CTN vinculado'}
                  >
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-xs font-semibold text-primary">
                        {formatCNAECode(cnae.codigo)}
                      </span>
                      {cnae.isManual && (
                        <span className="text-xs bg-accent text-accent-foreground px-1.5 py-0.5 rounded font-medium">
                          Manual
                        </span>
                      )}
                      {cnae.ctn && (
                        <span className="text-xs text-muted-foreground">
                          → CTN {formatCTNDisplay(cnae.ctn)}
                        </span>
                      )}
                      {cnae.nbs && (
                        <span className="text-xs text-muted-foreground">
                          | NBS {cnae.nbs}
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
