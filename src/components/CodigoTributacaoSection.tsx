import React, { useState } from 'react';
import { Hash, Search, Check } from 'lucide-react';

const CODIGOS = [
  { code: '01.01', desc: 'Análise e desenvolvimento de sistemas' },
  { code: '01.02', desc: 'Programação' },
  { code: '01.03', desc: 'Processamento de dados e congêneres' },
  { code: '01.04', desc: 'Elaboração de programas de computadores' },
  { code: '01.05', desc: 'Licenciamento ou cessão de direito de uso de programas' },
  { code: '01.06', desc: 'Assessoria e consultoria em informática' },
  { code: '01.07', desc: 'Suporte técnico em informática' },
  { code: '01.08', desc: 'Planejamento, confecção, manutenção e atualização de páginas eletrônicas' },
  { code: '02.01', desc: 'Serviços de pesquisas e desenvolvimento' },
  { code: '07.01', desc: 'Engenharia, agronomia, agrimensura, arquitetura' },
  { code: '07.02', desc: 'Execução de obras' },
  { code: '17.01', desc: 'Assessoria ou consultoria de qualquer natureza' },
  { code: '17.02', desc: 'Análise, exame, pesquisa, coleta e fornecimento de dados' },
  { code: '25.01', desc: 'Funerais, inclusive fornecimento de caixão' },
];

interface Props {
  selected: string | null;
  onSelect: (code: string | null) => void;
  onAutosave: () => void;
}

const CodigoTributacaoSection: React.FC<Props> = ({ selected, onSelect, onAutosave }) => {
  const [search, setSearch] = useState('');

  const filtered = CODIGOS.filter(
    (c) =>
      c.code.includes(search) ||
      c.desc.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelect = (code: string) => {
    onSelect(selected === code ? null : code);
    onAutosave();
  };

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
          placeholder="Buscar por código ou descrição..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="max-h-64 overflow-y-auto border border-border rounded-lg divide-y divide-border">
        {filtered.length === 0 ? (
          <div className="p-4 text-sm text-muted-foreground text-center">
            Nenhum código encontrado.
          </div>
        ) : (
          filtered.map((c) => (
            <button
              key={c.code}
              type="button"
              onClick={() => handleSelect(c.code)}
              className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors duration-100 hover:bg-muted/50 ${
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
              <span className="text-sm font-mono text-primary font-medium w-12">{c.code}</span>
              <span className="text-sm text-foreground">{c.desc}</span>
            </button>
          ))
        )}
      </div>
    </div>
  );
};

export default CodigoTributacaoSection;
