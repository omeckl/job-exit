"use client";

import { useState } from "react";

export default function ShareBox({
  url,
  title,
  shareLabel,
  copyLabel,
  copiedLabel,
  locale,
}: {
  url: string;
  title: string;
  shareLabel: string;
  copyLabel: string;
  copiedLabel: string;
  locale: string;
}) {
  const [copied, setCopied] = useState(false);

  const postText =
    locale === "en"
      ? `I'm leaving my position (${title}) and handing it over. If it sounds like you, all the details are here: ${url}`
      : `Elhagyom a pozíciómat (${title}), és átadom. Ha érdekel, itt vannak a részletek: ${url}`;

  async function copy() {
    await navigator.clipboard.writeText(postText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="flex flex-wrap gap-3">
      <a
        className="btn-secondary"
        href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`}
        target="_blank"
        rel="noreferrer"
      >
        {shareLabel} · LinkedIn
      </a>
      <button type="button" className="btn-secondary" onClick={copy}>
        {copied ? copiedLabel : copyLabel}
      </button>
    </div>
  );
}
