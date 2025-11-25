// project/src/components/ClientRedirect.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:4000";
const CODE_RE = /^[A-Za-z0-9]{6,8}$/;

export default function ClientRedirect() {
  const { code } = useParams();
  const nav = useNavigate();
  const [status, setStatus] = useState("checking"); // 'checking' | 'redirect' | 'notfound' | 'invalid'

  useEffect(() => {
    if (!code) {
      setStatus("invalid");
      return;
    }
    // protect known app routes (so /healthz etc don't get swallowed)
    const lower = code.toLowerCase();
    if (["healthz", "api", "favicon.ico"].includes(lower)) {
      setStatus("invalid");
      return;
    }
    if (!CODE_RE.test(code)) {
      setStatus("invalid");
      return;
    }

    // Redirect the browser to the backend redirect endpoint (302 handled by backend)
    const target = `${API_BASE}/${code}`;
    // set a tiny delay so the UI shows something
    setStatus("redirect");
    // perform full navigation
    window.location.href = target;
  }, [code, nav]);

  if (status === "checking") return <p>Checking short link…</p>;
  if (status === "redirect") return <p>Redirecting you now…</p>;
  if (status === "notfound") return <p>Not found (404)</p>;
  return (
    <div>
      <p>Invalid short link.</p>
      <p>
        <a
          onClick={() => nav("/")}
          style={{ cursor: "pointer", color: "#0b5fff" }}
        >
          Go home
        </a>
      </p>
    </div>
  );
}
