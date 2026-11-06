import Link from "next/link";

export default function Home() {
  return (
    <main>
      <section className="hero">
        <div>
          <span className="eyebrow">Search fund & ETA advisory</span>
          <h1>Discover businesses worth building around.</h1>
          <p>
            Explore acquisition opportunities with structured information, clear
            visibility, and a more considered path from search to decision.
          </p>
          <div className="button-row">
            <Link className="button" href="/register">
              Explore as an investor
            </Link>
            <Link className="button button-secondary" href="/login">
              Sign in
            </Link>
          </div>
        </div>
        <aside className="hero-aside">
          <span className="eyebrow">A clearer starting point</span>
          <p>
            Find relevant opportunities, understand what is available, and
            evaluate each listing without guesswork or noise.
          </p>
        </aside>
      </section>
      <section>
        <div className="section-heading">
          <div>
            <span className="eyebrow">How it works</span>
            <h2>A focused research workspace</h2>
          </div>
        </div>
        <div className="business-grid">
          <article className="panel">
            <span className="eyebrow">01</span>
            <h3>Discover opportunities</h3>
            <p className="muted">
              Search approved listings by industry, location, and available
              financial information.
            </p>
          </article>
          <article className="panel">
            <span className="eyebrow">02</span>
            <h3>Review the facts</h3>
            <p className="muted">
              Compare the information that has been made available for each
              potential acquisition.
            </p>
          </article>
          <article className="panel">
            <span className="eyebrow">03</span>
            <h3>Move with clarity</h3>
            <p className="muted">
              Use a structured platform built for thoughtful acquisition
              research.
            </p>
          </article>
        </div>
      </section>
    </main>
  );
}
