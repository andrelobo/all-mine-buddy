

# Reorganizar aba "O Prestador" em 3 sub-abas horizontais com cards

## Visao Geral

Reestruturar a aba "O Prestador" que hoje exibe todos os componentes em sequencia vertical, organizando-os em 3 sub-abas horizontais no topo: **Dados Cadastrais**, **Regime Tributario** e **Parametros Fiscais**. Cada sub-aba contera cards agrupados logicamente.

## Estrutura das Sub-abas

### Sub-aba 1: Dados Cadastrais
- **Card: Informacoes da Empresa** - CNPJ (com auto-busca), Nome Empresarial, Nome Fantasia, Inscricao Municipal, Inscricao Estadual, Suframa, Optante Simples Nacional (toggle Sim/Nao)
- **Card: CNAE** - Componente CNAESection existente (atividades economicas do CNPJ, selecao de CNAE principal)
- **Card: Contato** - E-mail, WhatsApp
- **Card: Endereco** - CEP (com auto-busca), Logradouro, Numero, Complemento, Bairro, Localidade/UF

### Sub-aba 2: Regime Tributario
- **Card unico: Regime Tributario** - Seletor de regime (Simples Nacional, Lucro Presumido, Lucro Real) com destaque visual
- Quando Simples Nacional selecionado, exibir dentro do mesmo card:
  - Destaque visual: "Simples Nacional - Anexo III - Sem Fator R"
  - Campo RBT12
  - Campos somente-leitura: Anexo, Faixa, Aliquota Nominal, Parcela a Deduzir, Aliquota Efetiva, % ISS
  - Alertas e validacoes
  - Resumo Tributario (ResumoTributario)

### Sub-aba 3: Parametros Fiscais
- **Card: Parametros Federais** - Toggles do Simples Nacional (regime apuracao, informar aliquota, campo aliquota %)
- **Card: Parametros Municipais** - CTNSection completo (CNAE + CTN + NBS, lista de servicos configurados)
- **Card: Configuracoes Operacionais** - Placeholder para futuras configuracoes

## Detalhes Tecnicos

### Arquivos a modificar

1. **`src/pages/Index.tsx`** (modificar)
   - Adicionar estado `prestadorSubTab` com valores `'cadastro' | 'regime' | 'parametros'`
   - Renderizar barra de sub-abas horizontais dentro do bloco `activeTab === 'prestador'`
   - Distribuir os componentes existentes entre as 3 sub-abas
   - Mover CNAESection para sub-aba "Dados Cadastrais"
   - Mover SimplesNacionalSection e ResumoTributario para sub-aba "Regime Tributario"
   - Mover CTNSection e toggles federais para sub-aba "Parametros Fiscais"

2. **`src/components/PrestadorSection.tsx`** (modificar)
   - Separar o componente em cards distintos reutilizaveis
   - Card "Informacoes da Empresa": identificacao + optante simples
   - Card "Contato": email + whatsapp
   - Card "Endereco": campos de endereco com auto-busca CEP
   - Manter toda a logica de auto-busca CNPJ/CEP intacta

3. **`src/components/RegimeEParametrosSection.tsx`** (modificar)
   - Remover o slot de `children` (CTNSection sera renderizado separadamente)
   - Adicionar destaque visual para "Simples Nacional - Anexo III - Sem Fator R" quando regime = simples
   - Integrar SimplesNacionalSection e ResumoTributario nesta sub-aba

### Navegacao por Sub-abas

- Usar estilo de tabs horizontais com `border-b` e indicador ativo
- Transicao suave entre sub-abas
- Manter estado da sub-aba ao alternar entre abas principais (prestador/tomador/emissao)

### Experiencia do Usuario

- Tooltips explicativos em campos tributarios (ja existentes em CNAESection, manter e expandir)
- Mascaras automaticas ja implementadas (CNPJ, CEP, telefone) - sem alteracao
- Auto-complete CEP e CNAE ja funcionais - sem alteracao
- Mensagens de validacao ja existentes via `toast` - sem alteracao
- Salvamento sem recarregar ja implementado - sem alteracao
- Indicador visual de sucesso (botao SALVAR com bounce) - sem alteracao

### Layout Responsivo

- Cards em grid responsivo: 1 coluna mobile, 2 colunas tablet, layout otimizado desktop
- Sub-abas com scroll horizontal em telas pequenas
- Campos com `grid-cols-1 md:grid-cols-2 lg:grid-cols-4` conforme contexto

