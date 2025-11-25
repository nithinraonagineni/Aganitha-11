const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:4000";

export async function listLinks() {
  const r = await fetch(`${API_BASE}/api/links`);
  if (!r.ok) throw new Error("Failed to load links");
  return r.json();
}

export async function createLink(payload) {
  const r = await fetch(`${API_BASE}/api/links`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!r.ok) {
    const err = await r.json().catch(() => ({ error: "unknown" }));
    const status = r.status;
    const e = new Error(err.error || "Create failed");
    e.status = status;
    throw e;
  }
  return r.json();
}

export async function getLink(code) {
  const r = await fetch(`${API_BASE}/api/links/${code}`);
  if (!r.ok) {
    const err = await r.json().catch(() => ({ error: "unknown" }));
    const e = new Error(err.error || "Failed");
    e.status = r.status;
    throw e;
  }
  return r.json();
}

export async function deleteLink(code) {
  const r = await fetch(`${API_BASE}/api/links/${code}`, { method: "DELETE" });
  if (!r.ok) {
    const err = await r.json().catch(() => ({ error: "unknown" }));
    const e = new Error(err.error || "Delete failed");
    e.status = r.status;
    throw e;
  }
  return r.json();
}
