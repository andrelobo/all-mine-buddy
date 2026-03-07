import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { toast } from 'sonner';
import { Save, CheckCircle, Loader2, List, FileOutput, Printer, AlertCircle, Building2, Landmark, Settings, Trash2 } from 'lucide-react';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import AppSidebar from '@/components/AppSidebar';
import PrestadorSection from '@/components/PrestadorSection';
import RegimeEParametrosSection, { type RegimeTributario } from '@/components/RegimeEParametrosSection';
import ParametrosTributariosSNCard, { type ParametroISSOption } from '@/components/ParametrosTributariosSNCard';
import CTNSection from '@/components/CTNSection';
import CNAESection from '@/components/CNAESection';
import SimplesNacionalSection from '@/components/SimplesNacionalSection';
import ResumoTributario from '@/components/ResumoTributario';
import Dashboard from '@/components/Dashboard';
import TabelaAnexoIII from '@/components/TabelaAnexoIII';
import EmpresaCard from '@/components/prestador/EmpresaCard';
import ConfigOperacionaisSection from '@/components/ConfigOperacionaisSection';
import ContatoCard from '@/components/prestador/ContatoCard';
import EnderecoCard from '@/components/prestador/EnderecoCard';
import CertificadoDigitalCard from '@/components/prestador/CertificadoDigitalCard';
import IdentificacaoDocumentoCard from '@/components/prestador/IdentificacaoDocumentoCard';
import { usePrestadorAutoFetch } from '@/hooks/usePrestadorAutoFetch';
import TomadorSection, { type TomadorData } from '@/components/TomadorSection';
import TomadoresLista from '@/components/TomadoresLista';
import TomadorEmissao, { INITIAL_TOMADOR as INITIAL_TOMADOR_EMISSAO, type TomadorEmissaoData } from '@/components/emissao/TomadorEmissao';
import PrestacaoServicoSection, { type PrestacaoServicoData } from '@/components/emissao/PrestacaoServicoSection';
import LocalPrestacaoSection, { type LocalPrestacaoData } from '@/components/emissao/LocalPrestacaoSection';
import ValoresTotaisSection from '@/components/emissao/ValoresTotaisSection';
import DANFSePrint from '@/components/emissao/DANFSePrint';
import FingestClientesTabela from '@/components/FingestClientesTabela';
import { validateCNPJ, validateEmail } from '@/utils/validators';
import { usePrestador } from '@/hooks/usePrestador';
import { useTomadores } from '@/hooks/useTomadores';
import { useNotasFiscais } from '@/hooks/useNotasFiscais';
import { useSimplesNacional } from '@/hooks/useSimplesNacional';
import type { TomadorDB } from '@/hooks/useTomadores';

type ActiveTab = 'dashboard' | 'prestador' | 'tomador' | 'emissao' | 'notas';
type PrestadorSubTab = 'cadastro' | 'regime' | 'parametros';

const INITIAL_TOMADOR: TomadorData = {
  nomeEmpresarial: '', nomeFantasia: '', cnpjCpf: '', inscricaoMunicipal: '', inscricaoEstadual: '',
  suframa: '', substitutoTributario: false, cep: '', logradouro: '', numero: '', complemento: '',
  bairro: '', localidadeUf: '', email: '', whatsapp: '',
};

const INITIAL_PRESTACAO: PrestacaoServicoData = {
  codigoServico: '', descricaoServico: '', localPrestacao: '', valorServico: '', aliquota: '',
  baseCalculo: '', issRetido: false, desconto: '', retPis: '', retCofins: '', retCsll: '',
  retIr: '', retInss: '',
};

function parseCurrency(value: string): number {
  if (!value) return 0;
  return parseFloat(value.replace(/\./g, '').replace(',', '.')) || 0;
}

function parsePercent(value: string): number {
  if (!value) return 0;
  return parseFloat(value.replace(',', '.')) || 0;
}

const SUB_TABS: { key: PrestadorSubTab; label: string; icon: React.ReactNode }[] = [
  { key: 'cadastro', label: 'Dados Cadastrais', icon: <Building2 className="w-4 h-4" /> },
  { key: 'regime', label: 'Regime Tributário', icon: <Landmark className="w-4 h-4" /> },
  { key: 'parametros', label: 'Parâmetros Fiscais', icon: <Settings className="w-4 h-4" /> },
];

