import React, { useState } from 'react';
import { Hash, Search, Check } from 'lucide-react';
import { CODIGOS_TRIBUTACAO } from '@/data/codigosTributacao';

interface Props {
  selected: string | null;
  onSelect: (code: string | null) => void;
  onAutosave: () => void;
}

const CodigoTributacaoSection: React.FC<Props> = ({ selected, onSelect, onAutosave }) => {
  const [search, setSearch] = useState('');

  const filtered = CODIGOS_TRIBUTACAO.filter(
    (c) =>
      c.code.includes(search) ||
      c.desc.toLowerCase().includes(search.toLowerCase()) ||
      c.group.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelect = (code: string) => {
    onSelect(selected === code ? null : code);
    onAutosave();
  };

  // Group items
  const groups = filtered.reduce<Record<string, typeof filtered>>((acc, item) => {
    if (!acc[item.group]) acc[item.group] = [];
    acc[item.group].push(item);
    return acc;
  }, {});

  return (
    <div className="section-card">
      <h2 className="section-title">
        <Hash className="w-5 h-5 text-primary" />
        Código de Tributação Nacional (CTN)
      </h2>

      <div className="relative mb-4 max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          className="field-input pl-9"
          placeholder="Buscar por código, descrição ou grupo..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="max-h-80 overflow-y-auto border border-border rounded-lg">
        {Object.keys(groups).length === 0 ? (
          <div className="p-4 text-sm text-muted-foreground text-center">
            Nenhum código encontrado.
          </div>
        ) : (
          Object.entries(groups).map(([group, items]) => (
            <div key={group}>
              <div className="sticky top-0 px-4 py-2 bg-muted text-xs font-semibold text-muted-foreground uppercase tracking-wide border-b border-border">
                {group}
              </div>
              {items.map((c) => (
                <button
                  key={c.code}
                  type="button"
                  onClick={() => handleSelect(c.code)}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors duration-100 hover:bg-muted/50 border-b border-border last:border-b-0 ${
                    selected === c.code ? 'bg-primary/5' : ''
                  }`}
                >
                  <div className={`w-5 h-5 rounded border flex items-center justify-center shrink-0 ${
                    selected === c.code
                      ? 'bg-primary border-primary'
                      : 'border-muted-foreground/30'
                  }`}>
                    {selected === c.code && <Check className="w-3 h-3 text-primary-foreground" />}
                  </div>
                  <span className="text-sm font-mono text-primary font-medium w-12 shrink-0">{c.code}</span>
                  <span className="text-sm text-foreground">{c.desc}</span>
                </button>
              ))}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CodigoTributacaoSection;
