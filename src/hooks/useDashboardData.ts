import { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { calcularSimplesAnexoIII, formatCurrency, formatPercent } from '@/utils/simples-nacional';

export interface NotaDashboard {
  id: string;
  tomador_id: string | null;
  valor_servico: number;
  desconto: number;
  base_calculo: number;
  iss_valor: number;
  iss_retido: boolean;
  valor_liquido: number;
  ret_pis: number;
  ret_cofins: number;
  ret_csll: number;
  ret_ir: number;
  ret_inss: number;
  aliquota: number;
  data_emissao: string;
  status: string;
}

export interface SplitPaymentRow {
  id: string;
  nota_fiscal_id: string;
  valor_bruto: number;
  valor_reservado: number;
  valor_liberado: number;
  status: string;
  mes_referencia: string;
}

export interface ClienteAnalise {
  tomadorId: string;
  nome: string;
  faturamento: number;
  quantidadeNf: number;
  ticketMedio: number;
  percentual: number;
  classificacao: 'A' | 'B' | 'C';
}

export interface MesData {
  mes: string;
  label: string;
  faturamento: number;
  tributoEstimado: number;
  issRetido: number;
  qtdNotas: number;
}

export function useDashboardData(prestadorId: string | null, rbt12: number, cnaeAnexo: string) {
  const [notas, setNotas] = useState<NotaDashboard[]>([]);
  const [splits, setSplits] = useState<SplitPaymentRow[]>([]);
  const [tomadores, setTomadores] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!prestadorId) { setLoading(false); return; }
    const fetchAll = async () => {
      setLoading(true);
      const [notasRes, splitsRes, tomadoresRes] = await Promise.all([
        supabase.from('notas_fiscais').select('*').eq('prestador_id', prestadorId).order('data_emissao', { ascending: true }),
        supabase.from('split_payment').select('*').eq('prestador_id', prestadorId),
        supabase.from('tomadores').select('id, nome_razao_social').eq('prestador_id', prestadorId),
      ]);
      if (notasRes.data) setNotas(notasRes.data as NotaDashboard[]);
      if (splitsRes.data) setSplits(splitsRes.data as SplitPaymentRow[]);
      if (tomadoresRes.data) {
        const map: Record<string, string> = {};
        tomadoresRes.data.forEach((t: any) => { map[t.id] = t.nome_razao_social; });
        setTomadores(map);
      }
      setLoading(false);
    };
    fetchAll();
  }, [prestadorId]);

  const calculo = useMemo(() => calcularSimplesAnexoIII(rbt12, cnaeAnexo || 'III'), [rbt12, cnaeAnexo]);

  // Monthly aggregation
  const dadosMensais = useMemo<MesData[]>(() => {
    const map = new Map<string, MesData>();
    notas.forEach(n => {
      const d = new Date(n.data_emissao);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      const label = `${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
      if (!map.has(key)) map.set(key, { mes: key, label, faturamento: 0, tributoEstimado: 0, issRetido: 0, qtdNotas: 0 });
      const m = map.get(key)!;
      m.faturamento += n.valor_servico;
      m.tributoEstimado += n.valor_servico * (calculo.aliquotaEfetiva || 0);
      m.issRetido += n.iss_retido ? n.iss_valor : 0;
      m.qtdNotas += 1;
    });
    return Array.from(map.values()).sort((a, b) => a.mes.localeCompare(b.mes));
  }, [notas, calculo.aliquotaEfetiva]);

  // KPIs
  const kpis = useMemo(() => {
    const now = new Date();
    const mesAtual = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    const notasMes = notas.filter(n => {
      const d = new Date(n.data_emissao);
      return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}` === mesAtual;
    });

    const faturamentoMes = notasMes.reduce((s, n) => s + n.valor_servico, 0);
    const totalNotas = notas.length;
    const totalNotasMes = notasMes.length;
    const issRetidoMes = notasMes.filter(n => n.iss_retido).reduce((s, n) => s + n.iss_valor, 0);
    const dasEstimado = faturamentoMes * (calculo.aliquotaEfetiva || 0);
    const totalRetencoes = notasMes.reduce((s, n) => s + n.ret_pis + n.ret_cofins + n.ret_csll + n.ret_ir + n.ret_inss, 0);
    const valorLiquidoMes = notasMes.reduce((s, n) => s + n.valor_liquido, 0);
    const totalReservado = splits.filter(s => s.mes_referencia === mesAtual).reduce((s, sp) => s + sp.valor_reservado, 0);
    const margemLiquida = faturamentoMes > 0 ? ((valorLiquidoMes - dasEstimado) / faturamentoMes) * 100 : 0;

    return {
      faturamentoMes, rbt12, totalNotas, totalNotasMes, dasEstimado, issRetidoMes,
      valorLiquidoMes, totalReservado, aliquotaEfetiva: calculo.aliquotaEfetiva,
      margemLiquida, totalRetencoes,
    };
  }, [notas, splits, calculo, rbt12]);

  // Client analysis (Curva ABC)
  const analiseClientes = useMemo<ClienteAnalise[]>(() => {
    const map = new Map<string, { faturamento: number; qtd: number }>();
    notas.forEach(n => {
      const tid = n.tomador_id || 'sem-tomador';
      if (!map.has(tid)) map.set(tid, { faturamento: 0, qtd: 0 });
      const c = map.get(tid)!;
      c.faturamento += n.valor_servico;
      c.qtd += 1;
    });
    const totalFat = Array.from(map.values()).reduce((s, c) => s + c.faturamento, 0);
    const sorted = Array.from(map.entries())
      .map(([tid, c]) => ({
        tomadorId: tid,
        nome: tomadores[tid] || 'Cliente sem nome',
        faturamento: c.faturamento,
        quantidadeNf: c.qtd,
        ticketMedio: c.qtd > 0 ? c.faturamento / c.qtd : 0,
        percentual: totalFat > 0 ? (c.faturamento / totalFat) * 100 : 0,
        classificacao: 'C' as 'A' | 'B' | 'C',
      }))
      .sort((a, b) => b.faturamento - a.faturamento);

    let acum = 0;
    sorted.forEach(c => {
      acum += c.percentual;
      if (acum <= 80) c.classificacao = 'A';
      else if (acum <= 95) c.classificacao = 'B';
      else c.classificacao = 'C';
    });
    return sorted;
  }, [notas, tomadores]);

  // Alerts
  const alertas = useMemo(() => {
    const list: { tipo: 'warning' | 'danger' | 'info'; mensagem: string }[] = [];
    if (kpis.margemLiquida < 20 && kpis.faturamentoMes > 0) {
      list.push({ tipo: 'danger', mensagem: `Margem líquida de ${kpis.margemLiquida.toFixed(1)}% está abaixo de 20%.` });
    }
    const clienteConcentrado = analiseClientes.find(c => c.percentual > 40);
    if (clienteConcentrado) {
      list.push({ tipo: 'warning', mensagem: `${clienteConcentrado.nome} concentra ${clienteConcentrado.percentual.toFixed(1)}% da receita.` });
    }
    return list;
  }, [calculo, rbt12, kpis, analiseClientes]);

  // Cash flow
  const fluxoCaixa = useMemo(() => {
    const operacional = kpis.valorLiquidoMes;
    const tributario = kpis.dasEstimado + kpis.issRetidoMes;
    return { operacional, tributario, saldo: operacional - tributario };
  }, [kpis]);

  return { loading, notas, splits, kpis, calculo, dadosMensais, analiseClientes, alertas, fluxoCaixa };
}
