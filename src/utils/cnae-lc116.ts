/**
 * Mapeamento entre códigos CNAE e itens da Lista de Serviços
 * anexa à Lei Complementar nº 116, de 31 de julho de 2003.
 *
 * - item: código do item da lista de serviços (LC 116/2003)
 * - descricao: descrição do serviço conforme LC 116/2003
 * - ctn: Código de Tributação Nacional — 6 dígitos
 *         Fonte: TabCtneNbs.xlsx — tabela oficial do governo federal (ABRASF/SPED)
 *         Formato: IISSDD onde II=item, SS=subitem, DD=desdobro (ex: "010101")
 * - nbs: Nomenclatura Brasileira de Serviços — opcional, apenas quando disponível em fonte oficial
 */

export interface LC116Item {
  item: string;
  descricao: string;
  ctn?: string;   // 6 dígitos — padrão governo federal (ex: "010101")
  nbs?: string;   // Opcional — apenas quando disponível em fonte oficial
}

// Mapeamento item LC 116 → CTN (6 dígitos — fonte: TabCtneNbs.xlsx do governo federal)
// O CTN de 6 dígitos segue o padrão: IISSDD (item, subitem, desdobro nacional)
// Cada item mapeia para o primeiro CTN oficial (desdobro 01 do subitem 01)
const LC116_CTN: Record<string, string> = {
  // Grupo 01 — Serviços de Informática e congêneres
  '1.01': '010101',
  '1.02': '010201',
  '1.03': '010301',
  '1.04': '010401',
  '1.05': '010501',
  '1.06': '010601',
  '1.07': '010701',
  '1.08': '010801',
  '1.09': '010901',
  // Grupo 02 — Pesquisas e desenvolvimento
  '2.01': '020101',
  // Grupo 03 — Locação, cessão de direito de uso e congêneres
  '3.02': '030201',
  '3.03': '030301',
  '3.04': '030401',
  '3.05': '030501',
  // Grupo 04 — Saúde, assistência médica e congêneres
  '4.01': '040101',
  '4.02': '040201',
  '4.03': '040301',
  '4.04': '040401',
  '4.05': '040501',
  '4.06': '040601',
  '4.07': '040701',
  '4.08': '040801',
  '4.09': '040901',
  '4.10': '041001',
  '4.11': '041101',
  '4.12': '041201',
  '4.13': '041301',
  '4.14': '041401',
  '4.15': '041501',
  '4.16': '041601',
  '4.17': '041701',
  '4.18': '041801',
  '4.19': '041901',
  '4.20': '042001',
  '4.21': '042101',
  '4.22': '042201',
  '4.23': '042301',
  // Grupo 05 — Medicina e assistência veterinária
  '5.01': '050101',
  '5.02': '050201',
  '5.03': '050301',
  '5.04': '050401',
  '5.05': '050501',
  '5.06': '050601',
  '5.07': '050701',
  '5.08': '050801',
  '5.09': '050901',
  // Grupo 06 — Cuidados pessoais, estética, atividades físicas
  '6.01': '060101',
  '6.02': '060201',
  '6.03': '060301',
  '6.04': '060401',
  '6.05': '060501',
  '6.06': '060601',
  // Grupo 07 — Engenharia, arquitetura, construção civil
  '7.01': '070101',
  '7.02': '070201',
  '7.03': '070301',
  '7.04': '070401',
  '7.05': '070501',
  '7.06': '070601',
  '7.07': '070701',
  '7.08': '070801',
  '7.09': '070901',
  '7.10': '071001',
  '7.11': '071101',
  '7.12': '071201',
  '7.13': '071301',
  '7.16': '071601',
  '7.17': '071701',
  '7.18': '071801',
  '7.19': '071901',
  '7.20': '072001',
  '7.21': '072101',
  '7.22': '072201',
  // Grupo 08 — Educação, ensino, instrução
  '8.01': '080101',
  '8.02': '080201',
  // Grupo 09 — Hospedagem, turismo, viagens
  '9.01': '090101',
  '9.02': '090201',
  '9.03': '090301',
  // Grupo 10 — Intermediação e congêneres
  '10.01': '100101',
  '10.02': '100201',
  '10.03': '100301',
  '10.04': '100401',
  '10.05': '100501',
  '10.06': '100601',
  '10.07': '100701',
  '10.08': '100801',
  '10.09': '100901',
  '10.10': '101001',
  // Grupo 11 — Guarda, estacionamento, vigilância
  '11.01': '110101',
  '11.02': '110201',
  '11.03': '110301',
  '11.04': '110401',
  // Grupo 12 — Diversões, lazer, entretenimento
  '12.01': '120101',
  '12.02': '120201',
  '12.03': '120301',
  '12.04': '120401',
  '12.05': '120501',
  '12.06': '120601',
  '12.07': '120701',
  '12.08': '120801',
  '12.09': '120901',
  '12.10': '121001',
  '12.11': '121101',
  '12.12': '121201',
  '12.13': '121301',
  '12.14': '121401',
  '12.15': '121501',
  '12.16': '121601',
  '12.17': '121701',
  // Grupo 13 — Fonografia, fotografia, cinematografia
  '13.02': '130201',
  '13.03': '130301',
  '13.04': '130401',
  '13.05': '130501',
  // Grupo 14 — Serviços relativos a bens de terceiros
  '14.01': '140101',
  '14.02': '140201',
  '14.03': '140301',
  '14.04': '140401',
  '14.05': '140501',
  '14.06': '140601',
  '14.07': '140701',
  '14.08': '140801',
  '14.09': '140901',
  '14.10': '141001',
  '14.11': '141101',
  '14.12': '141201',
  '14.13': '141301',
  // Grupo 15 — Serviços relacionados ao setor bancário ou financeiro
  '15.01': '150101',
  '15.02': '150201',
  '15.03': '150301',
  '15.04': '150401',
  '15.05': '150501',
  '15.06': '150601',
  '15.07': '150701',
  '15.08': '150801',
  '15.09': '150901',
  '15.10': '151001',
  '15.11': '151101',
  '15.12': '151201',
  '15.13': '151301',
  '15.14': '151401',
  '15.15': '151501',
  '15.16': '151601',
  '15.17': '151701',
  '15.18': '151801',
  // Grupo 16 — Transporte de natureza municipal
  '16.01': '160101',
  '16.02': '160201',
  // Grupo 17 — Apoio técnico, administrativo, jurídico, contábil
  '17.01': '170101',
  '17.02': '170201',
  '17.03': '170301',
  '17.04': '170401',
  '17.05': '170501',
  '17.06': '170601',
  '17.08': '170801',
  '17.09': '170901',
  '17.10': '171001',
  '17.11': '171101',
  '17.12': '171201',
  '17.13': '171301',
  '17.14': '171401',
  '17.15': '171501',
  '17.16': '171601',
  '17.17': '171701',
  '17.18': '171801',
  '17.19': '171901',
  '17.20': '172001',
  '17.21': '172101',
  '17.22': '172201',
  '17.23': '172301',
  '17.24': '172401',
  '17.25': '172501',
  // Grupo 18 — Regulação de sinistros, seguros
  '18.01': '180101',
  // Grupo 19 — Loteria, bingos, apostas
  '19.01': '190101',
  // Grupo 20 — Serviços portuários, aeroportuários, terminais
  '20.01': '200101',
  '20.02': '200201',
  '20.03': '200301',
  // Grupo 21 — Registros públicos, cartorários e notariais
  '21.01': '210101',
  // Grupo 22 — Exploração de rodovia
  '22.01': '220101',
  // Grupo 23 — Programação e comunicação visual, desenho industrial
  '23.01': '230101',
  // Grupo 24 — Chaveiros, carimbos, placas
  '24.01': '240101',
  // Grupo 25 — Serviços funerários
  '25.01': '250101',
  '25.02': '250201',
  '25.03': '250301',
  '25.04': '250401',
  '25.05': '250501',
  // Grupo 26 — Correios, courrier, coleta e entrega
  '26.01': '260101',
  // Grupo 27 — Assistência social
  '27.01': '270101',
  // Grupo 28 — Avaliação de bens e serviços
  '28.01': '280101',
  // Grupo 29 — Biblioteconomia
  '29.01': '290101',
  // Grupo 30 — Biologia, biotecnologia e química
  '30.01': '300101',
  // Grupo 31 — Serviços técnicos em edificações, eletrônica
  '31.01': '310101',
  // Grupo 32 — Desenhos técnicos
  '32.01': '320101',
  // Grupo 33 — Desembaraço aduaneiro, despachantes
  '33.01': '330101',
  // Grupo 34 — Investigação, detetives particulares
  '34.01': '340101',
  // Grupo 35 — Reportagem, jornalismo
  '35.01': '350101',
  // Grupo 36 — Meteorologia
  '36.01': '360101',
  // Grupo 37 — Artistas, atletas, modelos
  '37.01': '370101',
  // Grupo 38 — Museologia
  '38.01': '380101',
  // Grupo 39 — Ourivesaria e lapidação
  '39.01': '390101',
  // Grupo 40 — Obras de arte sob encomenda
  '40.01': '400101',
};

