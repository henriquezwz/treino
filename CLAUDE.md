# Caderno de Treino — guia para o Claude

Este app é do Paulo. Ele quer que o Caderno de Treino siga **o mesmo padrão visual e o mesmo jeito de funcionar** da Caderneta (o app de finanças dele).

O código de referência está no repositório **henriquezwz/caderneta**, no arquivo `index.html`, com o app inteiro num arquivo só. Antes de mudar qualquer coisa aqui, leia o que precisar de lá e copie os padrões, em vez de reinventar.

Publique só neste repositório (henriquezwz/treino). Nunca mexa em outros repositórios do Paulo, principalmente o `revisao-esfcex`.

## Quem é o usuário

- **Preguiça assumida.** Quanto menos digitar e tocar, melhor. Tudo o que o app puder deduzir sozinho, ele deduz.
- **Usa no celular Android**, no Chrome, às vezes como app instalado. Testa também no Chromebook.
- **Fala português do Brasil, de forma informal.** Os textos da interface também são em português e sem jargão técnico.
- **Quer ver o resultado funcionando**, não explicação. Responda curto, dizendo o que mudou e onde tocar.

## Visual (igual à Caderneta)

- **Moderno, colorido e claro, "sem cara de IA".** Nada de tela toda preta. O modo escuro existe só como opção (botão ☀ no topo, com os temas claro, escuro e automático).
- **Fontes:** `Schibsted Grotesk` (interface) e `JetBrains Mono` (números), pelo Google Fonts.
- **Paleta** (tokens CSS no `:root`; os mesmos nomes devem valer aqui):

```css
:root{
  --bg:#F3F5FB; --surface:#FFFFFF; --sunk:#E9EDF6; --ink:#141B34; --muted:#5E6784; --line:#DCE1EE;
  --blue:#2D5BFF; --blue-deep:#1A3FD6; --blue-soft:#E2E9FF;
  --tang:#FF6A2B; --tang-soft:#FFE7DC;
  --violet:#7B5CF5; --violet-soft:#ECE6FF;
  --amber:#F2A007; --amber-soft:#FFF1D2;
  --mint:#12B07F; --mint-soft:#D8F4E9;
  --sky:#119FE3; --pink:#E9468A; --teal:#0E9E9B;
  --danger:#E0363B; --danger-soft:#FDE3E3;
  --f-ui:"Schibsted Grotesk", system-ui, sans-serif;
  --f-num:"JetBrains Mono", ui-monospace, monospace;
  --r:14px; --r-sm:8px;
}
:root[data-tema="escuro"]{
  --bg:#0B1020; --surface:#131A2E; --sunk:#1B2339; --ink:#E8ECF7; --muted:#97A0BC; --line:#252F4A;
  --blue:#5C82FF; --blue-soft:#1C2A55; --tang:#FF7E45; --tang-soft:#3A2218;
  --violet:#9A82FF; --violet-soft:#2A2350; --amber:#FFB534; --amber-soft:#3A2D10;
  --mint:#2FCB97; --mint-soft:#103629; --danger:#FF5A5E; --danger-soft:#3D1A1D; color-scheme:dark;
}
```

- **Azul** é a cor principal e o **laranja (tang)** é o destaque. Violeta, âmbar, menta, céu e rosa servem para categorias e estados.
- **Componentes da Caderneta para reaproveitar:** os painéis (`.panel`) com título e cor de marcação, os chips, as barras de progresso com o risquinho do "ritmo de hoje", as folhas que sobem de baixo (`abrirFolha`), os toasts com Desfazer e o bloco de destaque do topo (hero).
- **Mobile primeiro:**
  - Gutter de 16px e nada de rolagem lateral.
  - Áreas de toque de pelo menos 40px.
  - Ao tocar em algo, a tela **não pode pular para o topo**: atualize no lugar ou preserve a rolagem.

## Padrões de funcionamento que o Paulo aprovou

