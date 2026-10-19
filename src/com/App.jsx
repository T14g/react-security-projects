import { useState } from 'react';
import { CommentBox } from '../CommentBox.jsx';
import { SiteHeader } from '../SiteHeader.jsx';
import { examples } from '../sample.js';
import { getSanitizerPolicy, trustedTypesAvailable } from './policy.js';

function tryRawInnerHTML(value) {
  const element = document.createElement('div');

  try {
    element.innerHTML = value;
    return { blocked: false, message: 'O navegador aceitou o texto cru.' };
  } catch (error) {
    return {
      blocked: true,
      message: error instanceof Error ? error.message : String(error),
    };
  }
}

export function App() {
  const available = trustedTypesAvailable();
  const policy = available ? getSanitizerPolicy() : null;
  const [draft, setDraft] = useState(examples[2].value);
  const [published, setPublished] = useState(null);

  function publish() {
    const trusted = policy ? policy.createHTML(draft) : null;
    setPublished({
      value: draft,
      trusted,
      raw: tryRawInnerHTML(draft),
      at: Date.now(),
    });
  }

  return (
    <>
      <SiteHeader current="com" />
      <main className="page page-com">
        <p className="eyebrow">Página com Trusted Types</p>
        <h1>O mesmo comentário, agora com um porteiro</h1>
        <p className="lede">
          Esta página liga o Trusted Types. Pense nele como um{' '}
          <strong>porteiro</strong> do navegador: ele não deixa nenhum texto
          entrar no HTML da página sem antes passar por uma função de limpeza
          que você escolheu.
        </p>

        {!available && (
          <p className="banner" role="status">
            Este navegador não implementa <code>trustedTypes</code>. Abra a
            página num Chrome ou Edge recente para ver a proteção funcionando.
          </p>
        )}

        <section>
          <h2>Teste o comentário malicioso</h2>
          <p>
            O exemplo 3 já vem selecionado. Publique e veja o que acontece com
            ele aqui.
          </p>
          <CommentBox
            draft={draft}
            onDraftChange={setDraft}
            onPublish={publish}
            publishLabel="Publicar comentário"
          />

          {published && (
            <div className="compare">
              <article>
                <h3>Tentando colocar o texto cru</h3>
                <p className="hint">
                  <code>div.innerHTML = comentario</code>
                </p>
                <p className={published.raw.blocked ? 'status good' : 'status bad'}>
                  {published.raw.blocked ? 'Bloqueado pelo navegador' : 'Passou'}
                </p>
                <p className="hint">{published.raw.message}</p>
                <p>
                  {published.raw.blocked
                    ? 'O porteiro viu um texto comum, sem passar pela limpeza, e recusou. Nada foi colocado na página.'
                    : 'A proteção não está ativa neste navegador.'}
                </p>
              </article>
              <article>
                <h3>Passando pela limpeza</h3>
                <p className="hint">
                  <code>policy.createHTML(comentario)</code>
                </p>
                {published.trusted ? (
                  <>
                    <div
                      key={published.at}
                      className="surface"
                      dangerouslySetInnerHTML={{ __html: published.trusted }}
                    />
                    <p className="status good">Aceito, já limpo</p>
                    <p className="hint">O que sobrou depois da limpeza:</p>
                    <pre className="code small">
                      {String(published.trusted) || '(vazio)'}
                    </pre>
                  </>
                ) : (
                  <p className="hint">Sem a API, não há limpeza obrigatória.</p>
                )}
              </article>
            </div>
          )}

          {published && published.trusted && (
            <div className="before-after">
              <div>
                <p className="hint">Você escreveu</p>
                <pre className="code small">{published.value}</pre>
              </div>
              <span className="arrow" aria-hidden="true">
                →
              </span>
              <div>
                <p className="hint">A página recebeu</p>
                <pre className="code small">
                  {String(published.trusted) || '(vazio)'}
                </pre>
              </div>
            </div>
          )}
        </section>

        <section>
          <h2>O que aconteceu</h2>
          <ol className="steps">
            <li>
              <strong>Texto cru foi barrado.</strong> Colocar o comentário
              direto no <code>innerHTML</code> deu erro. Com Trusted Types, o
              navegador só aceita um objeto especial chamado{' '}
              <code>TrustedHTML</code>, e texto comum não é esse objeto.
            </li>
            <li>
              <strong>A limpeza tirou a parte perigosa.</strong> A função{' '}
              <code>createHTML</code> passou o comentário pelo DOMPurify. No
              exemplo 3, ele manteve a imagem e apagou o{' '}
              <code>onerror</code>. Sem esse atributo, não há código para rodar,
              e o alerta não aparece.
            </li>
            <li>
              <strong>O React entregou o resultado sem estragar.</strong> O
              React 19.3 passa o <code>TrustedHTML</code> direto para o
              navegador. Antes disso, o React transformava o objeto em texto
              comum, e o porteiro recusava até o HTML já limpo.
            </li>
          </ol>
          <p>
            Teste também o exemplo 2: o negrito continua funcionando, porque{' '}
            <code>&lt;b&gt;</code> não é perigoso. A limpeza tira só o que pode
            rodar código.
          </p>
        </section>

        <section>
          <h2>O código, em três partes</h2>
          <p className="hint">1. Ligar o porteiro, no HTML da página:</p>
          <pre className="code">{`<meta http-equiv="Content-Security-Policy"
  content="require-trusted-types-for 'script'; trusted-types sanitizer dompurify">`}</pre>
          <p>
            <code>require-trusted-types-for &apos;script&apos;</code> liga o
            bloqueio. <code>trusted-types</code> diz quais funções de limpeza
            podem existir. O nome <code>dompurify</code> está ali porque a
            biblioteca cria uma função própria por dentro. Neste projeto também
            existe <code>&apos;allow-duplicates&apos;</code>, só para o
            recarregamento do servidor de desenvolvimento.
          </p>

          <p className="hint">2. Criar a função de limpeza:</p>
          <pre className="code">{`import DOMPurify from 'dompurify';

const policy = trustedTypes.createPolicy('sanitizer', {
  createHTML: (texto) => DOMPurify.sanitize(texto),
});`}</pre>

          <p className="hint">3. Usar no componente:</p>
          <pre className="code">{`function Comentario({ texto }) {
  return (
    <div dangerouslySetInnerHTML={{ __html: policy.createHTML(texto) }} />
  );
}`}</pre>
        </section>

        <section className="next">
          <h2>O que lembrar</h2>
          <ul className="steps">
            <li>
              Para mostrar texto, continue usando <code>{'{texto}'}</code>. É o
              jeito mais simples e seguro.
            </li>
            <li>
              Trusted Types não limpa nada sozinho. Ele obriga a passar pela
              sua função, e quem limpa é o DOMPurify dentro dela.
            </li>
            <li>
              A vantagem é que um <code>innerHTML</code> esquecido no código
              passa a dar erro, em vez de abrir uma falha.
            </li>
          </ul>
          <a className="text-link" href="/">
            Voltar para a página sem proteção
          </a>
        </section>
      </main>
    </>
  );
}
