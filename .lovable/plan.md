
## Alinhar "Alíquota Simples Nacional" abaixo de "Informar alíquota do Simples Nacional"

Atualmente o label "Alíquota Simples Nacional" e o campo de input estão com margem esquerda de 48px, mas visualmente não estão alinhados perfeitamente com o texto do toggle acima.

### O que será feito

Ajustar a margem esquerda do bloco que contém "Alíquota Simples Nacional" e o campo de porcentagem para que fique exatamente alinhado com o início do texto "Informar alíquota do Simples Nacional".

### Detalhes técnicos

**Arquivo:** `src/components/RegimeEParametrosSection.tsx`

- O toggle usa um botão switch com largura `w-9` (36px) e um `gap-3` (12px) entre o switch e o texto, totalizando 48px
- A margem atual `ml-[48px]` está correta em teoria, mas o switch tem `border-2` que adiciona 4px extras
- Ajustar para `ml-[52px]` para compensar a borda, garantindo alinhamento perfeito com o texto do toggle