const Index = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [prestadorSubTab, setPrestadorSubTab] = useState<PrestadorSubTab>('cadastro');
  const [unsavedPrestador, setUnsavedPrestador] = useState(false);
  
  const { prestador, setPrestador, config, setConfig, loading: loadingPrestador, saving: savingPrestador, salvarPrestador, limparPrestador } = usePrestador();
  
  const [regime, setRegime] = useState<RegimeTributario>(null);
  const [informarAliquotaSN, setInformarAliquotaSN] = useState(false);
  const [aliquotaSN, setAliquotaSN] = useState('');
  const [regimeApuracaoSNParametro, setRegimeApuracaoSNParametro] = useState(false);
  const [configValida, setConfigValida] = useState(false);
  const [simplesParametroIss, setSimplesParametroIss] = useState<ParametroISSOption>('');
  const [ctnSelecionado, setCtnSelecionado] = useState<string | null>(null);
  const [ctnDescricao, setCtnDescricao] = useState<string>('');
  const [ctnItem, setCtnItem] = useState<string>('');

  const [cnaesLista, setCnaesLista] = useState<any[]>(config.cnaesLista || []);

  const {
    cnaePrincipal: snCnaePrincipal, setCnaePrincipal: snSetCnaePrincipal,
    cnaeDescricao: snCnaeDescricao, cnaeAnexo: snCnaeAnexo, permiteFatorR: snPermiteFatorR,
    rbt12: snRbt12, setRbt12: snSetRbt12, calculo: snCalculo, alertas: snAlertas,
  } = useSimplesNacional(config.cnaePrincipal, config.rbt12);

  const [tomador, setTomador] = useState<TomadorData>(INITIAL_TOMADOR);
  const [editingTomadorId, setEditingTomadorId] = useState<string | null>(null);
  const [showTomadorForm, setShowTomadorForm] = useState(false);
  const { tomadores: tomadoresList, loading: loadingTomadores, salvarTomador, excluirTomador } = useTomadores(config.id);

  const { salvarNota, saving: savingNota } = useNotasFiscais();
  const [tomadorEmissao, setTomadorEmissao] = useState<TomadorEmissaoData>(INITIAL_TOMADOR_EMISSAO);
  const [prestacao, setPrestacao] = useState<PrestacaoServicoData>(INITIAL_PRESTACAO);
  const [localPrestacao, setLocalPrestacao] = useState<LocalPrestacaoData>({ pais: 'Brasil', uf: 'AM', municipio: 'Manaus' });
  const [emissaoErrors, setEmissaoErrors] = useState<string[]>([]);
  const [tomadorSubstituto, setTomadorSubstituto] = useState(false);
  const [configOperacionais, setConfigOperacionais] = useState<{ id: string; natureza: string; descricao: string }[]>([]);
  const [nfseNum, setNfseNum] = useState('');
  const [dpsNum, setDpsNum] = useState('');
  const [serieDpsNum, setSerieDpsNum] = useState('');
  const [dataEmissao, setDataEmissao] = useState(() => new Date().toISOString().slice(0, 10));
  const [competencia, setCompetencia] = useState('01/2026');

  // Sync local state from config only on initial load (when config.id first appears)
  const configSyncedRef = React.useRef(false);
  useEffect(() => {
    if (configSyncedRef.current) return;
    if (!config.id) return;
    configSyncedRef.current = true;
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
    if (config.cnaesLista && config.cnaesLista.length > 0) setCnaesLista(config.cnaesLista);
    if (config.configOperacionais && config.configOperacionais.length > 0) setConfigOperacionais(config.configOperacionais);
    if (config.simplesParametroIss) setSimplesParametroIss(config.simplesParametroIss as ParametroISSOption);
  }, [config.id]);

  // Sincronizar alíquota efetiva do cálculo Simples Nacional com o campo de Parâmetros Fiscais
  useEffect(() => {
    if (snCalculo.valido && snCalculo.aliquotaEfetiva > 0) {
      const efetiva = (snCalculo.aliquotaEfetiva * 100).toFixed(2).replace('.', ',');
      setAliquotaSN(efetiva);
      setInformarAliquotaSN(true);
      setRegimeApuracaoSNParametro(true);
      setUnsavedPrestador(true);
    }
  }, [snCalculo.valido, snCalculo.aliquotaEfetiva]);

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

  // Auto-fetch hook for CNPJ/CEP
  const autoFetch = usePrestadorAutoFetch(prestador, setPrestador, autosave, handleSimplesDetected);

  const handleTabChange = (tab: ActiveTab) => { setActiveTab(tab); };

  const handleSalvar = async () => {
    if (!validateCNPJ(prestador.cnpj)) { toast.error('CNPJ inválido. Verifique o número informado.'); return; }
    if (prestador.email && !validateEmail(prestador.email)) { toast.error('E-mail inválido. Verifique o endereço informado.'); return; }
    if (!regime) { toast.error('Selecione o regime tributário.'); return; }
    if (regime === 'simples' && !aliquotaSN) { toast.error('Informe a alíquota do Simples Nacional.'); return; }

    const cfg = {
      ...config,
      regimeTributario: regime,
      optanteSimples: regime === 'simples',
      aliquotaSimples: aliquotaSN,
      ctnCodigo: ctnSelecionado || '',
      ctnDescricao, ctnItem,
      cnaePrincipal: snCnaePrincipal,
      cnaesLista,
      configOperacionais,
      rbt12: snRbt12,
      simplesAnexo: snCnaeAnexo || 'III',
      simplesFaixa: snCalculo.faixa?.faixa || null,
      simplesAliquotaNominal: snCalculo.faixa?.aliquotaNominal || 0,
      simplesParcalaDeduzir: snCalculo.faixa?.parcelaDeduzir || 0,
      simplesAliquotaEfetiva: snCalculo.aliquotaEfetiva || 0,
      simplesParametroIss: simplesParametroIss,
    };
    const result = await salvarPrestador(prestador, cfg);
    if (result) setUnsavedPrestador(false);
  };

  const handleSalvarTomador = async () => {
    if (!tomador.cnpjCpf) { toast.error('Informe o CNPJ/CPF do tomador.'); return; }
    if (!tomador.nomeEmpresarial) { toast.error('Informe o nome/razão social do tomador.'); return; }
    await salvarTomador({
      id: editingTomadorId || undefined,
      prestador_id: config.id || null, cnpj_cpf: tomador.cnpjCpf,
      nome_razao_social: tomador.nomeEmpresarial, nome_fantasia: tomador.nomeFantasia,
      inscricao_municipal: tomador.inscricaoMunicipal, inscricao_estadual: tomador.inscricaoEstadual,
      suframa: tomador.suframa, substituto_tributario: tomador.substitutoTributario,
      cep: tomador.cep, logradouro: tomador.logradouro, numero: tomador.numero,
      complemento: tomador.complemento, bairro: tomador.bairro, localidade_uf: tomador.localidadeUf,
      email: tomador.email, whatsapp: tomador.whatsapp, pais: 'Brasil',
    });
    setTomador(INITIAL_TOMADOR); setEditingTomadorId(null); setShowTomadorForm(false);
  };

  const handleTomadorSelecionado = useCallback((t: TomadorDB) => {
    const isSub = !!t.substituto_tributario;
    setTomadorSubstituto(isSub);
    if (isSub) { setPrestacao(prev => ({ ...prev, issRetido: true })); }
    else { setPrestacao(prev => ({ ...prev, issRetido: false, aliquota: config.optanteSimples ? '' : prev.aliquota })); }
  }, [config.optanteSimples]);

  const valores = useMemo(() => {
    const valorBruto = parseCurrency(prestacao.valorServico);
    const desconto = parseCurrency(prestacao.desconto);
    const aliquota = parsePercent(prestacao.aliquota);
    const baseCalculo = valorBruto - desconto;
    const issValor = baseCalculo * (aliquota / 100);
    return {
      valorBruto, desconto, baseCalculo, issValor,
      retPis: parseCurrency(prestacao.retPis), retCofins: parseCurrency(prestacao.retCofins),
      retCsll: parseCurrency(prestacao.retCsll), retIr: parseCurrency(prestacao.retIr),
      retInss: parseCurrency(prestacao.retInss),
    };
  }, [prestacao]);

  const handlePrestacaoChange = (newData: PrestacaoServicoData) => {
    const valorBruto = parseCurrency(newData.valorServico);
    const desconto = parseCurrency(newData.desconto);
    const baseCalculo = valorBruto - desconto;
    setPrestacao({
      ...newData,
      baseCalculo: baseCalculo > 0
        ? baseCalculo.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
        : '',
    });
  };

  const validarEmissao = (): string[] => {
    const erros: string[] = [];
    if (!validateCNPJ(prestador.cnpj)) erros.push('CNPJ do prestador é obrigatório/inválido.');
    if (!tomadorEmissao.cnpjCpf) erros.push('CPF/CNPJ do tomador é obrigatório.');
    if (!tomadorEmissao.nomeRazaoSocial) erros.push('Nome/Razão Social do tomador é obrigatório.');
    if (!tomadorEmissao.email) erros.push('E-mail do tomador é obrigatório.');
    if (!tomadorEmissao.localidadeUf) erros.push('Município do tomador é obrigatório.');
    if (!prestacao.codigoServico) erros.push('Código do serviço é obrigatório.');
    if (!prestacao.descricaoServico) erros.push('Descrição do serviço é obrigatória.');
    if (!prestacao.valorServico || parseCurrency(prestacao.valorServico) <= 0) erros.push('Valor do serviço deve ser maior que zero.');
    if (!prestacao.aliquota && !(config.optanteSimples && !tomadorSubstituto)) erros.push('Alíquota é obrigatória.');
    return erros;
  };

  const handleEmitir = async () => {
    const erros = validarEmissao();
    setEmissaoErrors(erros);
    if (erros.length > 0) { toast.error('Corrija os erros antes de emitir a NFS-e.'); return; }
    const tomadorId = await salvarTomador({
      prestador_id: config.id || null, cnpj_cpf: tomadorEmissao.cnpjCpf,
      nome_razao_social: tomadorEmissao.nomeRazaoSocial, nome_fantasia: '',
      inscricao_municipal: tomadorEmissao.inscricaoMunicipal, inscricao_estadual: '', suframa: '',
      substituto_tributario: false, cep: tomadorEmissao.cep, logradouro: tomadorEmissao.logradouro,
      numero: tomadorEmissao.numero, complemento: tomadorEmissao.complemento, bairro: tomadorEmissao.bairro,
      localidade_uf: tomadorEmissao.localidadeUf, email: tomadorEmissao.email, whatsapp: '',
      pais: tomadorEmissao.pais || 'Brasil',
    });
    await salvarNota({
      prestadorId: config.id || null, tomadorId: tomadorId || null,
      prestacao, localPrestacao, status: 'emitida', dataEmissao,
    });
    // Limpar formulário DANFSE para próxima nota
    setTomadorEmissao(INITIAL_TOMADOR_EMISSAO);
    setPrestacao(INITIAL_PRESTACAO);
    setLocalPrestacao({ pais: 'Brasil', uf: 'AM', municipio: 'Manaus' });
    setEmissaoErrors([]);
    setNfseNum('');
    setDpsNum('');
    setSerieDpsNum('');
    setDataEmissao(new Date().toISOString().slice(0, 10));
    setTomadorSubstituto(false);
  };

  const autosaveEmissao = useCallback(() => {}, []);
  const tabTitle = activeTab === 'dashboard' ? 'Dashboard' : activeTab === 'prestador' ? 'O Prestador' : activeTab === 'tomador' ? 'Tomadores' : activeTab === 'notas' ? 'FinGest' : 'DANFSE';

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
        <AppSidebar activeTab={activeTab} onTabChange={handleTabChange} prestadorSubTab={prestadorSubTab} onPrestadorSubTabChange={setPrestadorSubTab} />

        <div className="flex-1 flex flex-col min-w-0">
          {/* Top bar */}
          <header className="bg-card border-b border-border sticky top-0 z-10 px-4 sm:px-6 py-2 flex items-center justify-between gap-2">
            <div className="flex items-center gap-3 shrink-0">
              <SidebarTrigger />
              <h2 className="text-base font-semibold text-foreground">{tabTitle}</h2>
            </div>



            <div className="flex items-center gap-3 shrink-0">
              {activeTab === 'prestador' && configValida && (
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

              {activeTab === 'prestador' && (
                <>
                </>
              )}

              {activeTab === 'tomador' && showTomadorForm && (
                <button onClick={handleSalvarTomador} className="flex items-center gap-2 text-sm py-2 btn-primary">
                  <Save className="w-4 h-4" />
                  <span className="hidden sm:inline">{editingTomadorId ? 'Atualizar' : 'SALVAR'}</span>
                </button>
              )}

              {activeTab === 'emissao' && (
                <div className="flex items-center gap-2 flex-nowrap">
                  <button onClick={() => window.print()} className="btn-outline flex items-center gap-2 text-sm py-2 whitespace-nowrap">
                    <Printer className="w-4 h-4 shrink-0" /><span>Visualizar</span>
                  </button>
                  <button onClick={handleEmitir} disabled={savingNota} className="btn-primary flex items-center gap-2 text-sm py-2 whitespace-nowrap">
                    {savingNota ? <Loader2 className="w-4 h-4 animate-spin shrink-0" /> : <FileOutput className="w-4 h-4 shrink-0" />}
                    <span>Emitir</span>
                  </button>
                </div>
              )}
            </div>
          </header>

          {/* Content */}
          <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-4 space-y-2">

            {/* ====== DASHBOARD ====== */}
            {activeTab === 'dashboard' && (
              <Dashboard
                prestadorId={config.id || null}
                nomeEmpresa={prestador.nomeEmpresarial || prestador.nomeFantasia || ''}
                rbt12={snRbt12}
                cnaeAnexo={snCnaeAnexo || 'III'}
                regime={regime}
              />
            )}


            {/* ====== PRESTADOR com sub-abas ====== */}
            {activeTab === 'prestador' && (
              <>
                {prestadorSubTab === 'cadastro' && (
                  <div className="space-y-2">
                    <EmpresaCard
                      data={prestador}
                      onFieldChange={autoFetch.handleFieldChange}
                      onCNPJChange={autoFetch.handleCNPJChange}
                      loadingCNPJ={autoFetch.loadingCNPJ}
                      simplesStatus={autoFetch.simplesStatus ?? config.optanteSimples ?? null}
                      onSimplesToggle={(v) => {
                        autoFetch.setSimplesStatus(v);
                        handleSimplesDetected(v);
                      }}
                    />


                    <EnderecoCard
                      cep={prestador.cep}
                      logradouro={prestador.logradouro}
                      numero={prestador.numero}
                      complemento={prestador.complemento}
                      bairro={prestador.bairro}
                      localidadeUf={prestador.localidadeUf}
                      onFieldChange={autoFetch.handleFieldChange}
                      onCEPChange={autoFetch.handleCEPChange}
                      loadingCEP={autoFetch.loadingCEP}
                    />

                    <ContatoCard
                      email={prestador.email}
                      whatsapp={prestador.whatsapp}
                      onFieldChange={autoFetch.handleFieldChange}
                    />

                    <CertificadoDigitalCard />

                    <IdentificacaoDocumentoCard
                      nfseNum={nfseNum}
                      onNfseNumChange={setNfseNum}
                      dpsNum={dpsNum}
                      onDpsNumChange={setDpsNum}
                      serieDpsNum={serieDpsNum}
                      onSerieDpsNumChange={setSerieDpsNum}
                    />

                    <div className="flex justify-end gap-3 pt-2">
                      <button
                        onClick={() => {
                          if (window.confirm('Tem certeza que deseja limpar todos os dados do prestador?')) {
                            limparPrestador();
                            setRegime(null);
                            setAliquotaSN('');
                            setCtnSelecionado(null);
                            setCtnDescricao('');
                            setCtnItem('');
                            setCnaesLista([]);
                            setUnsavedPrestador(false);
                          }
                        }}
                        className="btn-outline flex items-center gap-2 text-sm py-2 text-destructive border-destructive/30 hover:bg-destructive/10"
                      >
                        <Trash2 className="w-4 h-4" />
                        Limpar
                      </button>
                      <button
                        onClick={handleSalvar}
                        disabled={savingPrestador}
                        className={`flex items-center gap-2 text-sm py-2 btn-primary ${
                          unsavedPrestador ? 'animate-bounce ring-2 ring-yellow-400 ring-offset-2' : ''
                        }`}
                      >
                        {savingPrestador ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        SALVAR
                      </button>
                    </div>
                  </div>
                )}

                {/* Sub-aba: Regime Tributário */}
                {prestadorSubTab === 'regime' && (
                   <div className="space-y-2">
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
                    />

                    <CNAESection
                      cnpj={prestador.cnpj}
                      cnaeEscolhido={snCnaePrincipal || null}
                      onCnaeEscolhidoChange={(codigo, descricao) => {
                        snSetCnaePrincipal(codigo);
                        setUnsavedPrestador(true);
                      }}
                      rbt12={snRbt12}
                      cnaesLista={cnaesLista}
                      onCnaesListaChange={(lista) => { setCnaesLista(lista); setUnsavedPrestador(true); }}
                    />

                    {regime === 'simples' && (
                      <SimplesNacionalSection
                        cnaePrincipal={snCnaePrincipal}
                        cnaeDescricao={snCnaeDescricao}
                        cnaeAnexo={snCnaeAnexo}
                        rbt12={snRbt12}
                        onRbt12Change={(v) => { snSetRbt12(v); setUnsavedPrestador(true); }}
                        calculo={snCalculo}
                        alertas={snAlertas}
                        permiteFatorR={snPermiteFatorR}
                      />
                    )}

                    {regime === 'simples' && (
                      <TabelaAnexoIII faixaAtual={snCalculo.faixa?.faixa ?? null} />
                    )}

                    <div className="flex justify-end pt-2">
                      <button
                        onClick={handleSalvar}
                        disabled={savingPrestador}
                        className={`flex items-center gap-2 text-sm py-2 btn-primary ${
                          unsavedPrestador ? 'animate-bounce ring-2 ring-yellow-400 ring-offset-2' : ''
                        }`}
                      >
                        {savingPrestador ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        SALVAR
                      </button>
                    </div>

                  </div>
                )}

                {/* Sub-aba: Parâmetros Fiscais */}
                {prestadorSubTab === 'parametros' && (
                  <div className="space-y-2">

                    {/* Parâmetros Federais */}
                    {regime === 'simples' && (
                      <div className="section-card p-3">
                        <h2 className="section-title text-sm mb-2">
                          <Settings className="w-4 h-4 text-primary" />
                          Parâmetros Federais
                        </h2>
                        <div className="space-y-2 p-2.5 rounded-lg bg-muted/50 border border-border">
                          <ToggleSwitch
                            checked={regimeApuracaoSNParametro}
                            onChange={(v) => { setRegimeApuracaoSNParametro(v); autosave(); }}
                            label="Regime de apuração dos tributos federais e municipal pelo Simples Nacional"
                          />
                          <ToggleSwitch
                            checked={informarAliquotaSN}
                            onChange={(v) => { setInformarAliquotaSN(v); autosave(); }}
                            label="Informar alíquota do Simples Nacional"
                          />
                          {informarAliquotaSN && (
                            <div>
                              <label className="field-label whitespace-nowrap">Simples Nacional</label>
                              <div className="relative w-[55px]">
                                <input
                                  className="field-input pr-7 border-primary"
                                  type="text"
                                  placeholder="00,00"
                                  maxLength={5}
                                  value={aliquotaSN}
                                  onChange={(e) => {
                                    let v = e.target.value.replace(/[^\d]/g, '').slice(0, 4);
                                    if (v.length > 2) v = v.slice(0, -2) + ',' + v.slice(-2);
                                    setAliquotaSN(v);
                                    autosave();
                                  }}
                                />
                                <span className="absolute right-2 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">%</span>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {!regime && (
                      <div className="section-card flex items-center justify-center py-8 text-muted-foreground text-sm">
                        Selecione um regime tributário na aba "Regime Tributário" para configurar os parâmetros.
                      </div>
                    )}

                    {regime && regime !== 'simples' && (
                      <div className="section-card p-3">
539:                         <h2 className="section-title text-sm mb-2">
                          <Settings className="w-4 h-4 text-primary" />
                          Parâmetros Federais
                        </h2>
                        <p className="text-sm text-muted-foreground">Configurações federais para {regime === 'presumido' ? 'Lucro Presumido' : 'Lucro Real'} serão disponibilizadas em breve.</p>
                      </div>
                    )}

                    {/* Parâmetros Municipais */}
                    <div className="section-card p-3">
                      <h2 className="section-title text-sm mb-2">
                        <Settings className="w-4 h-4 text-primary" />
                        Parâmetros Municipais
                      </h2>
                      <CTNSection
                        ctnSelecionado={ctnSelecionado}
                        onCtnChange={(codigo, descricao, itemFormatado) => {
                          setCtnSelecionado(codigo);
                          setCtnDescricao(descricao);
                          setCtnItem(itemFormatado);
                        }}
                        savedCnaes={config.parametroMunicipal}
                        onCnaesChange={(cnaes) => setConfig(prev => ({ ...prev, parametroMunicipal: cnaes }))}
                        regimeCnaes={cnaesLista}
                      />
                    </div>

                    <ConfigOperacionaisSection
                      items={configOperacionais}
                      onChange={setConfigOperacionais}
                    />

                    <div className="flex justify-end pt-2">
                      <button
                        onClick={handleSalvar}
                        disabled={savingPrestador}
                        className={`flex items-center gap-2 text-sm py-2 btn-primary ${
                          unsavedPrestador ? 'animate-bounce ring-2 ring-yellow-400 ring-offset-2' : ''
                        }`}
                      >
                        {savingPrestador ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        SALVAR
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}

            {/* ====== TOMADOR ====== */}
            {activeTab === 'tomador' && (
              <>
                {showTomadorForm ? (
                  <TomadorSection data={tomador} onChange={setTomador} onAutosave={autosaveTomador} />
                ) : (
                  <TomadoresLista
                    tomadores={tomadoresList} loading={loadingTomadores} editingId={editingTomadorId}
                    onNovo={() => { setTomador(INITIAL_TOMADOR); setEditingTomadorId(null); setShowTomadorForm(true); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                    onEditar={(t) => {
                      setTomador({
                        nomeEmpresarial: t.nome_razao_social, nomeFantasia: t.nome_fantasia,
                        cnpjCpf: t.cnpj_cpf, inscricaoMunicipal: t.inscricao_municipal,
                        inscricaoEstadual: t.inscricao_estadual, suframa: t.suframa,
                        substitutoTributario: t.substituto_tributario, cep: t.cep,
                        logradouro: t.logradouro, numero: t.numero, complemento: t.complemento,
                        bairro: t.bairro, localidadeUf: t.localidade_uf,
                        email: t.email, whatsapp: t.whatsapp,
                      });
                      setEditingTomadorId(t.id); setShowTomadorForm(true);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    onExcluir={excluirTomador}
                  />
                )}
              </>
            )}

            {/* ====== EMISSÃO ====== */}
            {activeTab === 'emissao' && (
              <>
                {emissaoErrors.length > 0 && (
                  <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertCircle className="w-4 h-4 text-destructive" />
                      <span className="text-sm font-medium text-destructive">Corrija os seguintes erros:</span>
                    </div>
                    <ul className="list-disc list-inside text-sm text-destructive/80 space-y-1">
                      {emissaoErrors.map((e, i) => <li key={i}>{e}</li>)}
                    </ul>
                  </div>
                )}
                {/* Card superior: Competência, Data, NFS-e, DPS, Série DPS */}
                <div className="section-card p-3">
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                    <div>
                      <label className="field-label">Competência</label>
                      <input
                        className="field-input"
                        type="text"
                        placeholder="mm/aaaa"
                        maxLength={7}
                        value={competencia}
                        onChange={e => {
                          let v = e.target.value.replace(/[^0-9]/g, '');
                          if (v.length > 2) v = v.slice(0, 2) + '/' + v.slice(2, 6);
                          setCompetencia(v);
                        }}
                      />
                    </div>
                    <div>
                      <label className="field-label">Data de Emissão</label>
                      <input className="field-input" type="date" value={dataEmissao} onChange={e => setDataEmissao(e.target.value)} />
                    </div>
                    <div>
                      <label className="field-label">NFS-e Nº</label>
                      <input className="field-input" type="text" placeholder="Número" inputMode="numeric" value={nfseNum} onChange={e => setNfseNum(e.target.value.replace(/\D/g, ''))} />
                    </div>
                    <div>
                      <label className="field-label">DPS Nº</label>
                      <input className="field-input" type="text" placeholder="Número" inputMode="numeric" value={dpsNum} onChange={e => setDpsNum(e.target.value.replace(/\D/g, ''))} />
                    </div>
                    <div>
                      <label className="field-label">Série DPS Nº</label>
                      <input className="field-input" type="text" placeholder="Número" inputMode="numeric" value={serieDpsNum} onChange={e => setSerieDpsNum(e.target.value.replace(/\D/g, ''))} />
                    </div>
                  </div>
                </div>
                <PrestadorSection data={prestador} onChange={setPrestador} onAutosave={autosaveEmissao} optanteSimples={config.optanteSimples} compact />
                <TomadorEmissao data={tomadorEmissao} onChange={setTomadorEmissao} onTomadorSelecionado={handleTomadorSelecionado} prestadorId={config.id} />
                <LocalPrestacaoSection data={localPrestacao} onChange={setLocalPrestacao} />
                <PrestacaoServicoSection data={prestacao} onChange={handlePrestacaoChange} mostrarRetencoesFederais={true} favoritos={config.parametroMunicipal} optanteSimples={config.optanteSimples} tomadorSubstituto={tomadorSubstituto} listaServico={configOperacionais} />
                <ValoresTotaisSection
                  valorBruto={valores.valorBruto} desconto={valores.desconto} issValor={valores.issValor}
                  issRetido={prestacao.issRetido} retPis={valores.retPis} retCofins={valores.retCofins}
                  retCsll={valores.retCsll} retIr={valores.retIr} retInss={valores.retInss}
                />
              </>
            )}

            {/* ====== NOTAS FISCAIS ====== */}
            {activeTab === 'notas' && (
              <FingestClientesTabela prestadorId={config.id || null} />
            )}
          </main>
        </div>
      </div>

      {activeTab === 'emissao' && (
        <DANFSePrint
          data={{
            prestador: { cnpj: prestador.cnpj, inscricaoMunicipal: prestador.inscricaoMunicipal, nomeEmpresarial: prestador.nomeEmpresarial, nomeFantasia: prestador.nomeFantasia },
            tomador: { cnpjCpf: tomadorEmissao.cnpjCpf, nomeRazaoSocial: tomadorEmissao.nomeRazaoSocial, inscricaoMunicipal: tomadorEmissao.inscricaoMunicipal, email: tomadorEmissao.email, logradouro: tomadorEmissao.logradouro, numero: tomadorEmissao.numero, complemento: tomadorEmissao.complemento, bairro: tomadorEmissao.bairro, localidadeUf: tomadorEmissao.localidadeUf, cep: tomadorEmissao.cep },
            localPrestacao,
            servico: { codigoServico: prestacao.codigoServico, descricaoServico: prestacao.descricaoServico, valorServico: prestacao.valorServico, aliquota: prestacao.aliquota, baseCalculo: prestacao.baseCalculo, desconto: prestacao.desconto, issRetido: prestacao.issRetido },
            valores,
          }}
        />
      )}
    </SidebarProvider>
  );
};

// Toggle component used in Parâmetros Fiscais
const ToggleSwitch: React.FC<{ checked: boolean; onChange: (v: boolean) => void; label: string }> = ({ checked, onChange, label }) => (
  <label className="flex items-center gap-3 cursor-pointer select-none">
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`switch-track ${checked ? 'switch-track-on' : 'switch-track-off'}`}
    >
      <span className={`switch-thumb ${checked ? 'translate-x-4' : 'translate-x-0'}`} />
    </button>
    <span className="text-sm text-foreground">{label}</span>
  </label>
);

export default Index;
