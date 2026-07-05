# Guia detalhado — Enviar o projeto para o GitHub

**Seu repositório:** https://github.com/laurabarros5/browser-wrapped  
**Pasta do projeto no seu PC:** `C:\Users\Laura\Projects\browser-wrapped`

Este guia assume que você **já criou** o repositório vazio no GitHub (sem README, sem .gitignore, sem licença — o GitHub oferece essas opções na criação; deixe todas desmarcadas).

---

## O que já foi feito por você (automático)

No seu computador, o projeto já está:

- [x] Com todos os arquivos da extensão
- [x] Com ícones em `icons/` (icon16, icon48, icon128)
- [x] Com Git inicializado (`git init`)
- [x] Com primeiro commit criado
- [x] Com branch renomeada para `main`
- [x] Com `remote` apontando para `https://github.com/laurabarros5/browser-wrapped.git`

**Falta apenas uma coisa:** o comando `git push` (enviar o código para o GitHub). Isso exige login na sua conta GitHub.

---

## Passo 1 — Abrir o terminal certo

### Opção A — Terminal do Cursor (recomendado)

1. No Cursor, menu **Terminal → New Terminal** (ou `` Ctrl+` ``).
2. Digite:

```powershell
cd C:\Users\Laura\Projects\browser-wrapped
```

### Opção B — PowerShell do Windows

1. Tecla Windows, digite **PowerShell**, abra **Windows PowerShell**.
2. Mesmo comando `cd` acima.

### Se aparecer "git não é reconhecido"

O Git está instalado, mas pode não estar no PATH. Use o caminho completo:

```powershell
& "C:\Program Files\Git\bin\git.exe" --version
```

Se mostrar `git version 2.x.x`, use `& "C:\Program Files\Git\bin\git.exe"` no lugar de `git` em todos os comandos abaixo, **ou** reinstale o Git marcando **"Add Git to PATH"**: https://git-scm.com/download/win

---

## Passo 2 — Confirmar que está tudo pronto

Cole estes comandos **um bloco de cada vez** e leia a saída:

```powershell
cd C:\Users\Laura\Projects\browser-wrapped

git status
```

**Resultado esperado:** algo como `On branch main` e `nothing to commit, working tree clean` (ou lista de arquivos se ainda não commitou).

```powershell
git remote -v
```

**Resultado esperado:**

```
origin  https://github.com/laurabarros5/browser-wrapped.git (fetch)
origin  https://github.com/laurabarros5/browser-wrapped.git (push)
```

```powershell
git log -1 --oneline
```

**Resultado esperado:** uma linha com `feat: extensão Browser Wrapped...`

Se o `remote` estiver errado ou vazio:

```powershell
git remote remove origin
git remote add origin https://github.com/laurabarros5/browser-wrapped.git
```

Se ainda **não** existir commit:

```powershell
git add .
git commit -m "feat: extensão Browser Wrapped com rastreamento e Wrapped semanal"
git branch -M main
```

---

## Passo 3 — Enviar para o GitHub (`git push`)

Este é o passo principal:

```powershell
cd C:\Users\Laura\Projects\browser-wrapped
git push -u origin main
```

### O que pode acontecer

#### Cenário A — Abre uma janela do navegador (Git Credential Manager)

1. O navegador abre pedindo login no GitHub.
2. Faça login com **laurabarros5**.
3. Autorize o Git Credential Manager.
4. Volte ao terminal — deve aparecer algo como:

```
Enumerating objects: ...
Writing objects: 100% ...
To https://github.com/laurabarros5/browser-wrapped.git
 * [new branch]      main -> main
```

5. Abra https://github.com/laurabarros5/browser-wrapped — você deve ver todos os arquivos (manifest.json, popup/, lib/, etc.).

#### Cenário B — Pede usuário e senha no terminal

- **Username:** `laurabarros5`
- **Password:** **NÃO** use a senha da conta GitHub. Use um **Personal Access Token (PAT)**.

Como criar o token:

1. Acesse: https://github.com/settings/tokens
2. **Generate new token** → **Generate new token (classic)**
3. Note: `browser-wrapped push`
4. Expiration: 90 days (ou No expiration, se preferir)
5. Marque o scope **`repo`** (acesso completo a repositórios privados e públicos)
6. **Generate token**
7. **Copie o token** (começa com `ghp_...`) — só aparece uma vez
8. No terminal, quando pedir **Password**, cole o token (não aparece enquanto digita — é normal)

#### Cenário C — Erro "failed to push" / "rejected"

Se você marcou **"Add a README"** ao criar o repo no GitHub, o remoto tem um commit que o local não tem. Corrija assim:

```powershell
git pull origin main --allow-unrelated-histories
git push -u origin main
```

Se pedir mensagem de merge, salve e feche o editor que abrir (no Vim: `:wq` + Enter).

#### Cenário D — Erro "remote origin already exists"

```powershell
git remote set-url origin https://github.com/laurabarros5/browser-wrapped.git
git push -u origin main
```

#### Cenário E — Erro 403 / Permission denied

- Token expirado ou sem scope `repo` → crie outro token.
- Usuário errado → `git config user.name` e confira se está logado como laurabarros5 no credential manager.

---

## Passo 4 — Verificar no GitHub

1. Abra: https://github.com/laurabarros5/browser-wrapped
2. Confira se aparecem pastas: `background`, `lib`, `popup`, `wrapped`, `options`, `icons`
3. Clique em **README.md** — deve mostrar a documentação da extensão
4. O commit mais recente deve ter a mensagem do `feat: extensão Browser Wrapped...`

---

## Passo 5 — Deixar o repositório apresentável (opcional, 5 minutos)

No GitHub, na página do repositório:

### 5.1 Descrição e About

1. Clique na **engrenagem** ao lado de "About" (lado direito).
2. **Description:** `Extensão de navegador — Wrapped semanal da sua navegação, estilo Spotify`
3. **Website:** deixe vazio por enora
4. Marque **Releases** se quiser publicar versões depois
5. Salve

### 5.2 Topics (tags)

1. Clique em **⚙️** ou em **Add topics**
2. Adicione: `browser-extension`, `chrome-extension`, `manifest-v3`, `javascript`, `privacy`
3. Enter para cada uma

### 5.3 README visível na página inicial

Já está incluído no push — a home do repo mostra o README automaticamente.

---

## Passo 6 — Instalar a extensão a partir do GitHub (para testar)

O GitHub **não instala** extensão sozinho; você baixa o código e carrega no Chrome:

1. Se quiser clonar em outro PC:
   ```powershell
   git clone https://github.com/laurabarros5/browser-wrapped.git
   cd browser-wrapped
   ```
2. No seu PC, você já tem a pasta em `C:\Users\Laura\Projects\browser-wrapped`.
3. Chrome → `chrome://extensions`
4. Ative **Modo do desenvolvedor**
5. **Carregar sem compactação** → selecione a pasta `browser-wrapped`
6. Navegue alguns minutos e clique no ícone da extensão.

---

## Comandos úteis depois do primeiro push

Sempre que alterar código e quiser atualizar o GitHub:

```powershell
cd C:\Users\Laura\Projects\browser-wrapped
git status
git add .
git commit -m "descreva o que mudou"
git push
```

Exemplos de mensagem de commit:

- `fix: corrigir contagem quando troca de aba`
- `docs: atualizar README`
- `feat: adicionar categoria jogos`

---

## Resumo — só o essencial

| # | Ação | Comando |
|---|------|---------|
| 1 | Ir à pasta | `cd C:\Users\Laura\Projects\browser-wrapped` |
| 2 | Conferir remote | `git remote -v` |
| 3 | Enviar | `git push -u origin main` |
| 4 | Ver no site | https://github.com/laurabarros5/browser-wrapped |

---

## Problemas frequentes

| Problema | Solução |
|----------|---------|
| `git` não encontrado | Use `"C:\Program Files\Git\bin\git.exe"` ou reinstale Git com PATH |
| Pediu senha e não aceita | Use token PAT em https://github.com/settings/tokens |
| Repo vazio no GitHub após push | Confira branch `main` no dropdown do GitHub (não `master`) |
| Pasta `icons` vazia no GitHub | Rode `node scripts/generate-icons.cjs` e faça novo commit + push |
| Quer apagar histórico e recomeçar | **Cuidado:** só se o repo for seu e vazio no GitHub; peça ajuda antes |

---

## Checklist final

- [ ] `git push -u origin main` executado com sucesso
- [ ] Arquivos visíveis em https://github.com/laurabarros5/browser-wrapped
- [ ] Extensão carrega em `chrome://extensions`
- [ ] (Opcional) Description e topics no GitHub

Quando o `git push` funcionar, me avise se quiser ajuda com releases, badge no README ou publicação na Chrome Web Store.
