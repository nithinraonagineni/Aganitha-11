import React, { useEffect, useState } from "react";
import { listLinks, createLink, deleteLink } from "../api";
import LinkForm from "../components/LinkForm";
import LinksTable from "../components/LinksTable";

export default function Dashboard() {
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await listLinks();
      setLinks(data);
    } catch (err) {
      setError(err.message || "Failed to load");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleAdd = (newL) => setLinks((prev) => [newL, ...prev]);
  const handleDelete = async (code) => {
    if (!confirm(`Delete ${code}?`)) return;
    try {
      await deleteLink(code);
      setLinks((prev) => prev.filter((p) => p.code !== code));
    } catch (err) {
      alert("Delete failed: " + (err.message || ""));
    }
  };

  return (
    <div>
      <section className="card">
        <h2>Create short link</h2>
        <LinkForm onSuccess={handleAdd} />
      </section>

      <section className="card">
        <h2>Links</h2>
        {loading && <p>Loading...</p>}
        {error && <p className="error">{error}</p>}
        {!loading && !error && (
          <LinksTable links={links} onDelete={handleDelete} />
        )}
        {!loading && !error && links.length === 0 && <p>No links yet.</p>}
      </section>
    </div>
  );
}
