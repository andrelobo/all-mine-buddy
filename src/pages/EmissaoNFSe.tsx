import React, { useState, useMemo, useCallback } from 'react';
import { Shield, Send, Save, ArrowLeft, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import PrestadorSection from '@/components/PrestadorSection';
import TomadorEmissao, { INITIAL_TOMADOR, type TomadorEmissaoData } from '@/components/emissao/TomadorEmissao';
import PrestacaoServicoSection, { type PrestacaoServicoData } from '@/components/emissao/PrestacaoServicoSection';
import ValoresTotaisSection from '@/components/emissao/ValoresTotaisSection';
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

  // Estado do Prestador (mesmos campos da aba "O Prestador")
  const [prestador, setPrestador] = useState(INITIAL_PRESTADOR);


  // Estado do Tomador
  const [tomador, setTomador] = useState<TomadorEmissaoData>(INITIAL_TOMADOR);

  // Estado da Prestação do Serviço
  const [prestacao, setPrestacao] = useState<PrestacaoServicoData>(INITIAL_PRESTACAO);
  const [errors, setErrors] = useState<string[]>([]);

  const autosave = useCallback(() => {
    // placeholder para persistência futura
  }, []);




  // Cálculos automáticos
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

  const handleEmitir = () => {
    const erros = validar();
    setErrors(erros);
    if (erros.length > 0) {
      toast.error('Corrija os erros antes de emitir a NFS-e.');
      return;
    }
    toast.success('NFS-e preparada para emissão! (Integração futura)');
  };

  const handleSalvarRascunho = () => {
    toast.info('Rascunho salvo! (Persistência futura)');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/')}
              className="p-2 rounded-lg hover:bg-muted transition-colors"
            >
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
            <button onClick={handleSalvarRascunho} className="btn-outline flex items-center gap-2 text-sm py-2">
              <Save className="w-4 h-4" />
              <span className="hidden sm:inline">Rascunho</span>
            </button>
            <button onClick={handleEmitir} className="btn-primary flex items-center gap-2 text-sm py-2">
              <Send className="w-4 h-4" />
              <span className="hidden sm:inline">Emitir NFS-e</span>
            </button>
          </div>
        </div>
      </header>

      {/* Erros de validação */}
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

      {/* Conteúdo */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-3">
        {/* Seção Prestador - mesmos componentes da aba "O Prestador" */}
        <PrestadorSection
          data={prestador}
          onChange={setPrestador}
          onAutosave={autosave}
          
        />



        {/* Seção Tomador */}
        <TomadorEmissao data={tomador} onChange={setTomador} />

        {/* Seção Prestação do Serviço */}
        <PrestacaoServicoSection
          data={prestacao}
          onChange={handlePrestacaoChange}
          mostrarRetencoesFederais={true}
        />

        {/* Seção Valores e Totais */}
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
    </div>
  );
};

export default EmissaoNFSe;
