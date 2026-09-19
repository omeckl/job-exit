"use client";

import { useActionState, useState } from "react";
import type { Listing } from "@prisma/client";
import {
  COMPANY_SIZES,
  COUNTRIES,
  DOMAINS,
  EMPLOYMENT_TYPES,
  FIELDS,
  LANGUAGES,
  SCHEDULES,
  SENIORITIES,
  WORK_MODES,
} from "@/lib/taxonomy";
import type { Dictionary } from "@/i18n";
import { createListingAction, updateListingAction, type ListingFormState } from "@/app/actions/listings";

type Props = {
  locale: string;
  t: Dictionary;
  tags: { name: string; category: string }[];
  cities: string[];
  listing?: Listing | null;
  defaultFullName?: string | null;
  defaultPhotoUrl?: string | null;
  signedIn: boolean;
};

export default function ListingForm({
  locale,
  t,
  tags,
  cities,
  listing,
  defaultFullName,
  defaultPhotoUrl,
  signedIn,
}: Props) {
  const action = listing ? updateListingAction : createListingAction;
  const [state, formAction, pending] = useActionState<ListingFormState, FormData>(action, null);
  const [workMode, setWorkMode] = useState<string>(listing?.workMode ?? "ONSITE");

  if (state?.emailSent) {
    return (
      <div className="card">
        <h2 className="font-semibold">{t.apply.confirmTitle}</h2>
        <p className="mt-1 text-sm text-neutral-600">{t.apply.confirmText}</p>
      </div>
    );
  }

  const errors: Record<string, string> = {
    already_active: t.dashboard.title,
    banned: t.auth.banned,
    invalid: t.common.error,
    invalid_email: t.common.error,
    unauthorized: t.admin.noAccess,
    rate_limited: t.common.error,
  };

  return (
    <form action={formAction} className="space-y-8">
      <input type="hidden" name="locale" value={locale} />
      {listing && <input type="hidden" name="id" value={listing.id} />}

      <section className="card space-y-4">
        <h2 className="text-lg font-semibold">{t.form.requiredSection}</h2>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="label" htmlFor="fullName">
              {t.form.fullName}
            </label>
            <input id="fullName" name="fullName" required defaultValue={defaultFullName ?? ""} className="input" />
            <p className="mt-1 text-xs text-neutral-500">{t.form.fullNameHelp}</p>
          </div>

          <div>
            <label className="label" htmlFor="displayMode">
              {t.form.displayMode}
            </label>
            <select id="displayMode" name="displayMode" defaultValue={listing?.displayMode ?? "FIRST_NAME"} className="input">
              <option value="FIRST_NAME">{t.form.displayFirstName}</option>
              <option value="FULL_NAME">{t.form.displayFullName}</option>
            </select>
          </div>

          <div className="sm:col-span-2">
            <label className="label" htmlFor="photoUrl">
              {t.form.photoUrl}
            </label>
            <input id="photoUrl" name="photoUrl" defaultValue={defaultPhotoUrl ?? ""} className="input" />
          </div>

          <div className="sm:col-span-2">
            <label className="label" htmlFor="title">
              {t.form.title}
            </label>
            <input id="title" name="title" required defaultValue={listing?.title ?? ""} className="input" />
          </div>

          <div>
            <label className="label" htmlFor="field">
              {t.form.field}
            </label>
            <select id="field" name="field" required defaultValue={listing?.field ?? ""} className="input">
              <option value="">—</option>
              {FIELDS.map((item) => (
                <option key={item} value={item}>
                  {t.fields[item]}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="label" htmlFor="domain">
              {t.form.domain}
            </label>
            <select id="domain" name="domain" required defaultValue={listing?.domain ?? ""} className="input">
              <option value="">—</option>
              {DOMAINS.map((item) => (
                <option key={item} value={item}>
                  {t.domains[item]}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="label" htmlFor="country">
              {t.form.country}
            </label>
            <select id="country" name="country" required defaultValue={listing?.country ?? "HU"} className="input">
              {COUNTRIES.map((item) => (
                <option key={item} value={item}>
                  {t.enums[item as keyof typeof t.enums]}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="label" htmlFor="workMode">
              {t.form.workMode}
            </label>
            <select
              id="workMode"
              name="workMode"
              value={workMode}
              onChange={(event) => setWorkMode(event.target.value)}
              className="input"
            >
              {WORK_MODES.map((item) => (
                <option key={item} value={item}>
                  {t.enums[item as keyof typeof t.enums]}
                </option>
              ))}
            </select>
          </div>

          {workMode !== "REMOTE" && (
            <div>
              <label className="label" htmlFor="city">
                {t.form.city}
              </label>
              <input
                id="city"
                name="city"
                required
                list="city-list"
                defaultValue={listing?.city ?? ""}
                className="input"
              />
              <datalist id="city-list">
                {cities.map((city) => (
                  <option key={city} value={city} />
                ))}
              </datalist>
            </div>
          )}

          <div>
            <label className="label" htmlFor="listingLanguage">
              {t.form.listingLanguage}
            </label>
            <select
              id="listingLanguage"
              name="listingLanguage"
              defaultValue={listing?.listingLanguage ?? locale}
              className="input"
            >
              {LANGUAGES.map((item) => (
                <option key={item} value={item}>
                  {t.enums[item as keyof typeof t.enums]}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="label" htmlFor="workLanguages">
              {t.form.workLanguages}
            </label>
            <select
              id="workLanguages"
              name="workLanguages"
              multiple
              required
              defaultValue={listing?.workLanguages ?? [locale]}
              className="input h-24"
            >
              {LANGUAGES.map((item) => (
                <option key={item} value={item}>
                  {t.enums[item as keyof typeof t.enums]}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="label" htmlFor="lastWorkingDay">
              {t.form.lastWorkingDay}
            </label>
            <input
              id="lastWorkingDay"
              name="lastWorkingDay"
              type="date"
              required
              defaultValue={listing?.lastWorkingDay.toISOString().slice(0, 10) ?? ""}
              className="input"
            />
          </div>
        </div>
      </section>

      <section className="card space-y-4">
        <h2 className="text-lg font-semibold">{t.form.optionalSection}</h2>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="label" htmlFor="seniority">
              {t.form.seniority}
            </label>
            <select id="seniority" name="seniority" defaultValue={listing?.seniority ?? ""} className="input">
              <option value="">—</option>
              {SENIORITIES.map((item) => (
                <option key={item} value={item}>
                  {t.enums[item as keyof typeof t.enums]}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="label" htmlFor="experienceNeeded">
              {t.form.experienceNeeded}
            </label>
            <input
              id="experienceNeeded"
              name="experienceNeeded"
              maxLength={200}
              defaultValue={listing?.experienceNeeded ?? ""}
              className="input"
            />
          </div>

          <div>
            <label className="label" htmlFor="employmentType">
              {t.form.employmentType}
            </label>
            <select id="employmentType" name="employmentType" defaultValue={listing?.employmentType ?? ""} className="input">
              <option value="">—</option>
              {EMPLOYMENT_TYPES.map((item) => (
                <option key={item} value={item}>
                  {t.enums[item as keyof typeof t.enums] ?? item}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="label" htmlFor="schedule">
              {t.form.schedule}
            </label>
            <select id="schedule" name="schedule" defaultValue={listing?.schedule ?? ""} className="input">
              <option value="">—</option>
              {SCHEDULES.map((item) => (
                <option key={item} value={item}>
                  {t.enums[item as keyof typeof t.enums]}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-end gap-3">
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" name="hasReports" defaultChecked={listing?.hasReports ?? false} />
              {t.form.hasReports}
            </label>
            <input
              name="reportCount"
              type="number"
              min={0}
              placeholder={t.form.reportCount}
              defaultValue={listing?.reportCount ?? ""}
              className="input"
            />
          </div>

          <div>
            <label className="label" htmlFor="travel">
              {t.form.travel}
            </label>
            <input id="travel" name="travel" defaultValue={listing?.travel ?? ""} className="input" />
          </div>

          {workMode === "HYBRID" && (
            <div>
              <label className="label" htmlFor="officeDays">
                {t.form.officeDays}
              </label>
              <input
                id="officeDays"
                name="officeDays"
                type="number"
                min={0}
                max={7}
                defaultValue={listing?.officeDays ?? ""}
                className="input"
              />
            </div>
          )}

          {workMode === "REMOTE" && (
            <div>
              <label className="label" htmlFor="remoteLimit">
                {t.form.remoteLimit}
              </label>
              <input id="remoteLimit" name="remoteLimit" defaultValue={listing?.remoteLimit ?? ""} className="input" />
            </div>
          )}

          <div>
            <label className="label" htmlFor="salary">
              {t.form.salary}
            </label>
            <input id="salary" name="salary" defaultValue={listing?.salary ?? ""} className="input" />
          </div>

          <div>
            <label className="label" htmlFor="benefits">
              {t.form.benefits}
            </label>
            <input id="benefits" name="benefits" defaultValue={listing?.benefits.join(", ") ?? ""} className="input" />
          </div>

          <div className="sm:col-span-2">
            <label className="label" htmlFor="tasks">
              {t.form.tasks}
            </label>
            <textarea id="tasks" name="tasks" rows={5} defaultValue={listing?.tasks.join("\n") ?? ""} className="input" />
          </div>

          <div className="sm:col-span-2">
            <label className="label" htmlFor="techTags">
              {t.form.techTags}
            </label>
            <select
              id="techTags"
              name="techTags"
              multiple
              defaultValue={listing?.techTags ?? []}
              className="input h-40"
            >
              {tags.map((tag) => (
                <option key={tag.name} value={tag.name}>
                  {tag.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="label" htmlFor="goodParts">
              {t.form.goodParts}
            </label>
            <textarea id="goodParts" name="goodParts" rows={3} defaultValue={listing?.goodParts ?? ""} className="input" />
          </div>

          <div>
            <label className="label" htmlFor="hardParts">
              {t.form.hardParts}
            </label>
            <textarea id="hardParts" name="hardParts" rows={3} defaultValue={listing?.hardParts ?? ""} className="input" />
          </div>

          <div>
            <label className="label" htmlFor="teamSize">
              {t.form.teamSize}
            </label>
            <input id="teamSize" name="teamSize" defaultValue={listing?.teamSize ?? ""} className="input" />
          </div>

          <div>
            <label className="label" htmlFor="reportsTo">
              {t.form.reportsTo}
            </label>
            <input id="reportsTo" name="reportsTo" defaultValue={listing?.reportsTo ?? ""} className="input" />
          </div>

          <div>
            <label className="label" htmlFor="companyName">
              {t.form.companyName}
            </label>
            <input id="companyName" name="companyName" defaultValue={listing?.companyName ?? ""} className="input" />
            <p className="mt-1 text-xs text-neutral-500">{t.form.companyNameHelp}</p>
          </div>

          <div>
            <label className="label" htmlFor="companyUrl">
              {t.form.companyUrl}
            </label>
            <input id="companyUrl" name="companyUrl" defaultValue={listing?.companyUrl ?? ""} className="input" />
          </div>

          <div className="sm:col-span-2">
            <label className="label" htmlFor="companyDescription">
              {t.form.companyDescription}
            </label>
            <textarea
              id="companyDescription"
              name="companyDescription"
              rows={3}
              maxLength={600}
              defaultValue={listing?.companyDescription ?? ""}
              className="input"
            />
          </div>

          <div>
            <label className="label" htmlFor="industry">
              {t.form.industry}
            </label>
            <input id="industry" name="industry" defaultValue={listing?.industry ?? ""} className="input" />
          </div>

          <div>
            <label className="label" htmlFor="companySize">
              {t.form.companySize}
            </label>
            <select id="companySize" name="companySize" defaultValue={listing?.companySize ?? ""} className="input">
              <option value="">—</option>
              {COMPANY_SIZES.map((item) => (
                <option key={item} value={item}>
                  {t.enums[item as keyof typeof t.enums]}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="label" htmlFor="applicantPrompt">
              {t.form.applicantPrompt}
            </label>
            <input
              id="applicantPrompt"
              name="applicantPrompt"
              maxLength={300}
              defaultValue={listing?.applicantPrompt ?? ""}
              className="input"
            />
          </div>

          <div>
            <label className="label" htmlFor="dealbreakers">
              {t.form.dealbreakers}
            </label>
            <input
              id="dealbreakers"
              name="dealbreakers"
              defaultValue={listing?.dealbreakers.join(", ") ?? ""}
              className="input"
            />
          </div>
        </div>
      </section>

      {!signedIn && (
        <section className="card space-y-2">
          <label className="label" htmlFor="email">
            {t.form.emailLabel}
          </label>
          <input id="email" name="email" type="email" required className="input" />
          <p className="text-xs text-neutral-500">{t.form.publishHint}</p>
        </section>
      )}

      {state?.error && <p className="text-sm text-red-600">{errors[state.error] ?? t.common.error}</p>}

      <button type="submit" className="btn-primary" disabled={pending}>
        {listing ? t.form.save : t.form.submit}
      </button>
    </form>
  );
}
