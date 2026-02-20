
## Objetivo

Atualizar o card "Parametrização de CNAE" com duas melhorias:

1. Reconstruir as tabelas de CTN (6 dígitos, padrão governo federal) e NBS usando os arquivos anexos como fonte oficial.
2. Adicionar a funcionalidade de inclusão manual de CNAE diretamente no card.

---

## O que foi identificado nos arquivos

### Cnae_Service.docx
Tabela oficial com a relação CNAE → Item da Lista de Serviços da LC 116/2003. Contém milhares de CNAEs mapeados. Esse arquivo é a fonte autoritativa para o campo `item` e `descricao` do mapeamento atual.

### TabCtneNbs.xlsx
Tabela do governo federal com a estrutura completa do CTN de 6 dígitos:

```text
CÓDIGO | ITEM | SUBITEM | DESDOBRO | DESCRIÇÃO
010101 |  01  |   01    |    01    | Análise e desenvolvimento de sistemas.
010201 |  01  |   02    |    01    | Programação.
```

O CTN correto é de **6 dígitos** (ex: `010101`), não 4 como está atualmente. O NBS não está presente nesse arquivo — ele é uma tabela separada da Receita Federal. O arquivo fornecido é exclusivamente de CTN.

---

## Problemas no código atual

- O CTN está errado: usa 4 dígitos (`0101`) em vez dos 6 dígitos oficiais (`010101`).
- O NBS está sendo atribuído genericamente (`1.0101.00.00`) sem base em tabela oficial — precisa ser marcado como campo separado e opcional.
- Não existe funcionalidade de inclusão manual de CNAE.

---

## Plano de Implementação

### Parte 1 — Atualizar `src/utils/cnae-lc116.ts`

Reconstruir a tabela `LC116_CTN_NBS` usando os dados do `TabCtneNbs.xlsx`:

- **CTN**: usar os 6 dígitos exatos da coluna "CÓDIGO DE TRIBUTAÇÃO NACIONAL" (ex: `010101`, `010201`, `010301`).
- Para cada item LC 116 (ex: `1.01`), mapear para o CTN de 6 dígitos do primeiro subitem com desdobro `01`.
- **NBS**: manter como campo opcional (`nbs?: string`) e remover os valores inventados. O NBS será preenchido apenas onde houver dados confiáveis (a tabela fornecida não contém NBS).

A lógica de mapeamento de item para CTN seguirá a tabela oficial:

```text
Item 1.01 → CTN 010101
Item 1.02 → CTN 010201
Item 1.03 → CTN 010301 (ou 010302 dependendo do subserviço)
Item 2.01 → CTN 020101
Item 4.01 → CTN 040101 (Medicina)
Item 4.02 → CTN 040201 (Análises clínicas)
...
```

### Parte 2 — Adicionar inclusão manual de CNAE

No componente `src/components/CNAESection.tsx`, adicionar um formulário de inclusão manual que permite ao usuário informar:

- **Código CNAE** (campo texto com máscara `XXXX-X/XX`)
- **Descrição** (campo texto livre)

O CNAE incluído manualmente será adicionado à lista de atividades, podendo ser selecionado, removido e tratado como qualquer outro CNAE buscado via API. Será marcado com badge "Manual" para diferenciá-lo.

O botão de inclusão manual só aparece quando o CNPJ é válido (para manter coerência com o fluxo atual). Porém, também será exibido mesmo sem CNPJ válido com uma nota explicando que é uma adição manual.

### Fluxo da adição manual

```text
Usuário clica "Adicionar CNAE manualmente"
  → Abre formulário inline no card
  → Preenche código (ex: 6201-5/00) e descrição
  → Clica "Adicionar"
  → CNAE aparece na lista com badge "Manual"
  → Pode ser selecionado como CNAE para configuração tributária
  → Pode ser removido como os demais
```

---

## Arquivos a modificar

| Arquivo | Mudança |
|---|---|
| `src/utils/cnae-lc116.ts` | Atualizar `LC116_CTN_NBS` com CTNs de 6 dígitos do governo federal; remover NBS inventados |
| `src/components/CNAESection.tsx` | Adicionar formulário de inclusão manual de CNAE com badge "Manual" |

---

## Detalhes técnicos

**Interface atualizada:**
```typescript
export interface LC116Item {
  item: string;
  descricao: string;
  ctn?: string;   // 6 dígitos — padrão governo federal (TabCtneNbs.xlsx)
  nbs?: string;   // Opcional — apenas quando disponível em fonte oficial
}
```

**Novo estado no CNAESection:**
```typescript
const [showManualForm, setShowManualForm] = useState(false);
const [manualCodigo, setManualCodigo] = useState('');
const [manualDescricao, setManualDescricao] = useState('');
```

**CNAEAtividade atualizado:**
```typescript
interface CNAEAtividade {
  codigo: number | string;
  descricao: string;
  isPrincipal: boolean;
  isManual?: boolean; // flag para identificar inclusões manuais
}
```
