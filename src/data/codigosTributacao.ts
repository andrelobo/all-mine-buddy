export interface CodigoTributacao {
  code: string;
  desc: string;
  group: string;
}

export const CODIGOS_TRIBUTACAO: CodigoTributacao[] = [
  // 1 – Serviços de informática e congêneres
  { code: '01.01', desc: 'Análise e desenvolvimento de sistemas', group: '1 – Informática' },
  { code: '01.02', desc: 'Programação', group: '1 – Informática' },
  { code: '01.03', desc: 'Processamento de dados e congêneres', group: '1 – Informática' },
  { code: '01.04', desc: 'Elaboração de programas de computadores, inclusive de jogos eletrônicos', group: '1 – Informática' },
  { code: '01.05', desc: 'Licenciamento ou cessão de direito de uso de programas de computação', group: '1 – Informática' },
  { code: '01.06', desc: 'Assessoria e consultoria em informática', group: '1 – Informática' },
  { code: '01.07', desc: 'Suporte técnico em informática, inclusive instalação, configuração e manutenção de programas de computação e bancos de dados', group: '1 – Informática' },
  { code: '01.08', desc: 'Planejamento, confecção, manutenção e atualização de páginas eletrônicas', group: '1 – Informática' },

  // 2 – Serviços de pesquisas e desenvolvimento
  { code: '02.01', desc: 'Serviços de pesquisas e desenvolvimento de qualquer natureza', group: '2 – Pesquisa e Desenvolvimento' },

  // 3 – Serviços de locação, cessão de direito de uso e congêneres
  { code: '03.02', desc: 'Cessão de direito de uso de marcas e de sinais de propaganda', group: '3 – Locação e Cessão' },
  { code: '03.03', desc: 'Exploração de salões de festas, centro de convenções, escritórios virtuais, stands, quadras esportivas, estádios, ginásios, auditórios, casas de espetáculos, parques de diversões, canchas e congêneres', group: '3 – Locação e Cessão' },
  { code: '03.04', desc: 'Locação, sublocação, arrendamento, direito de passagem ou permissão de uso, compartilhado ou não, de ferrovia, rodovia, postes, cabos, dutos e condutos de qualquer natureza', group: '3 – Locação e Cessão' },
  { code: '03.05', desc: 'Cessão de andaimes, palcos, coberturas e outras estruturas de uso temporário', group: '3 – Locação e Cessão' },

  // 4 – Serviços de saúde, assistência médica e congêneres
  { code: '04.01', desc: 'Medicina e biomedicina', group: '4 – Saúde' },
  { code: '04.02', desc: 'Análises clínicas, patologia, eletricidade médica, radioterapia, quimioterapia, ultra-sonografia, ressonância magnética, radiologia, tomografia e congêneres', group: '4 – Saúde' },
  { code: '04.03', desc: 'Hospitais, clínicas, laboratórios, sanatórios, manicômios, casas de saúde, prontos-socorros, ambulatórios e congêneres', group: '4 – Saúde' },
  { code: '04.04', desc: 'Instrumentação cirúrgica', group: '4 – Saúde' },
  { code: '04.05', desc: 'Acupuntura', group: '4 – Saúde' },
  { code: '04.06', desc: 'Enfermagem, inclusive serviços auxiliares', group: '4 – Saúde' },
  { code: '04.07', desc: 'Serviços farmacêuticos', group: '4 – Saúde' },
  { code: '04.08', desc: 'Terapia ocupacional, fisioterapia e fonoaudiologia', group: '4 – Saúde' },
  { code: '04.09', desc: 'Terapias de qualquer espécie destinadas ao tratamento físico, orgânico e mental', group: '4 – Saúde' },
  { code: '04.10', desc: 'Nutrição', group: '4 – Saúde' },
  { code: '04.11', desc: 'Obstetrícia', group: '4 – Saúde' },
  { code: '04.12', desc: 'Odontologia', group: '4 – Saúde' },
  { code: '04.13', desc: 'Ortóptica', group: '4 – Saúde' },
  { code: '04.14', desc: 'Próteses sob encomenda', group: '4 – Saúde' },
  { code: '04.15', desc: 'Psicanálise', group: '4 – Saúde' },
  { code: '04.16', desc: 'Psicologia', group: '4 – Saúde' },
  { code: '04.17', desc: 'Casas de repouso e de recuperação, creches, asilos e congêneres', group: '4 – Saúde' },
  { code: '04.18', desc: 'Inseminação artificial, fertilização in vitro e congêneres', group: '4 – Saúde' },
  { code: '04.19', desc: 'Bancos de sangue, leite, pele, olhos, óvulos, sêmen e congêneres', group: '4 – Saúde' },
  { code: '04.20', desc: 'Coleta de sangue, leite, tecidos, sêmen, órgãos e materiais biológicos de qualquer espécie', group: '4 – Saúde' },
  { code: '04.21', desc: 'Unidade de atendimento, assistência ou tratamento móvel e congêneres', group: '4 – Saúde' },
  { code: '04.22', desc: 'Planos de medicina de grupo ou individual e convênios para prestação de assistência médica, hospitalar, odontológica e congêneres', group: '4 – Saúde' },
  { code: '04.23', desc: 'Outros planos de saúde que se cumpram através de serviços de terceiros contratados, credenciados, cooperados ou apenas pagos pelo operador do plano mediante indicação do beneficiário', group: '4 – Saúde' },

  // 5 – Serviços de medicina e assistência veterinária
  { code: '05.01', desc: 'Medicina veterinária e zootecnia', group: '5 – Veterinária' },
  { code: '05.02', desc: 'Hospitais, clínicas, ambulatórios, prontos-socorros e congêneres, na área veterinária', group: '5 – Veterinária' },
  { code: '05.03', desc: 'Laboratórios de análise na área veterinária', group: '5 – Veterinária' },
  { code: '05.04', desc: 'Inseminação artificial, fertilização in vitro e congêneres', group: '5 – Veterinária' },
  { code: '05.05', desc: 'Bancos de sangue e de órgãos e congêneres', group: '5 – Veterinária' },
  { code: '05.06', desc: 'Coleta de sangue, leite, tecidos, sêmen, órgãos e materiais biológicos de qualquer espécie', group: '5 – Veterinária' },
  { code: '05.07', desc: 'Unidade de atendimento, assistência ou tratamento móvel e congêneres', group: '5 – Veterinária' },
  { code: '05.08', desc: 'Guarda, tratamento, amestramento, embelezamento, alojamento e congêneres', group: '5 – Veterinária' },
  { code: '05.09', desc: 'Planos de atendimento e assistência médico-veterinária', group: '5 – Veterinária' },

  // 6 – Serviços de cuidados pessoais, estética, atividades físicas
  { code: '06.01', desc: 'Barbearia, cabeleireiros, manicuros, pedicuros e congêneres', group: '6 – Cuidados Pessoais' },
  { code: '06.02', desc: 'Esteticistas, tratamento de pele, depilação e congêneres', group: '6 – Cuidados Pessoais' },
  { code: '06.03', desc: 'Banhos, duchas, sauna, massagens e congêneres', group: '6 – Cuidados Pessoais' },
  { code: '06.04', desc: 'Ginástica, dança, esportes, natação, artes marciais e demais atividades físicas', group: '6 – Cuidados Pessoais' },
  { code: '06.05', desc: 'Centros de emagrecimento, spa e congêneres', group: '6 – Cuidados Pessoais' },

  // 7 – Serviços de engenharia, arquitetura, construção civil
  { code: '07.01', desc: 'Engenharia, agronomia, agrimensura, arquitetura, geologia, urbanismo, paisagismo e congêneres', group: '7 – Engenharia e Construção' },
  { code: '07.02', desc: 'Execução, por administração, empreitada ou subempreitada, de obras de construção civil, hidráulica ou elétrica e de outras obras semelhantes', group: '7 – Engenharia e Construção' },
  { code: '07.03', desc: 'Elaboração de planos diretores, estudos de viabilidade, estudos organizacionais e outros, relacionados com obras e serviços de engenharia', group: '7 – Engenharia e Construção' },
  { code: '07.04', desc: 'Demolição', group: '7 – Engenharia e Construção' },
  { code: '07.05', desc: 'Reparação, conservação e reforma de edifícios, estradas, pontes, portos e congêneres', group: '7 – Engenharia e Construção' },
  { code: '07.06', desc: 'Colocação e instalação de tapetes, carpetes, assoalhos, cortinas, revestimentos de parede, vidros, divisórias, placas de gesso e congêneres', group: '7 – Engenharia e Construção' },
  { code: '07.07', desc: 'Recuperação, raspagem, polimento e lustração de pisos e congêneres', group: '7 – Engenharia e Construção' },
  { code: '07.08', desc: 'Calafetação', group: '7 – Engenharia e Construção' },
  { code: '07.09', desc: 'Varrição, coleta, remoção, incineração, tratamento, reciclagem, separação e destinação final de lixo, rejeitos e outros resíduos', group: '7 – Engenharia e Construção' },
  { code: '07.10', desc: 'Limpeza, manutenção e conservação de vias e logradouros públicos, imóveis, chaminés, piscinas, parques, jardins e congêneres', group: '7 – Engenharia e Construção' },
  { code: '07.11', desc: 'Decoração e jardinagem, inclusive corte e poda de árvores', group: '7 – Engenharia e Construção' },
  { code: '07.12', desc: 'Controle e tratamento de efluentes de qualquer natureza e de agentes físicos, químicos e biológicos', group: '7 – Engenharia e Construção' },
  { code: '07.13', desc: 'Dedetização, desinfecção, desinsetização, imunização, higienização, desratização, pulverização e congêneres', group: '7 – Engenharia e Construção' },
  { code: '07.16', desc: 'Florestamento, reflorestamento, semeadura, adubação e congêneres', group: '7 – Engenharia e Construção' },
  { code: '07.17', desc: 'Escoramento, contenção de encostas e serviços congêneres', group: '7 – Engenharia e Construção' },
  { code: '07.18', desc: 'Limpeza e dragagem de rios, portos, canais, baías, lagos, lagoas, represas, açudes e congêneres', group: '7 – Engenharia e Construção' },
  { code: '07.19', desc: 'Acompanhamento e fiscalização da execução de obras de engenharia, arquitetura e urbanismo', group: '7 – Engenharia e Construção' },
  { code: '07.20', desc: 'Aerofotogrametria, cartografia, mapeamento, levantamentos topográficos, batimétricos, geográficos, geodésicos, geológicos, geofísicos e congêneres', group: '7 – Engenharia e Construção' },
  { code: '07.21', desc: 'Pesquisa, perfuração, cimentação, mergulho, perfilagem, concretação, testemunhagem, pescaria, estimulação e outros serviços relacionados com a exploração de petróleo e gás natural', group: '7 – Engenharia e Construção' },
  { code: '07.22', desc: 'Nucleação e bombardeamento de nuvens e congêneres', group: '7 – Engenharia e Construção' },

  // 8 – Serviços de educação, ensino
  { code: '08.01', desc: 'Ensino regular pré-escolar, fundamental, médio e superior', group: '8 – Educação' },
  { code: '08.02', desc: 'Instrução, treinamento, orientação pedagógica e educacional, avaliação de conhecimentos de qualquer natureza', group: '8 – Educação' },

  // 9 – Serviços de hospedagem, turismo, viagens
  { code: '09.01', desc: 'Hospedagem de qualquer natureza em hotéis, apart-service, flat, apart-hotéis, motéis, pensões e congêneres', group: '9 – Hospedagem e Turismo' },
  { code: '09.02', desc: 'Agenciamento, organização, promoção, intermediação e execução de programas de turismo, passeios, viagens, excursões, hospedagens e congêneres', group: '9 – Hospedagem e Turismo' },
  { code: '09.03', desc: 'Guias de turismo', group: '9 – Hospedagem e Turismo' },

  // 10 – Serviços de intermediação
  { code: '10.01', desc: 'Agenciamento, corretagem ou intermediação de câmbio, de seguros, de cartões de crédito, de planos de saúde e de planos de previdência privada', group: '10 – Intermediação' },
  { code: '10.02', desc: 'Agenciamento, corretagem ou intermediação de títulos em geral, valores mobiliários e contratos quaisquer', group: '10 – Intermediação' },
  { code: '10.03', desc: 'Agenciamento, corretagem ou intermediação de direitos de propriedade industrial, artística ou literária', group: '10 – Intermediação' },
  { code: '10.04', desc: 'Agenciamento, corretagem ou intermediação de contratos de arrendamento mercantil (leasing), de franquia (franchising) e de faturização (factoring)', group: '10 – Intermediação' },
  { code: '10.05', desc: 'Agenciamento, corretagem ou intermediação de bens móveis ou imóveis, não abrangidos em outros itens ou subitens', group: '10 – Intermediação' },
  { code: '10.06', desc: 'Agenciamento marítimo', group: '10 – Intermediação' },
  { code: '10.07', desc: 'Agenciamento de notícias', group: '10 – Intermediação' },
  { code: '10.08', desc: 'Agenciamento de publicidade e propaganda, inclusive o agenciamento de veiculação por quaisquer meios', group: '10 – Intermediação' },
  { code: '10.09', desc: 'Representação de qualquer natureza, inclusive comercial', group: '10 – Intermediação' },
  { code: '10.10', desc: 'Distribuição de bens de terceiros', group: '10 – Intermediação' },

  // 11 – Serviços de guarda, estacionamento, vigilância
  { code: '11.01', desc: 'Guarda e estacionamento de veículos terrestres automotores, de aeronaves e de embarcações', group: '11 – Guarda e Vigilância' },
  { code: '11.02', desc: 'Vigilância, segurança ou monitoramento de bens e pessoas', group: '11 – Guarda e Vigilância' },
  { code: '11.03', desc: 'Escolta, inclusive de veículos e cargas', group: '11 – Guarda e Vigilância' },
  { code: '11.04', desc: 'Armazenamento, depósito, carga, descarga, arrumação e guarda de bens de qualquer espécie', group: '11 – Guarda e Vigilância' },

  // 12 – Serviços de diversões, lazer, entretenimento
  { code: '12.01', desc: 'Espetáculos teatrais', group: '12 – Diversões e Lazer' },
  { code: '12.02', desc: 'Exibições cinematográficas', group: '12 – Diversões e Lazer' },
  { code: '12.03', desc: 'Espetáculos circenses', group: '12 – Diversões e Lazer' },
  { code: '12.04', desc: 'Programas de auditório', group: '12 – Diversões e Lazer' },
  { code: '12.05', desc: 'Parques de diversões, centros de lazer e congêneres', group: '12 – Diversões e Lazer' },
  { code: '12.06', desc: 'Boates, taxi-dancing e congêneres', group: '12 – Diversões e Lazer' },
  { code: '12.07', desc: 'Shows, ballet, danças, desfiles, bailes, óperas, concertos, recitais, festivais e congêneres', group: '12 – Diversões e Lazer' },
  { code: '12.08', desc: 'Feiras, exposições, congressos e congêneres', group: '12 – Diversões e Lazer' },
  { code: '12.09', desc: 'Bilhares, boliches e diversões eletrônicas ou não', group: '12 – Diversões e Lazer' },
  { code: '12.10', desc: 'Corridas e competições de animais', group: '12 – Diversões e Lazer' },
  { code: '12.11', desc: 'Competições esportivas ou de destreza física ou intelectual, com ou sem a participação do espectador', group: '12 – Diversões e Lazer' },
  { code: '12.12', desc: 'Execução de música', group: '12 – Diversões e Lazer' },
  { code: '12.13', desc: 'Produção, mediante ou sem encomenda prévia, de eventos, espetáculos, entrevistas, shows, ballet, danças, desfiles, bailes, teatros, óperas, concertos, recitais, festivais e congêneres', group: '12 – Diversões e Lazer' },
  { code: '12.14', desc: 'Fornecimento de música para ambientes fechados ou não, mediante transmissão por qualquer processo', group: '12 – Diversões e Lazer' },
  { code: '12.15', desc: 'Desfiles de blocos carnavalescos ou folclóricos, trios elétricos e congêneres', group: '12 – Diversões e Lazer' },
  { code: '12.16', desc: 'Exibição de filmes, entrevistas, musicais, espetáculos, shows, concertos, desfiles, óperas, competições esportivas, de destreza intelectual ou congêneres', group: '12 – Diversões e Lazer' },
  { code: '12.17', desc: 'Recreação e animação, inclusive em festas e eventos de qualquer natureza', group: '12 – Diversões e Lazer' },

  // 13 – Serviços de fonografia, fotografia, cinematografia e reprografia
  { code: '13.02', desc: 'Fonografia ou gravação de sons, inclusive trucagem, dublagem, mixagem e congêneres', group: '13 – Fonografia e Fotografia' },
  { code: '13.03', desc: 'Fotografia e cinematografia, inclusive revelação, ampliação, cópia, reprodução, trucagem e congêneres', group: '13 – Fonografia e Fotografia' },
  { code: '13.04', desc: 'Reprografia, microfilmagem e digitalização', group: '13 – Fonografia e Fotografia' },
  { code: '13.05', desc: 'Composição gráfica, fotocomposição, clicheria, zincografia, litografia, fotolitografia', group: '13 – Fonografia e Fotografia' },

  // 14 – Serviços relativos a bens de terceiros
  { code: '14.01', desc: 'Lubrificação, limpeza, lustração, revisão, carga e recarga, conserto, restauração, blindagem, manutenção e conservação de máquinas, veículos, aparelhos, equipamentos, motores, elevadores ou de qualquer objeto', group: '14 – Bens de Terceiros' },
  { code: '14.02', desc: 'Assistência técnica', group: '14 – Bens de Terceiros' },
  { code: '14.03', desc: 'Recondicionamento de motores', group: '14 – Bens de Terceiros' },
  { code: '14.04', desc: 'Recauchutagem ou regeneração de pneus', group: '14 – Bens de Terceiros' },
  { code: '14.05', desc: 'Restauração, recondicionamento, acondicionamento, pintura, beneficiamento, lavagem, secagem, tingimento, galvanoplastia, anodização, corte, recorte, polimento, plastificação e congêneres', group: '14 – Bens de Terceiros' },
  { code: '14.06', desc: 'Instalação e montagem de aparelhos, máquinas e equipamentos, inclusive montagem industrial, prestados ao usuário final', group: '14 – Bens de Terceiros' },
  { code: '14.07', desc: 'Colocação de molduras e congêneres', group: '14 – Bens de Terceiros' },
  { code: '14.08', desc: 'Encadernação, gravação e douração de livros, revistas e congêneres', group: '14 – Bens de Terceiros' },
  { code: '14.09', desc: 'Alfaiataria e costura, quando o material for fornecido pelo usuário final, exceto aviamento', group: '14 – Bens de Terceiros' },
  { code: '14.10', desc: 'Tinturaria e lavanderia', group: '14 – Bens de Terceiros' },
  { code: '14.11', desc: 'Tapeçaria e reforma de estofamentos em geral', group: '14 – Bens de Terceiros' },
  { code: '14.12', desc: 'Funilaria e lanternagem', group: '14 – Bens de Terceiros' },
  { code: '14.13', desc: 'Carpintaria e serralheria', group: '14 – Bens de Terceiros' },

  // 15 – Serviços bancários e financeiros
  { code: '15.01', desc: 'Administração de fundos quaisquer, de consórcio, de cartão de crédito ou débito e congêneres', group: '15 – Bancário e Financeiro' },
  { code: '15.02', desc: 'Abertura de contas em geral, inclusive conta-corrente, conta de investimentos e aplicação e caderneta de poupança', group: '15 – Bancário e Financeiro' },
  { code: '15.03', desc: 'Locação e manutenção de cofres particulares, de terminais eletrônicos, de terminais de atendimento e de bens e equipamentos em geral', group: '15 – Bancário e Financeiro' },
  { code: '15.04', desc: 'Fornecimento ou emissão de atestados em geral, inclusive atestado de idoneidade, atestado de capacidade financeira e congêneres', group: '15 – Bancário e Financeiro' },
  { code: '15.05', desc: 'Cadastro, elaboração de ficha cadastral, renovação cadastral e congêneres', group: '15 – Bancário e Financeiro' },
  { code: '15.06', desc: 'Emissão, reemissão e fornecimento de avisos, comprovantes e documentos em geral; abono de firmas; coleta e entrega de documentos, bens e valores', group: '15 – Bancário e Financeiro' },
  { code: '15.07', desc: 'Acesso, movimentação, atendimento e consulta a contas em geral, por qualquer meio ou processo', group: '15 – Bancário e Financeiro' },
  { code: '15.08', desc: 'Emissão, reemissão, alteração, cessão, substituição, cancelamento e registro de contrato de crédito', group: '15 – Bancário e Financeiro' },
  { code: '15.09', desc: 'Arrendamento mercantil (leasing) de quaisquer bens', group: '15 – Bancário e Financeiro' },
  { code: '15.10', desc: 'Serviços relacionados a cobranças, recebimentos ou pagamentos em geral', group: '15 – Bancário e Financeiro' },
  { code: '15.11', desc: 'Devolução de títulos, protesto de títulos, sustação de protesto, manutenção de títulos, reapresentação de títulos e demais serviços', group: '15 – Bancário e Financeiro' },
  { code: '15.12', desc: 'Custódia em geral, inclusive de títulos e valores mobiliários', group: '15 – Bancário e Financeiro' },
  { code: '15.13', desc: 'Serviços relacionados a operações de câmbio em geral', group: '15 – Bancário e Financeiro' },
  { code: '15.14', desc: 'Fornecimento, emissão, reemissão, renovação e manutenção de cartão magnético, cartão de crédito, cartão de débito, cartão salário e congêneres', group: '15 – Bancário e Financeiro' },
  { code: '15.15', desc: 'Compensação de cheques e títulos quaisquer; serviços relacionados a depósito', group: '15 – Bancário e Financeiro' },
  { code: '15.16', desc: 'Emissão, reemissão, liquidação, alteração, cancelamento e baixa de ordens de pagamento, ordens de crédito e similares', group: '15 – Bancário e Financeiro' },
  { code: '15.17', desc: 'Emissão, fornecimento, devolução, sustação, cancelamento e oposição de cheques quaisquer', group: '15 – Bancário e Financeiro' },
  { code: '15.18', desc: 'Serviços relacionados a crédito imobiliário, avaliação e vistoria de imóvel ou obra', group: '15 – Bancário e Financeiro' },

  // 16 – Serviços de transporte municipal
  { code: '16.01', desc: 'Serviços de transporte de natureza municipal', group: '16 – Transporte Municipal' },

  // 17 – Serviços de apoio técnico, administrativo, jurídico, contábil
  { code: '17.01', desc: 'Assessoria ou consultoria de qualquer natureza, não contida em outros itens desta lista', group: '17 – Apoio Técnico e Administrativo' },
  { code: '17.02', desc: 'Datilografia, digitação, estenografia, expediente, secretaria em geral, resposta audível, redação, edição, interpretação, revisão, tradução e congêneres', group: '17 – Apoio Técnico e Administrativo' },
  { code: '17.03', desc: 'Planejamento, coordenação, programação ou organização técnica, financeira ou administrativa', group: '17 – Apoio Técnico e Administrativo' },
  { code: '17.04', desc: 'Recrutamento, agenciamento, seleção e colocação de mão-de-obra', group: '17 – Apoio Técnico e Administrativo' },
  { code: '17.05', desc: 'Fornecimento de mão-de-obra, mesmo em caráter temporário', group: '17 – Apoio Técnico e Administrativo' },
  { code: '17.06', desc: 'Propaganda e publicidade, inclusive promoção de vendas, planejamento de campanhas ou sistemas de publicidade', group: '17 – Apoio Técnico e Administrativo' },
  { code: '17.08', desc: 'Franquia (franchising)', group: '17 – Apoio Técnico e Administrativo' },
  { code: '17.09', desc: 'Perícias, laudos, exames técnicos e análises técnicas', group: '17 – Apoio Técnico e Administrativo' },
  { code: '17.10', desc: 'Planejamento, organização e administração de feiras, exposições, congressos e congêneres', group: '17 – Apoio Técnico e Administrativo' },
  { code: '17.11', desc: 'Organização de festas e recepções; bufê', group: '17 – Apoio Técnico e Administrativo' },
  { code: '17.12', desc: 'Administração em geral, inclusive de bens e negócios de terceiros', group: '17 – Apoio Técnico e Administrativo' },
  { code: '17.13', desc: 'Leilão e congêneres', group: '17 – Apoio Técnico e Administrativo' },
  { code: '17.14', desc: 'Advocacia', group: '17 – Apoio Técnico e Administrativo' },
  { code: '17.15', desc: 'Arbitragem de qualquer espécie, inclusive jurídica', group: '17 – Apoio Técnico e Administrativo' },
  { code: '17.16', desc: 'Auditoria', group: '17 – Apoio Técnico e Administrativo' },
  { code: '17.17', desc: 'Análise de Organização e Métodos', group: '17 – Apoio Técnico e Administrativo' },
  { code: '17.18', desc: 'Atuária e cálculos técnicos de qualquer natureza', group: '17 – Apoio Técnico e Administrativo' },
  { code: '17.19', desc: 'Contabilidade, inclusive serviços técnicos e auxiliares', group: '17 – Apoio Técnico e Administrativo' },
  { code: '17.20', desc: 'Consultoria e assessoria econômica ou financeira', group: '17 – Apoio Técnico e Administrativo' },
  { code: '17.21', desc: 'Estatística', group: '17 – Apoio Técnico e Administrativo' },
  { code: '17.22', desc: 'Cobrança em geral', group: '17 – Apoio Técnico e Administrativo' },
  { code: '17.23', desc: 'Assessoria, análise, avaliação, atendimento, consulta, cadastro, seleção, gerenciamento de informações, administração de contas a receber ou a pagar, relacionados a operações de faturização (factoring)', group: '17 – Apoio Técnico e Administrativo' },
  { code: '17.24', desc: 'Apresentação de palestras, conferências, seminários e congêneres', group: '17 – Apoio Técnico e Administrativo' },

  // 18 – Serviços de regulação de sinistros e seguros
  { code: '18.01', desc: 'Serviços de regulação de sinistros vinculados a contratos de seguros; inspeção e avaliação de riscos para cobertura de contratos de seguros; prevenção e gerência de riscos seguráveis', group: '18 – Seguros' },

  // 19 – Serviços de loterias e apostas
  { code: '19.01', desc: 'Serviços de distribuição e venda de bilhetes e demais produtos de loteria, bingos, cartões, pules ou cupons de apostas, sorteios, prêmios e congêneres', group: '19 – Loterias e Apostas' },

  // 20 – Serviços portuários, aeroportuários e de terminais
  { code: '20.01', desc: 'Serviços portuários, ferroportuários, utilização de porto, movimentação de passageiros, reboque de embarcações, capatazia, armazenagem e congêneres', group: '20 – Portuários e Aeroportuários' },
  { code: '20.02', desc: 'Serviços aeroportuários, utilização de aeroporto, movimentação de passageiros, armazenagem, capatazia e congêneres', group: '20 – Portuários e Aeroportuários' },
  { code: '20.03', desc: 'Serviços de terminais rodoviários, ferroviários, metroviários, movimentação de passageiros, mercadorias e congêneres', group: '20 – Portuários e Aeroportuários' },

  // 21 – Serviços de registros públicos, cartorários e notariais
  { code: '21.01', desc: 'Serviços de registros públicos, cartorários e notariais', group: '21 – Registros Públicos' },

  // 22 – Serviços de exploração de rodovia
  { code: '22.01', desc: 'Serviços de exploração de rodovia mediante cobrança de preço ou pedágio dos usuários', group: '22 – Exploração de Rodovia' },

  // 23 – Serviços de programação e comunicação visual
  { code: '23.01', desc: 'Serviços de programação e comunicação visual, desenho industrial e congêneres', group: '23 – Comunicação Visual' },

  // 24 – Serviços de chaveiros, carimbos, placas
  { code: '24.01', desc: 'Serviços de chaveiros, confecção de carimbos, placas, sinalização visual, banners, adesivos e congêneres', group: '24 – Chaveiros e Sinalização' },

  // 25 – Serviços funerários
  { code: '25.01', desc: 'Funerais, inclusive fornecimento de caixão, urna ou esquifes; aluguel de capela; transporte do corpo cadavérico e congêneres', group: '25 – Funerários' },
  { code: '25.02', desc: 'Cremação de corpos e partes de corpos cadavéricos', group: '25 – Funerários' },
  { code: '25.03', desc: 'Planos ou convênio funerários', group: '25 – Funerários' },
  { code: '25.04', desc: 'Manutenção e conservação de jazigos e cemitérios', group: '25 – Funerários' },

  // 26 – Serviços de coleta, remessa ou entrega
  { code: '26.01', desc: 'Serviços de coleta, remessa ou entrega de correspondências, documentos, objetos, bens ou valores, inclusive pelos correios e suas agências franqueadas; courrier e congêneres', group: '26 – Coleta e Entrega' },

  // 27 – Serviços de assistência social
  { code: '27.01', desc: 'Serviços de assistência social', group: '27 – Assistência Social' },

  // 28 – Serviços de avaliação de bens
  { code: '28.01', desc: 'Serviços de avaliação de bens e serviços de qualquer natureza', group: '28 – Avaliação de Bens' },

  // 29 – Serviços de biblioteconomia
  { code: '29.01', desc: 'Serviços de biblioteconomia', group: '29 – Biblioteconomia' },

  // 30 – Serviços de biologia, biotecnologia e química
  { code: '30.01', desc: 'Serviços de biologia, biotecnologia e química', group: '30 – Biologia e Química' },

  // 31 – Serviços técnicos em edificações, eletrônica, mecânica
  { code: '31.01', desc: 'Serviços técnicos em edificações, eletrônica, eletrotécnica, mecânica, telecomunicações e congêneres', group: '31 – Serviços Técnicos' },

  // 32 – Serviços de desenhos técnicos
  { code: '32.01', desc: 'Serviços de desenhos técnicos', group: '32 – Desenhos Técnicos' },

  // 33 – Serviços de desembaraço aduaneiro
  { code: '33.01', desc: 'Serviços de desembaraço aduaneiro, comissários, despachantes e congêneres', group: '33 – Desembaraço Aduaneiro' },

  // 34 – Serviços de investigações particulares
  { code: '34.01', desc: 'Serviços de investigações particulares, detetives e congêneres', group: '34 – Investigações' },

  // 35 – Serviços de reportagem e jornalismo
  { code: '35.01', desc: 'Serviços de reportagem, assessoria de imprensa, jornalismo e relações públicas', group: '35 – Jornalismo' },

  // 36 – Serviços de meteorologia
  { code: '36.01', desc: 'Serviços de meteorologia', group: '36 – Meteorologia' },

  // 37 – Serviços de artistas, atletas, modelos
  { code: '37.01', desc: 'Serviços de artistas, atletas, modelos e manequins', group: '37 – Artistas e Atletas' },

  // 38 – Serviços de museologia
  { code: '38.01', desc: 'Serviços de museologia', group: '38 – Museologia' },

  // 39 – Serviços de ourivesaria e lapidação
  { code: '39.01', desc: 'Serviços de ourivesaria e lapidação (quando o material for fornecido pelo tomador do serviço)', group: '39 – Ourivesaria' },

  // 40 – Serviços relativos a obras de arte sob encomenda
  { code: '40.01', desc: 'Obras de arte sob encomenda', group: '40 – Obras de Arte' },
];
