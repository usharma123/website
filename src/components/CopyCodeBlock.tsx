"use client";
import { useRef, useState } from "react";

export default function CopyCodeBlock({ children, ...props }: any) {
  const preRef = useRef<HTMLPreElement>(null);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (preRef.current) {
      const code = preRef.current.innerText;
      navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    }
  };

  return (
    <div style={{ position: "relative" }}>
      <button
        onClick={handleCopy}
        style={{
          position: "absolute",
          top: 8,
          right: 8,
          zIndex: 2,
          background: "#23272e",
          color: "#f4f4f4",
          border: "none",
          borderRadius: 4,
          padding: "0.2em 0.7em",
          fontSize: "1.1em",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
        }}
        aria-label="Copy code"
      >
        {copied ? (
          // Checkmark icon
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M5 10.5L9 14.5L15 7.5" stroke="#4ade80" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        ) : (
          // Clipboard icon
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="6" y="2" width="8" height="4" rx="1" stroke="#f4f4f4" strokeWidth="1.5" />
            <rect x="4" y="6" width="12" height="12" rx="2" stroke="#f4f4f4" strokeWidth="1.5" />
          </svg>
        )}
      </button>
      <pre ref={preRef} {...props}>{children}</pre>
    </div>
  );
}