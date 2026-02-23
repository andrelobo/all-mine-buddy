import React, { useState, useMemo } from 'react';
import { Search, List } from 'lucide-react';
import { CTN_DATA, type CTNEntry } from '@/utils/ctn-data';

const ListaServicosSection: React.FC = () => {
  const [busca, setBusca] = useState('');

  const resultados = useMemo(() => {
    if (!busca.trim()) return CTN_DATA.slice(0, 50);
    const termo = busca.toLowerCase();
    return CTN_DATA.filter(
      (e) =>
        e.codigo.includes(termo) ||
        e.itemFormatado.includes(termo) ||
        e.descricao.toLowerCase().includes(termo) ||
        (e.nbs && e.nbs.includes(termo))
    );
  }, [busca]);

  return (
    <div className="section-card">
      <h2 className="section-title">
        <List className="w-5 h-5 text-primary" />
        Lista de Serviços — Código Tributação Nacional
      </h2>

      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          className="field-input pl-10"
          placeholder="Buscar por código, item ou descrição..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
        />
      </div>

      <div className="text-xs text-muted-foreground mb-2">
        {resultados.length} serviço{resultados.length !== 1 ? 's' : ''} encontrado{resultados.length !== 1 ? 's' : ''}
      </div>

      <div className="overflow-x-auto border border-border rounded-lg">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-muted/50 border-b border-border">
              <th className="text-left px-3 py-2 font-medium text-muted-foreground w-24">Código</th>
              <th className="text-left px-3 py-2 font-medium text-muted-foreground w-20">Item</th>
              <th className="text-left px-3 py-2 font-medium text-muted-foreground">Descrição</th>
              <th className="text-left px-3 py-2 font-medium text-muted-foreground w-32">NBS</th>
            </tr>
          </thead>
          <tbody>
            {resultados.map((entry) => (
              <tr key={entry.codigo} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                <td className="px-3 py-2 font-mono text-xs">{entry.codigo}</td>
                <td className="px-3 py-2 text-xs">{entry.itemFormatado}</td>
                <td className="px-3 py-2 text-xs">{entry.descricao}</td>
                <td className="px-3 py-2 font-mono text-xs text-muted-foreground">{entry.nbs || '—'}</td>
              </tr>
            ))}
            {resultados.length === 0 && (
              <tr>
                <td colSpan={4} className="px-3 py-8 text-center text-muted-foreground text-sm">
                  Nenhum serviço encontrado para "{busca}"
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ListaServicosSection;
