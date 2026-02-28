# CONTEXT.md

Documento de contexto do repositorio `novastelas`.

## 1. Papel do repositorio

`novastelas` e a fonte de layout/telas vindas do designer (Lovable).
Ele funciona como repositorio de referencia visual e de interacao para clonagem no `zera-frontend`.

Resumo operacional:
* designer publica as mudancas em `novastelas`
* time de frontend recebe via `git pull`
* mudancas sao portadas para `zera-frontend` preservando o contrato da API propria (sem dependencia de Supabase)

## 2. Stack

* React + TypeScript + Vite
* Tailwind + shadcn/ui
* fluxo de design orientado por Lovable

## 3. Regra de integracao com `zera-frontend`

Ao clonar telas de `novastelas` para `zera-frontend`:
* manter layout, componentes e comportamento visual equivalentes
* preservar/adequar integracoes para backend proprio (`zera-backend`)
* nao introduzir dependencia obrigatoria de Supabase no fluxo final de producao
* quando houver divergencia de menu/sidebar, decidir com base no escopo definido para a release

## 4. Estado atual (28/02/2026)

* `novastelas` segue como base de referencia para layout da sidebar, dashboard e fluxos de emissao/cadastro.
* parte relevante das telas ja foi clonada para `zera-frontend`.
* ajustes de contrato de API e emissao fiscal devem ser feitos no `zera-frontend`/`zera-backend`, nao aqui.

## 5. Limites deste repositorio

`novastelas` nao e a fonte canonica de regras fiscais.
Fonte canonica de contrato de API e emissao:
* backend: `zera-backend/CONTEXT.md`
* frontend de producao: `zera-frontend/CONTEXT.md`

## 6. Checklist rapido antes de portar mudancas

1. Confirmar quais telas/componentes mudaram no pull mais recente.
2. Verificar se ha impacto em rotas/menu (`AppSidebar`, paginas NFSe, tomadores, empresas).
3. Portar somente o necessario para release atual.
4. Rodar validacoes no destino (`zera-frontend`: lint/test/build).
5. Atualizar `CONTEXT.md` do repositorio de destino com a alteracao portada.
