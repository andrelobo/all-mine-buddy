import React, { useState, useCallback, useEffect } from 'react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { Save, CheckCircle, Loader2, List } from 'lucide-react';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import AppSidebar from '@/components/AppSidebar';
import PrestadorSection from '@/components/PrestadorSection';
import RegimeEParametrosSection, { type RegimeTributario } from '@/components/RegimeEParametrosSection';
import CTNSection from '@/components/CTNSection';
import TomadorSection, { type TomadorData } from '@/components/TomadorSection';
import TomadoresLista from '@/components/TomadoresLista';
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
  const [unsavedPrestador, setUnsavedPrestador] = useState(false);
  
  const { prestador, setPrestador, config, setConfig, loading: loadingPrestador, saving: savingPrestador, salvarPrestador } = usePrestador();
  
  const [regime, setRegime] = useState<RegimeTributario>(null);
  const [informarAliquotaSN, setInformarAliquotaSN] = useState(false);
  const [aliquotaSN, setAliquotaSN] = useState('');
  const [regimeApuracaoSNParametro, setRegimeApuracaoSNParametro] = useState(false);
  const [configValida, setConfigValida] = useState(false);
  const [ctnSelecionado, setCtnSelecionado] = useState<string | null>(null);
  const [ctnDescricao, setCtnDescricao] = useState<string>('');
  const [ctnItem, setCtnItem] = useState<string>('');

  const [tomador, setTomador] = useState<TomadorData>(INITIAL_TOMADOR);
  const [editingTomadorId, setEditingTomadorId] = useState<string | null>(null);
  const [showTomadorForm, setShowTomadorForm] = useState(false);
  const { tomadores: tomadoresList, loading: loadingTomadores, salvarTomador, excluirTomador } = useTomadores(config.id);

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
    setUnsavedPrestador(true);
  }, [checkValidity]);

  const autosaveTomador = useCallback(() => {}, []);

  const handleSimplesDetected = useCallback((isOptante: boolean) => {
    if (isOptante) {
      setRegime('simples');
      setInformarAliquotaSN(true);
      setRegimeApuracaoSNParametro(true);
    }
    setUnsavedPrestador(true);
  }, []);

  const handleTabChange = (tab: ActiveTab) => {
    if (tab === 'emissao') {
      navigate('/emissao-nfse');
    } else {
      setActiveTab(tab);
    }
  };

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

    const result = await salvarPrestador(prestador, cfg);
    if (result) setUnsavedPrestador(false);
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
      id: editingTomadorId || undefined,
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
    setEditingTomadorId(null);
    setShowTomadorForm(false);
  };

  if (loadingPrestador) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar activeTab={activeTab} onTabChange={handleTabChange} />

        <div className="flex-1 flex flex-col min-w-0">
          {/* Top bar */}
          <header className="bg-card border-b border-border sticky top-0 z-10 px-4 sm:px-6 py-2 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <SidebarTrigger />
              <h2 className="text-base font-semibold text-foreground">
                {activeTab === 'prestador' ? 'O Prestador' : 'Tomadores'}
              </h2>
            </div>

            <div className="flex items-center gap-3">
              {configValida && (
                <div className="alert-success flex items-center gap-2 text-xs hidden sm:flex">
                  <CheckCircle className="w-4 h-4" />
                  Configuração fiscal válida
                </div>
              )}

              {activeTab === 'tomador' && showTomadorForm && (
                <button
                  onClick={() => { setTomador(INITIAL_TOMADOR); setEditingTomadorId(null); setShowTomadorForm(false); }}
                  className="btn-outline flex items-center gap-2 text-sm py-2"
                >
                  <List className="w-4 h-4" />
                  <span className="hidden sm:inline">Lista</span>
                </button>
              )}
              {(activeTab !== 'tomador' || showTomadorForm) && (
                <button
                  onClick={activeTab === 'tomador' ? handleSalvarTomador : handleSalvar}
                  disabled={savingPrestador}
                  className={`flex items-center gap-2 text-sm py-2 btn-primary ${
                    activeTab === 'prestador' && unsavedPrestador
                      ? 'animate-bounce ring-2 ring-yellow-400 ring-offset-2'
                      : ''
                  }`}
                >
                  {savingPrestador ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  <span className="hidden sm:inline">
                    {activeTab === 'tomador'
                      ? (editingTomadorId ? 'Atualizar' : 'SALVAR')
                      : 'SALVAR'}
                  </span>
                </button>
              )}
            </div>
          </header>

          {/* Content */}
          <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 space-y-5">
            {activeTab === 'prestador' && (
              <>
                <PrestadorSection
                  data={prestador}
                  onChange={setPrestador}
                  onAutosave={autosave}
                  onSimplesDetected={handleSimplesDetected}
                  optanteSimples={config.optanteSimples}
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
                    savedCnaes={config.parametroMunicipal}
                    onCnaesChange={(cnaes) => setConfig(prev => ({ ...prev, parametroMunicipal: cnaes }))}
                  />
                </RegimeEParametrosSection>
              </>
            )}

            {activeTab === 'tomador' && (
              <>
                {showTomadorForm ? (
                  <TomadorSection
                    data={tomador}
                    onChange={setTomador}
                    onAutosave={autosaveTomador}
                  />
                ) : (
                  <TomadoresLista
                    tomadores={tomadoresList}
                    loading={loadingTomadores}
                    editingId={editingTomadorId}
                    onNovo={() => {
                      setTomador(INITIAL_TOMADOR);
                      setEditingTomadorId(null);
                      setShowTomadorForm(true);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    onEditar={(t) => {
                      setTomador({
                        nomeEmpresarial: t.nome_razao_social,
                        nomeFantasia: t.nome_fantasia,
                        cnpjCpf: t.cnpj_cpf,
                        inscricaoMunicipal: t.inscricao_municipal,
                        inscricaoEstadual: t.inscricao_estadual,
                        suframa: t.suframa,
                        substitutoTributario: t.substituto_tributario,
                        cep: t.cep,
                        logradouro: t.logradouro,
                        numero: t.numero,
                        complemento: t.complemento,
                        bairro: t.bairro,
                        localidadeUf: t.localidade_uf,
                        email: t.email,
                        whatsapp: t.whatsapp,
                      });
                      setEditingTomadorId(t.id);
                      setShowTomadorForm(true);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    onExcluir={excluirTomador}
                  />
                )}
              </>
            )}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Index;
