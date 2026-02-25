import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { toast } from 'sonner';
import { Save, CheckCircle, Loader2, List, FileOutput, Printer, AlertCircle } from 'lucide-react';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import AppSidebar from '@/components/AppSidebar';
import PrestadorSection from '@/components/PrestadorSection';
import RegimeEParametrosSection, { type RegimeTributario } from '@/components/RegimeEParametrosSection';
import CTNSection from '@/components/CTNSection';
import CNAESection from '@/components/CNAESection';
import SimplesNacionalSection from '@/components/SimplesNacionalSection';
import ResumoTributario from '@/components/ResumoTributario';
import TomadorSection, { type TomadorData } from '@/components/TomadorSection';
import TomadoresLista from '@/components/TomadoresLista';
import TomadorEmissao, { INITIAL_TOMADOR as INITIAL_TOMADOR_EMISSAO, type TomadorEmissaoData } from '@/components/emissao/TomadorEmissao';
import PrestacaoServicoSection, { type PrestacaoServicoData } from '@/components/emissao/PrestacaoServicoSection';
import LocalPrestacaoSection, { type LocalPrestacaoData } from '@/components/emissao/LocalPrestacaoSection';
import ValoresTotaisSection from '@/components/emissao/ValoresTotaisSection';
import DANFSePrint from '@/components/emissao/DANFSePrint';
import { validateCNPJ, validateEmail } from '@/utils/validators';
import { usePrestador } from '@/hooks/usePrestador';
import { useTomadores } from '@/hooks/useTomadores';
import { useNotasFiscais } from '@/hooks/useNotasFiscais';
import { useSimplesNacional } from '@/hooks/useSimplesNacional';
import type { TomadorDB } from '@/hooks/useTomadores';

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

const INITIAL_PRESTACAO: PrestacaoServicoData = {
  codigoServico: '',
  descricaoServico: '',
  localPrestacao: '',
  valorServico: '',
  aliquota: '',
  baseCalculo: '',
  issRetido: false,
  desconto: '',
  retPis: '',
  retCofins: '',
  retCsll: '',
  retIr: '',
  retInss: '',
};

function parseCurrency(value: string): number {
  if (!value) return 0;
  return parseFloat(value.replace(/\./g, '').replace(',', '.')) || 0;
}

function parsePercent(value: string): number {
  if (!value) return 0;
  return parseFloat(value.replace(',', '.')) || 0;
}

