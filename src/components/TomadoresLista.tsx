import React from 'react';
import { Users, Pencil, Trash2, Loader2 } from 'lucide-react';
import type { TomadorDB } from '@/hooks/useTomadores';

interface Props {
  tomadores: TomadorDB[];
  loading: boolean;
  onEditar: (tomador: TomadorDB) => void;
  onExcluir: (id: string) => void;
}

const TomadoresLista: React.FC<Props> = ({ tomadores, loading, onEditar, onExcluir }) => {
  if (loading) {
    return (
      <div className="section-card flex items-center justify-center py-8">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="section-card">
      <h2 className="section-title">
        <Users className="w-5 h-5 text-primary" />
        Tomadores Cadastrados ({tomadores.length})
      </h2>

      {tomadores.length === 0 ? (
        <p className="text-sm text-muted-foreground py-4 text-center">
          Nenhum tomador cadastrado ainda. Preencha o formulário acima e clique em "Salvar Tomador".
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-2 px-3 font-medium text-muted-foreground">CNPJ/CPF</th>
                <th className="text-left py-2 px-3 font-medium text-muted-foreground">Nome / Razão Social</th>
                <th className="text-left py-2 px-3 font-medium text-muted-foreground hidden md:table-cell">Localidade</th>
                <th className="text-left py-2 px-3 font-medium text-muted-foreground hidden lg:table-cell">E-mail</th>
                <th className="text-right py-2 px-3 font-medium text-muted-foreground w-24">Ações</th>
              </tr>
            </thead>
            <tbody>
              {tomadores.map((t) => (
                <tr key={t.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                  <td className="py-2.5 px-3 text-sm text-foreground">{t.cnpj_cpf}</td>
                  <td className="py-2.5 px-3 text-sm text-foreground">{t.nome_razao_social}</td>
                  <td className="py-2.5 px-3 text-sm text-muted-foreground hidden md:table-cell">{t.localidade_uf || '—'}</td>
                  <td className="py-2.5 px-3 text-sm text-muted-foreground hidden lg:table-cell">{t.email || '—'}</td>
                  <td className="py-2.5 px-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => onEditar(t)}
                        className="p-1.5 rounded-md hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
                        title="Editar"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          if (window.confirm(`Excluir o tomador "${t.nome_razao_social}"?`)) {
                            onExcluir(t.id);
                          }
                        }}
                        className="p-1.5 rounded-md hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                        title="Excluir"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default TomadoresLista;
