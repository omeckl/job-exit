import Link from "next/link";
import type { Listing, User } from "@prisma/client";
import { vacancyLabel, type Dictionary } from "@/i18n";
import { daysUntil } from "@/lib/listing";
import Avatar from "@/components/Avatar";

type Props = {
  listing: Listing & { owner: Pick<User, "fullName" | "photoUrl"> };
  locale: string;
  t: Dictionary;
};

export function firstNameOf(fullName: string | null) {
  if (!fullName) return "";
  const parts = fullName.trim().split(/\s+/);
  return parts.length > 1 ? parts[parts.length - 1] : parts[0];
}

export default function ListingCard({ listing, locale, t }: Props) {
  const place =
    listing.workMode === "REMOTE"
      ? t.listing.remote
      : [listing.city, listing.workMode === "HYBRID" ? t.listing.hybrid : t.listing.onsite]
          .filter(Boolean)
          .join(" · ");

  const displayName =
    listing.displayMode === "FULL_NAME" ? listing.owner.fullName : firstNameOf(listing.owner.fullName);

  return (
    <Link href={`/${locale}/h/${listing.slug}`} className="card block hover:border-neutral-400">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-base font-semibold">{listing.title}</h3>
          <p className="text-sm text-neutral-600">
            {listing.companyName ?? t.listing.anonymous} · {place}
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-neutral-600">
          <Avatar name={displayName} photoUrl={listing.owner.photoUrl} />
          <span className="hidden sm:inline">{displayName}</span>
        </div>
      </div>

      <p className="mt-2 text-sm text-neutral-600">
        {t.fields[listing.field as keyof typeof t.fields] ?? listing.field} ·{" "}
        {t.domains[listing.domain as keyof typeof t.domains] ?? listing.domain}
      </p>
      <p className="mt-1 text-sm font-medium text-[color:var(--color-brand)]">
        {vacancyLabel(t, daysUntil(listing.lastWorkingDay))}
      </p>

      {listing.techTags.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {listing.techTags.slice(0, 3).map((tag) => (
            <span key={tag} className="chip">
              {tag}
            </span>
          ))}
        </div>
      )}
    </Link>
  );
}
