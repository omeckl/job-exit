"use client";

import { useActionState, useState } from "react";
import { applyAction, type ApplyState } from "@/app/actions/applications";
import { format, type Dictionary } from "@/i18n";

export default function ApplyForm({
  locale,
  t,
  listingId,
  prompt,
  signedIn,
  alreadyApplied,
}: {
  locale: string;
  t: Dictionary;
  listingId: string;
  prompt: string | null;
  signedIn: boolean;
  alreadyApplied: boolean;
}) {
  const [state, formAction, pending] = useActionState<ApplyState, FormData>(applyAction, null);
  const [intro, setIntro] = useState("");

  if (alreadyApplied) {
    return <p className="card text-sm text-neutral-700">{t.apply.alreadyApplied}</p>;
  }

  if (state?.emailSent) {
    return (
      <div className="card">
        <h2 className="font-semibold">{t.apply.confirmTitle}</h2>
        <p className="mt-1 text-sm text-neutral-600">{t.apply.confirmText}</p>
      </div>
    );
  }

  if (state?.done) {
    return <p className="card text-sm text-neutral-700">{t.applications.statusSent}</p>;
  }

  const errorMessages: Record<string, string> = {
    already_applied: t.apply.alreadyApplied,
    limit: t.apply.limitReached,
    closed: t.apply.closed,
    own_listing: t.apply.ownListing,
    banned: t.auth.banned,
    invalid: t.common.error,
    invalid_email: t.common.error,
  };

  return (
    <form action={formAction} className="card space-y-4" id="apply">
      <h2 className="text-lg font-semibold">{t.apply.title}</h2>
      <input type="hidden" name="locale" value={locale} />
      <input type="hidden" name="listingId" value={listingId} />

      <div>
        <label className="label" htmlFor="linkedinUrl">
          {t.apply.linkedin}
        </label>
        <input id="linkedinUrl" name="linkedinUrl" required className="input" placeholder="https://linkedin.com/in/..." />
      </div>

      <div>
        <label className="label" htmlFor="intro">
          {t.apply.intro}
        </label>
        <p className="mb-1 text-sm text-neutral-500">{prompt ?? t.apply.introHelpDefault}</p>
        <textarea
          id="intro"
          name="intro"
          required
          minLength={200}
          maxLength={1500}
          rows={7}
          className="input"
          value={intro}
          onChange={(event) => setIntro(event.target.value)}
        />
        <p className="mt-1 text-xs text-neutral-500">{format(t.form.charCount, { n: intro.length, max: 1500 })}</p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className="label" htmlFor="salaryExpectation">
            {t.apply.salaryExpectation}
          </label>
          <input id="salaryExpectation" name="salaryExpectation" className="input" />
        </div>
        <div>
          <label className="label" htmlFor="noticePeriod">
            {t.apply.noticePeriod}
          </label>
          <input id="noticePeriod" name="noticePeriod" className="input" />
        </div>
      </div>

      {!signedIn && (
        <div>
          <label className="label" htmlFor="email">
            {t.apply.email}
          </label>
          <input id="email" name="email" type="email" required className="input" />
        </div>
      )}

      {state?.error && <p className="text-sm text-red-600">{errorMessages[state.error] ?? t.common.error}</p>}

      <button type="submit" className="btn-primary" disabled={pending}>
        {t.apply.submit}
      </button>
    </form>
  );
}
