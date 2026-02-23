
ALTER TABLE public.prestadores
ADD COLUMN parametro_municipal jsonb DEFAULT '[]'::jsonb;
