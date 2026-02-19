import React, { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { Shield, FileText, Save, X, CheckCircle } from 'lucide-react';
import PrestadorSection from '@/components/PrestadorSection';
import RegimeEParametrosSection, { type RegimeTributario } from '@/components/RegimeEParametrosSection';
import { validateCNPJ, validateEmail } from '@/utils/validators';


const INITIAL_PRESTADOR = {
  nomeEmpresarial: '',
  nomeFantasia: '',
  cnpj: '',
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

const Index = () => {
  const [prestador, setPrestador] = useState(INITIAL_PRESTADOR);
  const [regime, setRegime] = useState<RegimeTributario>(null);
  const [regimeApuracaoSN, setRegimeApuracaoSN] = useState('');
  const [informarAliquotaSN, setInformarAliquotaSN] = useState(false);
  const [aliquotaSN, setAliquotaSN] = useState('');
  const [regimeApuracaoSNParametro, setRegimeApuracaoSNParametro] = useState(false);
  const [configValida, setConfigValida] = useState(false);

  const checkValidity = useCallback(() => {
    const cnpjOk = validateCNPJ(prestador.cnpj);
    const emailOk = prestador.email === '' || validateEmail(prestador.email);
    const regimeOk = regime !== null;
    const aliquotaOk = regime !== 'simples' || aliquotaSN.length > 0;
    setConfigValida(cnpjOk && emailOk && regimeOk && aliquotaOk);
  }, [prestador.cnpj, prestador.email, regime, aliquotaSN]);

  const autosave = useCallback(() => {
    checkValidity();
    // Simula autosave
  }, [checkValidity]);

  const handleSimplesDetected = useCallback((isOptante: boolean) => {
    if (isOptante) {
      setRegime('simples');
      setInformarAliquotaSN(true);
      setRegimeApuracaoSN('federal_municipal');
    }
  }, []);

  const handleSalvar = () => {
    if (!validateCNPJ(prestador.cnpj)) {
      toast.error('CNPJ inválido. Verifique o número informado.');
      return;
    }
    if (prestador.email && !validateEmail(prestador.email)) {
      toast.error('E-mail inválido. Verifique o endereço informado.');
      return;
    }
    if (!regime) {
      toast.error('Selecione o regime tributário.');
      return;
    }
    if (regime === 'simples' && !aliquotaSN) {
      toast.error('Informe a alíquota do Simples Nacional.');
      return;
    }
    toast.success('Configuração fiscal salva com sucesso!');
  };

  const handleTestar = () => {
    if (!configValida) {
      toast.error('Corrija os campos antes de testar a emissão.');
      return;
    }
    toast.info('Simulação de emissão de NFS-e iniciada...');
  };


  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center">
              <Shield className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-foreground tracking-tight">
                Zerä<span className="text-accent">:)</span>
              </h1>
              <p className="text-xs text-muted-foreground">Parametrização Fiscal — NFS-e</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {configValida && (
              <div className="alert-success flex items-center gap-2 text-xs">
                <CheckCircle className="w-4 h-4" />
                Configuração fiscal válida para emissão de NFS-e
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Form */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-5">
        <PrestadorSection
          data={prestador}
          onChange={setPrestador}
          onAutosave={autosave}
          onSimplesDetected={handleSimplesDetected}
        />

        <RegimeEParametrosSection
          regime={regime}
          onRegimeChange={setRegime}
          regimeApuracaoSN={regimeApuracaoSN}
          onRegimeApuracaoChange={setRegimeApuracaoSN}
          informarAliquotaSN={informarAliquotaSN}
          onInformarAliquotaChange={setInformarAliquotaSN}
          aliquotaSN={aliquotaSN}
          onAliquotaSNChange={setAliquotaSN}
          regimeApuracaoSNParametro={regimeApuracaoSNParametro}
          onRegimeApuracaoSNParametroChange={setRegimeApuracaoSNParametro}
          onAutosave={autosave}
        />


        {/* Footer */}
        <div className="section-card">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            {configValida && (
              <div className="alert-success flex items-center gap-2 text-sm">
                <CheckCircle className="w-4 h-4" />
                Configuração fiscal válida para emissão de NFS-e
              </div>
            )}
            <div className="flex items-center gap-3 ml-auto">
              <button onClick={() => { setPrestador(INITIAL_PRESTADOR); setRegime(null); }} className="btn-outline flex items-center gap-2">
                <X className="w-4 h-4" />
                Cancelar
              </button>
              <button onClick={handleTestar} className="btn-outline flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Testar Emissão NFS-e
              </button>
              <button onClick={handleSalvar} className="btn-primary flex items-center gap-2">
                <Save className="w-4 h-4" />
                Salvar Configuração
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
