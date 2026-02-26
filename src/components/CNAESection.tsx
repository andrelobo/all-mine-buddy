import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Landmark, Star, Loader2, AlertCircle, Trash2, CheckCircle2, Plus, X, ChevronDown, Search } from 'lucide-react';
import { validateCNPJ } from '@/utils/validators';
import { CNAE_LIST, formatCNAECode as formatCNAECodeFromList, getLC116Item } from '@/utils/cnae-lc116';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface CNAEAtividade {
  codigo: number | string;
  descricao: string;
  isPrincipal: boolean;
  isManual?: boolean;
}

interface Props {
  cnpj: string;
  cnaeEscolhido: string | null;
  onCnaeEscolhidoChange: (codigo: string, descricao: string) => void;
}

function formatCNAECode(codigo: number | string): string {
  const str = String(codigo).replace(/\D/g, '').padStart(7, '0');
  if (str.length >= 7) return `${str.slice(0, 4)}-${str.slice(4, 5)}/${str.slice(5, 7)}`;
  return str;
}

const CNAESection: React.FC<Props> = ({ cnpj, cnaeEscolhido, onCnaeEscolhidoChange }) => {
  const [manualActivities, setManualActivities] = useState<CNAEAtividade[]>([]);
  const [removedCodes, setRemovedCodes] = useState<Set<string>>(new Set());
  const [manualCnae, setManualCnae] = useState('');
  const [manualCnaeDescricaoIBGE, setManualCnaeDescricaoIBGE] = useState('');
  const [showCnaeDropdown, setShowCnaeDropdown] = useState(false);
  const cnaeDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (cnaeDropdownRef.current && !cnaeDropdownRef.current.contains(e.target as Node)) setShowCnaeDropdown(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

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

  const visibleActivities = manualActivities.filter((a) => !removedCodes.has(String(a.codigo)));

  const handleRemove = (e: React.MouseEvent, codigo: string) => {
    e.stopPropagation();
    setRemovedCodes((prev) => { const next = new Set(prev); next.add(codigo); return next; });
    if (cnaeEscolhido === codigo) {
      const next = manualActivities.find((a) => String(a.codigo) !== codigo && !removedCodes.has(String(a.codigo)));
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
  };

  const handleAddManual = () => {
    const cleaned = manualCnae.replace(/\D/g, '');
    if (cleaned.length < 7) return;
    if (manualActivities.some((a) => String(a.codigo).replace(/\D/g, '') === cleaned)) return;
    const nova: CNAEAtividade = {
      codigo: cleaned,
      descricao: manualCnaeDescricaoIBGE || 'Inclusão manual',
      isPrincipal: false,
      isManual: true,
    };
    setManualActivities((prev) => [...prev, nova]);
    setManualCnae('');
    setManualCnaeDescricaoIBGE('');
    if (!cnaeEscolhido) onCnaeEscolhidoChange(cleaned, nova.descricao);
  };

  const selectedActivity = manualActivities.find((a) => String(a.codigo) === cnaeEscolhido);

  return (
    <div className="section-card">
      <h2 className="section-title">
        <Landmark className="w-5 h-5 text-primary" />
        Código Cnae
      </h2>

      {/* Campo de pesquisa CNAE — acima da lista */}
      <div className="space-y-3">
        <div ref={cnaeDropdownRef} className={`radio-card flex flex-col items-start ${manualCnae ? 'radio-card-selected' : ''}`}>
          <div className="text-sm font-bold leading-tight flex items-center gap-1.5 mb-1.5 text-primary"><Search className="w-4 h-4" />Pesquise</div>
          <div className="w-full space-y-1">
            <div className="relative">
              <Input placeholder="Ex: 6201-5/00 ou 6201500" value={manualCnae} onChange={e => handleManualCnaeChange(e.target.value)} onFocus={() => { if (manualCnae.trim()) setShowCnaeDropdown(true); }} className="h-8 text-sm pr-8" />
              <button type="button" onClick={() => setShowCnaeDropdown(v => !v)} className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                <ChevronDown className="w-3.5 h-3.5" />
              </button>
              {showCnaeDropdown && cnaeManualResults.length > 0 && (
                <div className="absolute z-30 top-full mt-1 w-full max-h-48 overflow-y-auto rounded-lg border border-border bg-card shadow-lg">
                  {cnaeManualResults.map(entry => (
                    <button key={entry.codigo} type="button" onClick={() => {
                      const cleaned = entry.codigo.replace(/\D/g, '');
                      if (!manualActivities.some(a => String(a.codigo).replace(/\D/g, '') === cleaned)) {
                        const nova = { codigo: cleaned, descricao: entry.descricao, isPrincipal: false, isManual: true };
                        setManualActivities(prev => [...prev, nova]);
                        if (!cnaeEscolhido) onCnaeEscolhidoChange(cleaned, entry.descricao);
                      }
                      setManualCnae(''); setManualCnaeDescricaoIBGE(''); setShowCnaeDropdown(false);
                    }} className="w-full text-left px-3 py-2 border-b border-border/50 last:border-b-0 hover:bg-muted/50 transition-colors">
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

        {manualCnae.replace(/\D/g, '') && (
          <div className="flex justify-end">
            <Button type="button" size="sm" onClick={handleAddManual} disabled={!manualCnae.replace(/\D/g, '')} className="text-xs gap-1.5">
              <Plus className="w-3.5 h-3.5" /> Adicionar
            </Button>
          </div>
        )}
      </div>

      {/* Lista de CNAEs adicionados — abaixo da pesquisa */}
      {visibleActivities.length > 0 && (
        <div className="mt-4 space-y-3">
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
                    </div>
                  </button>
                  <button type="button" onClick={(e) => handleRemove(e, codigo)} title="Remover atividade" className="shrink-0 p-1.5 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors opacity-0 group-hover:opacity-100 mt-0.5">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              );
            })}
          </div>

          {removedCodes.size > 0 && (
            <button type="button" onClick={() => setRemovedCodes(new Set())} className="text-xs text-muted-foreground hover:text-foreground underline transition-colors">
              Restaurar {removedCodes.size} atividade{removedCodes.size > 1 ? 's' : ''} removida{removedCodes.size > 1 ? 's' : ''}
            </button>
          )}


        </div>
      )}
    </div>
  );
};

export default CNAESection;