const Index = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('prestador');
  const [unsavedPrestador, setUnsavedPrestador] = useState(false);
  
  const { prestador, setPrestador, config, setConfig, loading: loadingPrestador, saving: savingPrestador, salvarPrestador } = usePrestador();
  
  // --- Prestador state ---
  const [regime, setRegime] = useState<RegimeTributario>(null);
  const [informarAliquotaSN, setInformarAliquotaSN] = useState(false);
  const [aliquotaSN, setAliquotaSN] = useState('');
  const [regimeApuracaoSNParametro, setRegimeApuracaoSNParametro] = useState(false);
  const [configValida, setConfigValida] = useState(false);
  const [ctnSelecionado, setCtnSelecionado] = useState<string | null>(null);
  const [ctnDescricao, setCtnDescricao] = useState<string>('');
  const [ctnItem, setCtnItem] = useState<string>('');

  // --- Simples Nacional Anexo III ---
  const {
    cnaePrincipal: snCnaePrincipal,
    setCnaePrincipal: snSetCnaePrincipal,
    cnaeDescricao: snCnaeDescricao,
    cnaeAnexo: snCnaeAnexo,
    permiteFatorR: snPermiteFatorR,
    rbt12: snRbt12,
    setRbt12: snSetRbt12,
    calculo: snCalculo,
    alertas: snAlertas,
  } = useSimplesNacional(config.cnaePrincipal, config.rbt12);

  // --- Tomador state ---
  const [tomador, setTomador] = useState<TomadorData>(INITIAL_TOMADOR);
  const [editingTomadorId, setEditingTomadorId] = useState<string | null>(null);
  const [showTomadorForm, setShowTomadorForm] = useState(false);
  const { tomadores: tomadoresList, loading: loadingTomadores, salvarTomador, excluirTomador } = useTomadores(config.id);

  // --- Emissão (DANFSE) state ---
  const { salvarNota, saving: savingNota } = useNotasFiscais();
  const [tomadorEmissao, setTomadorEmissao] = useState<TomadorEmissaoData>(INITIAL_TOMADOR_EMISSAO);
  const [prestacao, setPrestacao] = useState<PrestacaoServicoData>(INITIAL_PRESTACAO);
  const [localPrestacao, setLocalPrestacao] = useState<LocalPrestacaoData>({ pais: 'Brasil', uf: 'AM', municipio: 'Manaus' });
  const [emissaoErrors, setEmissaoErrors] = useState<string[]>([]);
  const [tomadorSubstituto, setTomadorSubstituto] = useState(false);

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
    setActiveTab(tab);
  };

  // --- Prestador save ---
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
      cnaePrincipal: snCnaePrincipal,
      rbt12: snRbt12,
      simplesAnexo: snCnaeAnexo || 'III',
      simplesFaixa: snCalculo.faixa?.faixa || null,
      simplesAliquotaNominal: snCalculo.faixa?.aliquotaNominal || 0,
      simplesParcalaDeduzir: snCalculo.faixa?.parcelaDeduzir || 0,
      simplesAliquotaEfetiva: snCalculo.aliquotaEfetiva || 0,
    };

    const result = await salvarPrestador(prestador, cfg);
    if (result) setUnsavedPrestador(false);
  };

  // --- Tomador save ---
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

  // --- Emissão logic ---
  const handleTomadorSelecionado = useCallback((t: TomadorDB) => {
    const isSub = !!t.substituto_tributario;
    setTomadorSubstituto(isSub);
    if (isSub) {
      setPrestacao(prev => ({ ...prev, issRetido: true }));
    } else {
      setPrestacao(prev => ({ ...prev, issRetido: false, aliquota: config.optanteSimples ? '' : prev.aliquota }));
    }
  }, [config.optanteSimples]);

  const valores = useMemo(() => {
    const valorBruto = parseCurrency(prestacao.valorServico);
    const desconto = parseCurrency(prestacao.desconto);
    const aliquota = parsePercent(prestacao.aliquota);
    const baseCalculo = valorBruto - desconto;
    const issValor = baseCalculo * (aliquota / 100);
    return {
      valorBruto,
      desconto,
      baseCalculo,
      issValor,
      retPis: parseCurrency(prestacao.retPis),
      retCofins: parseCurrency(prestacao.retCofins),
      retCsll: parseCurrency(prestacao.retCsll),
      retIr: parseCurrency(prestacao.retIr),
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
    if (erros.length > 0) {
      toast.error('Corrija os erros antes de emitir a NFS-e.');
      return;
    }

    const tomadorId = await salvarTomador({
      prestador_id: config.id || null,
      cnpj_cpf: tomadorEmissao.cnpjCpf,
      nome_razao_social: tomadorEmissao.nomeRazaoSocial,
      nome_fantasia: '',
      inscricao_municipal: tomadorEmissao.inscricaoMunicipal,
      inscricao_estadual: '',
      suframa: '',
      substituto_tributario: false,
      cep: tomadorEmissao.cep,
      logradouro: tomadorEmissao.logradouro,
      numero: tomadorEmissao.numero,
      complemento: tomadorEmissao.complemento,
      bairro: tomadorEmissao.bairro,
      localidade_uf: tomadorEmissao.localidadeUf,
      email: tomadorEmissao.email,
      whatsapp: '',
      pais: tomadorEmissao.pais || 'Brasil',
    });

    await salvarNota({
      prestadorId: config.id || null,
      tomadorId: tomadorId || null,
      prestacao,
      localPrestacao,
      status: 'emitida',
    });
  };

  const autosaveEmissao = useCallback(() => {}, []);

  // --- Header config per tab ---
  const tabTitle = activeTab === 'prestador' ? 'O Prestador' : activeTab === 'tomador' ? 'Tomadores' : 'DANFSE';

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
              <h2 className="text-base font-semibold text-foreground">{tabTitle}</h2>
            </div>

            <div className="flex items-center gap-3">
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
                <button
                  onClick={handleSalvar}
                  disabled={savingPrestador}
                  className={`flex items-center gap-2 text-sm py-2 btn-primary ${
                    unsavedPrestador ? 'animate-bounce ring-2 ring-yellow-400 ring-offset-2' : ''
                  }`}
                >
                  {savingPrestador ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  <span className="hidden sm:inline">SALVAR</span>
                </button>
              )}

              {activeTab === 'tomador' && showTomadorForm && (
                <button
                  onClick={handleSalvarTomador}
                  className="flex items-center gap-2 text-sm py-2 btn-primary"
                >
                  <Save className="w-4 h-4" />
                  <span className="hidden sm:inline">{editingTomadorId ? 'Atualizar' : 'SALVAR'}</span>
                </button>
              )}

              {activeTab === 'emissao' && (
                <div className="flex items-center gap-2 flex-nowrap">
                  <button onClick={() => window.print()} className="btn-outline flex items-center gap-2 text-sm py-2 whitespace-nowrap">
                    <Printer className="w-4 h-4 shrink-0" />
                    <span>Visualizar</span>
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

                {regime === 'simples' && (
                  <CNAESection
                    cnpj={prestador.cnpj}
                    cnaeEscolhido={snCnaePrincipal || null}
                    onCnaeEscolhidoChange={(codigo, descricao) => {
                      snSetCnaePrincipal(codigo);
                      setUnsavedPrestador(true);
                    }}
                  />
                )}

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
                  <ResumoTributario
                    rbt12={snRbt12}
                    cnaeAnexo={snCnaeAnexo || 'III'}
                    calculo={snCalculo}
                    visible={snCalculo.valido}
                  />
                )}
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
                <PrestadorSection data={prestador} onChange={setPrestador} onAutosave={autosaveEmissao} optanteSimples={config.optanteSimples} compact />
                <TomadorEmissao data={tomadorEmissao} onChange={setTomadorEmissao} onTomadorSelecionado={handleTomadorSelecionado} prestadorId={config.id} />
                <LocalPrestacaoSection data={localPrestacao} onChange={setLocalPrestacao} />
                <PrestacaoServicoSection data={prestacao} onChange={handlePrestacaoChange} mostrarRetencoesFederais={true} favoritos={config.parametroMunicipal} optanteSimples={config.optanteSimples} tomadorSubstituto={tomadorSubstituto} />
                <ValoresTotaisSection
                  valorBruto={valores.valorBruto}
                  desconto={valores.desconto}
                  issValor={valores.issValor}
                  issRetido={prestacao.issRetido}
                  retPis={valores.retPis}
                  retCofins={valores.retCofins}
                  retCsll={valores.retCsll}
                  retIr={valores.retIr}
                  retInss={valores.retInss}
                />
              </>
            )}
          </main>
        </div>
      </div>

      {activeTab === 'emissao' && (
        <DANFSePrint
          data={{
            prestador: {
              cnpj: prestador.cnpj,
              inscricaoMunicipal: prestador.inscricaoMunicipal,
              nomeEmpresarial: prestador.nomeEmpresarial,
              nomeFantasia: prestador.nomeFantasia,
            },
            tomador: {
              cnpjCpf: tomadorEmissao.cnpjCpf,
              nomeRazaoSocial: tomadorEmissao.nomeRazaoSocial,
              inscricaoMunicipal: tomadorEmissao.inscricaoMunicipal,
              email: tomadorEmissao.email,
              logradouro: tomadorEmissao.logradouro,
              numero: tomadorEmissao.numero,
              complemento: tomadorEmissao.complemento,
              bairro: tomadorEmissao.bairro,
              localidadeUf: tomadorEmissao.localidadeUf,
              cep: tomadorEmissao.cep,
            },
            localPrestacao,
            servico: {
              codigoServico: prestacao.codigoServico,
              descricaoServico: prestacao.descricaoServico,
              valorServico: prestacao.valorServico,
              aliquota: prestacao.aliquota,
              baseCalculo: prestacao.baseCalculo,
              desconto: prestacao.desconto,
              issRetido: prestacao.issRetido,
            },
            valores,
          }}
        />
      )}
    </SidebarProvider>
  );
};

export default Index;
