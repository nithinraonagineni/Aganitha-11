import React, { useState, useMemo } from "react";
import CopyBtn from "./CopyBtn";
import { Link as RouterLink } from "react-router-dom";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:4000";

export default function LinksTable({ links, onDelete }) {
  const [q, setQ] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [dir, setDir] = useState("desc");

  const filtered = useMemo(() => {
    const s = q.toLowerCase().trim();
    let out = links.filter(
      (l) =>
        !s ||
        l.code.toLowerCase().includes(s) ||
        l.targetUrl.toLowerCase().includes(s)
    );
    out.sort((a, b) => {
      let va = a[sortBy],
        vb = b[sortBy];
      if (va == null) va = "";
      if (vb == null) vb = "";
      if (va < vb) return dir === "asc" ? -1 : 1;
      if (va > vb) return dir === "asc" ? 1 : -1;
      return 0;
    });
    return out;
  }, [links, q, sortBy, dir]);

  const niceDate = (d) => (d ? new Date(d).toLocaleString() : "—");

  return (
    <div>
      <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
        <input
          placeholder="Search code or URL"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <label>
          Sort:
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="createdAt">Created</option>
            <option value="clicks">Clicks</option>
            <option value="lastClicked">Last clicked</option>
            <option value="code">Code</option>
          </select>
        </label>
        <label>
          <select value={dir} onChange={(e) => setDir(e.target.value)}>
            <option value="desc">Desc</option>
            <option value="asc">Asc</option>
          </select>
        </label>
      </div>

      <table className="table">
        <thead>
          <tr>
            <th>Short</th>
            <th>Target</th>
            <th>Clicks</th>
            <th>Last clicked</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((l) => (
            <tr key={l.code}>
              <td>
                <a
                  href={`${API_BASE}/${l.code}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  {l.code}
                </a>
                <CopyBtn text={`${API_BASE}/${l.code}`} />
                <RouterLink to={`/code/${l.code}`} style={{ marginLeft: 8 }}>
                  Stats
                </RouterLink>
              </td>
              <td>
                <a href={l.targetUrl} target="_blank" rel="noreferrer">
                  {l.targetUrl}
                </a>
              </td>
              <td>{l.clicks}</td>
              <td>{niceDate(l.lastClicked)}</td>
              <td>
                <button onClick={() => onDelete(l.code)} className="danger">
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
