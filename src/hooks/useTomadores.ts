import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface TomadorDB {
  id: string;
  prestador_id: string | null;
  cnpj_cpf: string;
  nome_razao_social: string;
  nome_fantasia: string;
  inscricao_municipal: string;
  inscricao_estadual: string;
  suframa: string;
  substituto_tributario: boolean;
  cep: string;
  logradouro: string;
  numero: string;
  complemento: string;
  bairro: string;
  localidade_uf: string;
  email: string;
  whatsapp: string;
  pais: string;
}

export function useTomadores(prestadorId?: string) {
  const [tomadores, setTomadores] = useState<TomadorDB[]>([]);
  const [loading, setLoading] = useState(false);

  const carregarTomadores = useCallback(async () => {
    setLoading(true);
    try {
      let query = supabase.from('tomadores').select('*').order('nome_razao_social');
      if (prestadorId) {
        query = query.eq('prestador_id', prestadorId);
      }
      const { data, error } = await query;
      if (error) throw error;
      setTomadores((data || []) as TomadorDB[]);
    } catch (err) {
      console.error('Erro ao carregar tomadores:', err);
    } finally {
      setLoading(false);
    }
  }, [prestadorId]);

  useEffect(() => {
    carregarTomadores();
  }, [carregarTomadores]);

  const salvarTomador = useCallback(async (tomador: Omit<TomadorDB, 'id'> & { id?: string }) => {
    try {
      const row = {
        prestador_id: tomador.prestador_id,
        cnpj_cpf: tomador.cnpj_cpf,
        nome_razao_social: tomador.nome_razao_social,
        nome_fantasia: tomador.nome_fantasia || '',
        inscricao_municipal: tomador.inscricao_municipal || '',
        inscricao_estadual: tomador.inscricao_estadual || '',
        suframa: tomador.suframa || '',
        substituto_tributario: tomador.substituto_tributario || false,
        cep: tomador.cep || '',
        logradouro: tomador.logradouro || '',
        numero: tomador.numero || '',
        complemento: tomador.complemento || '',
        bairro: tomador.bairro || '',
        localidade_uf: tomador.localidade_uf || '',
        email: tomador.email || '',
        whatsapp: tomador.whatsapp || '',
        pais: tomador.pais || 'Brasil',
      };

      let result;
      if (tomador.id) {
        result = await supabase
          .from('tomadores')
          .update(row)
          .eq('id', tomador.id)
          .select()
          .single();
      } else {
        result = await supabase
          .from('tomadores')
          .insert(row)
          .select()
          .single();
      }

      if (result.error) throw result.error;
      toast.success('Tomador salvo com sucesso!');
      await carregarTomadores();
      return result.data.id;
    } catch (err: any) {
      toast.error('Erro ao salvar tomador: ' + (err.message || ''));
      return null;
    }
  }, [carregarTomadores]);

  const excluirTomador = useCallback(async (id: string) => {
    try {
      const { error } = await supabase.from('tomadores').delete().eq('id', id);
      if (error) throw error;
      toast.success('Tomador excluído!');
      await carregarTomadores();
    } catch (err: any) {
      toast.error('Erro ao excluir tomador: ' + (err.message || ''));
    }
  }, [carregarTomadores]);

  return { tomadores, loading, salvarTomador, excluirTomador, carregarTomadores };
}
