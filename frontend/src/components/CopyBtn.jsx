import React, { useState } from "react";

export default function CopyBtn({ text }) {
  const [ok, setOk] = useState(false);
  const onClick = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setOk(true);
      setTimeout(() => setOk(false), 1500);
    } catch (e) {
      alert("Copy failed");
    }
  };
  return (
    <button onClick={onClick} title="Copy" className="copy">
      {ok ? "Copied" : "Copy"}
    </button>
  );
}
