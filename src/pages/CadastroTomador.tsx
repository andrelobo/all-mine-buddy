import React, { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { Shield, Save, CheckCircle, Printer, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import TomadorSection, { type TomadorData, validateCPF } from '@/components/TomadorSection';
import { validateCNPJ, validateEmail } from '@/utils/validators';

const INITIAL_TOMADOR: TomadorData = {
  nomeEmpresarial: '',
  nomeFantasia: '',
  cnpjCpf: '',
  inscricaoMunicipal: '',
  inscricaoEstadual: '',
  suframa: '',
  cep: '',
  logradouro: '',
  numero: '',
  complemento: '',
  bairro: '',
  localidadeUf: '',
  email: '',
  whatsapp: '',
};

const CadastroTomador = () => {
  const navigate = useNavigate();
  const [tomador, setTomador] = useState<TomadorData>(INITIAL_TOMADOR);
  const [configValida, setConfigValida] = useState(false);

  const checkValidity = useCallback(() => {
    const cleaned = tomador.cnpjCpf.replace(/\D/g, '');
    const docOk = cleaned.length === 11 ? validateCPF(cleaned) : validateCNPJ(cleaned);
    const emailOk = tomador.email === '' || validateEmail(tomador.email);
    setConfigValida(docOk && emailOk);
  }, [tomador.cnpjCpf, tomador.email]);

  const autosave = useCallback(() => {
    checkValidity();
  }, [checkValidity]);

  const handleSalvar = () => {
    const cleaned = tomador.cnpjCpf.replace(/\D/g, '');
    const docOk = cleaned.length === 11 ? validateCPF(cleaned) : validateCNPJ(cleaned);
    if (!docOk) {
      toast.error('CNPJ/CPF inválido. Verifique o número informado.');
      return;
    }
    if (tomador.email && !validateEmail(tomador.email)) {
      toast.error('E-mail inválido. Verifique o endereço informado.');
      return;
    }
    toast.success('Tomador salvo com sucesso!');
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card border-b border-border sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/')}
              className="btn-secondary p-2"
              title="Voltar"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center">
              <Shield className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-foreground tracking-tight">
                Cadastro de Tomador
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {configValida && (
              <div className="alert-success flex items-center gap-2 text-xs">
                <CheckCircle className="w-4 h-4" />
                Dados do tomador válidos
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-5">
        <TomadorSection
          data={tomador}
          onChange={setTomador}
          onAutosave={autosave}
        />

        <div className="section-card">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            {configValida && (
              <div className="alert-success flex items-center gap-2 text-sm">
                <CheckCircle className="w-4 h-4" />
                Dados do tomador válidos
              </div>
            )}
            <div className="flex items-center gap-3 ml-auto no-print">
              <button onClick={() => window.print()} className="btn-secondary flex items-center gap-2">
                <Printer className="w-4 h-4" />
                Imprimir
              </button>
              <button onClick={handleSalvar} className="btn-primary flex items-center gap-2">
                <Save className="w-4 h-4" />
                Salvar Tomador
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CadastroTomador;
