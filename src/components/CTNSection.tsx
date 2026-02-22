import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Settings, Search, CheckCircle2, AlertCircle, X, Plus, Trash2, PenLine, ChevronDown, Star } from 'lucide-react';
import { getCTNByCode, isValidCTN, searchCTN } from '@/utils/ctn-data';
import { CNAE_LIST, formatCNAECode, getLC116Item, type CNAEEntry } from '@/utils/cnae-lc116';
import { getNBSDescricao, searchNBS, type NBSEntry } from '@/utils/nbs-data';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';

interface CnaeAdicionado {
  codigo: string;
  /** Descrição oficial do CNAE (IBGE) */
  cnaeDescricao: string;
  /** Descrição do serviço conforme LC 116 */
  lc116Descricao: string;
  /** Item da LC 116 (ex: "1.01") */
  lc116Item: string;
  ctn: string | undefined;
  ctnDescricao?: string;
  nbs?: string;
  nbsDescricao?: string;
  isManual?: boolean;
  isPrincipal?: boolean;
  vinculadoSN?: boolean;
}

interface Props {
  ctnSelecionado: string | null;
  onCtnChange: (codigo: string, descricao: string, itemFormatado: string) => void;
}

const CTNSection: React.FC<Props> = ({ ctnSelecionado, onCtnChange }) => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [cnaes, setCnaes] = useState<CnaeAdicionado[]>([]);
  const [pendingEntry, setPendingEntry] = useState<CNAEEntry | null>(null);
  const [pendingPrincipal, setPendingPrincipal] = useState(false);
  const [pendingVincularSN, setPendingVincularSN] = useState(false);
  const [showManualForm, setShowManualForm] = useState(false);
  const [manualCnae, setManualCnae] = useState('');
  const [manualCtn, setManualCtn] = useState('');
  const [manualNbs, setManualNbs] = useState('');
  const [manualDescricao, setManualDescricao] = useState('');
  const [manualIsPrincipal, setManualIsPrincipal] = useState(false);
  const [manualVincularSN, setManualVincularSN] = useState(false);
  const [manualCnaeDescricaoIBGE, setManualCnaeDescricaoIBGE] = useState('');
  const [ctnQuery, setCtnQuery] = useState('');
  const [nbsQuery, setNbsQuery] = useState('');
  const [showCtnDropdown, setShowCtnDropdown] = useState(false);
  const [showNbsDropdown, setShowNbsDropdown] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const ctnDropdownRef = useRef<HTMLDivElement>(null);
  const nbsDropdownRef = useRef<HTMLDivElement>(null);

  const ctnResults = useMemo(() => {
    const q = ctnQuery.trim();
    if (!q) return searchCTN('', 0);
    return searchCTN(q, 30);
  }, [ctnQuery]);

  const nbsResults = useMemo(() => {
    return searchNBS(nbsQuery.trim(), 30);
  }, [nbsQuery]);

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
      if (ctnDropdownRef.current && !ctnDropdownRef.current.contains(e.target as Node)) {
        setShowCtnDropdown(false);
      }
      if (nbsDropdownRef.current && !nbsDropdownRef.current.contains(e.target as Node)) {
        setShowNbsDropdown(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Auto-fill CTN and NBS when CNAE is typed
  const handleManualCnaeChange = (value: string) => {
    setManualCnae(value);
    const digits = value.replace(/\D/g, '');
    // Try to find IBGE description from CNAE_LIST
    const cnaeEntry = CNAE_LIST.find(e => e.codigo === digits);
    setManualCnaeDescricaoIBGE(cnaeEntry?.descricao || '');
    if (digits.length >= 7) {
      const lc = getLC116Item(digits);
      if (lc) {
        if (lc.ctn) {
          setManualCtn(lc.ctn);
          setCtnQuery('');
        }
        if (lc.nbs) {
          setManualNbs(lc.nbs);
          setNbsQuery('');
        }
        setManualDescricao(lc.descricao);
      }
    }
  };

  const handleAddCNAE = (entry: CNAEEntry) => {
    setPendingEntry(entry);
    setPendingPrincipal(false);
    setPendingVincularSN(false);
    setQuery('');
    setIsOpen(false);
  };

  const handleConfirmPending = () => {
    if (!pendingEntry) return;
    const entry = pendingEntry;
    const ctnEntry = entry.lc116.ctn ? getCTNByCode(entry.lc116.ctn) : null;
    const novo: CnaeAdicionado = {
      codigo: entry.codigo,
      cnaeDescricao: entry.descricao,
      lc116Descricao: entry.descricaoLC116,
      lc116Item: entry.lc116.item,
      ctn: entry.lc116.ctn,
      ctnDescricao: ctnEntry?.descricao || entry.lc116.descricao,
      nbs: entry.lc116.nbs || ctnEntry?.nbs,
      nbsDescricao: getNBSDescricao(entry.lc116.nbs || ctnEntry?.nbs || '') || undefined,
      isPrincipal: pendingPrincipal,
      vinculadoSN: pendingVincularSN,
    };
    setCnaes(prev => {
      if (pendingPrincipal) {
        return [...prev.map(c => ({ ...c, isPrincipal: false })), novo];
      }
      return [...prev, novo];
    });
    if (!ctnSelecionado && entry.lc116.ctn) {
      const ctnEntry = getCTNByCode(entry.lc116.ctn);
      if (ctnEntry) {
        onCtnChange(ctnEntry.codigo, ctnEntry.descricao, ctnEntry.itemFormatado);
      } else {
        onCtnChange(entry.lc116.ctn, entry.lc116.descricao, entry.lc116.item);
      }
    }
    setPendingEntry(null);
  };

  const handleCancelPending = () => {
    setPendingEntry(null);
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

  const handleTogglePrincipal = (codigo: string) => {
    setCnaes(prev => prev.map(c => ({
      ...c,
      isPrincipal: c.codigo === codigo ? !c.isPrincipal : false,
    })));
  };

  const handleToggleVinculadoSN = (codigo: string) => {
    setCnaes(prev => prev.map(c =>
      c.codigo === codigo ? { ...c, vinculadoSN: !c.vinculadoSN } : c
    ));
  };

  const handleUpdateCTN = (codigo: string, newCtn: string) => {
    const ctnEntry = newCtn ? getCTNByCode(newCtn) : null;
    setCnaes(prev => prev.map(c =>
      c.codigo === codigo
        ? {
            ...c,
            ctn: newCtn || undefined,
            ctnDescricao: ctnEntry?.descricao || undefined,
            nbs: ctnEntry?.nbs || c.nbs,
            nbsDescricao: ctnEntry?.nbs ? (getNBSDescricao(ctnEntry.nbs) || undefined) : c.nbsDescricao,
          }
        : c
    ));
  };

  const handleUpdateNBS = (codigo: string, newNbs: string) => {
    setCnaes(prev => prev.map(c =>
      c.codigo === codigo
        ? { ...c, nbs: newNbs || undefined, nbsDescricao: newNbs ? (getNBSDescricao(newNbs) || newNbs) : undefined }
        : c
    ));
  };

  const handleAddManual = () => {
    const codigo = manualCnae.replace(/\D/g, '');
    if (!codigo) return;
    if (cnaes.some(c => c.codigo === codigo)) return;
    const ctnCode = manualCtn.replace(/\D/g, '') || undefined;
    const ctnEntry = ctnCode ? getCTNByCode(ctnCode) : null;
    const lc = getLC116Item(codigo);
    const novo: CnaeAdicionado = {
      codigo,
      cnaeDescricao: manualCnaeDescricaoIBGE || manualDescricao || 'Inclusão manual',
      lc116Descricao: lc?.descricao || manualDescricao || '',
      lc116Item: lc?.item || '',
      ctn: ctnCode,
      ctnDescricao: ctnEntry?.descricao || (ctnCode ? manualDescricao : undefined),
      nbs: manualNbs || undefined,
      nbsDescricao: manualNbs ? (getNBSDescricao(manualNbs) || manualNbs) : undefined,
      isManual: true,
      isPrincipal: manualIsPrincipal,
      vinculadoSN: manualVincularSN,
    };
    setCnaes(prev => {
      // Se marcou como principal, desmarcar os outros
      if (manualIsPrincipal) {
        return [...prev.map(c => ({ ...c, isPrincipal: false })), novo];
      }
      return [...prev, novo];
    });
    if (!ctnSelecionado && novo.ctn) {
      const ctnEntry = getCTNByCode(novo.ctn);
      if (ctnEntry) {
        onCtnChange(ctnEntry.codigo, ctnEntry.descricao, ctnEntry.itemFormatado);
      } else {
        onCtnChange(novo.ctn, novo.cnaeDescricao, '');
      }
    }
    setManualCnae('');
    setManualCtn('');
    setManualNbs('');
    setManualDescricao('');
    setManualCnaeDescricaoIBGE('');
    setManualIsPrincipal(false);
    setManualVincularSN(false);
    setCtnQuery('');
    setNbsQuery('');
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
      <h2 className="section-title mb-3">
        <Settings className="w-5 h-5 text-primary" />
        Parâmetro Fiscal
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
        {/* CNAE Card */}
        <div className={`radio-card flex-col items-start ${manualCnae ? 'radio-card-selected' : ''}`}>
          <div className="flex items-center gap-2 w-full">
            <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${
              manualCnae ? 'border-primary' : 'border-muted-foreground/40'
            }`}>
              {manualCnae && <div className="w-2 h-2 rounded-full bg-primary" />}
            </div>
            <div className="text-sm font-medium text-foreground">CNAE *</div>
          </div>
          <div className="w-full mt-2 space-y-1">
            <Input
              placeholder="Ex: 6201500"
              value={manualCnae}
              onChange={e => handleManualCnaeChange(e.target.value)}
              className="h-8 text-sm"
            />
            {manualCnaeDescricaoIBGE && (
              <p className="text-xs text-foreground/70 leading-snug">{manualCnaeDescricaoIBGE}</p>
            )}
          </div>
        </div>

        {/* CTN Card */}
        <div ref={ctnDropdownRef} className={`radio-card flex-col items-start ${manualCtn ? 'radio-card-selected' : ''}`}>
          <div className="flex items-center gap-2 w-full">
            <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${
              manualCtn ? 'border-primary' : 'border-muted-foreground/40'
            }`}>
              {manualCtn && <div className="w-2 h-2 rounded-full bg-primary" />}
            </div>
            <div className="text-sm font-medium text-foreground">CTN (6 dígitos)</div>
          </div>
          <div className="w-full mt-2 relative">
            <Input
              placeholder="Buscar CTN..."
              value={showCtnDropdown ? ctnQuery : (manualCtn ? formatCTNDisplay(manualCtn) : '')}
              onChange={e => {
                setCtnQuery(e.target.value);
                setManualCtn('');
                setShowCtnDropdown(true);
              }}
              onFocus={() => setShowCtnDropdown(true)}
              className="h-8 text-sm pr-8"
            />
            <button
              type="button"
              onClick={() => setShowCtnDropdown(v => !v)}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <ChevronDown className="w-3.5 h-3.5" />
            </button>
            {showCtnDropdown && ctnResults.length > 0 && (
              <div className="absolute z-30 top-full mt-1 w-full max-h-48 overflow-y-auto rounded-lg border border-border bg-card shadow-lg">
                {ctnResults.map(entry => (
                  <button
                    key={entry.codigo}
                    type="button"
                    onClick={() => {
                      setManualCtn(entry.codigo);
                      setCtnQuery('');
                      setShowCtnDropdown(false);
                      if (entry.nbs && !manualNbs) setManualNbs(entry.nbs);
                    }}
                    className="w-full text-left px-3 py-2 border-b border-border/50 last:border-b-0 hover:bg-muted/50 transition-colors"
                  >
                    <span className="font-mono text-xs font-semibold text-primary">{formatCTNDisplay(entry.codigo)}</span>
                    <span className="text-xs text-muted-foreground ml-2">({entry.itemFormatado})</span>
                    <p className="text-xs text-foreground/70 line-clamp-1">{entry.descricao}</p>
                  </button>
                ))}
              </div>
            )}
          </div>
          {manualCtn && (
            <p className="text-xs text-foreground/70 leading-snug mt-1">
              {getCTNByCode(manualCtn)?.descricao || ''}
            </p>
          )}
        </div>

        {/* NBS Card */}
        <div ref={nbsDropdownRef} className={`radio-card flex-col items-start ${manualNbs ? 'radio-card-selected' : ''}`}>
          <div className="flex items-center gap-2 w-full">
            <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${
              manualNbs ? 'border-primary' : 'border-muted-foreground/40'
            }`}>
              {manualNbs && <div className="w-2 h-2 rounded-full bg-primary" />}
            </div>
            <div>
              <div className="text-sm font-medium text-foreground">NBS</div>
              <div className="text-xs text-muted-foreground">Nomenclatura Brasileira Serviços</div>
            </div>
          </div>
          <div className="w-full mt-2 relative">
            <Input
              placeholder="Buscar NBS..."
              value={showNbsDropdown ? nbsQuery : manualNbs}
              onChange={e => {
                setNbsQuery(e.target.value);
                setManualNbs('');
                setShowNbsDropdown(true);
              }}
              onFocus={() => setShowNbsDropdown(true)}
              className="h-8 text-sm pr-8"
            />
            <button
              type="button"
              onClick={() => setShowNbsDropdown(v => !v)}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <ChevronDown className="w-3.5 h-3.5" />
            </button>
            {showNbsDropdown && nbsResults.length > 0 && (
              <div className="absolute z-30 top-full mt-1 w-full max-h-48 overflow-y-auto rounded-lg border border-border bg-card shadow-lg">
                {nbsResults.map(entry => (
                  <button
                    key={entry.codigo}
                    type="button"
                    onClick={() => {
                      setManualNbs(entry.codigo);
                      setNbsQuery('');
                      setShowNbsDropdown(false);
                    }}
                    className="w-full text-left px-3 py-2 border-b border-border/50 last:border-b-0 hover:bg-muted/50 transition-colors"
                  >
                    <span className="font-mono text-xs font-semibold text-primary">{entry.codigo}</span>
                    <p className="text-xs text-foreground/70 line-clamp-1">{entry.descricao}</p>
                  </button>
                ))}
              </div>
            )}
          </div>
          </div>
          {manualNbs && (
            <p className="text-xs text-foreground/70 leading-snug mt-1">
              {getNBSDescricao(manualNbs) || ''}
            </p>
          )}
        </div>

      {/* Options and Add button */}
      {manualCnae.replace(/\D/g, '') && (
        <div className="mb-4 p-3 rounded-lg border border-border bg-muted/30 space-y-3">
          <div className="grid grid-cols-1 gap-3">
            <div className="space-y-1">
              <Label className="text-xs">Descrição</Label>
              <Input
                placeholder="Descrição da atividade"
                value={manualDescricao}
                onChange={e => setManualDescricao(e.target.value)}
                className="h-8 text-sm"
              />
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                id="manual-principal"
                checked={manualIsPrincipal}
                onCheckedChange={(checked) => setManualIsPrincipal(checked === true)}
              />
              <Label htmlFor="manual-principal" className="text-xs cursor-pointer">
                Atividade econômica principal
              </Label>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                id="manual-vincular-sn"
                checked={manualVincularSN}
                onCheckedChange={(checked) => setManualVincularSN(checked === true)}
              />
              <Label htmlFor="manual-vincular-sn" className="text-xs cursor-pointer">
                Vincular ao Simples Nacional
              </Label>
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


      {/* Pending confirmation panel */}
      {pendingEntry && (
        <div className="mt-3 p-3 rounded-lg border border-primary/30 bg-primary/5 space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-foreground">Confirmar adição do Cnaë</p>
            <button type="button" onClick={handleCancelPending} className="text-muted-foreground hover:text-foreground">
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="space-y-1 text-xs">
            <p className="text-foreground/90">
              <span className="font-mono font-semibold text-primary">{formatCNAECode(pendingEntry.codigo)}</span>
              <span className="ml-2">{pendingEntry.descricao}</span>
            </p>
            {pendingEntry.lc116.ctn && (
              <p className="text-muted-foreground">
                CTN {formatCTNDisplay(pendingEntry.lc116.ctn)}: {pendingEntry.lc116.descricao}
              </p>
            )}
            {(pendingEntry.lc116.nbs || (pendingEntry.lc116.ctn && getCTNByCode(pendingEntry.lc116.ctn)?.nbs)) && (
              <p className="text-muted-foreground">
                NBS {pendingEntry.lc116.nbs || getCTNByCode(pendingEntry.lc116.ctn!)?.nbs}
              </p>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <Checkbox
                id="pending-principal"
                checked={pendingPrincipal}
                onCheckedChange={(checked) => setPendingPrincipal(checked === true)}
              />
              <Label htmlFor="pending-principal" className="text-xs cursor-pointer">
                Atividade econômica principal
              </Label>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                id="pending-vincular-sn"
                checked={pendingVincularSN}
                onCheckedChange={(checked) => setPendingVincularSN(checked === true)}
              />
              <Label htmlFor="pending-vincular-sn" className="text-xs cursor-pointer">
                Vincular ao Simples Nacional
              </Label>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" size="sm" onClick={handleCancelPending} className="text-xs">
              Cancelar
            </Button>
            <Button type="button" size="sm" onClick={handleConfirmPending} className="text-xs gap-1.5">
              <Plus className="w-3.5 h-3.5" />
              Adicionar
            </Button>
          </div>
        </div>
      )}

      {/* Lista de CNAEs adicionados */}
      {cnaes.length > 0 && (
        <div className="mt-4 space-y-2">
          <p className="text-xs text-muted-foreground font-medium">Cnaës adicionados</p>
          <div className="space-y-1.5">
            {cnaes.map((cnae) => {
              const isLinked = cnae.ctn === ctnSelecionado;
              return (
                <CnaeListItem
                  key={cnae.codigo}
                  cnae={cnae}
                  isLinked={isLinked}
                  onSelect={() => handleSelectCNAEForCTN(cnae)}
                  onRemove={() => handleRemoveCNAE(cnae.codigo)}
                  onTogglePrincipal={() => handleTogglePrincipal(cnae.codigo)}
                  onToggleVinculadoSN={() => handleToggleVinculadoSN(cnae.codigo)}
                  onUpdateCTN={(ctn) => handleUpdateCTN(cnae.codigo, ctn)}
                  onUpdateNBS={(nbs) => handleUpdateNBS(cnae.codigo, nbs)}
                  formatCTNDisplay={formatCTNDisplay}
                />
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

/* ─── Sub-component for each CNAE list item ─── */
interface CnaeListItemProps {
  cnae: CnaeAdicionado;
  isLinked: boolean;
  onSelect: () => void;
  onRemove: () => void;
  onTogglePrincipal: () => void;
  onToggleVinculadoSN: () => void;
  onUpdateCTN: (ctn: string) => void;
  onUpdateNBS: (nbs: string) => void;
  formatCTNDisplay: (c: string) => string;
}

const CnaeListItem: React.FC<CnaeListItemProps> = ({
  cnae, isLinked, onSelect, onRemove, onTogglePrincipal, onToggleVinculadoSN, onUpdateCTN, onUpdateNBS, formatCTNDisplay
}) => {
  const [editingCtn, setEditingCtn] = useState(false);
  const [editingNbs, setEditingNbs] = useState(false);
  const [ctnInput, setCtnInput] = useState('');
  const [nbsInput, setNbsInput] = useState('');
  const [ctnSearchOpen, setCtnSearchOpen] = useState(false);
  const [nbsSearchOpen, setNbsSearchOpen] = useState(false);
  const ctnRef = useRef<HTMLDivElement>(null);
  const nbsRef = useRef<HTMLDivElement>(null);

  const ctnSearchResults = useMemo(() => searchCTN(ctnInput.trim(), 15), [ctnInput]);
  const nbsSearchResults = useMemo(() => searchNBS(nbsInput.trim(), 15), [nbsInput]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ctnRef.current && !ctnRef.current.contains(e.target as Node)) {
        setEditingCtn(false);
        setCtnSearchOpen(false);
      }
      if (nbsRef.current && !nbsRef.current.contains(e.target as Node)) {
        setEditingNbs(false);
        setNbsSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div
      className={`group p-2.5 rounded-lg border transition-colors ${
        isLinked
          ? 'border-primary/30 bg-primary/5'
          : 'border-border bg-background hover:border-primary/20'
      }`}
    >
      {/* Header row */}
      <div className="flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={onSelect}
          disabled={!cnae.ctn}
          className="flex items-center gap-2 flex-wrap min-w-0 text-left flex-1"
          title={cnae.ctn ? 'Clique para vincular este Cnaë ao CTN' : 'Sem CTN vinculado'}
        >
          <span className="font-mono text-xs font-semibold text-primary">
            {formatCNAECode(cnae.codigo)}
          </span>
          {cnae.isManual && (
            <span className="text-xs bg-accent text-accent-foreground px-1.5 py-0.5 rounded font-medium">Manual</span>
          )}
          {isLinked && (
            <span className="flex items-center gap-1 text-xs text-primary bg-primary/10 px-1.5 py-0.5 rounded font-medium">
              <CheckCircle2 className="w-3 h-3" /> Vinculado
            </span>
          )}
        </button>
        <button
          type="button"
          onClick={onRemove}
          title="Remover CNAE"
          className="shrink-0 p-1.5 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors opacity-0 group-hover:opacity-100"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Atividade Econômica Cnae */}
      <div className="mt-1 space-y-0.5">
        <div>
          <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">Atividade Econômica Cnaë</p>
          <p className="text-xs text-foreground/90 -mt-px">
            <span className="font-mono font-semibold text-primary">{formatCNAECode(cnae.codigo)}</span>{' '}{cnae.cnaeDescricao}
          </p>
        </div>

        {/* Código Tributação Nacional (CTN) */}
        <div ref={ctnRef}>
          <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">Código Tributação Nacional (CTN)</p>
          {!editingCtn ? (
            <button
              type="button"
              onClick={() => { setEditingCtn(true); setCtnInput(''); setCtnSearchOpen(true); }}
              className="text-left"
            >
              {cnae.ctn ? (
                <p className="text-xs text-foreground/90">
                  <span className="font-mono font-semibold text-primary">{formatCTNDisplay(cnae.ctn)}</span>{' '}{cnae.ctnDescricao || ''}
                </p>
              ) : (
                <p className="text-xs text-muted-foreground italic hover:text-primary transition-colors">(clique para adicionar)</p>
              )}
            </button>
          ) : (
            <div className="relative max-w-xs">
              <Input
                autoFocus
                placeholder="Buscar CTN..."
                value={ctnInput}
                onChange={e => { setCtnInput(e.target.value); setCtnSearchOpen(true); }}
                className="h-7 text-xs"
              />
              {cnae.ctn && (
                <button type="button" onClick={() => { onUpdateCTN(''); setEditingCtn(false); }} className="absolute right-1 top-1/2 -translate-y-1/2 text-destructive hover:text-destructive/80">
                  <X className="w-3 h-3" />
                </button>
              )}
              {ctnSearchOpen && ctnSearchResults.length > 0 && (
                <div className="absolute z-30 top-full mt-1 w-full max-h-36 overflow-y-auto rounded-lg border border-border bg-card shadow-lg">
                  {ctnSearchResults.map(entry => (
                    <button
                      key={entry.codigo}
                      type="button"
                      onClick={() => { onUpdateCTN(entry.codigo); setEditingCtn(false); setCtnSearchOpen(false); }}
                      className="w-full text-left px-2 py-1.5 border-b border-border/50 last:border-b-0 hover:bg-muted/50 transition-colors"
                    >
                      <span className="font-mono text-xs font-semibold text-primary">{formatCTNDisplay(entry.codigo)}</span>
                      <p className="text-xs text-foreground/70 line-clamp-1">{entry.descricao}</p>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Nomenclatura Brasileira Serviços (NBS) */}
        <div ref={nbsRef}>
          <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">Nomenclatura Brasileira Serviços (NBS)</p>
          {!editingNbs ? (
            <button
              type="button"
              onClick={() => { setEditingNbs(true); setNbsInput(''); setNbsSearchOpen(true); }}
              className="text-left"
            >
              {cnae.nbs ? (
                <p className="text-xs text-foreground/90">
                  <span className="font-mono font-semibold text-primary">{cnae.nbs}</span>{' '}{cnae.nbsDescricao || ''}
                </p>
              ) : (
                <p className="text-xs text-muted-foreground italic hover:text-primary transition-colors">(clique para adicionar)</p>
              )}
            </button>
          ) : (
            <div className="relative max-w-xs">
              <Input
                autoFocus
                placeholder="Buscar NBS..."
                value={nbsInput}
                onChange={e => { setNbsInput(e.target.value); setNbsSearchOpen(true); }}
                className="h-7 text-xs"
              />
              {cnae.nbs && (
                <button type="button" onClick={() => { onUpdateNBS(''); setEditingNbs(false); }} className="absolute right-1 top-1/2 -translate-y-1/2 text-destructive hover:text-destructive/80">
                  <X className="w-3 h-3" />
                </button>
              )}
              {nbsSearchOpen && nbsSearchResults.length > 0 && (
                <div className="absolute z-30 top-full mt-1 w-full max-h-36 overflow-y-auto rounded-lg border border-border bg-card shadow-lg">
                  {nbsSearchResults.map(entry => (
                    <button
                      key={entry.codigo}
                      type="button"
                      onClick={() => { onUpdateNBS(entry.codigo); setEditingNbs(false); setNbsSearchOpen(false); }}
                      className="w-full text-left px-2 py-1.5 border-b border-border/50 last:border-b-0 hover:bg-muted/50 transition-colors"
                    >
                      <span className="font-mono text-xs font-semibold text-primary">{entry.codigo}</span>
                      <p className="text-xs text-foreground/70 line-clamp-1">{entry.descricao}</p>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Toggle buttons */}
      <div className="mt-2 flex items-center gap-3">
        <button
          type="button"
          onClick={onTogglePrincipal}
          className={`flex items-center gap-1 text-xs px-2 py-1 rounded-md border transition-colors ${
            cnae.isPrincipal
              ? 'border-amber-300 bg-amber-50 text-amber-700'
              : 'border-border text-muted-foreground hover:border-amber-300 hover:text-amber-700'
          }`}
        >
          <Star className={`w-3 h-3 ${cnae.isPrincipal ? 'fill-amber-400' : ''}`} />
          Principal
        </button>
        <button
          type="button"
          onClick={onToggleVinculadoSN}
          className={`flex items-center gap-1 text-xs px-2 py-1 rounded-md border transition-colors ${
            cnae.vinculadoSN
              ? 'border-emerald-300 bg-emerald-50 text-emerald-700'
              : 'border-border text-muted-foreground hover:border-emerald-300 hover:text-emerald-700'
          }`}
        >
          <CheckCircle2 className="w-3 h-3" />
          Simples Nacional
        </button>
      </div>
    </div>
  );
};

export default CTNSection;
