# Publicar no GitHub

Guia passo a passo para subir o **Browser Wrapped** ao GitHub.

## Pré-requisitos

1. **Git** instalado: https://git-scm.com/download/win  
   Depois de instalar, feche e reabra o terminal (ou o Cursor).
2. Conta no **GitHub**: https://github.com/signup
3. (Opcional) **GitHub CLI** (`gh`): https://cli.github.com/ — facilita criar o repositório pelo terminal.

## 1. Verificar que os ícones existem

Os ícones já devem estar em `icons/`. Se a pasta estiver vazia:

```powershell
cd C:\Users\Laura\Projects\browser-wrapped
node scripts/generate-icons.cjs
```

Confirme que existem: `icon16.png`, `icon48.png`, `icon128.png`.

## 2. Criar o repositório no GitHub (site)

1. Acesse https://github.com/new
2. **Repository name:** `browser-wrapped` (ou outro nome)
3. **Description:** Extensão de navegador — Wrapped semanal da sua navegação
4. Escolha **Public** ou **Private**
5. **Não** marque "Add a README" (já temos um no projeto)
6. Clique em **Create repository**
7. Copie a URL do repositório, por exemplo:  
   `https://github.com/SEU_USUARIO/browser-wrapped.git`

## 3. Inicializar Git e enviar (PowerShell)

Substitua `SEU_USUARIO` pelo seu usuário do GitHub.

```powershell
cd C:\Users\Laura\Projects\browser-wrapped

git init
git add .
git status
git commit -m "feat: extensão Browser Wrapped com rastreamento e Wrapped semanal"

git branch -M main
git remote add origin https://github.com/SEU_USUARIO/browser-wrapped.git
git push -u origin main
```

Na primeira vez, o Git pode pedir login (navegador ou token).

### Autenticação (se o push falhar)

- **HTTPS:** use um [Personal Access Token](https://github.com/settings/tokens) como senha (não use a senha da conta).
- **SSH:** configure chave em https://docs.github.com/en/authentication/connecting-to-github-with-ssh e use:
  ```powershell
  git remote set-url origin git@github.com:SEU_USUARIO/browser-wrapped.git
  git push -u origin main
  ```

## 4. Alternativa com GitHub CLI

```powershell
cd C:\Users\Laura\Projects\browser-wrapped
git init
git add .
git commit -m "feat: extensão Browser Wrapped com rastreamento e Wrapped semanal"
gh repo create browser-wrapped --public --source=. --remote=origin --push
```

## 5. O que será enviado

| Incluído | Excluído (.gitignore) |
|----------|------------------------|
| Código da extensão | `node_modules/` |
| `icons/*.png` | logs, arquivos temporários |
| `README.md`, `LICENSE` | |

**Nenhum dado de navegação do usuário** entra no repositório — isso fica só no `chrome.storage.local` de cada pessoa.

## 6. Depois do push

- Adicione **Topics** no GitHub: `browser-extension`, `chrome-extension`, `manifest-v3`, `privacy`
- Em **About**, link para instalação: instruções do `README.md`
- (Futuro) Publicar na Chrome Web Store exige conta de desenvolvedor ($5 única)

## 7. Atualizações futuras

```powershell
cd C:\Users\Laura\Projects\browser-wrapped
git add .
git commit -m "descrição da mudança"
git push
```

## Checklist antes do primeiro push

- [ ] `node scripts/generate-icons.cjs` executado
- [ ] Pasta `icons/` com 3 PNGs
- [ ] `git status` sem arquivos sensíveis (.env, etc.)
- [ ] Repositório criado no GitHub
- [ ] `remote` apontando para a URL correta
