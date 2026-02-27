
CREATE TABLE public.split_payment (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nota_fiscal_id UUID REFERENCES public.notas_fiscais(id) ON DELETE CASCADE,
  prestador_id UUID REFERENCES public.prestadores(id) ON DELETE CASCADE,
  valor_bruto NUMERIC NOT NULL DEFAULT 0,
  valor_reservado NUMERIC NOT NULL DEFAULT 0,
  valor_liberado NUMERIC NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'reservado',
  mes_referencia TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.split_payment ENABLE ROW LEVEL SECURITY;

CREATE POLICY "split_payment_select" ON public.split_payment FOR SELECT USING (true);
CREATE POLICY "split_payment_insert" ON public.split_payment FOR INSERT WITH CHECK (true);
CREATE POLICY "split_payment_update" ON public.split_payment FOR UPDATE USING (true);
CREATE POLICY "split_payment_delete" ON public.split_payment FOR DELETE USING (true);

CREATE TRIGGER update_split_payment_updated_at
  BEFORE UPDATE ON public.split_payment
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
