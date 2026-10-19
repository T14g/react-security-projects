export function SiteHeader({ current }) {
  return (
    <header className="site-header">
      <a className="brand" href="/">
        React e Trusted Types
      </a>
      <nav>
        <a href="/" aria-current={current === 'sem' ? 'page' : undefined}>
          Sem a API
        </a>
        <a
          href="/protegida.html"
          aria-current={current === 'com' ? 'page' : undefined}
        >
          Com a API
        </a>
      </nav>
    </header>
  );
}
