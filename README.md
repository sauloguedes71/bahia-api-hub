# Bahia Hub

Portal unificado de dados públicos da Bahia: reúne módulos de diferentes frentes (Eleições, Clima, Economia, Educação, População) em uma interface única, rápida e acessível, e traz conteúdo próprio sobre o território baiano.

🔗 **Acesse:** <https://bahia-hub.vercel.app/>

## Funcionalidades

- **Arquitetura modular:** cada domínio de dados é um módulo independente, mantido por uma equipe e exibido dentro do Hub.
- **Conheça a Bahia:** a cada dia, um dos 417 municípios (sem repetir) com foto, mapa de localização e contorno desenhados a partir de dados do IBGE, população, área e densidade (Censo 2022) e descrição. Há também o botão "Sortear outro".
- **A Bahia em números:** municípios, mesorregiões e microrregiões, direto da API do IBGE.
- **Busca global (`Ctrl+K` / `⌘K`):** paleta de comandos para ir a qualquer página ou módulo, com navegação 100% por teclado.
- **Tema claro e escuro:** respeita a preferência do sistema, lembra a escolha e é enviado aos módulos (veja abaixo).
- **Resiliência:** `ErrorBoundary`, página 404, skeletons de carregamento e estados de erro com "tentar novamente".
- **Acessibilidade:** HTML semântico, "Pular para o conteúdo", foco visível, `<dialog>` nativo (focus trap e `Esc`), `prefers-reduced-motion` e idioma `pt-BR`.
- **Desempenho:** páginas carregadas sob demanda (`React.lazy`), cache em memória das chamadas e fonte hospedada no próprio projeto.

## Tecnologias

| Área       | Ferramenta                                             |
| ---------- | ------------------------------------------------------ |
| Core       | React 19, TypeScript (modo estrito, sem `any`), Vite 8 |
| Roteamento | React Router 7                                         |
| Estilo     | Tailwind CSS 3.4, Lucide Icons, Inter (via Fontsource) |
| Qualidade  | oxlint, Vitest + Testing Library                       |
| Deploy     | Vercel                                                 |

## Como executar

**Pré-requisito:** [Node.js](https://nodejs.org/) 22.22 ou superior.

```bash
git clone https://github.com/sauloguedes71/bahia-api-hub.git
cd bahia-api-hub
npm install
npm run dev
```

Abra `http://localhost:5173`.

| Script               | O que faz                             |
| -------------------- | ------------------------------------- |
| `npm run dev`        | Servidor de desenvolvimento           |
| `npm run build`      | Checagem de tipos e build de produção |
| `npm run preview`    | Serve o build localmente              |
| `npm run lint`       | Análise estática (oxlint)             |
| `npm test`           | Testes automatizados (Vitest)         |
| `npm run test:watch` | Testes em modo observação             |

## Estrutura

```
src/
├── components/
│   ├── hub/      # Sidebar, cabeçalho, cards, frame de módulo, paleta Ctrl+K, painéis do IBGE
│   ├── layout/   # Estruturas de layout (drawer mobile)
│   └── ui/       # Button, Skeleton, EmptyState, ErrorBoundary, ThemeToggle, BrandMark
├── hooks/        # use-theme, use-async, use-module-search, use-route-effects, use-command-shortcut
├── lib/
│   ├── api/      # http (fetch tipado), cache, ibge, wikipedia e types
│   ├── module-routes.ts   # rotas e URLs dos módulos
│   ├── modules.ts         # cards e itens do menu
│   ├── curiosidades.ts    # textos revisados à mão (opcional)
│   └── search.ts          # normalização de texto
├── pages/        # Sobre e 404
└── App.tsx       # roteador
```

Convenção: componentes de **layout** não conhecem regra de negócio, componentes de **ui** não conhecem a API, e a lógica de dados vive em `hooks/` e `lib/api/`.

## Como adicionar um módulo

São dois arquivos.

**1. `src/lib/module-routes.ts`:** cria a rota e alimenta o contador do selo.

```ts
{ path: 'saude', title: 'Módulo Saúde', url: 'https://link-da-equipe.vercel.app/' } // sem url = "em desenvolvimento"
```

**2. `src/lib/modules.ts`:** adiciona o card da home (ícone, descrição, cores e `repoUrl`) e o item do menu em `navItems`. O `id` deve ser igual ao `path` da rota.

### Requisitos para o módulo

- Permitir ser exibido em `iframe` (sem `X-Frame-Options: DENY` e com `frame-ancestors` liberando `https://bahia-hub.vercel.app`).
- Funcionar em telas a partir de 360 px, ter `<html lang="pt-BR">` e `<title>`.

### Tema escuro nos módulos (opcional)

O Hub envia o tema ao módulo por `postMessage` ao carregar e sempre que o usuário troca:

```js
window.addEventListener("message", (event) => {
  const allowed = ["https://bahia-hub.vercel.app", "http://localhost:5173"];
  if (!allowed.includes(event.origin)) return;
  if (event.data?.type === "bahia-hub:theme") {
    document.documentElement.classList.toggle(
      "dark",
      event.data.theme === "dark",
    );
  }
});
```

## Camada de API

Todo consumo externo passa por `src/lib/api/`: `fetchJson<T>(url, parser)` com timeout, erro tipado (`ApiError`) e validação obrigatória da resposta (`unknown` → `T`). Cada serviço usa cache em memória (falhas não ficam em cache), e `useAsync` expõe o estado `loading | success | error` com `reload`. Para criar um serviço: declare o tipo em `types.ts`, escreva o parser, exponha a função e consuma com `useAsync`.

## Fontes de dados e licenças

- **IBGE:** localidades, malhas geográficas e Censo 2022 (tabela 4714), dados públicos.
- **Wikipédia (pt):** descrição e foto dos municípios, texto sob licença CC BY-SA; o link da fonte aparece junto ao conteúdo.

## Testes

Vitest + Testing Library cobrem a busca (com e sem acento), o cache e a camada de API, o tema, o `useAsync` e o `ErrorBoundary`. Rode com `npm test`.

## Deploy

Publicado na Vercel. O `vercel.json` redireciona todas as rotas para o `index.html` (necessário para `/sobre` e para os módulos ao atualizar a página) e define cabeçalhos de segurança básicos.

## Limitações conhecidas

- Os módulos são sites externos em `iframe`: o Hub não altera o estilo interno deles e só conseguiria checar sua saúde se cada equipe liberasse CORS.

## Roadmap

- [x] Carregamento sob demanda das páginas
- [x] Meta tags de compartilhamento (Open Graph)
- [x] Busca global com `Ctrl+K`
- [x] Testes automatizados
- [x] Tema escuro sincronizado com os módulos
- [ ] Favoritos (fixar módulos no topo da home)
- [ ] Teste de ponta a ponta com Playwright

## Equipe

Desenvolvido pela equipe Front-End: Saulo, Solano e Pedro.

Código do Hub: <https://github.com/sauloguedes71/bahia-api-hub>
