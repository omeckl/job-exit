"use client";

import { useActionState } from "react";
import { requestLoginLinkAction } from "@/app/actions/auth";
import type { Dictionary } from "@/i18n";

type State = { sent: boolean; error?: string } | null;

export default function LoginForm({
  locale,
  t,
  redirectTo,
}: {
  locale: string;
  t: Dictionary;
  redirectTo: string;
}) {
  const [state, formAction, pending] = useActionState<State, FormData>(requestLoginLinkAction, null);

  if (state?.sent) return <p className="card text-sm">{t.auth.sent}</p>;

  return (
    <form action={formAction} className="card space-y-3">
      <input type="hidden" name="locale" value={locale} />
      <input type="hidden" name="redirectTo" value={redirectTo} />
      <label className="label" htmlFor="email">
        {t.auth.email}
      </label>
      <input id="email" name="email" type="email" required className="input" />
      {state?.error && (
        <p className="text-sm text-red-600">
          {state.error === "banned" ? t.auth.banned : t.common.error}
        </p>
      )}
      <button type="submit" className="btn-primary" disabled={pending}>
        {t.auth.send}
      </button>
    </form>
  );
}
