"use client";

import { useState } from "react";
import { sendHandoverAction } from "@/app/actions/applications";

export default function HandoverForm({
  locale,
  applicationId,
  openLabel,
  title,
  help,
  sendLabel,
  cancelLabel,
}: {
  locale: string;
  applicationId: string;
  openLabel: string;
  title: string;
  help: string;
  sendLabel: string;
  cancelLabel: string;
}) {
  const [open, setOpen] = useState(false);

  if (!open) {
    return (
      <button type="button" className="btn-primary" onClick={() => setOpen(true)}>
        {openLabel}
      </button>
    );
  }

  return (
    <form action={sendHandoverAction} className="space-y-2">
      <input type="hidden" name="locale" value={locale} />
      <input type="hidden" name="applicationId" value={applicationId} />
      <label className="label" htmlFor={`message-${applicationId}`}>
        {title}
      </label>
      <textarea id={`message-${applicationId}`} name="message" rows={6} required minLength={10} className="input" />
      <p className="text-xs text-neutral-500">{help}</p>
      <div className="flex gap-2">
        <button type="submit" className="btn-primary">
          {sendLabel}
        </button>
        <button type="button" className="btn-secondary" onClick={() => setOpen(false)}>
          {cancelLabel}
        </button>
      </div>
    </form>
  );
}
