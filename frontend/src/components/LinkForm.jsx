import React, { useState } from "react";
import { createLink } from "../api";

export default function LinkForm({ onSuccess }) {
  const [targetUrl, setTargetUrl] = useState("");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(null);
  const [success, setSuccess] = useState(null);

  const validate = () => {
    if (!targetUrl) return "Target URL required";
    try {
      const u = new URL(targetUrl);
      if (!["http:", "https:"].includes(u.protocol))
        return "URL must start with http:// or https://";
    } catch (e) {
      return "Invalid URL format";
    }
    if (code && !/^[A-Za-z0-9]{6,8}$/.test(code))
      return "Custom code must match [A-Za-z0-9]{6,8}";
    return null;
  };

  const submit = async (e) => {
    e.preventDefault();
    setErr(null);
    setSuccess(null);
    const v = validate();
    if (v) {
      setErr(v);
      return;
    }
    setLoading(true);
    try {
      const payload = { targetUrl, code: code || undefined };
      const created = await createLink(payload);
      setSuccess(`Created ${created.code}`);
      setTargetUrl("");
      setCode("");
      onSuccess && onSuccess(created);
    } catch (e) {
      if (e.status === 409) setErr("Code already exists");
      else setErr(e.message || "Create failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className="form">
      <input
        placeholder="https://example.com/very/long/url"
        value={targetUrl}
        onChange={(e) => setTargetUrl(e.target.value)}
      />
      <input
        placeholder="Custom code (optional: 6-8 alnum)"
        value={code}
        onChange={(e) => setCode(e.target.value)}
      />
      <div style={{ display: "flex", gap: 8 }}>
        <button type="submit" disabled={loading}>
          {loading ? "Creating..." : "Create"}
        </button>
        <button
          type="button"
          onClick={() => {
            setTargetUrl("");
            setCode("");
            setErr(null);
            setSuccess(null);
          }}
        >
          Reset
        </button>
      </div>
      {err && <div className="error">{err}</div>}
      {success && (
        <div className="success">
          {success} — <a href={`/${success.split(" ")[1]}`}>Open</a>
        </div>
      )}
    </form>
  );
}
