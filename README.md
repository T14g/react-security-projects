# React e Trusted Types

Demonstração de **injeção de conteúdo no front-end** (XSS baseado no DOM) e de como o **React 19.3** trabalha com a [API Trusted Types](https://developer.mozilla.org/docs/Web/API/Trusted_Types_API).

O exemplo é uma caixa de comentários. A mesma frase pode ser mostrada como texto ou como HTML. A diferença entre os dois jeitos é o que abre, ou fecha, o ataque.

São duas páginas porque a proteção vale para o documento inteiro. Não dá para ligar e desligar Trusted Types dentro de um único HTML.

| Página | Endereço | O que mostra |
| --- | --- | --- |
| Sem a API | `/` | O comentário vai direto para o HTML. Tags viram elementos e um comentário malicioso executa código. |
| Com a API | `/protegida.html` | O navegador recusa texto cru. Só entra no DOM o que passou pela política de limpeza. |

## Como rodar

Requer [Node.js](https://nodejs.org/) 20 ou mais recente.

```bash
npm install
npm run dev
```

Abra as duas rotas:

- http://localhost:5173/
- http://localhost:5173/protegida.html

A página protegida precisa de um navegador com Trusted Types, como Chrome ou Edge atuais. Sem a API, a explicação continua na tela, mas o bloqueio não acontece.

Para ver o build de produção:

```bash
npm run build
npm run preview
```

## O que testar

Na página sem proteção, publique os três exemplos e compare as caixas.

1. **Comentário normal.** As duas caixas mostram a mesma frase.
2. **Comentário com negrito.** Como texto, a tag `<b>` aparece escrita. Como HTML, a palavra fica em negrito.
3. **Comentário malicioso.** Como HTML, o navegador abre um `alert`. Como texto, os mesmos caracteres ficam só escritos. O alerta é local e não envia nada para lugar nenhum. Ele existe para deixar visível que o código do comentário rodou.

Na página protegida, publique o exemplo 3 de novo.

- Colocar o texto direto no `innerHTML` gera um erro: o documento exige `TrustedHTML`.
- Passar o texto por `createHTML` remove o `onerror`. O negrito do exemplo 2 continua, porque `<b>` não executa código.

## O que o React 19.3 mudou

Trusted Types só aceita, nos pontos que interpretam HTML ou script, um objeto criado por uma política (`TrustedHTML`, `TrustedScript` ou `TrustedScriptURL`). Uma string comum é recusada quando a página publica:

```
Content-Security-Policy: require-trusted-types-for 'script'
```

Até o React 19.2, `dangerouslySetInnerHTML` convertia esse objeto de volta em string (`'' + valor`) antes de escrever no DOM. A conversão desfazia a proteção e o navegador rejeitava até o HTML já limpo.

No React 19.3 o objeto segue inteiro até `innerHTML` e até atributos de HTML, SVG e URL. Quem filtra o conteúdo, neste projeto, é o DOMPurify, chamado de dentro da política `sanitizer`. Trusted Types não escolhe o que é seguro. Ele só garante que o valor passou por essa função.

A política desta demonstração está em `protegida.html`:

```html
<meta
  http-equiv="Content-Security-Policy"
  content="require-trusted-types-for 'script'; trusted-types sanitizer dompurify 'allow-duplicates';"
/>
```

`allow-duplicates` só existe para o recarregamento do servidor de desenvolvimento. Em produção, o mesmo par de diretivas deve ir no cabeçalho HTTP `Content-Security-Policy`.

## Estrutura

```
index.html              página sem Trusted Types
protegida.html          página com a política ativa
src/sem/                comentário sem proteção
src/com/                política, limpeza e comentário protegido
src/com/policy.js       createPolicy('sanitizer') + DOMPurify
src/sample.js           os três comentários de exemplo
src/CommentBox.jsx      campo compartilhado pelas duas páginas
```

## Stack

- React 19.3 e React DOM 19.3
- Vite
- DOMPurify
