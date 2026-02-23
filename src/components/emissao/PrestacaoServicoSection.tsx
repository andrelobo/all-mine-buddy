import React, { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import { Briefcase, Percent, ChevronDown, Search, MapPin } from 'lucide-react';
import { searchCTN, getCTNByCode } from '@/utils/ctn-data';

export interface PrestacaoServicoData {
  codigoServico: string;
  descricaoServico: string;
  localPrestacao: string;
  valorServico: string;
  aliquota: string;
  baseCalculo: string;
  issRetido: boolean;
  desconto: string;
  retPis: string;
  retCofins: string;
  retCsll: string;
  retIr: string;
  retInss: string;
}

interface FavoritoItem {
  codigo: string;
  cnaeDescricao: string;
  lc116Item: string;
  vinculos: { ctn?: string; ctnDescricao?: string; nbs?: string; nbsDescricao?: string }[];
}

interface Props {
  data: PrestacaoServicoData;
  onChange: (data: PrestacaoServicoData) => void;
  mostrarRetencoesFederais: boolean;
  favoritos?: FavoritoItem[];
}

function formatCurrency(value: string): string {
  const digits = value.replace(/\D/g, '');
  if (!digits) return '';
  const num = parseInt(digits, 10) / 100;
  return num.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function formatPercent(value: string): string {
  let v = value.replace(/[^\d]/g, '').slice(0, 4);
  if (v.length > 2) v = v.slice(0, -2) + ',' + v.slice(-2);
  return v;
}

function formatCTNDisplay(codigo: string) {
  if (codigo.length === 6) {
    return `${codigo.slice(0, 2)}.${codigo.slice(2, 4)}.${codigo.slice(4, 6)}`;
  }
  return codigo;
}

const UF_LIST = [
  'AC','AL','AM','AP','BA','CE','DF','ES','GO','MA','MG','MS','MT','PA',
  'PB','PE','PI','PR','RJ','RN','RO','RR','RS','SC','SE','SP','TO'
];

interface Municipio {
  nome: string;
}

const PrestacaoServicoSection: React.FC<Props> = ({ data, onChange, mostrarRetencoesFederais, favoritos = [] }) => {
  const update = (field: keyof PrestacaoServicoData, value: string | boolean) => {
    onChange({ ...data, [field]: value });
  };

  // CTN search state
  const [ctnQuery, setCtnQuery] = useState('');
  const [showCtnDropdown, setShowCtnDropdown] = useState(false);
  const [ctnDescricaoSelecionada, setCtnDescricaoSelecionada] = useState('');
  const ctnDropdownRef = useRef<HTMLDivElement>(null);

  // Favoritos dropdown state
  const [showFavoritosDropdown, setShowFavoritosDropdown] = useState(false);
  const [favoritosQuery, setFavoritosQuery] = useState('');
  const favoritosDropdownRef = useRef<HTMLDivElement>(null);

  const filteredFavoritos = useMemo(() => {
    if (!favoritosQuery.trim()) return favoritos;
    const q = favoritosQuery.toLowerCase();
    return favoritos.filter(f =>
      f.cnaeDescricao.toLowerCase().includes(q) ||
      f.codigo.includes(q) ||
      f.vinculos.some(v => v.ctnDescricao?.toLowerCase().includes(q) || v.ctn?.includes(q))
    );
  }, [favoritos, favoritosQuery]);

  const handleSelectFavorito = (fav: FavoritoItem) => {
    const primeiroVinculo = fav.vinculos[0];
    if (primeiroVinculo?.ctn) {
      const entry = getCTNByCode(primeiroVinculo.ctn);
      onChange({
        ...data,
        codigoServico: primeiroVinculo.ctn,
        descricaoServico: data.descricaoServico || primeiroVinculo.ctnDescricao || entry?.descricao || '',
      });
      setCtnDescricaoSelecionada(primeiroVinculo.ctnDescricao || entry?.descricao || '');
    }
    setShowFavoritosDropdown(false);
    setFavoritosQuery('');
  };

  // Local prestação state
  const [ufSelecionada, setUfSelecionada] = useState('');
  const [municipios, setMunicipios] = useState<Municipio[]>([]);
  const [municipioQuery, setMunicipioQuery] = useState('');
  const [showLocalDropdown, setShowLocalDropdown] = useState(false);
  const [loadingMunicipios, setLoadingMunicipios] = useState(false);
  const localDropdownRef = useRef<HTMLDivElement>(null);

  const ctnResults = useMemo(() => {
    return searchCTN(ctnQuery.trim(), 30);
  }, [ctnQuery]);

  // Fetch municipios when UF changes
  useEffect(() => {
    if (!ufSelecionada) {
      setMunicipios([]);
      return;
    }
    setLoadingMunicipios(true);
    fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${ufSelecionada}/municipios?orderBy=nome`)
      .then(res => res.json())
      .then((data: Municipio[]) => {
        setMunicipios(data);
        setLoadingMunicipios(false);
      })
      .catch(() => setLoadingMunicipios(false));
  }, [ufSelecionada]);

  const filteredMunicipios = useMemo(() => {
    if (!municipioQuery.trim()) return municipios;
    const q = municipioQuery.toLowerCase();
    return municipios.filter(m => m.nome.toLowerCase().includes(q));
  }, [municipios, municipioQuery]);

  // Parse existing localPrestacao to init UF
  useEffect(() => {
    if (data.localPrestacao && !ufSelecionada) {
      const parts = data.localPrestacao.split(' - ');
      if (parts.length === 2 && UF_LIST.includes(parts[1])) {
        setUfSelecionada(parts[1]);
      }
    }
  }, [data.localPrestacao]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ctnDropdownRef.current && !ctnDropdownRef.current.contains(e.target as Node)) {
        setShowCtnDropdown(false);
      }
      if (favoritosDropdownRef.current && !favoritosDropdownRef.current.contains(e.target as Node)) {
        setShowFavoritosDropdown(false);
      }
      if (localDropdownRef.current && !localDropdownRef.current.contains(e.target as Node)) {
        setShowLocalDropdown(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // If codigoServico is set externally, resolve description
  useEffect(() => {
    if (data.codigoServico && !ctnDescricaoSelecionada) {
      const entry = getCTNByCode(data.codigoServico);
      if (entry) setCtnDescricaoSelecionada(entry.descricao);
    }
  }, [data.codigoServico]);

  const handleSelectCTN = (codigo: string, descricao: string) => {
    update('codigoServico', codigo);
    setCtnDescricaoSelecionada(descricao);
    setCtnQuery('');
    setShowCtnDropdown(false);
  };

  const handleSelectMunicipio = (nome: string) => {
    update('localPrestacao', `${nome} - ${ufSelecionada}`);
    setMunicipioQuery('');
    setShowLocalDropdown(false);
  };

  return (
    <div className="section-card">
      <h2 className="section-title">
        <Briefcase className="w-5 h-5 text-primary" />
        Serviço Prestado
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Serviços Favoritos */}
        <div ref={favoritosDropdownRef} className="relative">
          <label className="field-label">Serviços Favoritos</label>
          <div className="relative">
            <input
              className="field-input pr-8"
              placeholder={favoritos.length > 0 ? `Buscar entre ${favoritos.length} serviço(s)...` : 'Nenhum serviço cadastrado'}
              value={showFavoritosDropdown ? favoritosQuery : ''}
              onChange={(e) => { setFavoritosQuery(e.target.value); setShowFavoritosDropdown(true); }}
              onFocus={() => { setFavoritosQuery(''); setShowFavoritosDropdown(true); }}
              readOnly={favoritos.length === 0}
            />
            <button
              type="button"
              onClick={() => { if (favoritos.length > 0) { setFavoritosQuery(''); setShowFavoritosDropdown(v => !v); } }}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <ChevronDown className="w-3.5 h-3.5" />
            </button>
          </div>
          {showFavoritosDropdown && filteredFavoritos.length > 0 && (
            <div className="absolute z-30 top-full mt-1 w-full md:w-[450px] max-h-52 overflow-y-auto rounded-lg border border-border bg-card shadow-lg">
              {filteredFavoritos.map((fav, idx) => (
                <button
                  key={fav.codigo}
                  type="button"
                  onClick={() => handleSelectFavorito(fav)}
                  className="w-full text-left px-3 py-2 border-b border-border/50 last:border-b-0 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-muted-foreground shrink-0">{idx + 1}.</span>
                    <span className="font-mono text-xs font-semibold text-primary">{fav.codigo.replace(/(\d{4})(\d)(\d{2})/, '$1-$2/$3')}</span>
                    <span className="text-xs text-foreground/90 truncate">{fav.cnaeDescricao}</span>
                  </div>
                  {fav.vinculos.length > 0 && fav.vinculos[0].ctn && (
                    <p className="text-xs text-muted-foreground mt-0.5 ml-5">
                      CTN {formatCTNDisplay(fav.vinculos[0].ctn)} — {fav.vinculos[0].ctnDescricao?.replace(/[.\s]+$/, '')}
                    </p>
                  )}
                </button>
              ))}
            </div>
          )}
          {showFavoritosDropdown && favoritosQuery.trim() && filteredFavoritos.length === 0 && (
            <div className="absolute z-30 top-full mt-1 w-full rounded-lg border border-border bg-card shadow-lg p-3">
              <p className="text-xs text-muted-foreground text-center">Nenhum favorito encontrado</p>
            </div>
          )}
        </div>
        <div ref={ctnDropdownRef} className="relative">
          <label className="field-label">Código Tributação Nacional*</label>
          <div className="relative">
            <input
              className="field-input pr-8"
              placeholder="Buscar código ou descrição..."
              value={showCtnDropdown ? ctnQuery : (data.codigoServico ? formatCTNDisplay(data.codigoServico) : '')}
              onChange={(e) => {
                setCtnQuery(e.target.value);
                setShowCtnDropdown(true);
              }}
              onFocus={() => { setCtnQuery(''); setShowCtnDropdown(true); }}
            />
            <button
              type="button"
              onClick={() => { if (!showCtnDropdown) setCtnQuery(''); setShowCtnDropdown(v => !v); }}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <ChevronDown className="w-3.5 h-3.5" />
            </button>
          </div>
          {ctnDescricaoSelecionada && !showCtnDropdown && (
            <p className="text-xs text-muted-foreground mt-1 leading-snug line-clamp-2">{ctnDescricaoSelecionada}</p>
          )}
          {showCtnDropdown && ctnResults.length > 0 && (
            <div className="absolute z-30 top-full mt-1 w-full md:w-[400px] max-h-48 overflow-y-auto rounded-lg border border-border bg-card shadow-lg">
              {ctnResults.map(entry => (
                <button
                  key={entry.codigo}
                  type="button"
                  title={`${formatCTNDisplay(entry.codigo)} (${entry.itemFormatado}) — ${entry.descricao}`}
                  onClick={() => handleSelectCTN(entry.codigo, entry.descricao)}
                  className={`w-full text-left px-3 py-2 border-b border-border/50 last:border-b-0 hover:bg-muted/50 transition-colors ${data.codigoServico === entry.codigo ? 'bg-primary/10' : ''}`}
                >
                  <span className="font-mono text-xs font-semibold text-primary">{formatCTNDisplay(entry.codigo)}</span>
                  <span className="text-xs text-muted-foreground ml-1.5">({entry.itemFormatado})</span>
                  <p className="text-xs text-foreground/70 line-clamp-1">{entry.descricao}</p>
                </button>
              ))}
            </div>
          )}
          {showCtnDropdown && ctnQuery.trim() && ctnResults.length === 0 && (
            <div className="absolute z-30 top-full mt-1 w-full md:w-[400px] rounded-lg border border-border bg-card shadow-lg p-3">
              <p className="text-xs text-muted-foreground text-center">Nenhum resultado encontrado</p>
            </div>
          )}
        </div>
      </div>

      <div className="mt-4">
        <label className="field-label">Descrição do Serviço*</label>
        <textarea
          className="field-input min-h-[80px] resize-y"
          placeholder="Descreva o serviço prestado conforme a NFS-e..."
          value={data.descricaoServico}
          onChange={(e) => update('descricaoServico', e.target.value)}
        />
      </div>



      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
        <div>
          <label className="field-label">Valor do Serviço* (R$)</label>
          <input
            className="field-input text-right"
            placeholder="0,00"
            value={data.valorServico}
            onChange={(e) => update('valorServico', formatCurrency(e.target.value))}
          />
        </div>
        <div>
          <label className="field-label flex items-center gap-1">
            <Percent className="w-3.5 h-3.5" />Alíquota (%)*
          </label>
          <input
            className="field-input text-right"
            placeholder="0,00"
            value={data.aliquota}
            onChange={(e) => update('aliquota', formatPercent(e.target.value))}
            maxLength={5}
          />
        </div>
        <div>
          <label className="field-label">Base de Cálculo (R$)</label>
          <input
            className="field-input text-right bg-muted/30"
            placeholder="0,00"
            value={data.baseCalculo}
            readOnly
          />
        </div>
        <div>
          <label className="field-label">Desconto (R$)</label>
          <input
            className="field-input text-right"
            placeholder="0,00"
            value={data.desconto}
            onChange={(e) => update('desconto', formatCurrency(e.target.value))}
          />
        </div>
      </div>

      {/* ISS Retido */}
      <div className="mt-4 flex items-center gap-3">
        <label className="flex items-center gap-3 cursor-pointer select-none">
          <button
            type="button"
            role="switch"
            aria-checked={data.issRetido}
            onClick={() => update('issRetido', !data.issRetido)}
            className={`switch-track ${data.issRetido ? 'switch-track-on' : 'switch-track-off'}`}
          >
            <span className={`switch-thumb ${data.issRetido ? 'translate-x-4' : 'translate-x-0'}`} />
          </button>
          <span className="text-sm text-foreground font-medium">ISS Retido</span>
        </label>
      </div>

      {/* Retenções Federais */}
      {mostrarRetencoesFederais && (
        <div className="mt-5 pt-5 border-t border-border">
          <label className="field-label flex items-center gap-1 mb-4">
            <Percent className="w-3.5 h-3.5" />
            Retenções Federais
          </label>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {([
              ['retPis', 'PIS'],
              ['retCofins', 'COFINS'],
              ['retCsll', 'CSLL'],
              ['retIr', 'IR'],
              ['retInss', 'INSS'],
            ] as [keyof PrestacaoServicoData, string][]).map(([field, label]) => (
              <div key={field}>
                <label className="field-label">{label} (R$)</label>
                <input
                  className="field-input text-right"
                  placeholder="0,00"
                  value={data[field] as string}
                  onChange={(e) => update(field, formatCurrency(e.target.value))}
                />
              </div>
            ))}
          </div>
        </div>
      )}



    </div>
  );
};

export default PrestacaoServicoSection;
