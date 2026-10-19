import { useState } from 'react';
import { CommentBox } from '../CommentBox.jsx';
import { SiteHeader } from '../SiteHeader.jsx';
import { examples } from '../sample.js';

export function App() {
  const [draft, setDraft] = useState(examples[0].value);
  const [published, setPublished] = useState(null);

  return (
    <>
      <SiteHeader current="sem" />
      <main className="page page-sem">
        <p className="eyebrow">Página sem Trusted Types</p>
        <h1>Um comentário que vira código</h1>
        <p className="lede">
          Pense num blog com comentários. Qualquer pessoa escreve um texto e o
          site mostra esse texto para todo mundo. A pergunta é: o site mostra o
          comentário <strong>como texto</strong> ou <strong>como HTML</strong>?
          Essa escolha decide se um comentário pode rodar código na página.
        </p>

        <section>
          <h2>Teste você mesmo</h2>
          <p>
            Publique os três exemplos, um de cada vez, e compare as duas
            caixas.
          </p>
          <CommentBox
            draft={draft}
            onDraftChange={setDraft}
            onPublish={() => setPublished({ value: draft, at: Date.now() })}
            publishLabel="Publicar comentário"
          />

          {published && (
            <div className="compare">
              <article>
                <h3>Mostrado como texto</h3>
                <p className="hint">
                  <code>{'<p>{comentario}</p>'}</code>
                </p>
                <div className="surface">{published.value}</div>
                <p className="status good">Seguro</p>
                <p className="hint">
                  O React escreve cada letra na tela, inclusive os sinais{' '}
                  <code>&lt;</code> e <code>&gt;</code>. Nada é interpretado.
                </p>
              </article>
              <article>
                <h3>Mostrado como HTML</h3>
                <p className="hint">
                  <code>dangerouslySetInnerHTML</code>
                </p>
                <div
                  key={published.at}
                  className="surface"
                  dangerouslySetInnerHTML={{ __html: published.value }}
                />
                <p className="status bad">Perigoso</p>
                <p className="hint">
                  O navegador lê as tags e monta a página com elas. Se houver
                  código escondido, ele roda.
                </p>
              </article>
            </div>
          )}
        </section>

        <section>
          <h2>O que aconteceu em cada exemplo</h2>
          <ol className="steps">
            <li>
              <strong>Comentário normal.</strong> Não tem nenhuma tag, então as
              duas caixas mostram a mesma frase.
            </li>
            <li>
              <strong>Comentário com negrito.</strong> Na caixa de texto você vê{' '}
              <code>&lt;b&gt;post&lt;/b&gt;</code> escrito. Na caixa de HTML a
              palavra fica em negrito. O comentário mudou a aparência da página.
              Parece inofensivo, mas mostra que quem escreve o comentário
              controla o HTML.
            </li>
            <li>
              <strong>Comentário malicioso.</strong> A caixa de HTML criou uma
              imagem que não existe. Quando a imagem falhou, o navegador rodou o
              código do <code>onerror</code> e abriu um alerta. Na caixa de
              texto, o mesmo comentário aparece só como letras.
            </li>
          </ol>
          <aside className="note">
            O alerta é inofensivo e só serve para provar que o código rodou. Um
            atacante de verdade colocaria outro código no lugar do{' '}
            <code>alert</code>.
          </aside>
        </section>

        <section>
          <h2>Esse ataque se chama XSS</h2>
          <p>
            <strong>XSS</strong> (<em>cross-site scripting</em>) é quando o
            texto de alguém vira código dentro do site de outra pessoa. O tipo
            que você acabou de ver é o <strong>XSS baseado no DOM</strong>: o
            próprio JavaScript da página pega o texto e manda o navegador
            interpretá-lo como HTML.
          </p>
          <div className="flow">
            <span>atacante escreve um comentário</span>
            <span className="arrow" aria-hidden="true">
              →
            </span>
            <span>o site salva</span>
            <span className="arrow" aria-hidden="true">
              →
            </span>
            <span>outra pessoa abre a página</span>
            <span className="arrow" aria-hidden="true">
              →
            </span>
            <span>o código roda no navegador dela</span>
          </div>
          <p>
            O código roda como se fosse parte do site. Então ele pode fazer o
            que o site faz:
          </p>
          <ul className="steps">
            <li>ler o que aparece na tela, como mensagens e dados pessoais;</li>
            <li>trocar o conteúdo, por exemplo mostrar um login falso;</li>
            <li>
              agir em nome da vítima, como enviar mensagens ou mudar
              configurações, porque ela já está logada.
            </li>
          </ul>
        </section>

        <section>
          <h2>Palavras que aparecem muito</h2>
          <dl className="facts">
            <div>
              <dt>Injeção de conteúdo</dt>
              <dd>
                Colocar um texto num lugar em que ele deixa de ser texto e passa
                a ser parte da página.
              </dd>
            </div>
            <div>
              <dt>Sink</dt>
              <dd>
                Uma função do navegador que interpreta o texto recebido. Exemplos:{' '}
                <code>innerHTML</code>, <code>dangerouslySetInnerHTML</code> no
                React e <code>eval</code>.
              </dd>
            </div>
            <div>
              <dt>Atributo de evento</dt>
              <dd>
                Atributos como <code>onerror</code> e <code>onclick</code>. O
                valor deles é código JavaScript, que o navegador roda quando o
                evento acontece.
              </dd>
            </div>
          </dl>
        </section>

        <section>
          <h2>A regra mais importante</h2>
          <p>
            No React, use <code>{'{comentario}'}</code>. Ele mostra o texto e
            pronto. Use <code>dangerouslySetInnerHTML</code> só quando você
            realmente precisa de HTML, e nunca com texto vindo de usuário sem
            limpar antes. O nome começa com <em>dangerously</em> (perigosamente)
            de propósito.
          </p>
        </section>

        <section className="next">
          <h2>E se alguém esquecer essa regra?</h2>
          <p>
            Num projeto grande, basta um lugar esquecido para abrir a falha. A
            API <strong>Trusted Types</strong> faz o navegador barrar qualquer
            texto cru que chegue num sink. Só passa o que foi limpo por uma
            função aprovada. A partir do React 19.3, o React funciona junto com
            essa proteção.
          </p>
          <a className="text-link" href="/protegida.html">
            Ver os mesmos exemplos com Trusted Types
          </a>
        </section>
      </main>
    </>
  );
}
