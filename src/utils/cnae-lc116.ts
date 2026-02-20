/**
 * Mapeamento entre códigos CNAE e itens da Lista de Serviços
 * anexa à Lei Complementar nº 116, de 31 de julho de 2003.
 *
 * Chave: código CNAE (string, sem formatação)
 * Valor: { item, descricao }
 */

export interface LC116Item {
  item: string;
  descricao: string;
}

const CNAE_LC116_MAP: Record<string, LC116Item> = {
  // ─── 1 – Informática e Congêneres ───────────────────────────────────────────
  '6201500': { item: '1.01', descricao: 'Análise e desenvolvimento de sistemas.' },
  '6202300': { item: '1.02', descricao: 'Programação.' },
  '6203100': { item: '1.01', descricao: 'Análise e desenvolvimento de sistemas.' },
  '6204000': { item: '1.02', descricao: 'Programação.' },
  '6209100': { item: '1.03', descricao: 'Processamento, armazenamento ou hospedagem de dados, textos, imagens, vídeos e congêneres.' },
  '6311900': { item: '1.03', descricao: 'Processamento, armazenamento ou hospedagem de dados, textos, imagens, vídeos e congêneres.' },
  '6319400': { item: '1.04', descricao: 'Elaboração de programas de computadores, inclusive de jogos eletrônicos, independentemente da arquitetura construtiva da máquina em que o programa será executado.' },
  '6391700': { item: '1.09', descricao: 'Disponibilização, sem cessão definitiva, de conteúdos de áudio, vídeo, imagem e texto por meio da internet.' },
  '6399200': { item: '1.09', descricao: 'Disponibilização, sem cessão definitiva, de conteúdos de áudio, vídeo, imagem e texto por meio da internet.' },
  '6201501': { item: '1.01', descricao: 'Análise e desenvolvimento de sistemas.' },
  '6201502': { item: '1.08', descricao: 'Licenciamento ou cessão de direito de uso de programas de computação.' },
  '6202301': { item: '1.02', descricao: 'Programação.' },
  '6209101': { item: '1.05', descricao: 'Licenciamento ou cessão de direito de uso de programas de computação.' },
  '6210800': { item: '1.05', descricao: 'Licenciamento ou cessão de direito de uso de programas de computação.' },
  '6290600': { item: '1.07', descricao: 'Suporte técnico em informática, inclusive instalação, configuração e manutenção de programas de computação e bancos de dados.' },
  '6110801': { item: '1.03', descricao: 'Processamento, armazenamento ou hospedagem de dados, textos, imagens, vídeos e congêneres.' },
  '6110802': { item: '1.03', descricao: 'Processamento, armazenamento ou hospedagem de dados, textos, imagens, vídeos e congêneres.' },
  '6120501': { item: '1.03', descricao: 'Processamento, armazenamento ou hospedagem de dados, textos, imagens, vídeos e congêneres.' },
  '6120502': { item: '1.03', descricao: 'Processamento, armazenamento ou hospedagem de dados, textos, imagens, vídeos e congêneres.' },
  '6130200': { item: '1.03', descricao: 'Processamento, armazenamento ou hospedagem de dados, textos, imagens, vídeos e congêneres.' },
  '6141800': { item: '1.03', descricao: 'Processamento, armazenamento ou hospedagem de dados, textos, imagens, vídeos e congêneres.' },
  '6142600': { item: '1.03', descricao: 'Processamento, armazenamento ou hospedagem de dados, textos, imagens, vídeos e congêneres.' },
  '6143400': { item: '1.03', descricao: 'Processamento, armazenamento ou hospedagem de dados, textos, imagens, vídeos e congêneres.' },

  // ─── 2 – Pesquisas e Desenvolvimento ────────────────────────────────────────
  '7210000': { item: '2.01', descricao: 'Serviços de pesquisa e desenvolvimento de qualquer natureza.' },
  '7220700': { item: '2.01', descricao: 'Serviços de pesquisa e desenvolvimento de qualquer natureza.' },

  // ─── 3 – Locação, Cessão de Direito de Uso ─────────────────────────────────
  '7711000': { item: '3.01', descricao: 'Locação de bens móveis.' },
  '7719501': { item: '3.01', descricao: 'Locação de bens móveis.' },
  '7719502': { item: '3.01', descricao: 'Locação de bens móveis.' },
  '7719599': { item: '3.01', descricao: 'Locação de bens móveis.' },
  '7721700': { item: '3.01', descricao: 'Locação de bens móveis.' },
  '7722500': { item: '3.01', descricao: 'Locação de bens móveis.' },
  '7723300': { item: '3.01', descricao: 'Locação de bens móveis.' },
  '7729201': { item: '3.01', descricao: 'Locação de bens móveis.' },
  '7729202': { item: '3.01', descricao: 'Locação de bens móveis.' },
  '7729299': { item: '3.01', descricao: 'Locação de bens móveis.' },
  '7810800': { item: '17.05', descricao: 'Fornecimento de mão de obra, mesmo em caráter temporário, inclusive de empregados ou trabalhadores, avulsos ou temporários, contratados pelo prestador de serviço.' },
  '7820500': { item: '17.05', descricao: 'Fornecimento de mão de obra, mesmo em caráter temporário.' },
  '7830200': { item: '17.05', descricao: 'Fornecimento de mão de obra, mesmo em caráter temporário.' },

  // ─── 4 – Saúde e Assistência Médica ────────────────────────────────────────
  '8610101': { item: '4.01', descricao: 'Medicina e biomedicina.' },
  '8610102': { item: '4.01', descricao: 'Medicina e biomedicina.' },
  '8621601': { item: '4.02', descricao: 'Análises clínicas, patologia, eletricidade médica, radioterapia, quimioterapia, ultra-sonografia, ressonância magnética, radiologia, tomografia e congêneres.' },
  '8621602': { item: '4.02', descricao: 'Análises clínicas, patologia, eletricidade médica, radioterapia, quimioterapia, ultra-sonografia, ressonância magnética, radiologia, tomografia e congêneres.' },
  '8622400': { item: '4.01', descricao: 'Medicina e biomedicina.' },
  '8630501': { item: '4.02', descricao: 'Análises clínicas, patologia, eletricidade médica, radioterapia, quimioterapia, ultra-sonografia, ressonância magnética, radiologia, tomografia e congêneres.' },
  '8630502': { item: '4.02', descricao: 'Análises clínicas, patologia, eletricidade médica, radioterapia, quimioterapia, ultra-sonografia, ressonância magnética, radiologia, tomografia e congêneres.' },
  '8630503': { item: '4.02', descricao: 'Análises clínicas, patologia, eletricidade médica, radioterapia, quimioterapia, ultra-sonografia, ressonância magnética, radiologia, tomografia e congêneres.' },
  '8630504': { item: '4.02', descricao: 'Análises clínicas, patologia, eletricidade médica, radioterapia, quimioterapia, ultra-sonografia, ressonância magnética, radiologia, tomografia e congêneres.' },
  '8630505': { item: '4.02', descricao: 'Análises clínicas, patologia, eletricidade médica, radioterapia, quimioterapia, ultra-sonografia, ressonância magnética, radiologia, tomografia e congêneres.' },
  '8630506': { item: '4.02', descricao: 'Análises clínicas, patologia, eletricidade médica, radioterapia, quimioterapia, ultra-sonografia, ressonância magnética, radiologia, tomografia e congêneres.' },
  '8630507': { item: '4.02', descricao: 'Análises clínicas, patologia, eletricidade médica, radioterapia, quimioterapia, ultra-sonografia, ressonância magnética, radiologia, tomografia e congêneres.' },
  '8640201': { item: '4.02', descricao: 'Análises clínicas, patologia, eletricidade médica, radioterapia, quimioterapia, ultra-sonografia, ressonância magnética, radiologia, tomografia e congêneres.' },
  '8640202': { item: '4.02', descricao: 'Análises clínicas, patologia, eletricidade médica, radioterapia, quimioterapia, ultra-sonografia, ressonância magnética, radiologia, tomografia e congêneres.' },
  '8640203': { item: '4.02', descricao: 'Análises clínicas, patologia, eletricidade médica, radioterapia, quimioterapia, ultra-sonografia, ressonância magnética, radiologia, tomografia e congêneres.' },
  '8640204': { item: '4.02', descricao: 'Análises clínicas, patologia, eletricidade médica, radioterapia, quimioterapia, ultra-sonografia, ressonância magnética, radiologia, tomografia e congêneres.' },
  '8640205': { item: '4.02', descricao: 'Análises clínicas, patologia, eletricidade médica, radioterapia, quimioterapia, ultra-sonografia, ressonância magnética, radiologia, tomografia e congêneres.' },
  '8650001': { item: '4.06', descricao: 'Enfermagem, inclusive serviços auxiliares.' },
  '8650002': { item: '4.01', descricao: 'Medicina e biomedicina.' },
  '8650003': { item: '4.01', descricao: 'Medicina e biomedicina.' },
  '8650004': { item: '4.13', descricao: 'Fisioterapia.' },
  '8650005': { item: '4.09', descricao: 'Nutrição.' },
  '8650006': { item: '4.14', descricao: 'Terapia ocupacional, quiropraxia, osteopatia e congêneres.' },
  '8650007': { item: '4.07', descricao: 'Partos, excisões, cirurgias, implantes, enxertos, lipoaspiração, lipoescultura ou dermabrasão.' },
  '8660700': { item: '4.19', descricao: 'Acupuntura.' },
  '8690901': { item: '4.15', descricao: 'Podologia.' },
  '8690902': { item: '4.01', descricao: 'Medicina e biomedicina.' },
  '8690903': { item: '4.14', descricao: 'Terapia ocupacional, quiropraxia, osteopatia e congêneres.' },
  '8690904': { item: '4.16', descricao: 'Fonoaudiologia.' },
  '8690999': { item: '4.23', descricao: 'Outros planos de saúde que se cumpram através de serviços de terceiros contratados, credenciados, cooperados ou apenas pagos pelo operador do plano mediante indicação do beneficiário.' },

  // ─── 5 – Medicina e Assistência Veterinária ────────────────────────────────
  '7500100': { item: '5.01', descricao: 'Medicina veterinária e zootecnia.' },

  // ─── 6 – Cuidados Pessoais e Estética ──────────────────────────────────────
  '9602501': { item: '6.01', descricao: 'Barbearia, cabeleireiros, manicuros, pedicuros e congêneres.' },
  '9602502': { item: '6.02', descricao: 'Esteticistas, tratamento de pele, depilação e congêneres.' },
  '9609201': { item: '6.04', descricao: 'Ginástica, dança, esportes, natação, artes marciais e demais atividades físicas.' },
  '9609202': { item: '6.04', descricao: 'Ginástica, dança, esportes, natação, artes marciais e demais atividades físicas.' },
  '9609203': { item: '6.04', descricao: 'Ginástica, dança, esportes, natação, artes marciais e demais atividades físicas.' },
  '9311500': { item: '6.04', descricao: 'Ginástica, dança, esportes, natação, artes marciais e demais atividades físicas.' },
  '9312300': { item: '6.04', descricao: 'Ginástica, dança, esportes, natação, artes marciais e demais atividades físicas.' },
  '9313100': { item: '6.04', descricao: 'Ginástica, dança, esportes, natação, artes marciais e demais atividades físicas.' },

  // ─── 7 – Engenharia, Arquitetura, Construção Civil ─────────────────────────
  '7111100': { item: '7.01', descricao: 'Engenharia, agronomia, agrimensura, arquitetura, geologia, urbanismo, paisagismo e congêneres.' },
  '7112000': { item: '7.01', descricao: 'Engenharia, agronomia, agrimensura, arquitetura, geologia, urbanismo, paisagismo e congêneres.' },
  '7119701': { item: '7.01', descricao: 'Engenharia, agronomia, agrimensura, arquitetura, geologia, urbanismo, paisagismo e congêneres.' },
  '7119702': { item: '7.01', descricao: 'Engenharia, agronomia, agrimensura, arquitetura, geologia, urbanismo, paisagismo e congêneres.' },
  '7119799': { item: '7.01', descricao: 'Engenharia, agronomia, agrimensura, arquitetura, geologia, urbanismo, paisagismo e congêneres.' },
  '4110700': { item: '7.02', descricao: 'Execução, por administração, empreitada ou subempreitada, de obras de construção civil, hidráulica ou elétrica e de outras obras semelhantes.' },
  '4120400': { item: '7.02', descricao: 'Execução, por administração, empreitada ou subempreitada, de obras de construção civil, hidráulica ou elétrica e de outras obras semelhantes.' },
  '4211101': { item: '7.02', descricao: 'Execução, por administração, empreitada ou subempreitada, de obras de construção civil, hidráulica ou elétrica e de outras obras semelhantes.' },
  '4321500': { item: '7.05', descricao: 'Instalação e montagem de aparelhos, máquinas e equipamentos, inclusive montagem industrial, prestados ao usuário final, exclusivamente com material por ele fornecido.' },
  '4321501': { item: '7.05', descricao: 'Instalação e montagem de aparelhos, máquinas e equipamentos, inclusive montagem industrial, prestados ao usuário final, exclusivamente com material por ele fornecido.' },
  '4321502': { item: '7.05', descricao: 'Instalação e montagem de aparelhos, máquinas e equipamentos, inclusive montagem industrial, prestados ao usuário final, exclusivamente com material por ele fornecido.' },
  '4322301': { item: '7.02', descricao: 'Execução, por administração, empreitada ou subempreitada, de obras de construção civil.' },
  '4322302': { item: '7.02', descricao: 'Execução, por administração, empreitada ou subempreitada, de obras de construção civil.' },
  '4399101': { item: '7.09', descricao: 'Varrição, coleta, remoção, incineração, tratamento, reciclagem, separação e destinação final de lixo, rejeitos e outros resíduos quaisquer.' },
  '4399103': { item: '7.02', descricao: 'Execução, por administração, empreitada ou subempreitada, de obras de construção civil.' },
  '4399199': { item: '7.02', descricao: 'Execução, por administração, empreitada ou subempreitada, de obras de construção civil.' },
  '7120100': { item: '7.01', descricao: 'Engenharia, agronomia, agrimensura, arquitetura, geologia, urbanismo, paisagismo e congêneres.' },

  // ─── 8 – Educação e Instrução ───────────────────────────────────────────────
  '8511200': { item: '8.01', descricao: 'Ensino regular pré-escolar, fundamental, médio e superior.' },
  '8512100': { item: '8.01', descricao: 'Ensino regular pré-escolar, fundamental, médio e superior.' },
  '8513900': { item: '8.01', descricao: 'Ensino regular pré-escolar, fundamental, médio e superior.' },
  '8520100': { item: '8.01', descricao: 'Ensino regular pré-escolar, fundamental, médio e superior.' },
  '8531700': { item: '8.01', descricao: 'Ensino regular pré-escolar, fundamental, médio e superior.' },
  '8532500': { item: '8.01', descricao: 'Ensino regular pré-escolar, fundamental, médio e superior.' },
  '8541400': { item: '8.01', descricao: 'Ensino regular pré-escolar, fundamental, médio e superior.' },
  '8542200': { item: '8.01', descricao: 'Ensino regular pré-escolar, fundamental, médio e superior.' },
  '8550301': { item: '8.02', descricao: 'Instrução, treinamento, orientação pedagógica e educacional, avaliação de conhecimentos de qualquer natureza.' },
  '8550302': { item: '8.02', descricao: 'Instrução, treinamento, orientação pedagógica e educacional, avaliação de conhecimentos de qualquer natureza.' },
  '8559701': { item: '8.02', descricao: 'Instrução, treinamento, orientação pedagógica e educacional, avaliação de conhecimentos de qualquer natureza.' },
  '8559799': { item: '8.02', descricao: 'Instrução, treinamento, orientação pedagógica e educacional, avaliação de conhecimentos de qualquer natureza.' },
  '8560900': { item: '8.02', descricao: 'Instrução, treinamento, orientação pedagógica e educacional, avaliação de conhecimentos de qualquer natureza.' },

  // ─── 9 – Hospedagem, Turismo, Viagens ──────────────────────────────────────
  '5510801': { item: '9.01', descricao: 'Hospedagem de qualquer natureza em hotéis, apart-service condominiais, flat, apart-hotéis, hotéis residência, residence-service, suite service, hotelaria marítima, motéis, pensões e congêneres.' },
  '5510802': { item: '9.01', descricao: 'Hospedagem de qualquer natureza em hotéis, apart-service condominiais, flat, apart-hotéis, hotéis residência, residence-service, suite service, hotelaria marítima, motéis, pensões e congêneres.' },
  '5590601': { item: '9.01', descricao: 'Hospedagem de qualquer natureza em hotéis, apart-service condominiais, flat, apart-hotéis, hotéis residência, residence-service, suite service, hotelaria marítima, motéis, pensões e congêneres.' },
  '5590602': { item: '9.01', descricao: 'Hospedagem de qualquer natureza em hotéis, apart-service condominiais, flat, apart-hotéis, hotéis residência, residence-service, suite service, hotelaria marítima, motéis, pensões e congêneres.' },
  '7911200': { item: '9.02', descricao: 'Agenciamento, organização, promoção, intermediação e execução de programas de turismo, passeios, viagens, excursões, hospedagens e congêneres.' },
  '7912100': { item: '9.02', descricao: 'Agenciamento, organização, promoção, intermediação e execução de programas de turismo, passeios, viagens, excursões, hospedagens e congêneres.' },
  '7990200': { item: '9.02', descricao: 'Agenciamento, organização, promoção, intermediação e execução de programas de turismo, passeios, viagens, excursões, hospedagens e congêneres.' },

  // ─── 10 – Intermediação e Congêneres ────────────────────────────────────────
  '6611801': { item: '10.02', descricao: 'Agenciamento, corretagem ou intermediação de títulos em geral, valores mobiliários e contratos quaisquer.' },
  '6611802': { item: '10.02', descricao: 'Agenciamento, corretagem ou intermediação de títulos em geral, valores mobiliários e contratos quaisquer.' },
  '6612601': { item: '10.03', descricao: 'Agenciamento, corretagem ou intermediação de câmbio, de seguros, de cartões de crédito, de planos de saúde e de planos de previdência privada.' },
  '6612602': { item: '10.03', descricao: 'Agenciamento, corretagem ou intermediação de câmbio, de seguros, de cartões de crédito, de planos de saúde e de planos de previdência privada.' },
  '6612603': { item: '10.03', descricao: 'Agenciamento, corretagem ou intermediação de câmbio, de seguros, de cartões de crédito, de planos de saúde e de planos de previdência privada.' },
  '6612604': { item: '10.03', descricao: 'Agenciamento, corretagem ou intermediação de câmbio, de seguros, de cartões de crédito, de planos de saúde e de planos de previdência privada.' },
  '6612605': { item: '10.03', descricao: 'Agenciamento, corretagem ou intermediação de câmbio, de seguros, de cartões de crédito, de planos de saúde e de planos de previdência privada.' },
  '6613400': { item: '10.04', descricao: 'Agenciamento, corretagem ou intermediação de contratos de arrendamento mercantil (leasing), de franquia (franchising) e de faturização (factoring).' },
  '6619301': { item: '10.09', descricao: 'Representação de qualquer natureza, inclusive comercial.' },
  '6619302': { item: '10.09', descricao: 'Representação de qualquer natureza, inclusive comercial.' },
  '6622300': { item: '10.03', descricao: 'Agenciamento, corretagem ou intermediação de câmbio, de seguros, de cartões de crédito, de planos de saúde e de planos de previdência privada.' },
  '7490101': { item: '10.09', descricao: 'Representação de qualquer natureza, inclusive comercial.' },
  '7490104': { item: '10.05', descricao: 'Agenciamento, corretagem ou intermediação de bens imóveis e móveis, serviços, quaisquer direitos e obrigações, coisas em geral.' },

  // ─── 11 – Guarda, Estacionamento, Vigilância ────────────────────────────────
  '8011101': { item: '11.02', descricao: 'Vigilância, segurança ou monitoramento de bens, pessoas e semoventes.' },
  '8011102': { item: '11.02', descricao: 'Vigilância, segurança ou monitoramento de bens, pessoas e semoventes.' },
  '8012900': { item: '11.02', descricao: 'Vigilância, segurança ou monitoramento de bens, pessoas e semoventes.' },
  '8020001': { item: '11.02', descricao: 'Vigilância, segurança ou monitoramento de bens, pessoas e semoventes.' },
  '8020002': { item: '11.02', descricao: 'Vigilância, segurança ou monitoramento de bens, pessoas e semoventes.' },
  '5211701': { item: '11.01', descricao: 'Guarda e estacionamento de veículos terrestres automotores, de aeronaves e de embarcações.' },
  '5211702': { item: '11.01', descricao: 'Guarda e estacionamento de veículos terrestres automotores, de aeronaves e de embarcações.' },

  // ─── 12 – Diversões, Lazer, Entretenimento ──────────────────────────────────
  '9001901': { item: '12.01', descricao: 'Espetáculos teatrais.' },
  '9001902': { item: '12.06', descricao: 'Danças, bailes, shows, bandas, circos, espetáculos de rodeios, vaquejadas e congêneres.' },
  '9001903': { item: '12.07', descricao: 'Espetáculos circenses.' },
  '9001904': { item: '12.06', descricao: 'Danças, bailes, shows, bandas, circos, espetáculos de rodeios, vaquejadas e congêneres.' },
  '9001905': { item: '12.06', descricao: 'Danças, bailes, shows, bandas, circos, espetáculos de rodeios, vaquejadas e congêneres.' },
  '9001906': { item: '12.01', descricao: 'Espetáculos teatrais.' },
  '9001907': { item: '12.06', descricao: 'Danças, bailes, shows, bandas, circos, espetáculos de rodeios, vaquejadas e congêneres.' },
  '9001999': { item: '12.06', descricao: 'Danças, bailes, shows, bandas, circos, espetáculos de rodeios, vaquejadas e congêneres.' },
  '9200301': { item: '12.13', descricao: 'Produção, mediante ou sem encomenda prévia, de eventos, espetáculos, entrevistas, shows, ballet, danças, desfiles, bailes, teatros, óperas, concertos, recitais, festivais e congêneres.' },
  '9200302': { item: '12.13', descricao: 'Produção, mediante ou sem encomenda prévia, de eventos, espetáculos, entrevistas, shows, ballet, danças, desfiles, bailes, teatros, óperas, concertos, recitais, festivais e congêneres.' },
  '9200399': { item: '12.13', descricao: 'Produção, mediante ou sem encomenda prévia, de eventos, espetáculos, entrevistas, shows, ballet, danças, desfiles, bailes, teatros, óperas, concertos, recitais, festivais e congêneres.' },
  '9321200': { item: '12.11', descricao: 'Parques de diversões, centros de lazer e congêneres.' },
  '9329801': { item: '12.11', descricao: 'Parques de diversões, centros de lazer e congêneres.' },
  '9329802': { item: '12.11', descricao: 'Parques de diversões, centros de lazer e congêneres.' },
  '9329803': { item: '12.11', descricao: 'Parques de diversões, centros de lazer e congêneres.' },
  '9329804': { item: '12.17', descricao: 'Tinturaria e lavanderia.' },

  // ─── 13 – Fonografia, Fotografia, Cinematografia ────────────────────────────
  '5911101': { item: '13.03', descricao: 'Fotografia e cinematografia, inclusive revelação, ampliação, cópia, reprodução, trucagem e congêneres.' },
  '5911102': { item: '13.03', descricao: 'Fotografia e cinematografia, inclusive revelação, ampliação, cópia, reprodução, trucagem e congêneres.' },
  '5911199': { item: '13.03', descricao: 'Fotografia e cinematografia, inclusive revelação, ampliação, cópia, reprodução, trucagem e congêneres.' },
  '5912001': { item: '13.02', descricao: 'Fonografia ou gravação de sons, inclusive trucagem, dublagem, mixagem e congêneres.' },
  '5912002': { item: '13.02', descricao: 'Fonografia ou gravação de sons, inclusive trucagem, dublagem, mixagem e congêneres.' },
  '5912099': { item: '13.02', descricao: 'Fonografia ou gravação de sons, inclusive trucagem, dublagem, mixagem e congêneres.' },
  '7420001': { item: '13.03', descricao: 'Fotografia e cinematografia, inclusive revelação, ampliação, cópia, reprodução, trucagem e congêneres.' },
  '7420002': { item: '13.03', descricao: 'Fotografia e cinematografia, inclusive revelação, ampliação, cópia, reprodução, trucagem e congêneres.' },
  '7420003': { item: '13.03', descricao: 'Fotografia e cinematografia, inclusive revelação, ampliação, cópia, reprodução, trucagem e congêneres.' },
  '7420004': { item: '13.03', descricao: 'Fotografia e cinematografia, inclusive revelação, ampliação, cópia, reprodução, trucagem e congêneres.' },
  '7420005': { item: '13.03', descricao: 'Fotografia e cinematografia, inclusive revelação, ampliação, cópia, reprodução, trucagem e congêneres.' },

  // ─── 14 – Serviços relativos a bens de terceiros ────────────────────────────
  '9511800': { item: '14.01', descricao: 'Lubrificação, limpeza, lustração, revisão, carga e recarga, conserto, restauração, blindagem, manutenção e conservação de máquinas, veículos, aparelhos, equipamentos, motores, elevadores ou de qualquer objeto.' },
  '9512600': { item: '14.01', descricao: 'Lubrificação, limpeza, lustração, revisão, carga e recarga, conserto, restauração, blindagem, manutenção e conservação de máquinas, veículos, aparelhos, equipamentos, motores, elevadores ou de qualquer objeto.' },
  '4520001': { item: '14.01', descricao: 'Lubrificação, limpeza, lustração, revisão, carga e recarga, conserto, restauração, blindagem, manutenção e conservação de máquinas, veículos, aparelhos, equipamentos, motores, elevadores ou de qualquer objeto.' },
  '4520002': { item: '14.01', descricao: 'Lubrificação, limpeza, lustração, revisão, carga e recarga, conserto, restauração, blindagem, manutenção e conservação de máquinas, veículos, aparelhos, equipamentos, motores, elevadores ou de qualquer objeto.' },
  '3314701': { item: '14.01', descricao: 'Lubrificação, limpeza, lustração, revisão, carga e recarga, conserto, restauração, blindagem, manutenção e conservação de máquinas, veículos, aparelhos, equipamentos, motores, elevadores ou de qualquer objeto.' },
  '3314702': { item: '14.01', descricao: 'Lubrificação, limpeza, lustração, revisão, carga e recarga, conserto, restauração, blindagem, manutenção e conservação de máquinas, veículos, aparelhos, equipamentos, motores, elevadores ou de qualquer objeto.' },
  '3314703': { item: '14.01', descricao: 'Lubrificação, limpeza, lustração, revisão, carga e recarga, conserto, restauração, blindagem, manutenção e conservação de máquinas, veículos, aparelhos, equipamentos, motores, elevadores ou de qualquer objeto.' },
  '3314799': { item: '14.01', descricao: 'Lubrificação, limpeza, lustração, revisão, carga e recarga, conserto, restauração, blindagem, manutenção e conservação de máquinas, veículos, aparelhos, equipamentos, motores, elevadores ou de qualquer objeto.' },
  '9521500': { item: '14.01', descricao: 'Lubrificação, limpeza, lustração, revisão, carga e recarga, conserto, restauração, blindagem, manutenção e conservação de máquinas, veículos, aparelhos, equipamentos, motores, elevadores ou de qualquer objeto.' },
  '9529101': { item: '14.12', descricao: 'Instalação e montagem de aparelhos, máquinas e equipamentos, inclusive montagem industrial, prestados ao usuário final, exclusivamente com material por ele fornecido.' },
  '9529102': { item: '14.01', descricao: 'Lubrificação, limpeza, lustração, revisão, carga e recarga, conserto, restauração, blindagem, manutenção e conservação de máquinas, veículos, aparelhos, equipamentos, motores, elevadores ou de qualquer objeto.' },
  '9529103': { item: '14.01', descricao: 'Lubrificação, limpeza, lustração, revisão, carga e recarga, conserto, restauração, blindagem, manutenção e conservação de máquinas, veículos, aparelhos, equipamentos, motores, elevadores ou de qualquer objeto.' },
  '9529104': { item: '14.01', descricao: 'Lubrificação, limpeza, lustração, revisão, carga e recarga, conserto, restauração, blindagem, manutenção e conservação de máquinas, veículos, aparelhos, equipamentos, motores, elevadores ou de qualquer objeto.' },
  '9529105': { item: '14.01', descricao: 'Lubrificação, limpeza, lustração, revisão, carga e recarga, conserto, restauração, blindagem, manutenção e conservação de máquinas, veículos, aparelhos, equipamentos, motores, elevadores ou de qualquer objeto.' },
  '9529199': { item: '14.01', descricao: 'Lubrificação, limpeza, lustração, revisão, carga e recarga, conserto, restauração, blindagem, manutenção e conservação de máquinas, veículos, aparelhos, equipamentos, motores, elevadores ou de qualquer objeto.' },

  // ─── 15 – Setor Bancário e Financeiro ──────────────────────────────────────
  '6410700': { item: '15.01', descricao: 'Administração de fundos quaisquer, de consórcio, de cartão de crédito ou débito e congêneres, de carteira de clientes, de cheques pré-datados e congêneres.' },
  '6421200': { item: '15.01', descricao: 'Administração de fundos quaisquer, de consórcio, de cartão de crédito ou débito e congêneres, de carteira de clientes, de cheques pré-datados e congêneres.' },
  '6422100': { item: '15.01', descricao: 'Administração de fundos quaisquer, de consórcio, de cartão de crédito ou débito e congêneres, de carteira de clientes, de cheques pré-datados e congêneres.' },
  '6423900': { item: '15.01', descricao: 'Administração de fundos quaisquer, de consórcio, de cartão de crédito ou débito e congêneres, de carteira de clientes, de cheques pré-datados e congêneres.' },
  '6431000': { item: '15.01', descricao: 'Administração de fundos quaisquer, de consórcio, de cartão de crédito ou débito e congêneres, de carteira de clientes, de cheques pré-datados e congêneres.' },
  '6432800': { item: '15.01', descricao: 'Administração de fundos quaisquer, de consórcio, de cartão de crédito ou débito e congêneres, de carteira de clientes, de cheques pré-datados e congêneres.' },
  '6450600': { item: '15.07', descricao: 'Arrendamento mercantil (leasing) de quaisquer bens, inclusive cessão de direitos e obrigações, substituição de garantias, alteração, cancelamento e registro de contrato, e demais serviços relacionados ao arrendamento mercantil.' },
  '6499901': { item: '15.14', descricao: 'Assessoria ou consultoria de crédito, de gestão de dívidas, consultoria financeira.' },
  '6499999': { item: '15.14', descricao: 'Assessoria ou consultoria de crédito, de gestão de dívidas, consultoria financeira.' },

  // ─── 16 – Transporte de Natureza Municipal ─────────────────────────────────
  '4923001': { item: '16.01', descricao: 'Serviços de transporte coletivo municipal rodoviário de passageiros.' },
  '4923002': { item: '16.01', descricao: 'Serviços de transporte coletivo municipal rodoviário de passageiros.' },
  '4929901': { item: '16.01', descricao: 'Serviços de transporte coletivo municipal rodoviário de passageiros.' },
  '4929902': { item: '16.01', descricao: 'Serviços de transporte coletivo municipal rodoviário de passageiros.' },
  '4929903': { item: '16.01', descricao: 'Serviços de transporte coletivo municipal rodoviário de passageiros.' },
  '4929904': { item: '16.01', descricao: 'Serviços de transporte coletivo municipal rodoviário de passageiros.' },
  '4929999': { item: '16.01', descricao: 'Serviços de transporte coletivo municipal rodoviário de passageiros.' },

  // ─── 17 – Apoio Técnico, Administrativo, Jurídico, Contábil ────────────────
  '6911701': { item: '17.16', descricao: 'Serviços advocatícios.' },
  '6911702': { item: '17.16', descricao: 'Serviços advocatícios.' },
  '6920601': { item: '17.17', descricao: 'Assessoria ou consultoria de qualquer natureza, não contida em outros itens desta lista.' },
  '6920602': { item: '17.17', descricao: 'Assessoria ou consultoria de qualquer natureza, não contida em outros itens desta lista.' },
  '7020400': { item: '17.17', descricao: 'Assessoria ou consultoria de qualquer natureza, não contida em outros itens desta lista.' },
  '7311400': { item: '17.06', descricao: 'Propaganda e publicidade, inclusive promoção de vendas, planejamento de campanhas ou sistemas de publicidade, elaboração de desenhos, textos e demais elementos publicitários.' },
  '7312200': { item: '17.06', descricao: 'Propaganda e publicidade, inclusive promoção de vendas, planejamento de campanhas ou sistemas de publicidade, elaboração de desenhos, textos e demais elementos publicitários.' },
  '7319001': { item: '17.06', descricao: 'Propaganda e publicidade, inclusive promoção de vendas, planejamento de campanhas ou sistemas de publicidade, elaboração de desenhos, textos e demais elementos publicitários.' },
  '7319002': { item: '17.06', descricao: 'Propaganda e publicidade, inclusive promoção de vendas, planejamento de campanhas ou sistemas de publicidade, elaboração de desenhos, textos e demais elementos publicitários.' },
  '7319003': { item: '17.06', descricao: 'Propaganda e publicidade, inclusive promoção de vendas, planejamento de campanhas ou sistemas de publicidade, elaboração de desenhos, textos e demais elementos publicitários.' },
  '7319004': { item: '17.06', descricao: 'Propaganda e publicidade, inclusive promoção de vendas, planejamento de campanhas ou sistemas de publicidade, elaboração de desenhos, textos e demais elementos publicitários.' },
  '7410202': { item: '17.06', descricao: 'Propaganda e publicidade, inclusive promoção de vendas, planejamento de campanhas ou sistemas de publicidade, elaboração de desenhos, textos e demais elementos publicitários.' },
  '7410203': { item: '17.09', descricao: 'Planejamento, organização e administração de feiras, exposições, congressos e congêneres.' },
  '7490102': { item: '17.17', descricao: 'Assessoria ou consultoria de qualquer natureza, não contida em outros itens desta lista.' },
  '7490103': { item: '17.17', descricao: 'Assessoria ou consultoria de qualquer natureza, não contida em outros itens desta lista.' },
  '7490105': { item: '17.17', descricao: 'Assessoria ou consultoria de qualquer natureza, não contida em outros itens desta lista.' },
  '8219901': { item: '17.02', descricao: 'Datilografia, digitação, estenografia, expediente, secretaria em geral, jejum, resposta audível, redação, edição, interpretação, revisão, tradução, apoio e infra-estrutura administrativa e congêneres.' },
  '8219999': { item: '17.02', descricao: 'Datilografia, digitação, estenografia, expediente, secretaria em geral, jejum, resposta audível, redação, edição, interpretação, revisão, tradução, apoio e infra-estrutura administrativa e congêneres.' },
  '8299701': { item: '17.02', descricao: 'Datilografia, digitação, estenografia, expediente, secretaria em geral, jejum, resposta audível, redação, edição, interpretação, revisão, tradução, apoio e infra-estrutura administrativa e congêneres.' },
  '8299702': { item: '17.10', descricao: 'Organização de festas e recepções; bufê (exceto o fornecimento de alimentação e bebidas, que fica sujeito ao ICMS).' },
  '8299703': { item: '17.17', descricao: 'Assessoria ou consultoria de qualquer natureza, não contida em outros itens desta lista.' },
  '8299704': { item: '17.17', descricao: 'Assessoria ou consultoria de qualquer natureza, não contida em outros itens desta lista.' },
  '8299705': { item: '17.02', descricao: 'Datilografia, digitação, estenografia, expediente, secretaria em geral, jejum, resposta audível, redação, edição, interpretação, revisão, tradução, apoio e infra-estrutura administrativa e congêneres.' },
  '8299706': { item: '17.17', descricao: 'Assessoria ou consultoria de qualquer natureza, não contida em outros itens desta lista.' },
  '8299707': { item: '17.17', descricao: 'Assessoria ou consultoria de qualquer natureza, não contida em outros itens desta lista.' },
  '8299799': { item: '17.17', descricao: 'Assessoria ou consultoria de qualquer natureza, não contida em outros itens desta lista.' },

  // ─── 21 – Registros Públicos, Cartorários, Notariais ───────────────────────
  '6912500': { item: '21.01', descricao: 'Serviços de registros públicos, cartorários e notariais.' },

  // ─── 23 – Comunicação Visual, Desenho Industrial ───────────────────────────
  '7410201': { item: '23.01', descricao: 'Serviços de programação e comunicação visual, desenho industrial e congêneres.' },
  '7410299': { item: '23.01', descricao: 'Serviços de programação e comunicação visual, desenho industrial e congêneres.' },

  // ─── 25 – Funerários ────────────────────────────────────────────────────────
  '9603301': { item: '25.01', descricao: 'Funerais, inclusive fornecimento de caixão, urna ou esquifes; aluguel de capela; transporte do corpo cadavérico; fornecimento de flores, coroas e outros paramentos; desembaraço de certidão de óbito; fornecimento de véu, essa e outros adornos; embalsamento, embelezamento, conservação ou restauração de cadáveres.' },
  '9603302': { item: '25.02', descricao: 'Translado intramunicipal e cremação de corpos e partes de corpos cadavéricos.' },
  '9603303': { item: '25.04', descricao: 'Jazigos e cemitérios.' },
  '9603304': { item: '25.01', descricao: 'Funerais, inclusive fornecimento de caixão, urna ou esquifes; aluguel de capela; transporte do corpo cadavérico; fornecimento de flores, coroas e outros paramentos; desembaraço de certidão de óbito; fornecimento de véu, essa e outros adornos; embalsamento, embelezamento, conservação ou restauração de cadáveres.' },

  // ─── 26 – Coleta, Remessa ou Entrega de Correspondências ───────────────────
  '5310501': { item: '26.01', descricao: 'Serviços de coleta, remessa ou entrega de correspondências, documentos, objetos, bens ou valores, inclusive pelos correios e suas agências franqueadas; courrier e congêneres.' },
  '5310502': { item: '26.01', descricao: 'Serviços de coleta, remessa ou entrega de correspondências, documentos, objetos, bens ou valores, inclusive pelos correios e suas agências franqueadas; courrier e congêneres.' },
  '5320201': { item: '26.01', descricao: 'Serviços de coleta, remessa ou entrega de correspondências, documentos, objetos, bens ou valores, inclusive pelos correios e suas agências franqueadas; courrier e congêneres.' },
  '5320202': { item: '26.01', descricao: 'Serviços de coleta, remessa ou entrega de correspondências, documentos, objetos, bens ou valores, inclusive pelos correios e suas agências franqueadas; courrier e congêneres.' },

  // ─── 28 – Avaliação de Bens e Serviços ─────────────────────────────────────
  '6911703': { item: '28.01', descricao: 'Serviços de avaliação de bens e serviços de qualquer natureza.' },
  '7490199': { item: '28.01', descricao: 'Serviços de avaliação de bens e serviços de qualquer natureza.' },

  // ─── 30 – Biologia, Biotecnologia e Química ────────────────────────────────
  '7110701': { item: '30.01', descricao: 'Serviços de biologia, biotecnologia e química.' },
  '7120000': { item: '30.01', descricao: 'Serviços de biologia, biotecnologia e química.' },
  '7110703': { item: '30.01', descricao: 'Serviços de biologia, biotecnologia e química.' },

  // ─── 31 – Serviços Técnicos em Edificações, Eletrônica, Mecânica ───────────
  '7110702': { item: '31.01', descricao: 'Serviços técnicos em edificações, eletrônica, eletrotécnica, mecânica, telecomunicações e congêneres.' },

  // ─── 33 – Desembaraço Aduaneiro, Despachantes ──────────────────────────────
  '5229001': { item: '33.01', descricao: 'Serviços de desembaraço aduaneiro, comissários, despachantes e congêneres.' },

  // ─── 35 – Reportagem, Jornalismo ────────────────────────────────────────────
  '6391701': { item: '35.01', descricao: 'Fonografia ou gravação de sons, inclusive trucagem, dublagem, mixagem e congêneres.' },
  '7410204': { item: '35.01', descricao: 'Serviços de reportagem, assessoria de imprensa, jornalismo e congêneres.' },

  // ─── 37 – Artistas, Atletas, Modelos ────────────────────────────────────────
  '9003500': { item: '37.01', descricao: 'Serviços de artistas, atletas, modelos e manequins.' },
  '7490106': { item: '37.01', descricao: 'Serviços de artistas, atletas, modelos e manequins.' },
};

/**
 * Retorna o item da LC 116/2003 correspondente ao código CNAE informado.
 * Remove pontuação do código antes de buscar.
 */
export function getLC116Item(codigoCnae: string | number): LC116Item | null {
  const cleaned = String(codigoCnae).replace(/\D/g, '');
  return CNAE_LC116_MAP[cleaned] ?? null;
}
