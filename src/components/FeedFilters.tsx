"use client";

import { useState } from "react";
import type { Dictionary } from "@/i18n";
import {
  COMPANY_SIZES,
  COUNTRIES,
  DOMAINS,
  EMPLOYMENT_TYPES,
  FIELDS,
  LANGUAGES,
  SCHEDULES,
  SENIORITIES,
  TECH_TAGS,
  WORK_MODES,
} from "@/lib/taxonomy";

type Params = Record<string, string | string[] | undefined>;

function value(params: Params, key: string) {
  const raw = params[key];
  return (Array.isArray(raw) ? raw[0] : raw) ?? "";
}

export default function FeedFilters({
  locale,
  t,
  params,
}: {
  locale: string;
  t: Dictionary;
  params: Params;
}) {
  const [showMore, setShowMore] = useState(false);
  const allTags = Object.values(TECH_TAGS).flat();
  const selectedTags = (Array.isArray(params.tags) ? params.tags : params.tags ? [params.tags] : []) as string[];

  return (
    <form action={`/${locale}/positions`} method="get" className="card space-y-4">
      <input
        name="q"
        defaultValue={value(params, "q")}
        placeholder={t.feed.searchPlaceholder}
        className="input text-base"
      />

      <div className="grid gap-3 sm:grid-cols-3">
        <select name="country" defaultValue={value(params, "country")} className="input">
          <option value="">{t.form.country}</option>
          {COUNTRIES.map((item) => (
            <option key={item} value={item}>
              {t.enums[item as keyof typeof t.enums]}
            </option>
          ))}
        </select>

        <input name="city" defaultValue={value(params, "city")} placeholder={t.form.city} className="input" />

        <select name="mode" defaultValue={value(params, "mode")} className="input">
          <option value="">{t.form.workMode}</option>
          {WORK_MODES.map((item) => (
            <option key={item} value={item}>
              {t.enums[item as keyof typeof t.enums]}
            </option>
          ))}
        </select>

        <select name="field" defaultValue={value(params, "field")} className="input">
          <option value="">{t.form.field}</option>
          {FIELDS.map((item) => (
            <option key={item} value={item}>
              {t.fields[item]}
            </option>
          ))}
        </select>

        <select name="domain" defaultValue={value(params, "domain")} className="input">
          <option value="">{t.form.domain}</option>
          {DOMAINS.map((item) => (
            <option key={item} value={item}>
              {t.domains[item]}
            </option>
          ))}
        </select>

        <select name="vacancy" defaultValue={value(params, "vacancy")} className="input">
          <option value="">{t.feed.vacancyIn}</option>
          <option value="7">{t.feed.days7}</option>
          <option value="30">{t.feed.days30}</option>
          <option value="90">{t.feed.days90}</option>
        </select>
      </div>

      {showMore && (
        <div className="grid gap-3 sm:grid-cols-3">
          <select name="workLanguage" defaultValue={value(params, "workLanguage")} className="input">
            <option value="">{t.form.workLanguages}</option>
            {LANGUAGES.map((item) => (
              <option key={item} value={item}>
                {t.enums[item as keyof typeof t.enums]}
              </option>
            ))}
          </select>

          <select name="listingLanguage" defaultValue={value(params, "listingLanguage")} className="input">
            <option value="">{t.form.listingLanguage}</option>
            {LANGUAGES.map((item) => (
              <option key={item} value={item}>
                {t.enums[item as keyof typeof t.enums]}
              </option>
            ))}
          </select>

          <select name="seniority" defaultValue={value(params, "seniority")} className="input">
            <option value="">{t.form.seniority}</option>
            {SENIORITIES.map((item) => (
              <option key={item} value={item}>
                {t.enums[item as keyof typeof t.enums]}
              </option>
            ))}
          </select>

          <select name="employmentType" defaultValue={value(params, "employmentType")} className="input">
            <option value="">{t.form.employmentType}</option>
            {EMPLOYMENT_TYPES.map((item) => (
              <option key={item} value={item}>
                {t.enums[item as keyof typeof t.enums] ?? item}
              </option>
            ))}
          </select>

          <select name="schedule" defaultValue={value(params, "schedule")} className="input">
            <option value="">{t.form.schedule}</option>
            {SCHEDULES.map((item) => (
              <option key={item} value={item}>
                {t.enums[item as keyof typeof t.enums]}
              </option>
            ))}
          </select>

          <select name="companySize" defaultValue={value(params, "companySize")} className="input">
            <option value="">{t.form.companySize}</option>
            {COMPANY_SIZES.map((item) => (
              <option key={item} value={item}>
                {t.enums[item as keyof typeof t.enums]}
              </option>
            ))}
          </select>

          <input
            name="company"
            defaultValue={value(params, "company")}
            placeholder={t.form.companyName}
            className="input"
          />

          <select name="posted" defaultValue={value(params, "posted")} className="input">
            <option value="">{t.feed.moreFilters}</option>
            <option value="1">24h</option>
            <option value="7">7</option>
            <option value="30">30</option>
          </select>

          <input name="s" defaultValue={value(params, "s")} placeholder={t.feed.search} className="input" />

          <select name="tags" multiple defaultValue={selectedTags} className="input h-28 sm:col-span-3">
            {allTags.map((tag) => (
              <option key={tag} value={tag}>
                {tag}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="flex flex-wrap items-center gap-3">
        <button type="submit" className="btn-primary">
          {t.feed.search}
        </button>
        <button type="button" className="btn-secondary" onClick={() => setShowMore((prev) => !prev)}>
          {t.feed.moreFilters}
        </button>
        <a href={`/${locale}/positions`} className="text-sm text-neutral-600">
          {t.feed.clear}
        </a>
      </div>
    </form>
  );
}
