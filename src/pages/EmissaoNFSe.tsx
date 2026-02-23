import React, { useState, useMemo, useCallback } from 'react';
import { Shield, Send, Save, ArrowLeft, AlertCircle, Printer, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import PrestadorSection from '@/components/PrestadorSection';
import TomadorEmissao, { INITIAL_TOMADOR, type TomadorEmissaoData } from '@/components/emissao/TomadorEmissao';
import PrestacaoServicoSection, { type PrestacaoServicoData } from '@/components/emissao/PrestacaoServicoSection';
import LocalPrestacaoSection, { type LocalPrestacaoData } from '@/components/emissao/LocalPrestacaoSection';
import ValoresTotaisSection from '@/components/emissao/ValoresTotaisSection';
import DANFSePrint from '@/components/emissao/DANFSePrint';
import { validateCNPJ, validateEmail } from '@/utils/validators';
import { usePrestador } from '@/hooks/usePrestador';
import { useNotasFiscais } from '@/hooks/useNotasFiscais';
import { useTomadores } from '@/hooks/useTomadores';

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

const EmissaoNFSe: React.FC = () => {
  const navigate = useNavigate();
  const { prestador, setPrestador, config, loading: loadingPrestador } = usePrestador();
  const { salvarNota, saving: savingNota } = useNotasFiscais();
  const { salvarTomador } = useTomadores(config.id);

  const [tomador, setTomador] = useState<TomadorEmissaoData>(INITIAL_TOMADOR);
  const [prestacao, setPrestacao] = useState<PrestacaoServicoData>(INITIAL_PRESTACAO);
  const [localPrestacao, setLocalPrestacao] = useState<LocalPrestacaoData>({ pais: 'Brasil', uf: 'AM', municipio: 'Manaus' });
  const [errors, setErrors] = useState<string[]>([]);

  const autosave = useCallback(() => {}, []);

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

  const validar = (): string[] => {
    const erros: string[] = [];
    if (!validateCNPJ(prestador.cnpj)) erros.push('CNPJ do prestador é obrigatório/inválido.');
    if (!tomador.cnpjCpf) erros.push('CPF/CNPJ do tomador é obrigatório.');
    if (!tomador.nomeRazaoSocial) erros.push('Nome/Razão Social do tomador é obrigatório.');
    if (!tomador.email) erros.push('E-mail do tomador é obrigatório.');
    if (!tomador.localidadeUf) erros.push('Município do tomador é obrigatório.');
    if (!prestacao.codigoServico) erros.push('Código do serviço é obrigatório.');
    if (!prestacao.descricaoServico) erros.push('Descrição do serviço é obrigatória.');
    if (!prestacao.valorServico || parseCurrency(prestacao.valorServico) <= 0) erros.push('Valor do serviço deve ser maior que zero.');
    if (!prestacao.aliquota) erros.push('Alíquota é obrigatória.');
    return erros;
  };

  const handleEmitir = async () => {
    const erros = validar();
    setErrors(erros);
    if (erros.length > 0) {
      toast.error('Corrija os erros antes de emitir a NFS-e.');
      return;
    }

    // Save tomador first
    const tomadorId = await salvarTomador({
      prestador_id: config.id || null,
      cnpj_cpf: tomador.cnpjCpf,
      nome_razao_social: tomador.nomeRazaoSocial,
      nome_fantasia: '',
      inscricao_municipal: tomador.inscricaoMunicipal,
      inscricao_estadual: '',
      suframa: '',
      substituto_tributario: false,
      cep: tomador.cep,
      logradouro: tomador.logradouro,
      numero: tomador.numero,
      complemento: tomador.complemento,
      bairro: tomador.bairro,
      localidade_uf: tomador.localidadeUf,
      email: tomador.email,
      whatsapp: '',
      pais: tomador.pais || 'Brasil',
    });

    // Save nota fiscal
    await salvarNota({
      prestadorId: config.id || null,
      tomadorId: tomadorId || null,
      prestacao,
      localPrestacao,
      status: 'emitida',
    });
  };

  const handleSalvarRascunho = async () => {
    await salvarNota({
      prestadorId: config.id || null,
      tomadorId: null,
      prestacao,
      localPrestacao,
      status: 'rascunho',
    });
  };

  if (loadingPrestador) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card border-b border-border sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate('/')} className="p-2 rounded-lg hover:bg-muted transition-colors">
              <ArrowLeft className="w-5 h-5 text-muted-foreground" />
            </button>
            <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center">
              <Shield className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-foreground tracking-tight">DANFSE</h1>
              <p className="text-xs text-muted-foreground">Nota Fiscal de Serviços Eletrônica</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button onClick={() => window.print()} className="btn-outline flex items-center gap-2 text-sm py-2">
              <Printer className="w-4 h-4" />
              <span className="hidden sm:inline">Imprimir</span>
            </button>
            <button onClick={handleEmitir} disabled={savingNota} className="btn-primary flex items-center gap-2 text-sm py-2">
              {savingNota ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              <span className="hidden sm:inline">Emitir NFS-e</span>
            </button>
          </div>
        </div>
      </header>

      {errors.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-4">
          <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20">
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle className="w-4 h-4 text-destructive" />
              <span className="text-sm font-medium text-destructive">Corrija os seguintes erros:</span>
            </div>
            <ul className="list-disc list-inside text-sm text-destructive/80 space-y-1">
              {errors.map((e, i) => <li key={i}>{e}</li>)}
            </ul>
          </div>
        </div>
      )}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-3">
        <PrestadorSection data={prestador} onChange={setPrestador} onAutosave={autosave} optanteSimples={config.optanteSimples} compact />
        <TomadorEmissao data={tomador} onChange={setTomador} prestadorId={config.id} />
        <LocalPrestacaoSection data={localPrestacao} onChange={setLocalPrestacao} />
        <PrestacaoServicoSection data={prestacao} onChange={handlePrestacaoChange} mostrarRetencoesFederais={true} favoritos={config.parametroMunicipal} />
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
      </main>

      <DANFSePrint
        data={{
          prestador: {
            cnpj: prestador.cnpj,
            inscricaoMunicipal: prestador.inscricaoMunicipal,
            nomeEmpresarial: prestador.nomeEmpresarial,
            nomeFantasia: prestador.nomeFantasia,
          },
          tomador: {
            cnpjCpf: tomador.cnpjCpf,
            nomeRazaoSocial: tomador.nomeRazaoSocial,
            inscricaoMunicipal: tomador.inscricaoMunicipal,
            email: tomador.email,
            logradouro: tomador.logradouro,
            numero: tomador.numero,
            complemento: tomador.complemento,
            bairro: tomador.bairro,
            localidadeUf: tomador.localidadeUf,
            cep: tomador.cep,
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
    </div>
  );
};

export default EmissaoNFSe;
