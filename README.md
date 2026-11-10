# Portfólio — Julio Cesar

Site pessoal (HTML, CSS e JavaScript) do projeto individual de **Desenvolvimento Front-end para Web** — CP3: Git, deploy e JavaScript.

🔗 **Site publicado:** https://SEU-USUARIO.github.io/NOME-DO-REPOSITORIO/

## Páginas

| Página | Arquivo |
| --- | --- |
| Início | `index.html` |
| Currículo | `curriculo.html` |
| Contato (formulário) | `formulario.html` |
| Multimídia | `multimidia.html` |
| Gráficos (canvas e SVG) | `graficos.html` |

## Estrutura

```
├── css/estilos.css      # estilos do site (inclui o tema escuro)
├── js/scripts.js        # todo o JavaScript do site
├── midias/              # vídeo e áudio usados em multimidia.html
└── *.html
```

## Feature com localStorage: tema claro/escuro

- **O que faz:** o botão no cabeçalho (🌙 Tema escuro / ☀️ Tema claro) alterna a paleta do site.
- **O que fica salvo:** a escolha do tema, na chave `tema-site` do `localStorage` (valores `light` ou `dark`).
- **Em todas as páginas:** o botão existe nas 5 páginas e a escolha vale para todas.
- **Primeira visita:** sem escolha salva, o site segue a preferência de tema do sistema do visitante.
- **Como testar:**
  1. Clique no botão de tema.
  2. Recarregue a página (F5) ou navegue para outra página — o tema continua.
  3. Abra o DevTools → Application → Local Storage e veja a chave `tema-site`.

## Formulário de contato

`formulario.html` valida os campos com JavaScript (`js/scripts.js`) e mostra mensagens **na tela**, abaixo de cada campo com problema, além de um aviso geral de sucesso ou erro. Não usa `alert`.

> Demonstração: o site é estático e não possui servidor, então o formulário valida os dados mas não envia a mensagem para lugar nenhum.

## Como rodar localmente

Abra a pasta no VS Code e use a extensão Live Server em `index.html`.

## Fluxo Git do projeto

- `main`: versão publicada.
- `feature/tema-escuro`: branch onde foram desenvolvidos o tema escuro, a organização do JavaScript e a validação do formulário, depois mesclada na `main`.
- Tag `cp3-entrega`: estado exato do que foi entregue no CP3.
