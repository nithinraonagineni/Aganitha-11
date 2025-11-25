import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getLink } from "../api";

export default function Stats() {
  const { code } = useParams();
  const [link, setLink] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    getLink(code)
      .then((d) => setLink(d))
      .catch((err) => setError(err))
      .finally(() => setLoading(false));
  }, [code]);

  if (loading) return <p>Loading...</p>;
  if (error) {
    if (error.status === 404) return <p>Not found (404)</p>;
    return <p>Error: {error.message}</p>;
  }

  return (
    <div>
      <h2>Stats for {link.code}</h2>
      <div className="card">
        <p>
          <strong>Short</strong>:{" "}
          <a href={`/${link.code}`} target="_blank" rel="noreferrer">
            {window.location.origin}/{link.code}
          </a>
        </p>
        <p>
          <strong>Target</strong>:{" "}
          <a href={link.targetUrl} target="_blank" rel="noreferrer">
            {link.targetUrl}
          </a>
        </p>
        <p>
          <strong>Clicks</strong>: {link.clicks}
        </p>
        <p>
          <strong>Last clicked</strong>:{" "}
          {link.lastClicked
            ? new Date(link.lastClicked).toLocaleString()
            : "Never"}
        </p>
        <p>
          <strong>Created at</strong>:{" "}
          {new Date(link.createdAt).toLocaleString()}
        </p>
      </div>
    </div>
  );
}
