import MessageForm from "./submit-form";

export default function Home() {
  return (
    <main className="page-shell">
      <div className="content-wrap">
        <header className="brand">
          <span className="brand-mark" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none">
              <path
                d="M5 6.75A2.75 2.75 0 0 1 7.75 4h8.5A2.75 2.75 0 0 1 19 6.75v6.5A2.75 2.75 0 0 1 16.25 16H11l-4.5 3v-3.2A2.75 2.75 0 0 1 5 13.25v-6.5Z"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinejoin="round"
              />
              <path
                d="M9 9.5h6M9 12.5h3.5"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
              />
            </svg>
          </span>
          <span>Le petit mot</span>
        </header>

        <section className="form-section" aria-labelledby="page-title">
          <div className="intro">
            <h1 id="page-title">Une question, un petit mot&nbsp;?</h1>
            <p className="intro-copy">
              Écris-moi ce que tu veux, je te lirai avec plaisir.
            </p>
          </div>

          <MessageForm />
        </section>

        <footer className="page-footer">
          Merci de prendre le temps d’écrire.
        </footer>
      </div>
    </main>
  );
}