/** Retorna o item LC116 com CTN (6 dígitos) a partir do item */
function getCtn(item: string): { ctn?: string } {
  const ctn = LC116_CTN[item];
  return ctn ? { ctn } : {};
}


const CNAE_LC116_MAP: Record<string, LC116Item> = {
  // ─── 1 – Informática e Congêneres ───────────────────────────────────────────
  '6201500': { item: '1.01', descricao: 'Análise e desenvolvimento de sistemas.', ...getCtn('1.01') },
  '6202300': { item: '1.02', descricao: 'Programação.', ...getCtn('1.02') },
  '6203100': { item: '1.01', descricao: 'Análise e desenvolvimento de sistemas.', ...getCtn('1.01') },
  '6204000': { item: '1.02', descricao: 'Programação.', ...getCtn('1.02') },
  '6209100': { item: '1.03', descricao: 'Processamento de dados e congêneres.', ...getCtn('1.03') },
  '6311900': { item: '1.03', descricao: 'Processamento de dados e congêneres.', ...getCtn('1.03') },
  '6319400': { item: '1.04', descricao: 'Elaboração de programas de computadores, inclusive de jogos eletrônicos.', ...getCtn('1.04') },
  '6391700': { item: '1.09', descricao: 'Disponibilização, sem cessão definitiva, de conteúdos de áudio, vídeo, imagem e texto por meio da internet, respeitada a imunidade de livros, jornais e periódicos (exceto a distribuição de conteúdos pelas prestadoras de Serviço de Acesso Condicionado, de que trata a Lei no 12.485, de 12 de setembro de 2011, sujeita ao ICMS).', ...getCtn('1.09') },
  '6399200': { item: '1.09', descricao: 'Disponibilização, sem cessão definitiva, de conteúdos de áudio, vídeo, imagem e texto por meio da internet, respeitada a imunidade de livros, jornais e periódicos.', ...getCtn('1.09') },
  '6201501': { item: '1.01', descricao: 'Análise e desenvolvimento de sistemas.', ...getCtn('1.01') },
  '6201502': { item: '1.08', descricao: 'Planejamento, confecção, manutenção e atualização de páginas eletrônicas.', ...getCtn('1.08') },
  '6202301': { item: '1.02', descricao: 'Programação.', ...getCtn('1.02') },
  '6209101': { item: '1.05', descricao: 'Licenciamento ou cessão de direito de uso de programas de computação.', ...getCtn('1.05') },
  '6210800': { item: '1.05', descricao: 'Licenciamento ou cessão de direito de uso de programas de computação.', ...getCtn('1.05') },
  '6290600': { item: '1.07', descricao: 'Suporte técnico em informática, inclusive instalação, configuração e manutenção de programas de computação e bancos de dados.', ...getCtn('1.07') },
  '6110801': { item: '1.03', descricao: 'Processamento de dados e congêneres.', ...getCtn('1.03') },
  '6110802': { item: '1.03', descricao: 'Processamento de dados e congêneres.', ...getCtn('1.03') },
  '6120501': { item: '1.03', descricao: 'Processamento de dados e congêneres.', ...getCtn('1.03') },
  '6120502': { item: '1.03', descricao: 'Processamento de dados e congêneres.', ...getCtn('1.03') },
  '6130200': { item: '1.03', descricao: 'Processamento de dados e congêneres.', ...getCtn('1.03') },
  '6141800': { item: '1.03', descricao: 'Processamento de dados e congêneres.', ...getCtn('1.03') },
  '6142600': { item: '1.03', descricao: 'Processamento de dados e congêneres.', ...getCtn('1.03') },
  '6143400': { item: '1.03', descricao: 'Processamento de dados e congêneres.', ...getCtn('1.03') },

  // ─── 2 – Pesquisas e Desenvolvimento ────────────────────────────────────────
  '7210000': { item: '2.01', descricao: 'Serviços de pesquisas e desenvolvimento de qualquer natureza.', ...getCtn('2.01') },
  '7220700': { item: '2.01', descricao: 'Serviços de pesquisas e desenvolvimento de qualquer natureza.', ...getCtn('2.01') },

  // ─── 3 – Locação, Cessão de Direito de Uso ─────────────────────────────────
  '7711000': { item: '3.01', descricao: 'Locação de bens móveis.', ...getCtn('3.01') },
  '7719501': { item: '3.01', descricao: 'Locação de bens móveis.', ...getCtn('3.01') },
  '7719502': { item: '3.01', descricao: 'Locação de bens móveis.', ...getCtn('3.01') },
  '7719599': { item: '3.01', descricao: 'Locação de bens móveis.', ...getCtn('3.01') },
  '7721700': { item: '3.01', descricao: 'Locação de bens móveis.', ...getCtn('3.01') },
  '7722500': { item: '3.01', descricao: 'Locação de bens móveis.', ...getCtn('3.01') },
  '7723300': { item: '3.01', descricao: 'Locação de bens móveis.', ...getCtn('3.01') },
  '7729201': { item: '3.01', descricao: 'Locação de bens móveis.', ...getCtn('3.01') },
  '7729202': { item: '3.01', descricao: 'Locação de bens móveis.', ...getCtn('3.01') },
  '7729299': { item: '3.01', descricao: 'Locação de bens móveis.', ...getCtn('3.01') },
  '7810800': { item: '17.05', descricao: 'Fornecimento de mão-de-obra, mesmo em caráter temporário, inclusive de empregados ou trabalhadores, avulsos ou temporários, contratados pelo prestador de serviço.', ...getCtn('17.05') },
  '7820500': { item: '17.05', descricao: 'Fornecimento de mão-de-obra, mesmo em caráter temporário, inclusive de empregados ou trabalhadores, avulsos ou temporários, contratados pelo prestador de serviço.', ...getCtn('17.05') },
  '7830200': { item: '17.05', descricao: 'Fornecimento de mão-de-obra, mesmo em caráter temporário, inclusive de empregados ou trabalhadores, avulsos ou temporários, contratados pelo prestador de serviço.', ...getCtn('17.05') },

  // ─── 4 – Saúde e Assistência Médica ────────────────────────────────────────
  '8610101': { item: '4.01', descricao: 'Medicina e biomedicina.', ...getCtn('4.01') },
  '8610102': { item: '4.01', descricao: 'Medicina e biomedicina.', ...getCtn('4.01') },
  '8621601': { item: '4.02', descricao: 'Análises clínicas, patologia, eletricidade médica, radioterapia, quimioterapia, ultra-sonografia, ressonância magnética, radiologia, tomografia e congêneres.', ...getCtn('4.02') },
  '8621602': { item: '4.02', descricao: 'Análises clínicas, patologia, eletricidade médica, radioterapia, quimioterapia, ultra-sonografia, ressonância magnética, radiologia, tomografia e congêneres.', ...getCtn('4.02') },
  '8622400': { item: '4.01', descricao: 'Medicina e biomedicina.', ...getCtn('4.01') },
  '8630501': { item: '4.02', descricao: 'Análises clínicas, patologia, eletricidade médica, radioterapia, quimioterapia, ultra-sonografia, ressonância magnética, radiologia, tomografia e congêneres.', ...getCtn('4.02') },
  '8630502': { item: '4.02', descricao: 'Análises clínicas, patologia, eletricidade médica, radioterapia, quimioterapia, ultra-sonografia, ressonância magnética, radiologia, tomografia e congêneres.', ...getCtn('4.02') },
  '8630503': { item: '4.02', descricao: 'Análises clínicas, patologia, eletricidade médica, radioterapia, quimioterapia, ultra-sonografia, ressonância magnética, radiologia, tomografia e congêneres.', ...getCtn('4.02') },
  '8630504': { item: '4.02', descricao: 'Análises clínicas, patologia, eletricidade médica, radioterapia, quimioterapia, ultra-sonografia, ressonância magnética, radiologia, tomografia e congêneres.', ...getCtn('4.02') },
  '8630505': { item: '4.02', descricao: 'Análises clínicas, patologia, eletricidade médica, radioterapia, quimioterapia, ultra-sonografia, ressonância magnética, radiologia, tomografia e congêneres.', ...getCtn('4.02') },
  '8630506': { item: '4.02', descricao: 'Análises clínicas, patologia, eletricidade médica, radioterapia, quimioterapia, ultra-sonografia, ressonância magnética, radiologia, tomografia e congêneres.', ...getCtn('4.02') },
  '8630507': { item: '4.02', descricao: 'Análises clínicas, patologia, eletricidade médica, radioterapia, quimioterapia, ultra-sonografia, ressonância magnética, radiologia, tomografia e congêneres.', ...getCtn('4.02') },
  '8640201': { item: '4.02', descricao: 'Análises clínicas, patologia, eletricidade médica, radioterapia, quimioterapia, ultra-sonografia, ressonância magnética, radiologia, tomografia e congêneres.', ...getCtn('4.02') },
  '8640202': { item: '4.02', descricao: 'Análises clínicas, patologia, eletricidade médica, radioterapia, quimioterapia, ultra-sonografia, ressonância magnética, radiologia, tomografia e congêneres.', ...getCtn('4.02') },
  '8640203': { item: '4.02', descricao: 'Análises clínicas, patologia, eletricidade médica, radioterapia, quimioterapia, ultra-sonografia, ressonância magnética, radiologia, tomografia e congêneres.', ...getCtn('4.02') },
  '8640204': { item: '4.02', descricao: 'Análises clínicas, patologia, eletricidade médica, radioterapia, quimioterapia, ultra-sonografia, ressonância magnética, radiologia, tomografia e congêneres.', ...getCtn('4.02') },
  '8640205': { item: '4.02', descricao: 'Análises clínicas, patologia, eletricidade médica, radioterapia, quimioterapia, ultra-sonografia, ressonância magnética, radiologia, tomografia e congêneres.', ...getCtn('4.02') },
  '8650001': { item: '4.06', descricao: 'Enfermagem, inclusive serviços auxiliares.', ...getCtn('4.06') },
  '8650002': { item: '4.01', descricao: 'Medicina e biomedicina.', ...getCtn('4.01') },
  '8650003': { item: '4.01', descricao: 'Medicina e biomedicina.', ...getCtn('4.01') },
  '8650004': { item: '4.08', descricao: 'Terapia ocupacional, fisioterapia e fonoaudiologia.', ...getCtn('4.08') },
  '8650005': { item: '4.10', descricao: 'Nutrição.', ...getCtn('4.10') },
  '8650006': { item: '4.08', descricao: 'Terapia ocupacional, fisioterapia e fonoaudiologia.', ...getCtn('4.08') },
  '8650007': { item: '4.07', descricao: 'Serviços farmacêuticos.', ...getCtn('4.07') },
  '8660700': { item: '4.05', descricao: 'Acupuntura.', ...getCtn('4.05') },
  '8690901': { item: '4.14', descricao: 'Próteses sob encomenda.', ...getCtn('4.14') },
  '8690902': { item: '4.01', descricao: 'Medicina e biomedicina.', ...getCtn('4.01') },
  '8690903': { item: '4.08', descricao: 'Terapia ocupacional, fisioterapia e fonoaudiologia.', ...getCtn('4.08') },
  '8690904': { item: '4.08', descricao: 'Terapia ocupacional, fisioterapia e fonoaudiologia.', ...getCtn('4.08') },
  '8690999': { item: '4.23', descricao: 'Outros planos de saúde que se cumpram através de serviços de terceiros contratados, credenciados, cooperados ou apenas pagos pelo operador do plano mediante indicação do beneficiário.', ...getCtn('4.23') },

  // ─── 5 – Medicina e Assistência Veterinária ────────────────────────────────
  '7500100': { item: '5.01', descricao: 'Medicina veterinária e zootecnia.', ...getCtn('5.01') },

  // ─── 6 – Cuidados Pessoais e Estética ──────────────────────────────────────
  '9602501': { item: '6.01', descricao: 'Barbearia, cabeleireiros, manicuros, pedicuros e congêneres.', ...getCtn('6.01') },
  '9602502': { item: '6.02', descricao: 'Esteticistas, tratamento de pele, depilação e congêneres.', ...getCtn('6.02') },
  '9609201': { item: '6.04', descricao: 'Ginástica, dança, esportes, natação, artes marciais e demais atividades físicas.', ...getCtn('6.04') },
  '9609202': { item: '6.04', descricao: 'Ginástica, dança, esportes, natação, artes marciais e demais atividades físicas.', ...getCtn('6.04') },
  '9609203': { item: '6.04', descricao: 'Ginástica, dança, esportes, natação, artes marciais e demais atividades físicas.', ...getCtn('6.04') },
  '9311500': { item: '6.04', descricao: 'Ginástica, dança, esportes, natação, artes marciais e demais atividades físicas.', ...getCtn('6.04') },
  '9312300': { item: '6.04', descricao: 'Ginástica, dança, esportes, natação, artes marciais e demais atividades físicas.', ...getCtn('6.04') },
  '9313100': { item: '6.04', descricao: 'Ginástica, dança, esportes, natação, artes marciais e demais atividades físicas.', ...getCtn('6.04') },

  // ─── 7 – Engenharia, Arquitetura, Construção Civil ─────────────────────────
  '7111100': { item: '7.01', descricao: 'Engenharia, agronomia, agrimensura, arquitetura, geologia, urbanismo, paisagismo e congêneres.', ...getCtn('7.01') },
  '7112000': { item: '7.01', descricao: 'Engenharia, agronomia, agrimensura, arquitetura, geologia, urbanismo, paisagismo e congêneres.', ...getCtn('7.01') },
  '7119701': { item: '7.01', descricao: 'Engenharia, agronomia, agrimensura, arquitetura, geologia, urbanismo, paisagismo e congêneres.', ...getCtn('7.01') },
  '7119702': { item: '7.01', descricao: 'Engenharia, agronomia, agrimensura, arquitetura, geologia, urbanismo, paisagismo e congêneres.', ...getCtn('7.01') },
  '7119799': { item: '7.01', descricao: 'Engenharia, agronomia, agrimensura, arquitetura, geologia, urbanismo, paisagismo e congêneres.', ...getCtn('7.01') },
  '4110700': { item: '7.02', descricao: 'Execução, por administração, empreitada ou subempreitada, de obras de construção civil, hidráulica ou elétrica e de outras obras semelhantes.', ...getCtn('7.02') },
  '4120400': { item: '7.02', descricao: 'Execução, por administração, empreitada ou subempreitada, de obras de construção civil, hidráulica ou elétrica e de outras obras semelhantes.', ...getCtn('7.02') },
  '4211101': { item: '7.02', descricao: 'Execução, por administração, empreitada ou subempreitada, de obras de construção civil, hidráulica ou elétrica e de outras obras semelhantes.', ...getCtn('7.02') },
  '4321500': { item: '14.06', descricao: 'Instalação e montagem de aparelhos, máquinas e equipamentos, inclusive montagem industrial, prestados ao usuário final, exclusivamente com material por ele fornecido.', ...getCtn('14.06') },
  '4321501': { item: '14.06', descricao: 'Instalação e montagem de aparelhos, máquinas e equipamentos, inclusive montagem industrial, prestados ao usuário final, exclusivamente com material por ele fornecido.', ...getCtn('14.06') },
  '4321502': { item: '14.06', descricao: 'Instalação e montagem de aparelhos, máquinas e equipamentos, inclusive montagem industrial, prestados ao usuário final, exclusivamente com material por ele fornecido.', ...getCtn('14.06') },
  '4322301': { item: '7.02', descricao: 'Execução, por administração, empreitada ou subempreitada, de obras de construção civil.', ...getCtn('7.02') },
  '4322302': { item: '7.02', descricao: 'Execução, por administração, empreitada ou subempreitada, de obras de construção civil.', ...getCtn('7.02') },
  '4399101': { item: '7.09', descricao: 'Varrição, coleta, remoção, incineração, tratamento, reciclagem, separação e destinação final de lixo, rejeitos e outros resíduos quaisquer.', ...getCtn('7.09') },
  '4399103': { item: '7.02', descricao: 'Execução, por administração, empreitada ou subempreitada, de obras de construção civil.', ...getCtn('7.02') },
  '4399199': { item: '7.02', descricao: 'Execução, por administração, empreitada ou subempreitada, de obras de construção civil.', ...getCtn('7.02') },
  '7120100': { item: '7.01', descricao: 'Engenharia, agronomia, agrimensura, arquitetura, geologia, urbanismo, paisagismo e congêneres.', ...getCtn('7.01') },

  // ─── 8 – Educação e Instrução ───────────────────────────────────────────────
  '8511200': { item: '8.01', descricao: 'Ensino regular pré-escolar, fundamental, médio e superior.', ...getCtn('8.01') },
  '8512100': { item: '8.01', descricao: 'Ensino regular pré-escolar, fundamental, médio e superior.', ...getCtn('8.01') },
  '8513900': { item: '8.01', descricao: 'Ensino regular pré-escolar, fundamental, médio e superior.', ...getCtn('8.01') },
  '8520100': { item: '8.01', descricao: 'Ensino regular pré-escolar, fundamental, médio e superior.', ...getCtn('8.01') },
  '8531700': { item: '8.01', descricao: 'Ensino regular pré-escolar, fundamental, médio e superior.', ...getCtn('8.01') },
  '8532500': { item: '8.01', descricao: 'Ensino regular pré-escolar, fundamental, médio e superior.', ...getCtn('8.01') },
  '8541400': { item: '8.01', descricao: 'Ensino regular pré-escolar, fundamental, médio e superior.', ...getCtn('8.01') },
  '8542200': { item: '8.01', descricao: 'Ensino regular pré-escolar, fundamental, médio e superior.', ...getCtn('8.01') },
  '8550301': { item: '8.02', descricao: 'Instrução, treinamento, orientação pedagógica e educacional, avaliação de conhecimentos de qualquer natureza.', ...getCtn('8.02') },
  '8550302': { item: '8.02', descricao: 'Instrução, treinamento, orientação pedagógica e educacional, avaliação de conhecimentos de qualquer natureza.', ...getCtn('8.02') },
  '8559701': { item: '8.02', descricao: 'Instrução, treinamento, orientação pedagógica e educacional, avaliação de conhecimentos de qualquer natureza.', ...getCtn('8.02') },
  '8559799': { item: '8.02', descricao: 'Instrução, treinamento, orientação pedagógica e educacional, avaliação de conhecimentos de qualquer natureza.', ...getCtn('8.02') },
  '8560900': { item: '8.02', descricao: 'Instrução, treinamento, orientação pedagógica e educacional, avaliação de conhecimentos de qualquer natureza.', ...getCtn('8.02') },

  // ─── 9 – Hospedagem, Turismo, Viagens ──────────────────────────────────────
  '5510801': { item: '9.01', descricao: 'Hospedagem de qualquer natureza em hotéis, apart-service condominiais, flat, apart-hotéis, hotéis residência, residence-service, suite service, hotelaria marítima, motéis, pensões e congêneres.', ...getCtn('9.01') },
  '5510802': { item: '9.01', descricao: 'Hospedagem de qualquer natureza em hotéis, apart-service condominiais, flat, apart-hotéis, hotéis residência, residence-service, suite service, hotelaria marítima, motéis, pensões e congêneres.', ...getCtn('9.01') },
  '5590601': { item: '9.01', descricao: 'Hospedagem de qualquer natureza em hotéis, apart-service condominiais, flat, apart-hotéis, hotéis residência, residence-service, suite service, hotelaria marítima, motéis, pensões e congêneres.', ...getCtn('9.01') },
  '5590602': { item: '9.01', descricao: 'Hospedagem de qualquer natureza em hotéis, apart-service condominiais, flat, apart-hotéis, hotéis residência, residence-service, suite service, hotelaria marítima, motéis, pensões e congêneres.', ...getCtn('9.01') },
  '7911200': { item: '9.02', descricao: 'Agenciamento, organização, promoção, intermediação e execução de programas de turismo, passeios, viagens, excursões, hospedagens e congêneres.', ...getCtn('9.02') },
  '7912100': { item: '9.02', descricao: 'Agenciamento, organização, promoção, intermediação e execução de programas de turismo, passeios, viagens, excursões, hospedagens e congêneres.', ...getCtn('9.02') },
  '7990200': { item: '9.02', descricao: 'Agenciamento, organização, promoção, intermediação e execução de programas de turismo, passeios, viagens, excursões, hospedagens e congêneres.', ...getCtn('9.02') },

  // ─── 10 – Intermediação e Congêneres ────────────────────────────────────────
  '6611801': { item: '10.02', descricao: 'Agenciamento, corretagem ou intermediação de títulos em geral, valores mobiliários e contratos quaisquer.', ...getCtn('10.02') },
  '6611802': { item: '10.02', descricao: 'Agenciamento, corretagem ou intermediação de títulos em geral, valores mobiliários e contratos quaisquer.', ...getCtn('10.02') },
  '6612601': { item: '10.01', descricao: 'Agenciamento, corretagem ou intermediação de câmbio, de seguros, de cartões de crédito, de planos de saúde e de planos de previdência privada.', ...getCtn('10.01') },
  '6612602': { item: '10.01', descricao: 'Agenciamento, corretagem ou intermediação de câmbio, de seguros, de cartões de crédito, de planos de saúde e de planos de previdência privada.', ...getCtn('10.01') },
  '6612603': { item: '10.01', descricao: 'Agenciamento, corretagem ou intermediação de câmbio, de seguros, de cartões de crédito, de planos de saúde e de planos de previdência privada.', ...getCtn('10.01') },
  '6612604': { item: '10.01', descricao: 'Agenciamento, corretagem ou intermediação de câmbio, de seguros, de cartões de crédito, de planos de saúde e de planos de previdência privada.', ...getCtn('10.01') },
  '6612605': { item: '10.01', descricao: 'Agenciamento, corretagem ou intermediação de câmbio, de seguros, de cartões de crédito, de planos de saúde e de planos de previdência privada.', ...getCtn('10.01') },
  '6613400': { item: '10.04', descricao: 'Agenciamento, corretagem ou intermediação de contratos de arrendamento mercantil (leasing), de franquia (franchising) e de faturização (factoring).', ...getCtn('10.04') },
  '6619301': { item: '10.09', descricao: 'Representação de qualquer natureza, inclusive comercial.', ...getCtn('10.09') },
  '6619302': { item: '10.09', descricao: 'Representação de qualquer natureza, inclusive comercial.', ...getCtn('10.09') },
  '6622300': { item: '10.01', descricao: 'Agenciamento, corretagem ou intermediação de câmbio, de seguros, de cartões de crédito, de planos de saúde e de planos de previdência privada.', ...getCtn('10.01') },
  '7490101': { item: '10.09', descricao: 'Representação de qualquer natureza, inclusive comercial.', ...getCtn('10.09') },
  '7490104': { item: '10.05', descricao: 'Agenciamento, corretagem ou intermediação de bens móveis ou imóveis, não abrangidos em outros itens ou subitens, inclusive aqueles realizados no âmbito de Bolsas de Mercadorias e Futuros, por quaisquer meios.', ...getCtn('10.05') },

  // ─── 11 – Guarda, Estacionamento, Vigilância ────────────────────────────────
  '8011101': { item: '11.02', descricao: 'Vigilância, segurança ou monitoramento de bens e pessoas.', ...getCtn('11.02') },
  '8011102': { item: '11.02', descricao: 'Vigilância, segurança ou monitoramento de bens e pessoas.', ...getCtn('11.02') },
  '8012900': { item: '11.02', descricao: 'Vigilância, segurança ou monitoramento de bens e pessoas.', ...getCtn('11.02') },
  '8020001': { item: '11.02', descricao: 'Vigilância, segurança ou monitoramento de bens e pessoas.', ...getCtn('11.02') },
  '8020002': { item: '11.02', descricao: 'Vigilância, segurança ou monitoramento de bens e pessoas.', ...getCtn('11.02') },
  '5211701': { item: '11.01', descricao: 'Guarda e estacionamento de veículos terrestres automotores, de aeronaves e de embarcações.', ...getCtn('11.01') },
  '5211702': { item: '11.01', descricao: 'Guarda e estacionamento de veículos terrestres automotores, de aeronaves e de embarcações.', ...getCtn('11.01') },

  // ─── 12 – Diversões, Lazer, Entretenimento ──────────────────────────────────
  '9001901': { item: '12.01', descricao: 'Espetáculos teatrais.', ...getCtn('12.01') },
  '9001902': { item: '12.07', descricao: 'Shows, ballet, danças, desfiles, bailes, óperas, concertos, recitais, festivais e congêneres.', ...getCtn('12.07') },
  '9001903': { item: '12.03', descricao: 'Espetáculos circenses.', ...getCtn('12.03') },
  '9001904': { item: '12.07', descricao: 'Shows, ballet, danças, desfiles, bailes, óperas, concertos, recitais, festivais e congêneres.', ...getCtn('12.07') },
  '9001905': { item: '12.07', descricao: 'Shows, ballet, danças, desfiles, bailes, óperas, concertos, recitais, festivais e congêneres.', ...getCtn('12.07') },
  '9001906': { item: '12.01', descricao: 'Espetáculos teatrais.', ...getCtn('12.01') },
  '9001907': { item: '12.07', descricao: 'Shows, ballet, danças, desfiles, bailes, óperas, concertos, recitais, festivais e congêneres.', ...getCtn('12.07') },
  '9001999': { item: '12.07', descricao: 'Shows, ballet, danças, desfiles, bailes, óperas, concertos, recitais, festivais e congêneres.', ...getCtn('12.07') },
  '9200301': { item: '12.13', descricao: 'Produção, mediante ou sem encomenda prévia, de eventos, espetáculos, entrevistas, shows, ballet, danças, desfiles, bailes, teatros, óperas, concertos, recitais, festivais e congêneres.', ...getCtn('12.13') },
  '9200302': { item: '12.13', descricao: 'Produção, mediante ou sem encomenda prévia, de eventos, espetáculos, entrevistas, shows, ballet, danças, desfiles, bailes, teatros, óperas, concertos, recitais, festivais e congêneres.', ...getCtn('12.13') },
  '9200399': { item: '12.13', descricao: 'Produção, mediante ou sem encomenda prévia, de eventos, espetáculos, entrevistas, shows, ballet, danças, desfiles, bailes, teatros, óperas, concertos, recitais, festivais e congêneres.', ...getCtn('12.13') },
  '9321200': { item: '12.05', descricao: 'Parques de diversões, centros de lazer e congêneres.', ...getCtn('12.05') },
  '9329801': { item: '12.05', descricao: 'Parques de diversões, centros de lazer e congêneres.', ...getCtn('12.05') },
  '9329802': { item: '12.05', descricao: 'Parques de diversões, centros de lazer e congêneres.', ...getCtn('12.05') },
  '9329803': { item: '12.05', descricao: 'Parques de diversões, centros de lazer e congêneres.', ...getCtn('12.05') },
  '9329804': { item: '12.17', descricao: 'Recreação e animação, inclusive em festas e eventos de qualquer natureza.', ...getCtn('12.17') },

  // ─── 13 – Fonografia, Fotografia, Cinematografia ────────────────────────────
  '5911101': { item: '13.03', descricao: 'Fotografia e cinematografia, inclusive revelação, ampliação, cópia, reprodução, trucagem e congêneres.', ...getCtn('13.03') },
  '5911102': { item: '13.03', descricao: 'Fotografia e cinematografia, inclusive revelação, ampliação, cópia, reprodução, trucagem e congêneres.', ...getCtn('13.03') },
  '5911199': { item: '13.03', descricao: 'Fotografia e cinematografia, inclusive revelação, ampliação, cópia, reprodução, trucagem e congêneres.', ...getCtn('13.03') },
  '5912001': { item: '13.02', descricao: 'Fonografia ou gravação de sons, inclusive trucagem, dublagem, mixagem e congêneres.', ...getCtn('13.02') },
  '5912002': { item: '13.02', descricao: 'Fonografia ou gravação de sons, inclusive trucagem, dublagem, mixagem e congêneres.', ...getCtn('13.02') },
  '5912099': { item: '13.02', descricao: 'Fonografia ou gravação de sons, inclusive trucagem, dublagem, mixagem e congêneres.', ...getCtn('13.02') },
  '7420001': { item: '13.03', descricao: 'Fotografia e cinematografia, inclusive revelação, ampliação, cópia, reprodução, trucagem e congêneres.', ...getCtn('13.03') },
  '7420002': { item: '13.03', descricao: 'Fotografia e cinematografia, inclusive revelação, ampliação, cópia, reprodução, trucagem e congêneres.', ...getCtn('13.03') },
  '7420003': { item: '13.03', descricao: 'Fotografia e cinematografia, inclusive revelação, ampliação, cópia, reprodução, trucagem e congêneres.', ...getCtn('13.03') },
  '7420004': { item: '13.03', descricao: 'Fotografia e cinematografia, inclusive revelação, ampliação, cópia, reprodução, trucagem e congêneres.', ...getCtn('13.03') },
  '7420005': { item: '13.03', descricao: 'Fotografia e cinematografia, inclusive revelação, ampliação, cópia, reprodução, trucagem e congêneres.', ...getCtn('13.03') },

  // ─── 14 – Serviços relativos a bens de terceiros ────────────────────────────
  '9511800': { item: '14.01', descricao: 'Lubrificação, limpeza, lustração, revisão, carga e recarga, conserto, restauração, blindagem, manutenção e conservação de máquinas, veículos, aparelhos, equipamentos, motores, elevadores ou de qualquer objeto (exceto peças e partes empregadas, que ficam sujeitas ao ICMS).', ...getCtn('14.01') },
  '9512600': { item: '14.01', descricao: 'Lubrificação, limpeza, lustração, revisão, carga e recarga, conserto, restauração, blindagem, manutenção e conservação de máquinas, veículos, aparelhos, equipamentos, motores, elevadores ou de qualquer objeto (exceto peças e partes empregadas, que ficam sujeitas ao ICMS).', ...getCtn('14.01') },
  '4520001': { item: '14.01', descricao: 'Lubrificação, limpeza, lustração, revisão, carga e recarga, conserto, restauração, blindagem, manutenção e conservação de máquinas, veículos, aparelhos, equipamentos, motores, elevadores ou de qualquer objeto (exceto peças e partes empregadas, que ficam sujeitas ao ICMS).', ...getCtn('14.01') },
  '4520002': { item: '14.01', descricao: 'Lubrificação, limpeza, lustração, revisão, carga e recarga, conserto, restauração, blindagem, manutenção e conservação de máquinas, veículos, aparelhos, equipamentos, motores, elevadores ou de qualquer objeto (exceto peças e partes empregadas, que ficam sujeitas ao ICMS).', ...getCtn('14.01') },
  '3314701': { item: '14.01', descricao: 'Lubrificação, limpeza, lustração, revisão, carga e recarga, conserto, restauração, blindagem, manutenção e conservação de máquinas, veículos, aparelhos, equipamentos, motores, elevadores ou de qualquer objeto (exceto peças e partes empregadas, que ficam sujeitas ao ICMS).', ...getCtn('14.01') },
  '3314702': { item: '14.01', descricao: 'Lubrificação, limpeza, lustração, revisão, carga e recarga, conserto, restauração, blindagem, manutenção e conservação de máquinas, veículos, aparelhos, equipamentos, motores, elevadores ou de qualquer objeto (exceto peças e partes empregadas, que ficam sujeitas ao ICMS).', ...getCtn('14.01') },
  '3314703': { item: '14.01', descricao: 'Lubrificação, limpeza, lustração, revisão, carga e recarga, conserto, restauração, blindagem, manutenção e conservação de máquinas, veículos, aparelhos, equipamentos, motores, elevadores ou de qualquer objeto (exceto peças e partes empregadas, que ficam sujeitas ao ICMS).', ...getCtn('14.01') },
  '3314799': { item: '14.01', descricao: 'Lubrificação, limpeza, lustração, revisão, carga e recarga, conserto, restauração, blindagem, manutenção e conservação de máquinas, veículos, aparelhos, equipamentos, motores, elevadores ou de qualquer objeto (exceto peças e partes empregadas, que ficam sujeitas ao ICMS).', ...getCtn('14.01') },
  '9521500': { item: '14.01', descricao: 'Lubrificação, limpeza, lustração, revisão, carga e recarga, conserto, restauração, blindagem, manutenção e conservação de máquinas, veículos, aparelhos, equipamentos, motores, elevadores ou de qualquer objeto (exceto peças e partes empregadas, que ficam sujeitas ao ICMS).', ...getCtn('14.01') },
  '9529101': { item: '14.06', descricao: 'Instalação e montagem de aparelhos, máquinas e equipamentos, inclusive montagem industrial, prestados ao usuário final, exclusivamente com material por ele fornecido.', ...getCtn('14.06') },
  '9529102': { item: '14.01', descricao: 'Lubrificação, limpeza, lustração, revisão, carga e recarga, conserto, restauração, blindagem, manutenção e conservação de máquinas, veículos, aparelhos, equipamentos, motores, elevadores ou de qualquer objeto (exceto peças e partes empregadas, que ficam sujeitas ao ICMS).', ...getCtn('14.01') },
  '9529103': { item: '14.01', descricao: 'Lubrificação, limpeza, lustração, revisão, carga e recarga, conserto, restauração, blindagem, manutenção e conservação de máquinas, veículos, aparelhos, equipamentos, motores, elevadores ou de qualquer objeto (exceto peças e partes empregadas, que ficam sujeitas ao ICMS).', ...getCtn('14.01') },
  '9529104': { item: '14.01', descricao: 'Lubrificação, limpeza, lustração, revisão, carga e recarga, conserto, restauração, blindagem, manutenção e conservação de máquinas, veículos, aparelhos, equipamentos, motores, elevadores ou de qualquer objeto (exceto peças e partes empregadas, que ficam sujeitas ao ICMS).', ...getCtn('14.01') },
  '9529105': { item: '14.01', descricao: 'Lubrificação, limpeza, lustração, revisão, carga e recarga, conserto, restauração, blindagem, manutenção e conservação de máquinas, veículos, aparelhos, equipamentos, motores, elevadores ou de qualquer objeto (exceto peças e partes empregadas, que ficam sujeitas ao ICMS).', ...getCtn('14.01') },
  '9529199': { item: '14.01', descricao: 'Lubrificação, limpeza, lustração, revisão, carga e recarga, conserto, restauração, blindagem, manutenção e conservação de máquinas, veículos, aparelhos, equipamentos, motores, elevadores ou de qualquer objeto (exceto peças e partes empregadas, que ficam sujeitas ao ICMS).', ...getCtn('14.01') },

  // ─── 15 – Setor Bancário e Financeiro ──────────────────────────────────────
  '6410700': { item: '15.01', descricao: 'Administração de fundos quaisquer, de consórcio, de cartão de crédito ou débito e congêneres, de carteira de clientes, de cheques pré-datados e congêneres.', ...getCtn('15.01') },
  '6421200': { item: '15.01', descricao: 'Administração de fundos quaisquer, de consórcio, de cartão de crédito ou débito e congêneres, de carteira de clientes, de cheques pré-datados e congêneres.', ...getCtn('15.01') },
  '6422100': { item: '15.01', descricao: 'Administração de fundos quaisquer, de consórcio, de cartão de crédito ou débito e congêneres, de carteira de clientes, de cheques pré-datados e congêneres.', ...getCtn('15.01') },
  '6423900': { item: '15.01', descricao: 'Administração de fundos quaisquer, de consórcio, de cartão de crédito ou débito e congêneres, de carteira de clientes, de cheques pré-datados e congêneres.', ...getCtn('15.01') },
  '6431000': { item: '15.01', descricao: 'Administração de fundos quaisquer, de consórcio, de cartão de crédito ou débito e congêneres, de carteira de clientes, de cheques pré-datados e congêneres.', ...getCtn('15.01') },
  '6432800': { item: '15.01', descricao: 'Administração de fundos quaisquer, de consórcio, de cartão de crédito ou débito e congêneres, de carteira de clientes, de cheques pré-datados e congêneres.', ...getCtn('15.01') },
  '6450600': { item: '15.09', descricao: 'Arrendamento mercantil (leasing) de quaisquer bens, inclusive cessão de direitos e obrigações, substituição de garantia, alteração, cancelamento e registro de contrato, e demais serviços relacionados ao arrendamento mercantil (leasing).', ...getCtn('15.09') },
  '6499901': { item: '17.20', descricao: 'Consultoria e assessoria econômica ou financeira.', ...getCtn('17.20') },
  '6499999': { item: '17.20', descricao: 'Consultoria e assessoria econômica ou financeira.', ...getCtn('17.20') },

  // ─── 16 – Transporte de Natureza Municipal ─────────────────────────────────
  '4923001': { item: '16.01', descricao: 'Serviços de transporte de natureza municipal.', ...getCtn('16.01') },
  '4923002': { item: '16.01', descricao: 'Serviços de transporte de natureza municipal.', ...getCtn('16.01') },
  '4929901': { item: '16.01', descricao: 'Serviços de transporte de natureza municipal.', ...getCtn('16.01') },
  '4929902': { item: '16.01', descricao: 'Serviços de transporte de natureza municipal.', ...getCtn('16.01') },
  '4929903': { item: '16.01', descricao: 'Serviços de transporte de natureza municipal.', ...getCtn('16.01') },
  '4929904': { item: '16.01', descricao: 'Serviços de transporte de natureza municipal.', ...getCtn('16.01') },
  '4929999': { item: '16.01', descricao: 'Serviços de transporte de natureza municipal.', ...getCtn('16.01') },

  // ─── 17 – Apoio Técnico, Administrativo, Jurídico, Contábil ────────────────
  '6911701': { item: '17.14', descricao: 'Advocacia.', ...getCtn('17.14') },
  '6911702': { item: '17.14', descricao: 'Advocacia.', ...getCtn('17.14') },
  '6920601': { item: '17.19', descricao: 'Contabilidade, inclusive serviços técnicos e auxiliares.', ...getCtn('17.19') },
  '6920602': { item: '17.19', descricao: 'Contabilidade, inclusive serviços técnicos e auxiliares.', ...getCtn('17.19') },
  '7020400': { item: '17.01', descricao: 'Assessoria ou consultoria de qualquer natureza, não contida em outros itens desta lista; análise, exame, pesquisa, coleta, compilação e fornecimento de dados e informações de qualquer natureza, inclusive cadastro e similares.', ...getCtn('17.01') },
  '7311400': { item: '17.06', descricao: 'Propaganda e publicidade, inclusive promoção de vendas, planejamento de campanhas ou sistemas de publicidade, elaboração de desenhos, textos e demais materiais publicitários.', ...getCtn('17.06') },
  '7312200': { item: '17.06', descricao: 'Propaganda e publicidade, inclusive promoção de vendas, planejamento de campanhas ou sistemas de publicidade, elaboração de desenhos, textos e demais materiais publicitários.', ...getCtn('17.06') },
  '7319001': { item: '17.06', descricao: 'Propaganda e publicidade, inclusive promoção de vendas, planejamento de campanhas ou sistemas de publicidade, elaboração de desenhos, textos e demais materiais publicitários.', ...getCtn('17.06') },
  '7319002': { item: '17.06', descricao: 'Propaganda e publicidade, inclusive promoção de vendas, planejamento de campanhas ou sistemas de publicidade, elaboração de desenhos, textos e demais materiais publicitários.', ...getCtn('17.06') },
  '7319003': { item: '17.06', descricao: 'Propaganda e publicidade, inclusive promoção de vendas, planejamento de campanhas ou sistemas de publicidade, elaboração de desenhos, textos e demais materiais publicitários.', ...getCtn('17.06') },
  '7319004': { item: '17.06', descricao: 'Propaganda e publicidade, inclusive promoção de vendas, planejamento de campanhas ou sistemas de publicidade, elaboração de desenhos, textos e demais materiais publicitários.', ...getCtn('17.06') },
  '7410202': { item: '17.06', descricao: 'Propaganda e publicidade, inclusive promoção de vendas, planejamento de campanhas ou sistemas de publicidade, elaboração de desenhos, textos e demais materiais publicitários.', ...getCtn('17.06') },
  '7410203': { item: '17.10', descricao: 'Planejamento, organização e administração de feiras, exposições, congressos e congêneres.', ...getCtn('17.10') },
  '7490102': { item: '17.01', descricao: 'Assessoria ou consultoria de qualquer natureza, não contida em outros itens desta lista; análise, exame, pesquisa, coleta, compilação e fornecimento de dados e informações de qualquer natureza, inclusive cadastro e similares.', ...getCtn('17.01') },
  '7490103': { item: '17.01', descricao: 'Assessoria ou consultoria de qualquer natureza, não contida em outros itens desta lista; análise, exame, pesquisa, coleta, compilação e fornecimento de dados e informações de qualquer natureza, inclusive cadastro e similares.', ...getCtn('17.01') },
  '7490105': { item: '17.01', descricao: 'Assessoria ou consultoria de qualquer natureza, não contida em outros itens desta lista; análise, exame, pesquisa, coleta, compilação e fornecimento de dados e informações de qualquer natureza, inclusive cadastro e similares.', ...getCtn('17.01') },
  '8219901': { item: '17.02', descricao: 'Datilografia, digitação, estenografia, expediente, secretaria em geral, resposta audível, redação, edição, interpretação, revisão, tradução, apoio e infra-estrutura administrativa e congêneres.', ...getCtn('17.02') },
  '8219999': { item: '17.02', descricao: 'Datilografia, digitação, estenografia, expediente, secretaria em geral, resposta audível, redação, edição, interpretação, revisão, tradução, apoio e infra-estrutura administrativa e congêneres.', ...getCtn('17.02') },
  '8299701': { item: '17.02', descricao: 'Datilografia, digitação, estenografia, expediente, secretaria em geral, resposta audível, redação, edição, interpretação, revisão, tradução, apoio e infra-estrutura administrativa e congêneres.', ...getCtn('17.02') },
  '8299702': { item: '17.11', descricao: 'Organização de festas e recepções; bufê (exceto o fornecimento de alimentação e bebidas, que fica sujeito ao ICMS).', ...getCtn('17.11') },
  '8299703': { item: '17.01', descricao: 'Assessoria ou consultoria de qualquer natureza, não contida em outros itens desta lista; análise, exame, pesquisa, coleta, compilação e fornecimento de dados e informações de qualquer natureza, inclusive cadastro e similares.', ...getCtn('17.01') },
  '8299704': { item: '17.01', descricao: 'Assessoria ou consultoria de qualquer natureza, não contida em outros itens desta lista; análise, exame, pesquisa, coleta, compilação e fornecimento de dados e informações de qualquer natureza, inclusive cadastro e similares.', ...getCtn('17.01') },
  '8299705': { item: '17.02', descricao: 'Datilografia, digitação, estenografia, expediente, secretaria em geral, resposta audível, redação, edição, interpretação, revisão, tradução, apoio e infra-estrutura administrativa e congêneres.', ...getCtn('17.02') },
  '8299706': { item: '17.01', descricao: 'Assessoria ou consultoria de qualquer natureza, não contida em outros itens desta lista; análise, exame, pesquisa, coleta, compilação e fornecimento de dados e informações de qualquer natureza, inclusive cadastro e similares.', ...getCtn('17.01') },
  '8299707': { item: '17.01', descricao: 'Assessoria ou consultoria de qualquer natureza, não contida em outros itens desta lista; análise, exame, pesquisa, coleta, compilação e fornecimento de dados e informações de qualquer natureza, inclusive cadastro e similares.', ...getCtn('17.01') },
  '8299799': { item: '17.01', descricao: 'Assessoria ou consultoria de qualquer natureza, não contida em outros itens desta lista; análise, exame, pesquisa, coleta, compilação e fornecimento de dados e informações de qualquer natureza, inclusive cadastro e similares.', ...getCtn('17.01') },

  // ─── 21 – Registros Públicos, Cartorários, Notariais ───────────────────────
  '6912500': { item: '21.01', descricao: 'Serviços de registros públicos, cartorários e notariais.', ...getCtn('21.01') },

  // ─── 23 – Comunicação Visual, Desenho Industrial ───────────────────────────
  '7410201': { item: '23.01', descricao: 'Serviços de programação e comunicação visual, desenho industrial e congêneres.', ...getCtn('23.01') },
  '7410299': { item: '23.01', descricao: 'Serviços de programação e comunicação visual, desenho industrial e congêneres.', ...getCtn('23.01') },

  // ─── 25 – Funerários ────────────────────────────────────────────────────────
  '9603301': { item: '25.01', descricao: 'Funerais, inclusive fornecimento de caixão, urna ou esquifes; aluguel de capela; transporte do corpo cadavérico; fornecimento de flores, coroas e outros paramentos; desembaraço de certidão de óbito; fornecimento de véu, essa e outros adornos; embalsamento, embelezamento, conservação ou restauração de cadáveres.', ...getCtn('25.01') },
  '9603302': { item: '25.02', descricao: 'Cremação de corpos e partes de corpos cadavéricos.', ...getCtn('25.02') },
  '9603303': { item: '25.04', descricao: 'Manutenção e conservação de jazigos e cemitérios.', ...getCtn('25.04') },
  '9603304': { item: '25.01', descricao: 'Funerais, inclusive fornecimento de caixão, urna ou esquifes; aluguel de capela; transporte do corpo cadavérico; fornecimento de flores, coroas e outros paramentos; desembaraço de certidão de óbito; fornecimento de véu, essa e outros adornos; embalsamento, embelezamento, conservação ou restauração de cadáveres.', ...getCtn('25.01') },

  // ─── 26 – Coleta, Remessa ou Entrega de Correspondências ───────────────────
  '5310501': { item: '26.01', descricao: 'Serviços de coleta, remessa ou entrega de correspondências, documentos, objetos, bens ou valores, inclusive pelos correios e suas agências franqueadas; courrier e congêneres.', ...getCtn('26.01') },
  '5310502': { item: '26.01', descricao: 'Serviços de coleta, remessa ou entrega de correspondências, documentos, objetos, bens ou valores, inclusive pelos correios e suas agências franqueadas; courrier e congêneres.', ...getCtn('26.01') },
  '5320201': { item: '26.01', descricao: 'Serviços de coleta, remessa ou entrega de correspondências, documentos, objetos, bens ou valores, inclusive pelos correios e suas agências franqueadas; courrier e congêneres.', ...getCtn('26.01') },
  '5320202': { item: '26.01', descricao: 'Serviços de coleta, remessa ou entrega de correspondências, documentos, objetos, bens ou valores, inclusive pelos correios e suas agências franqueadas; courrier e congêneres.', ...getCtn('26.01') },

  // ─── 28 – Avaliação de Bens e Serviços ─────────────────────────────────────
  '6911703': { item: '28.01', descricao: 'Serviços de avaliação de bens e serviços de qualquer natureza.', ...getCtn('28.01') },
  '7490199': { item: '28.01', descricao: 'Serviços de avaliação de bens e serviços de qualquer natureza.', ...getCtn('28.01') },

  // ─── 30 – Biologia, Biotecnologia e Química ────────────────────────────────
  '7110701': { item: '30.01', descricao: 'Serviços de biologia, biotecnologia e química.', ...getCtn('30.01') },
  '7120000': { item: '30.01', descricao: 'Serviços de biologia, biotecnologia e química.', ...getCtn('30.01') },
  '7110703': { item: '30.01', descricao: 'Serviços de biologia, biotecnologia e química.', ...getCtn('30.01') },

  // ─── 31 – Serviços Técnicos em Edificações, Eletrônica, Mecânica ───────────
  '7110702': { item: '31.01', descricao: 'Serviços técnicos em edificações, eletrônica, eletrotécnica, mecânica, telecomunicações e congêneres.', ...getCtn('31.01') },

  // ─── 33 – Desembaraço Aduaneiro, Despachantes ──────────────────────────────
  '5229001': { item: '33.01', descricao: 'Serviços de desembaraço aduaneiro, comissários, despachantes e congêneres.', ...getCtn('33.01') },

  // ─── 35 – Reportagem, Jornalismo ────────────────────────────────────────────
  '6391701': { item: '35.01', descricao: 'Serviços de reportagem, assessoria de imprensa, jornalismo e relações públicas.', ...getCtn('35.01') },
  '7410204': { item: '35.01', descricao: 'Serviços de reportagem, assessoria de imprensa, jornalismo e relações públicas.', ...getCtn('35.01') },

  // ─── 37 – Artistas, Atletas, Modelos ────────────────────────────────────────
  '9003500': { item: '37.01', descricao: 'Serviços de artistas, atletas, modelos e manequins.', ...getCtn('37.01') },
  '7490106': { item: '37.01', descricao: 'Serviços de artistas, atletas, modelos e manequins.', ...getCtn('37.01') },
};

export interface CNAEEntry {
  codigo: string;
  descricao: string;
  lc116: LC116Item;
}

/** Lista de todos os CNAEs mapeados com seus dados LC 116 */
export const CNAE_LIST: CNAEEntry[] = Object.entries(CNAE_LC116_MAP).map(([codigo, lc]) => ({
  codigo,
  descricao: `${lc.item} – ${lc.descricao}`,
  lc116: lc,
}));

/**
 * Retorna o item da LC 116/2003 correspondente ao código CNAE informado.
 * Remove pontuação do código antes de buscar.
 */
export function getLC116Item(codigoCnae: string | number): LC116Item | null {
  const cleaned = String(codigoCnae).replace(/\D/g, '');
  return CNAE_LC116_MAP[cleaned] ?? null;
}

export function formatCNAECode(codigo: string): string {
  const str = codigo.replace(/\D/g, '').padStart(7, '0');
  if (str.length >= 7) {
    return `${str.slice(0, 4)}-${str.slice(4, 5)}/${str.slice(5, 7)}`;
  }
  return str;
}

