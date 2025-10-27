import React, { useState, useEffect, useMemo } from "react";
import "./index.css";

// ---------- COMPONENTS ----------

function Header() {
  return (
    <header className="container header">
      <h1>DevLog Journal 🧠</h1>
      <p className="subtitle">
        Capture your daily coding journey — one entry at a time.
      </p>
    </header>
  );
}

function Nav() {
  return (
    <nav className="nav">
      <div className="container nav-inner">
        <a href="#home">Home</a>
        <a href="#add">New Entry</a>
        <a href="#entries">My Logs</a>
      </div>
    </nav>
  );
}

function HomeSection() {
  return (
    <section id="home" className="container section">
      <h2>Welcome to DevLog Journal</h2>
      <p className="lead">
        Every great developer keeps track of their growth. DevLog helps you
        record what you’ve learned, the bugs you solved, and the goals you’ve
        achieved — all in one simple, elegant app.
      </p>

      <div className="features-grid">
        <div className="feature-card">
          <h3>🧩 Built with React</h3>
          <p>
            A modern, component-based architecture using React and Vite for fast
            performance and scalability.
          </p>
        </div>
        <div className="feature-card">
          <h3>⚡ Dynamic & Interactive</h3>
          <p>
            Add, search, and manage your daily logs instantly — no refresh
            needed, thanks to React state and hooks.
          </p>
        </div>
        <div className="feature-card">
          <h3>💾 Persistent Data</h3>
          <p>
            Your entries are safely stored in your browser using
            <strong> localStorage</strong>.
          </p>
        </div>
        <div className="feature-card">
          <h3>📱 Responsive Design</h3>
          <p>
            Clean and mobile-friendly layout built with Flexbox and CSS Grid for
            an optimal experience on any device.
          </p>
        </div>
      </div>
    </section>
  );
}

function AddEntrySection({ onAdd }) {
  const [text, setText] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    const clean = text.trim();
    if (!clean) return;
    onAdd({
      id: crypto.randomUUID(),
      text: clean,
      createdAt: Date.now(),
    });
    setText("");
  }

  return (
    <section id="add" className="container section">
      <h2>New Entry</h2>
      <form onSubmit={handleSubmit} className="form card">
        <input
          type="text"
          placeholder="What did you learn or accomplish today?"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button type="submit">Add Log</button>
      </form>
      <p className="hint">✨ Entries save automatically and stay even if you close the tab.</p>
    </section>
  );
}

function EntriesSection({ entries, onDelete, onClear }) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return entries;
    return entries.filter((e) => e.text.toLowerCase().includes(q));
  }, [entries, query]);

  return (
    <section id="entries" className="container section">
      <div className="row">
        <h2>My Logs</h2>
        <div className="spacer" />
        <input
          className="search"
          placeholder="Search logs..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button className="secondary" onClick={onClear} disabled={!entries.length}>
          Clear All
        </button>
      </div>

      {filtered.length === 0 ? (
        <p className="muted">No logs yet — time to start coding!</p>
      ) : (
        <ul className="grid">
          {filtered.map((e) => (
            <li key={e.id} className="card entry">
              <p>{e.text}</p>
              <div className="row small">
                <time dateTime={new Date(e.createdAt).toISOString()}>
                  {new Date(e.createdAt).toLocaleDateString()}
                </time>
                <div className="spacer" />
                <button className="danger" onClick={() => onDelete(e.id)}>
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <div className="container row">
        <small>
          © {new Date().getFullYear()} DevLog Journal | Built by {""}
          <a href="https://github.com/KIC8462852B" target="_blank" rel="noreferrer">
            Ruben
          </a>
        </small>
        <div className="spacer" />
        <small>
          <a href="#home">Back to top ↑</a>
        </small>
      </div>
    </footer>
  );
}

// ---------- MAIN APP ----------

export default function App() {
  const [entries, setEntries] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("devlog:entries")) || [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("devlog:entries", JSON.stringify(entries));
  }, [entries]);

  const addEntry = (entry) => setEntries((prev) => [entry, ...prev]);
  const deleteEntry = (id) => setEntries((prev) => prev.filter((e) => e.id !== id));
  const clearEntries = () => {
    if (confirm("Clear all your logs? This cannot be undone.")) setEntries([]);
  };

  return (
    <>
      <Header />
      <Nav />
      <main>
        <HomeSection />
        <AddEntrySection onAdd={addEntry} />
        <EntriesSection entries={entries} onDelete={deleteEntry} onClear={clearEntries} />
      </main>
      <Footer />
    </>
  );
}
