import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Landmark, Star, Loader2, AlertCircle, Trash2, CheckCircle2, Plus, X, ChevronDown } from 'lucide-react';
import { validateCNPJ } from '@/utils/validators';
import { CNAE_LIST, formatCNAECode as formatCNAECodeFromList, getLC116Item } from '@/utils/cnae-lc116';
import { getCTNByCode, searchCTN, searchCTNByItem } from '@/utils/ctn-data';
import { getNBSDescricao, searchNBS, searchNBSByPrefix } from '@/utils/nbs-data';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

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
    codigo: c.codigo, descricao: c.descricao || '',
  }));
  return { principal, secundarias };
}

function formatCNAECode(codigo: number | string): string {
  const str = String(codigo).replace(/\D/g, '').padStart(7, '0');
  if (str.length >= 7) return `${str.slice(0, 4)}-${str.slice(4, 5)}/${str.slice(5, 7)}`;
  return str;
}

const CNAESection: React.FC<Props> = ({ cnpj, cnaeEscolhido, onCnaeEscolhidoChange }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [allActivities, setAllActivities] = useState<CNAEAtividade[]>([]);
  const [manualActivities, setManualActivities] = useState<CNAEAtividade[]>([]);
  const [removedCodes, setRemovedCodes] = useState<Set<string>>(new Set());
  const [showManualForm, setShowManualForm] = useState(false);

  // Manual form state
  const [manualCnae, setManualCnae] = useState('');
  const [manualCtn, setManualCtn] = useState('');
  const [manualNbs, setManualNbs] = useState('');
  const [manualDescricao, setManualDescricao] = useState('');
  const [manualCnaeDescricaoIBGE, setManualCnaeDescricaoIBGE] = useState('');
  const [ctnQuery, setCtnQuery] = useState('');
  const [detectedItem, setDetectedItem] = useState<string | null>(null);
  const [nbsQuery, setNbsQuery] = useState('');
  const [detectedNbsPrefix, setDetectedNbsPrefix] = useState<string | null>(null);
  const [showCnaeDropdown, setShowCnaeDropdown] = useState(false);
  const [showCtnDropdown, setShowCtnDropdown] = useState(false);
  const [showNbsDropdown, setShowNbsDropdown] = useState(false);
  const cnaeDropdownRef = useRef<HTMLDivElement>(null);
  const ctnDropdownRef = useRef<HTMLDivElement>(null);
  const nbsDropdownRef = useRef<HTMLDivElement>(null);
  const lastFetchedCNPJ = useRef('');

  // Auto-fetch desativado — CNAEs serão informados manualmente

  // Click outside handlers
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (cnaeDropdownRef.current && !cnaeDropdownRef.current.contains(e.target as Node)) setShowCnaeDropdown(false);
      if (ctnDropdownRef.current && !ctnDropdownRef.current.contains(e.target as Node)) setShowCtnDropdown(false);
      if (nbsDropdownRef.current && !nbsDropdownRef.current.contains(e.target as Node)) setShowNbsDropdown(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Search results for manual dropdowns
  const cnaeManualResults = useMemo(() => {
    const q = manualCnae.trim();
    if (!q) return [];
    const normalized = q.toLowerCase();
    const digits = q.replace(/\D/g, '');
    const matches: typeof CNAE_LIST = [];
    for (const entry of CNAE_LIST) {
      if (matches.length >= 30) break;
      if (digits && entry.codigo.startsWith(digits)) matches.push(entry);
      else if (entry.descricao.toLowerCase().includes(normalized)) matches.push(entry);
    }
    return matches;
  }, [manualCnae]);

  const ctnResults = useMemo(() => {
    if (detectedItem) return searchCTNByItem(detectedItem, ctnQuery.trim(), 30);
    return searchCTN(ctnQuery.trim(), 30);
  }, [ctnQuery, detectedItem]);

  const nbsResults = useMemo(() => {
    if (detectedNbsPrefix) return searchNBSByPrefix(detectedNbsPrefix, nbsQuery.trim(), 30);
    return searchNBS(nbsQuery.trim(), 30);
  }, [nbsQuery, detectedNbsPrefix]);

  const combinedActivities = [...allActivities, ...manualActivities];
  const visibleActivities = combinedActivities.filter((a) => !removedCodes.has(String(a.codigo)));

  const handleRemove = (e: React.MouseEvent, codigo: string) => {
    e.stopPropagation();
    setRemovedCodes((prev) => { const next = new Set(prev); next.add(codigo); return next; });
    if (cnaeEscolhido === codigo) {
      const next = combinedActivities.find((a) => String(a.codigo) !== codigo && !removedCodes.has(String(a.codigo)));
      if (next) onCnaeEscolhidoChange(String(next.codigo), next.descricao);
    }
  };

  const handleSelect = (atividade: CNAEAtividade) => {
    onCnaeEscolhidoChange(String(atividade.codigo), atividade.descricao);
  };

  const handleManualCnaeChange = (value: string) => {
    setManualCnae(value);
    setShowCnaeDropdown(value.trim().length > 0);
    const digits = value.replace(/\D/g, '');
    const cnaeEntry = CNAE_LIST.find(e => e.codigo === digits);
    setManualCnaeDescricaoIBGE(cnaeEntry?.descricao || '');
    if (digits.length >= 7) {
      const lc = getLC116Item(digits);
      if (lc) {
        const itemParts = lc.item.split('.');
        setDetectedItem(itemParts[0].padStart(2, '0'));
        if (lc.ctn) { setManualCtn(lc.ctn); setCtnQuery(''); }
        if (lc.nbs) { setManualNbs(lc.nbs); setNbsQuery(''); setDetectedNbsPrefix(lc.nbs.substring(0, 4)); }
        else { setDetectedNbsPrefix(null); }
        setManualDescricao(lc.descricao);
      } else { setDetectedItem(null); setDetectedNbsPrefix(null); }
    } else { setDetectedItem(null); setDetectedNbsPrefix(null); }
  };

  const formatCTNDisplay = (codigo: string) => {
    if (codigo.length === 6) return `${codigo.slice(0, 2)}.${codigo.slice(2, 4)}.${codigo.slice(4, 6)}`;
    return codigo;
  };

  const handleAddManual = () => {
    const cleaned = manualCnae.replace(/\D/g, '');
    if (cleaned.length < 7) return;
    if (combinedActivities.some((a) => String(a.codigo).replace(/\D/g, '') === cleaned)) return;
    const nova: CNAEAtividade = {
      codigo: cleaned,
      descricao: manualCnaeDescricaoIBGE || manualDescricao.trim() || 'Inclusão manual',
      isPrincipal: false,
      isManual: true,
    };
    setManualActivities((prev) => [...prev, nova]);
    setManualCnae(''); setManualCtn(''); setManualNbs(''); setManualDescricao(''); setManualCnaeDescricaoIBGE('');
    setCtnQuery(''); setNbsQuery('');
    setShowManualForm(false);
    if (!cnaeEscolhido) onCnaeEscolhidoChange(cleaned, nova.descricao);
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
                <div key={codigo} className={`group flex items-start gap-3 p-3 rounded-lg border transition-all ${isSelected ? 'border-primary bg-primary/5' : 'border-border bg-background hover:border-primary/30 hover:bg-muted/30'}`}>
                  <button type="button" onClick={() => handleSelect(atividade)} className="flex items-start gap-3 flex-1 min-w-0 text-left">
                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 transition-colors ${isSelected ? 'border-primary' : 'border-muted-foreground/40'}`}>
                      {isSelected && <div className="w-2 h-2 rounded-full bg-primary" />}
                    </div>
                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        {atividade.isPrincipal && (
                          <span className="flex items-center gap-1 text-xs text-warning bg-warning/10 px-1.5 py-0.5 rounded font-medium">
                            <Star className="w-3 h-3" /> Principal
                          </span>
                        )}
                        {atividade.isManual && (
                          <span className="text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded font-medium">Manual</span>
                        )}
                        {isSelected && (
                          <span className="flex items-center gap-1 text-xs text-primary bg-primary/10 px-1.5 py-0.5 rounded font-medium">
                            <CheckCircle2 className="w-3 h-3" /> Configuração tributária
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
                  <button type="button" onClick={(e) => handleRemove(e, codigo)} title="Remover atividade" className="shrink-0 p-1.5 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors opacity-0 group-hover:opacity-100 mt-0.5">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              );
            })}

            {visibleActivities.length === 0 && (
              <div className="text-center py-4 text-sm text-muted-foreground">Todas as atividades foram removidas.</div>
            )}
          </div>

          {removedCodes.size > 0 && (
            <button type="button" onClick={() => setRemovedCodes(new Set())} className="text-xs text-muted-foreground hover:text-foreground underline transition-colors">
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
                    if (!lc) return <p className="text-xs text-muted-foreground/60 italic">Sem correspondência mapeada na LC 116/2003</p>;
                    return renderLC116Info(selectedActivity.codigo);
                  })()}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Formulário de inclusão manual — layout 3 colunas igual Parâmetro Municipal */}
      {showManualForm ? (
        <div className="mt-4 space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-foreground">Adicionar CNAE manualmente</p>
            <button type="button" onClick={() => { setShowManualForm(false); setManualCnae(''); setManualCtn(''); setManualNbs(''); setManualDescricao(''); setManualCnaeDescricaoIBGE(''); }} className="p-1 rounded text-muted-foreground hover:text-foreground transition-colors">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-stretch">
            {/* CNAE Card */}
            <div ref={cnaeDropdownRef} className={`radio-card flex flex-col items-start ${manualCnae ? 'radio-card-selected' : ''}`}>
              <div className="text-sm font-bold leading-tight min-h-[2rem] flex items-center" style={{ color: 'hsl(144, 72%, 28%)' }}>1. Código Cnae<span className="text-red-500">*</span></div>
              <div className="w-full space-y-1">
                <div className="relative">
                  <Input placeholder="Ex: 6201-5/00 ou 6201500" value={manualCnae} onChange={e => handleManualCnaeChange(e.target.value)} onFocus={() => { if (manualCnae.trim()) setShowCnaeDropdown(true); }} className="h-8 text-sm pr-8" />
                  <button type="button" onClick={() => setShowCnaeDropdown(v => !v)} className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                    <ChevronDown className="w-3.5 h-3.5" />
                  </button>
                  {showCnaeDropdown && cnaeManualResults.length > 0 && (
                    <div className="absolute z-30 top-full mt-1 w-full max-h-48 overflow-y-auto rounded-lg border border-border bg-card shadow-lg">
                      {cnaeManualResults.map(entry => (
                        <button key={entry.codigo} type="button" onClick={() => { handleManualCnaeChange(entry.codigo); setShowCnaeDropdown(false); }} className="w-full text-left px-3 py-2 border-b border-border/50 last:border-b-0 hover:bg-muted/50 transition-colors">
                          <span className="font-mono text-xs font-semibold text-primary">{formatCNAECodeFromList(entry.codigo)}</span>
                          <p className="text-xs text-foreground/70 line-clamp-1">{entry.descricao}</p>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                {manualCnaeDescricaoIBGE && <p className="text-xs text-foreground/70 leading-snug">{manualCnaeDescricaoIBGE}</p>}
              </div>
            </div>

            {/* CTN Card */}
            <div ref={ctnDropdownRef} className={`radio-card flex flex-col items-start ${manualCtn ? 'radio-card-selected' : ''}`}>
              <div className="text-sm font-bold leading-tight min-h-[2rem] flex items-center" style={{ color: 'hsl(144, 72%, 28%)' }}>2. Código Tributação Nacional<span className="text-red-500">*</span></div>
              <div className="w-full space-y-1">
                <div className="relative">
                  <Input placeholder="Buscar CTN..." value={showCtnDropdown ? ctnQuery : (manualCtn ? formatCTNDisplay(manualCtn) : '')} onChange={e => { setCtnQuery(e.target.value); setShowCtnDropdown(true); }} onFocus={() => { setCtnQuery(''); setShowCtnDropdown(true); }} className="h-8 text-sm pr-8" />
                  <button type="button" onClick={() => { if (!showCtnDropdown) setCtnQuery(''); setShowCtnDropdown(v => !v); }} className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                    <ChevronDown className="w-3.5 h-3.5" />
                  </button>
                  {showCtnDropdown && ctnResults.length > 0 && (
                    <div className="absolute z-30 top-full mt-1 w-full max-h-48 overflow-y-auto rounded-lg border border-border bg-card shadow-lg">
                      {ctnResults.map(entry => {
                        const isSelected = manualCtn === entry.codigo;
                        return (
                          <button key={entry.codigo} type="button" onClick={() => { setManualCtn(entry.codigo); setCtnQuery(''); setShowCtnDropdown(false); if (entry.nbs && !manualNbs) setManualNbs(entry.nbs); }} className={`w-full text-left px-3 py-2 border-b border-border/50 last:border-b-0 hover:bg-muted/50 transition-colors ${isSelected ? 'bg-primary/10' : ''}`}>
                            <span className="font-mono text-xs font-semibold text-primary">{formatCTNDisplay(entry.codigo)}</span>
                            <span className="text-xs text-muted-foreground ml-2">({entry.itemFormatado})</span>
                            {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-primary inline ml-2" />}
                            <p className="text-xs text-foreground/70 line-clamp-1">{entry.descricao}</p>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
                {manualCtn && <p className="text-xs text-foreground/70 leading-snug line-clamp-2">{getCTNByCode(manualCtn)?.descricao || ''}</p>}
              </div>
            </div>

            {/* NBS Card */}
            <div ref={nbsDropdownRef} className={`radio-card flex flex-col items-start ${manualNbs ? 'radio-card-selected' : ''}`}>
              <div className="text-sm font-bold leading-tight min-h-[2rem] flex items-center" style={{ color: 'hsl(144, 72%, 28%)' }}>3. Nomenclatura Brasileira Serviços</div>
              <div className="w-full space-y-1">
                <div className="relative">
                  <Input placeholder="Buscar NBS..." value={showNbsDropdown ? nbsQuery : manualNbs} onChange={e => { setNbsQuery(e.target.value); setShowNbsDropdown(true); }} onFocus={() => { setNbsQuery(''); setShowNbsDropdown(true); }} className="h-8 text-sm pr-8" />
                  <button type="button" onClick={() => { if (!showNbsDropdown) setNbsQuery(''); setShowNbsDropdown(v => !v); }} className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                    <ChevronDown className="w-3.5 h-3.5" />
                  </button>
                  {showNbsDropdown && nbsResults.length > 0 && (
                    <div className="absolute z-30 top-full mt-1 w-full max-h-48 overflow-y-auto rounded-lg border border-border bg-card shadow-lg">
                      {nbsResults.map(entry => {
                        const isSelected = manualNbs === entry.codigo;
                        return (
                          <button key={entry.codigo} type="button" onClick={() => { setManualNbs(entry.codigo); setNbsQuery(''); setShowNbsDropdown(false); }} className={`w-full text-left px-3 py-2 border-b border-border/50 last:border-b-0 hover:bg-muted/50 transition-colors ${isSelected ? 'bg-primary/10' : ''}`}>
                            <span className="font-mono text-xs font-semibold text-primary">{entry.codigo}</span>
                            {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-primary inline ml-2" />}
                            <p className="text-xs text-foreground/70 line-clamp-1">{entry.descricao}</p>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
                {manualNbs && <p className="text-xs text-foreground/70 leading-snug line-clamp-2">{getNBSDescricao(manualNbs) || ''}</p>}
              </div>
            </div>
          </div>

          {manualCnae.replace(/\D/g, '') && (
            <div className="flex justify-end">
              <Button type="button" size="sm" onClick={handleAddManual} disabled={!manualCnae.replace(/\D/g, '')} className="text-xs gap-1.5">
                <Plus className="w-3.5 h-3.5" /> Adicionar
              </Button>
            </div>
          )}
        </div>
      ) : (
        <button type="button" onClick={() => setShowManualForm(true)} className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
          <Plus className="w-3.5 h-3.5" /> Adicionar CNAE manualmente
        </button>
      )}
    </div>
  );
};

export default CNAESection;
