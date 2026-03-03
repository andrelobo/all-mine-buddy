-- Triggers com IF NOT EXISTS pattern (drop + create)
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_tomadores_updated_at') THEN
    CREATE TRIGGER update_tomadores_updated_at
      BEFORE UPDATE ON public.tomadores
      FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_notas_fiscais_updated_at') THEN
    CREATE TRIGGER update_notas_fiscais_updated_at
      BEFORE UPDATE ON public.notas_fiscais
      FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_split_payment_updated_at') THEN
    CREATE TRIGGER update_split_payment_updated_at
      BEFORE UPDATE ON public.split_payment
      FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
  END IF;
END $$;

-- Habilitar realtime (ignorar se já existir)
DO $$ BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE public.notas_fiscais;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE public.split_payment;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;