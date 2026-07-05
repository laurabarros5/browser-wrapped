# Browser Wrapped 🌐

Extensão de navegador que mapeia sua navegação, conta o tempo em cada site e gera um **Wrapped semanal** — como o Spotify Wrapped, só que do seu navegador.

## Funcionalidades

- **Rastreamento automático** — conta o tempo em cada domínio enquanto você navega
- **Popup em tempo real** — veja top sites de hoje, da semana e por categoria
- **Categorização inteligente** — identifica ferramentas (dev, social, entretenimento, produtividade, etc.)
- **Wrapped semanal** — apresentação gráfica estilo Spotify com slides animados
- **Privacidade total** — dados ficam apenas no seu navegador, nunca saem da máquina
- **Detecção de inatividade** — para de contar quando você está ausente

## Instalação

### Chrome / Edge / Brave

1. Abra `chrome://extensions` (ou `edge://extensions`)
2. Ative o **Modo do desenvolvedor** (canto superior direito)
3. Clique em **Carregar sem compactação**
4. Selecione a pasta `browser-wrapped`

### Firefox

1. Abra `about:debugging#/runtime/this-firefox`
2. Clique em **Carregar extensão temporária**
3. Selecione o arquivo `manifest.json` desta pasta

> **Nota:** Para gerar os ícones PNG, execute `node scripts/generate-icons.cjs` (requer Node.js).

## Como usar

1. **Navegue normalmente** — a extensão rastreia automaticamente
2. **Clique no ícone** da extensão para ver estatísticas do dia e da semana
3. **Wrapped semanal** — todo domingo à noite, ou clique em "Ver Wrapped Semanal"
4. **Configurações** — pause o rastreamento ou apague dados em Configurações

## Wrapped Semanal

A apresentação inclui 10 slides:

1. Introdução da semana
2. Tempo total de navegação
3. Seu site #1 (destaque)
4. Top 5 sites favoritos
5. Gráfico por dia da semana
6. Horários de pico
7. Categorias de uso (dev, social, etc.)
8. Seu perfil de navegador (Coruja Noturna, Builder, etc.)
9. Curiosidades e fatos
10. Resumo final

Navegue com setas do teclado, swipe no mobile, ou clique nos botões.

## Privacidade

- Apenas **domínios** são registrados (ex: `github.com`), nunca URLs completas
- Nenhum conteúdo de página é lido ou armazenado
- Dados em `chrome.storage.local` — 100% local
- Sem telemetria, sem servidores, sem contas

## Estrutura do projeto

```
browser-wrapped/
├── manifest.json          # Manifest V3
├── background/
│   └── service-worker.js  # Rastreamento de abas
├── lib/
│   ├── storage.js         # Persistência local
│   ├── stats.js           # Cálculos estatísticos
│   ├── categories.js      # Categorias de domínios
│   └── utils.js           # Utilitários
├── popup/                 # Popup da extensão
├── wrapped/               # Apresentação Wrapped
├── options/               # Configurações
└── icons/                 # Ícones da extensão
```

## Publicar no GitHub

**Repositório:** https://github.com/laurabarros5/browser-wrapped

- **Guia detalhado (comece aqui):** [GUIA_GITHUB_DETALHADO.md](GUIA_GITHUB_DETALHADO.md)
- Guia resumido: [GITHUB_SETUP.md](GITHUB_SETUP.md)

## Licença

MIT — veja [LICENSE](LICENSE).
