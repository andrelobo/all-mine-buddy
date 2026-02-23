import React, { useState, useCallback, useEffect } from 'react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { Shield, Save, CheckCircle, Printer, Building2, Users, Receipt, Loader2 } from 'lucide-react';
import PrestadorSection from '@/components/PrestadorSection';
import RegimeEParametrosSection, { type RegimeTributario } from '@/components/RegimeEParametrosSection';
import CTNSection from '@/components/CTNSection';
import SimplesNacionalSection from '@/components/SimplesNacionalSection';
import TomadorSection, { type TomadorData, validateCPF } from '@/components/TomadorSection';
import { validateCNPJ, validateEmail } from '@/utils/validators';
import { usePrestador } from '@/hooks/usePrestador';
import { useTomadores } from '@/hooks/useTomadores';

type ActiveTab = 'prestador' | 'tomador' | 'emissao';

const INITIAL_TOMADOR: TomadorData = {
  nomeEmpresarial: '',
  nomeFantasia: '',
  cnpjCpf: '',
  inscricaoMunicipal: '',
  inscricaoEstadual: '',
  suframa: '',
  substitutoTributario: false,
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
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<ActiveTab>('prestador');
  
  // Prestador persistence
  const { prestador, setPrestador, config, setConfig, loading: loadingPrestador, saving: savingPrestador, salvarPrestador } = usePrestador();
  
  // Regime state derived from config
  const [regime, setRegime] = useState<RegimeTributario>(null);
  const [informarAliquotaSN, setInformarAliquotaSN] = useState(false);
  const [aliquotaSN, setAliquotaSN] = useState('');
  const [regimeApuracaoSNParametro, setRegimeApuracaoSNParametro] = useState(false);
  const [configValida, setConfigValida] = useState(false);
  const [ctnSelecionado, setCtnSelecionado] = useState<string | null>(null);
  const [ctnDescricao, setCtnDescricao] = useState<string>('');
  const [ctnItem, setCtnItem] = useState<string>('');

  // Tomador state
  const [tomador, setTomador] = useState<TomadorData>(INITIAL_TOMADOR);
  const { salvarTomador } = useTomadores(config.id);

  // Sync config to local state when loaded from DB
  useEffect(() => {
    if (config.regimeTributario) {
      setRegime(config.regimeTributario as RegimeTributario);
      if (config.regimeTributario === 'simples') {
        setInformarAliquotaSN(true);
        setRegimeApuracaoSNParametro(true);
      }
    }
    if (config.aliquotaSimples) setAliquotaSN(config.aliquotaSimples);
    if (config.ctnCodigo) setCtnSelecionado(config.ctnCodigo);
    if (config.ctnDescricao) setCtnDescricao(config.ctnDescricao);
    if (config.ctnItem) setCtnItem(config.ctnItem);
  }, [config]);

  const checkValidity = useCallback(() => {
    const cnpjOk = validateCNPJ(prestador.cnpj);
    const emailOk = prestador.email === '' || validateEmail(prestador.email);
    const regimeOk = regime !== null;
    const aliquotaOk = regime !== 'simples' || aliquotaSN.length > 0;
    setConfigValida(cnpjOk && emailOk && regimeOk && aliquotaOk);
  }, [prestador.cnpj, prestador.email, regime, aliquotaSN]);

  const autosave = useCallback(() => {
    checkValidity();
  }, [checkValidity]);

  const autosaveTomador = useCallback(() => {
    // placeholder
  }, []);

  const handleSimplesDetected = useCallback((isOptante: boolean) => {
    if (isOptante) {
      setRegime('simples');
      setInformarAliquotaSN(true);
      setRegimeApuracaoSNParametro(true);
    }
  }, []);

  const handleSalvar = async () => {
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

    const cfg = {
      ...config,
      regimeTributario: regime,
      optanteSimples: regime === 'simples',
      aliquotaSimples: aliquotaSN,
      ctnCodigo: ctnSelecionado || '',
      ctnDescricao,
      ctnItem,
    };

    await salvarPrestador(prestador, cfg);
  };

  const handleSalvarTomador = async () => {
    if (!tomador.cnpjCpf) {
      toast.error('Informe o CNPJ/CPF do tomador.');
      return;
    }
    if (!tomador.nomeEmpresarial) {
      toast.error('Informe o nome/razão social do tomador.');
      return;
    }

    await salvarTomador({
      prestador_id: config.id || null,
      cnpj_cpf: tomador.cnpjCpf,
      nome_razao_social: tomador.nomeEmpresarial,
      nome_fantasia: tomador.nomeFantasia,
      inscricao_municipal: tomador.inscricaoMunicipal,
      inscricao_estadual: tomador.inscricaoEstadual,
      suframa: tomador.suframa,
      substituto_tributario: tomador.substitutoTributario,
      cep: tomador.cep,
      logradouro: tomador.logradouro,
      numero: tomador.numero,
      complemento: tomador.complemento,
      bairro: tomador.bairro,
      localidade_uf: tomador.localidadeUf,
      email: tomador.email,
      whatsapp: tomador.whatsapp,
      pais: 'Brasil',
    });

    setTomador(INITIAL_TOMADOR);
  };

  const tabs: { key: ActiveTab; label: string; icon: React.ReactNode }[] = [
    { key: 'prestador', label: 'O Prestador', icon: <Building2 className="w-4 h-4" /> },
    { key: 'tomador', label: 'Tomadores', icon: <Users className="w-4 h-4" /> },
    { key: 'emissao', label: 'Nota Fiscal', icon: <Receipt className="w-4 h-4" /> },
  ];

  if (loadingPrestador) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header with tabs and actions */}
      <header className="bg-card border-b border-border sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center">
              <Shield className="w-5 h-5 text-primary-foreground" />
            </div>
            <h1 className="text-lg font-bold text-foreground tracking-tight">
              Zerä Software Ltda
            </h1>
          </div>

          {configValida && (
            <div className="alert-success flex items-center gap-2 text-xs hidden sm:flex">
              <CheckCircle className="w-4 h-4" />
              Configuração fiscal válida
            </div>
          )}
        </div>

        {/* Tab bar + action buttons */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between border-t border-border">
          <nav className="flex items-center gap-1">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => tab.key === 'emissao' ? navigate('/emissao-nfse') : setActiveTab(tab.key)}
                className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors duration-150 ${
                  activeTab === tab.key
                    ? 'border-primary text-primary'
                    : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-2 no-print">
            <button onClick={() => window.print()} className="btn-outline flex items-center gap-2 text-sm py-2">
              <Printer className="w-4 h-4" />
              <span className="hidden sm:inline">Imprimir</span>
            </button>
            <button
              onClick={activeTab === 'tomador' ? handleSalvarTomador : handleSalvar}
              disabled={savingPrestador}
              className="btn-primary flex items-center gap-2 text-sm py-2"
            >
              {savingPrestador ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              <span className="hidden sm:inline">
                {activeTab === 'tomador' ? 'Salvar Tomador' : 'Salvar Configuração'}
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-5">
        {activeTab === 'prestador' && (
          <>
            <PrestadorSection
              data={prestador}
              onChange={setPrestador}
              onAutosave={autosave}
              onSimplesDetected={handleSimplesDetected}
            />

            <RegimeEParametrosSection
              regime={regime}
              onRegimeChange={setRegime}
              informarAliquotaSN={informarAliquotaSN}
              onInformarAliquotaChange={setInformarAliquotaSN}
              aliquotaSN={aliquotaSN}
              onAliquotaSNChange={setAliquotaSN}
              regimeApuracaoSNParametro={regimeApuracaoSNParametro}
              onRegimeApuracaoSNParametroChange={setRegimeApuracaoSNParametro}
              onAutosave={autosave}
            >
              <CTNSection
                ctnSelecionado={ctnSelecionado}
                onCtnChange={(codigo, descricao, itemFormatado) => {
                  setCtnSelecionado(codigo);
                  setCtnDescricao(descricao);
                  setCtnItem(itemFormatado);
                }}
              />
            </RegimeEParametrosSection>
          </>
        )}

        {activeTab === 'tomador' && (
          <TomadorSection
            data={tomador}
            onChange={setTomador}
            onAutosave={autosaveTomador}
          />
        )}
      </main>
    </div>
  );
};

export default Index;
