import React from "react";
import { Outlet, Link } from "react-router-dom";

export default function App() {
  return (
    <div className="container">
      <header className="header">
        <Link to="/">
          <h1>TinyLink</h1>
        </Link>
        <nav>
          <a href="/healthz" target="_blank" rel="noreferrer">
            Health
          </a>
        </nav>
      </header>
      <main>
        <Outlet />
      </main>
      <footer className="footer">
        <small>Built for TinyLink assignment</small>
      </footer>
    </div>
  );
}