1. **Barra de digitação natural no topo.** Ele escreve como fala e o app entende, inclusive várias coisas numa frase só. No treino, por exemplo, "corri 5km em 28min", "supino 4x10 40kg" ou "futebol 1h". Mostre uma prévia do que foi entendido antes de lançar.
2. **Tudo desfazível.**
   - Todo lançamento tem um ✕ para apagar na hora.
   - Toda ação mostra um toast com **Desfazer**.
   - Todo ✓ marcado pode ser desmarcado.
   - Importações em lote têm "Desfazer importação".
3. **Editar no lugar.**
   - Toque no valor e ele vira campo; Enter salva.
   - Toque no nome e ele renomeia.
   - Nada de formulário separado para coisa simples.
4. **Plano do período no topo, com acompanhamento embaixo.** Na Caderneta é o "Plano do mês" com os itens e o progresso de cada um. No treino, o equivalente é o plano da semana: o que planejou contra o que fez, com barras de progresso.
   - Já vem preenchido com base no período anterior; ele só revisa.
   - O plano é minimizável. No começo do período vem aberto, porque é o foco. Se ele minimizar, fica minimizado até abrir de novo.
5. **Nada de cadastrar à mão o que o app já tem.** Use o histórico para montar o padrão sozinho.
6. **Categorias não são o foco.** Ele odiou categorias inventadas. O que ele acompanha são os **itens do plano dele**. Categorias ficam nos bastidores, fáceis de renomear ou apagar.
7. **Aprende com correções.** Quando ele corrige algo, o app lembra para as próximas vezes.
8. **Insights de IA.** Use o Gemini pelo Firebase AI Logic (ver abaixo).
   - Um painel de insights profundos, com números reais, que atualiza sozinho uma vez por dia e tem botão Atualizar.
   - Formato de resposta em JSON: `[{tipo, titulo, texto, acao}]`.
   - Nada genérico.

## Infra (lições da Caderneta)

- **App de um arquivo só** (`index.html`), em JavaScript puro, sem build. Publicado no GitHub Pages.
- **Firebase 12.x** por import dinâmico do gstatic:
  - Login: `initializeAuth(app, {persistence: browserLocalPersistence})`. **Não** use IndexedDB, porque travava no Android.
  - Login com Google via popup, mais **e-mail e senha como alternativa**: o popup do Google falha em alguns Android com "Login cancelado".
  - Coloque prazo em tudo: se o Firebase não responder em cerca de 10 segundos, mostre uma mensagem e uma saída. Nunca deixe "Carregando…" para sempre.
- **Privacidade:**
  - Nada pessoal no código público.
  - Quem abre sem login vê o app funcionando com **dados genéricos de exemplo**, guardados só no navegador.
- **IA:** Firebase AI Logic com `GoogleAIBackend`.
  - Tente os modelos em ordem `["gemini-3.8-flash","gemini-3-flash-preview","gemini-flash-latest","gemini-3.5-flash-lite"]` e lembre o último que funcionou.
  - Use **sempre `generateContentStream`**, também para JSON. Sem streaming, a conexão cai no 4G.
  - Em erro de rede, tente o próximo modelo.
  - Mostre mensagens de erro claras, sem detalhe técnico.
- **App instalável (PWA):**
  - `manifest.webmanifest`, ícones 192 e 512 e um `sw.js` que busca sempre a versão nova na rede (`cache: "no-store"`), com o cache servindo só para quando estiver sem internet.
  - Convite de instalação **uma vez só**, dispensável. Depois, a opção fica em Ajustes.
- **Atualização automática:**
  - A cada publicação, grave um `version.json` com a mesma `VERSAO` do código.
  - O app compara ao abrir e quando volta ao primeiro plano. Se estiver mexendo, mostra "Versão nova · Atualizar agora".
  - Tenha uma trava para não recarregar em loop.
  - O modelo está na Caderneta: `procurarVersao` e `deploy.sh`.
- **Antes de publicar, teste com o Playwright** (o Chromium já vem instalado), no tamanho de celular (390 × 900): sem erros no console e com o fluxo principal funcionando.

## Ao responder ao Paulo

- Diga em uma ou duas frases o que mudou e onde ele toca para usar.
- Se algo depende de ele fazer um passo (abrir um link, importar um arquivo), diga exatamente o passo.
- Sem jargão: nada de "service worker" ou "Firestore" na conversa com ele, a menos que ele pergunte.
