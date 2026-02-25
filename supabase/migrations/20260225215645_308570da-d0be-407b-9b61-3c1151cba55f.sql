
-- Tabela de faixas do Simples Nacional Anexo III
CREATE TABLE public.simples_anexo_iii (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  faixa integer NOT NULL,
  limite_inferior numeric NOT NULL DEFAULT 0,
  limite_superior numeric NOT NULL,
  aliquota_nominal numeric NOT NULL,
  parcela_deduzir numeric NOT NULL DEFAULT 0,
  percentual_iss numeric NOT NULL DEFAULT 0.335,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Inserir as 6 faixas
INSERT INTO public.simples_anexo_iii (faixa, limite_inferior, limite_superior, aliquota_nominal, parcela_deduzir) VALUES
  (1, 0, 180000, 0.06, 0),
  (2, 180000.01, 360000, 0.112, 9360),
  (3, 360000.01, 720000, 0.135, 17640),
  (4, 720000.01, 1800000, 0.16, 35640),
  (5, 1800000.01, 3600000, 0.21, 125640),
  (6, 3600000.01, 4800000, 0.33, 648000);

-- Tabela catálogo CNAE
CREATE TABLE public.cnae_catalogo (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  codigo_cnae text NOT NULL UNIQUE,
  descricao text NOT NULL DEFAULT '',
  anexo text NOT NULL DEFAULT 'III',
  permite_fator_r boolean NOT NULL DEFAULT false,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Exemplos iniciais de CNAEs do Anexo III (serviços)
INSERT INTO public.cnae_catalogo (codigo_cnae, descricao, anexo, permite_fator_r) VALUES
  ('6201501', 'Desenvolvimento de programas de computador sob encomenda', 'III', true),
  ('6202300', 'Desenvolvimento e licenciamento de programas de computador customizáveis', 'III', true),
  ('6203100', 'Desenvolvimento e licenciamento de programas de computador não customizáveis', 'III', true),
  ('6204000', 'Consultoria em tecnologia da informação', 'III', true),
  ('6209100', 'Suporte técnico, manutenção e outros serviços em tecnologia da informação', 'III', true),
  ('6311900', 'Tratamento de dados, provedores de serviços de aplicação e serviços de hospedagem na internet', 'III', false),
  ('7020400', 'Atividades de consultoria em gestão empresarial', 'III', true),
  ('7111100', 'Serviços de arquitetura', 'III', true),
  ('7112000', 'Serviços de engenharia', 'III', true),
  ('7120100', 'Testes e análises técnicas', 'III', false),
  ('6920601', 'Atividades de contabilidade', 'III', true),
  ('7490104', 'Atividades de intermediação e agenciamento de serviços e negócios em geral', 'V', true),
  ('8511200', 'Educação infantil - creche', 'III', false),
  ('8599604', 'Treinamento em desenvolvimento profissional e gerencial', 'III', true);

-- Adicionar colunas ao prestador para persistir cálculos
ALTER TABLE public.prestadores
  ADD COLUMN IF NOT EXISTS cnae_principal text DEFAULT '',
  ADD COLUMN IF NOT EXISTS rbt12 numeric DEFAULT 0,
  ADD COLUMN IF NOT EXISTS simples_anexo text DEFAULT '',
  ADD COLUMN IF NOT EXISTS simples_faixa integer DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS simples_aliquota_nominal numeric DEFAULT 0,
  ADD COLUMN IF NOT EXISTS simples_parcela_deduzir numeric DEFAULT 0,
  ADD COLUMN IF NOT EXISTS simples_aliquota_efetiva numeric DEFAULT 0,
  ADD COLUMN IF NOT EXISTS simples_data_calculo timestamp with time zone DEFAULT NULL;

-- RLS para as novas tabelas (acesso público nesta fase sem auth)
ALTER TABLE public.simples_anexo_iii ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cnae_catalogo ENABLE ROW LEVEL SECURITY;

CREATE POLICY "simples_anexo_iii_select" ON public.simples_anexo_iii FOR SELECT USING (true);
CREATE POLICY "cnae_catalogo_select" ON public.cnae_catalogo FOR SELECT USING (true);
CREATE POLICY "cnae_catalogo_insert" ON public.cnae_catalogo FOR INSERT WITH CHECK (true);
CREATE POLICY "cnae_catalogo_update" ON public.cnae_catalogo FOR UPDATE USING (true);
CREATE POLICY "cnae_catalogo_delete" ON public.cnae_catalogo FOR DELETE USING (true);
