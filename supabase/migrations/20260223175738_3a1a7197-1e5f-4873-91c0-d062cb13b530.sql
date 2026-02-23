
-- Tabela Prestadores
CREATE TABLE public.prestadores (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  cnpj TEXT NOT NULL,
  nome_empresarial TEXT NOT NULL DEFAULT '',
  nome_fantasia TEXT DEFAULT '',
  inscricao_municipal TEXT DEFAULT '',
  inscricao_estadual TEXT DEFAULT '',
  suframa TEXT DEFAULT '',
  cep TEXT DEFAULT '',
  logradouro TEXT DEFAULT '',
  numero TEXT DEFAULT '',
  complemento TEXT DEFAULT '',
  bairro TEXT DEFAULT '',
  localidade_uf TEXT DEFAULT '',
  email TEXT DEFAULT '',
  whatsapp TEXT DEFAULT '',
  regime_tributario TEXT DEFAULT NULL,
  optante_simples BOOLEAN DEFAULT FALSE,
  aliquota_simples TEXT DEFAULT '',
  ctn_codigo TEXT DEFAULT '',
  ctn_descricao TEXT DEFAULT '',
  ctn_item TEXT DEFAULT '',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(cnpj)
);

ALTER TABLE public.prestadores ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Prestadores são acessíveis publicamente" 
ON public.prestadores FOR SELECT USING (true);

CREATE POLICY "Prestadores podem ser inseridos" 
ON public.prestadores FOR INSERT WITH CHECK (true);

CREATE POLICY "Prestadores podem ser atualizados" 
ON public.prestadores FOR UPDATE USING (true);

CREATE POLICY "Prestadores podem ser deletados" 
ON public.prestadores FOR DELETE USING (true);

-- Tabela Tomadores
CREATE TABLE public.tomadores (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  prestador_id UUID REFERENCES public.prestadores(id) ON DELETE CASCADE,
  cnpj_cpf TEXT NOT NULL DEFAULT '',
  nome_razao_social TEXT NOT NULL DEFAULT '',
  nome_fantasia TEXT DEFAULT '',
  inscricao_municipal TEXT DEFAULT '',
  inscricao_estadual TEXT DEFAULT '',
  suframa TEXT DEFAULT '',
  substituto_tributario BOOLEAN DEFAULT FALSE,
  cep TEXT DEFAULT '',
  logradouro TEXT DEFAULT '',
  numero TEXT DEFAULT '',
  complemento TEXT DEFAULT '',
  bairro TEXT DEFAULT '',
  localidade_uf TEXT DEFAULT '',
  email TEXT DEFAULT '',
  whatsapp TEXT DEFAULT '',
  pais TEXT DEFAULT 'Brasil',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.tomadores ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Tomadores são acessíveis publicamente" 
ON public.tomadores FOR SELECT USING (true);

CREATE POLICY "Tomadores podem ser inseridos" 
ON public.tomadores FOR INSERT WITH CHECK (true);

CREATE POLICY "Tomadores podem ser atualizados" 
ON public.tomadores FOR UPDATE USING (true);

CREATE POLICY "Tomadores podem ser deletados" 
ON public.tomadores FOR DELETE USING (true);

-- Tabela Notas Fiscais (NFS-e)
CREATE TABLE public.notas_fiscais (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  prestador_id UUID REFERENCES public.prestadores(id) ON DELETE SET NULL,
  tomador_id UUID REFERENCES public.tomadores(id) ON DELETE SET NULL,
  numero_nfse TEXT DEFAULT '',
  status TEXT NOT NULL DEFAULT 'rascunho',
  codigo_servico TEXT DEFAULT '',
  descricao_servico TEXT DEFAULT '',
  local_prestacao_pais TEXT DEFAULT 'Brasil',
  local_prestacao_uf TEXT DEFAULT '',
  local_prestacao_municipio TEXT DEFAULT '',
  valor_servico NUMERIC(15,2) DEFAULT 0,
  aliquota NUMERIC(5,2) DEFAULT 0,
  base_calculo NUMERIC(15,2) DEFAULT 0,
  desconto NUMERIC(15,2) DEFAULT 0,
  iss_retido BOOLEAN DEFAULT FALSE,
  iss_valor NUMERIC(15,2) DEFAULT 0,
  ret_pis NUMERIC(15,2) DEFAULT 0,
  ret_cofins NUMERIC(15,2) DEFAULT 0,
  ret_csll NUMERIC(15,2) DEFAULT 0,
  ret_ir NUMERIC(15,2) DEFAULT 0,
  ret_inss NUMERIC(15,2) DEFAULT 0,
  valor_liquido NUMERIC(15,2) DEFAULT 0,
  data_emissao TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.notas_fiscais ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Notas fiscais são acessíveis publicamente" 
ON public.notas_fiscais FOR SELECT USING (true);

CREATE POLICY "Notas fiscais podem ser inseridas" 
ON public.notas_fiscais FOR INSERT WITH CHECK (true);

CREATE POLICY "Notas fiscais podem ser atualizadas" 
ON public.notas_fiscais FOR UPDATE USING (true);

CREATE POLICY "Notas fiscais podem ser deletadas" 
ON public.notas_fiscais FOR DELETE USING (true);

-- Trigger para updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_prestadores_updated_at
BEFORE UPDATE ON public.prestadores
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_tomadores_updated_at
BEFORE UPDATE ON public.tomadores
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_notas_fiscais_updated_at
BEFORE UPDATE ON public.notas_fiscais
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
