# Bahia Hub

Portal unificado de dados públicos para diagnósticos territoriais e acompanhamento de métricas regionais da Bahia. O Hub funciona como um agregador: reúne módulos de diferentes frentes (Eleições, Clima, Economia, Educação, População) em uma única interface moderna, rápida e acessível.

## Funcionalidades

- **Arquitetura modular:** cada domínio de dados é um módulo independente, hospedado e mantido por sua própria equipe e incorporado ao Hub.
- **Painel "A Bahia em números":** dados oficiais do IBGE consumidos por uma camada de API tipada, com validação da resposta em tempo de execução, cache em memória e estados de carregamento, erro (com nova tentativa) e vazio.
- **Indicador de progresso:** o selo do cabeçalho mostra quantos módulos já estão disponíveis (ex.: "1 de 5 módulos disponíveis"), calculado a partir da configuração de rotas.
- **Tema claro e escuro:** respeita a preferência do sistema, lembra a escolha do usuário e não causa "flash" ao carregar.
- **Resiliência:** `ErrorBoundary` isola falhas de renderização, e a página 404 cobre rotas inexistentes.
- **Acessibilidade:** HTML semântico, link "Pular para o conteúdo", foco visível, drawer mobile com `<dialog>` nativo (focus trap e `Esc`), cards totalmente navegáveis por teclado, `prefers-reduced-motion` respeitado e idioma da página definido (`pt-BR`).
- **Navegação cuidadosa:** título da aba por página, rolagem ao topo e foco movido para o conteúdo a cada troca de rota.

## Tecnologias

| Área | Ferramenta |
| --- | --- |
| Core | React 19 (com React Compiler), TypeScript, Vite 8 |
| Roteamento | React Router 7 |
| Estilo | Tailwind CSS 3.4, Lucide Icons |
| Qualidade | oxlint, TypeScript em modo estrito (sem `any`) |

## Como executar localmente

**Pré-requisito:** [Node.js](https://nodejs.org/) 20.19 ou superior (recomendado: a versão LTS mais recente).

```bash
git clone https://github.com/sauloguedes71/bahia-api-hub.git
cd bahia-api-hub
npm install
npm run dev
```

Abra `http://localhost:5173`.

| Script | O que faz |
| --- | --- |
| `npm run dev` | Servidor de desenvolvimento |
| `npm run build` | Checagem de tipos (`tsc -b`) e build de produção |
| `npm run preview` | Serve o build de produção localmente |
| `npm run lint` | Análise estática com oxlint |

## Estrutura de pastas

```
src/
├── components/
│   ├── hub/        # Sidebar, cabeçalho, cards de módulos, frame de módulo, painel do IBGE
│   ├── layout/     # Estruturas de layout (ex.: drawer mobile)
│   └── ui/         # Componentes reutilizáveis (Button, Skeleton, EmptyState, ErrorBoundary, ThemeToggle)
├── hooks/          # use-theme, use-async, use-module-search, use-route-effects
├── lib/
│   ├── api/        # Camada de API: http (fetch tipado), ibge (serviço) e types (payloads)
│   ├── module-routes.ts   # Rotas e URLs dos módulos
│   ├── modules.ts         # Cards e itens do menu
│   └── utils.ts           # Utilitário cn
├── pages/          # Páginas (Sobre, 404)
└── App.tsx         # Configuração do roteador
```

Convenção: componentes de **layout** não conhecem regra de negócio, componentes de **ui** não conhecem a API, e a lógica de dados vive em `hooks/` e `lib/api/`.

## Como adicionar um novo módulo

São dois arquivos.

**1. `src/lib/module-routes.ts`:** cria a rota e alimenta o contador do selo.

```ts
export const moduleRoutes: readonly ModuleRoute[] = [
  // ... módulos existentes
  {
    path: 'saude',
    title: 'Módulo Saúde',
    url: 'https://link-da-equipe-de-saude.vercel.app/', // sem url = "em desenvolvimento"
  },
]
```

**2. `src/lib/modules.ts`:** adiciona o card na home (em `dataModules`, com ícone, descrição, cores e `repoUrl`) e o item do menu lateral (em `navItems`). O `id` deve ser igual ao `path` da rota.

Com isso, o Hub passa a exibir o módulo na home, no menu, na busca e na página Sobre, com título de aba próprio.

## Camada de API

Todo consumo de dados externos passa por `src/lib/api/`:

- `http.ts`: `fetchJson<T>(url, parser)` com timeout, erro tipado (`ApiError`) e validação obrigatória da resposta (`unknown` → `T`), sem `any`.
- `ibge.ts`: serviços do IBGE com cache em memória (falhas não ficam em cache).
- `types.ts`: interfaces dos payloads.
- `hooks/use-async.ts`: transforma qualquer chamada em um estado `loading | success | error` com `reload`.

Para criar um novo serviço: declare o tipo em `types.ts`, escreva o parser, exponha a função em um arquivo de serviço e consuma com `useAsync`.

## Limitações conhecidas

- Os módulos são sites externos carregados em `iframe`. Por isso o **tema escuro do Hub não se aplica ao conteúdo dos módulos**, e o Hub não consegue ler o estado de saúde deles sem que cada equipe libere CORS.

## Roadmap

- [ ] Carregamento sob demanda das páginas (`React.lazy` + `Suspense`)
- [ ] Busca global com atalho `Ctrl+K`
- [ ] Meta tags Open Graph para compartilhamento de links
- [ ] Testes automatizados (Vitest + Testing Library)
- [ ] Favoritos (fixar módulos no topo da home)

## Equipe

Desenvolvido pela equipe Front-End: Saulo, Solano e Pedro.

Código do Hub: <https://github.com/sauloguedes71/bahia-api-hub>
