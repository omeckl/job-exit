import { getDictionary } from "@/i18n";
import { prisma } from "@/lib/prisma";
import { currentUser } from "@/lib/auth";
import {
  addCityAction,
  addTagAction,
  deleteCityAction,
  deleteTagAction,
  toggleListingHiddenAction,
  toggleUserBannedAction,
} from "@/app/actions/admin";

export default async function AdminPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = getDictionary(locale);
  const user = await currentUser();

  if (!user?.isAdmin) {
    return <p className="card text-sm">{t.admin.noAccess}</p>;
  }

  const [listings, users, tags, cities] = await Promise.all([
    prisma.listing.findMany({ orderBy: { createdAt: "desc" }, take: 100, include: { owner: true } }),
    prisma.user.findMany({ orderBy: { createdAt: "desc" }, take: 100 }),
    prisma.techTag.findMany({ orderBy: [{ category: "asc" }, { name: "asc" }] }),
    prisma.city.findMany({ orderBy: { name: "asc" } }),
  ]);

  return (
    <div className="space-y-10">
      <h1 className="text-2xl font-semibold">{t.admin.title}</h1>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">{t.admin.listings}</h2>
        <div className="space-y-2">
          {listings.map((listing) => (
            <div key={listing.id} className="card flex flex-wrap items-center justify-between gap-2 text-sm">
              <span>
                {listing.title} · {listing.owner.email} · {listing.status}
                {listing.hiddenByAdmin ? " · hidden" : ""}
              </span>
              <form action={toggleListingHiddenAction}>
                <input type="hidden" name="locale" value={locale} />
                <input type="hidden" name="id" value={listing.id} />
                <button type="submit" className="btn-secondary">
                  {listing.hiddenByAdmin ? t.admin.unhide : t.admin.hide}
                </button>
              </form>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">{t.admin.users}</h2>
        <div className="space-y-2">
          {users.map((item) => (
            <div key={item.id} className="card flex flex-wrap items-center justify-between gap-2 text-sm">
              <span>
                {item.email}
                {item.isBanned ? " · banned" : ""}
                {item.isAdmin ? " · admin" : ""}
              </span>
              <form action={toggleUserBannedAction}>
                <input type="hidden" name="locale" value={locale} />
                <input type="hidden" name="id" value={item.id} />
                <button type="submit" className="btn-secondary">
                  {item.isBanned ? t.admin.unban : t.admin.ban}
                </button>
              </form>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">{t.admin.tags}</h2>
        <form action={addTagAction} className="flex flex-wrap gap-2">
          <input type="hidden" name="locale" value={locale} />
          <input name="name" placeholder={t.admin.name} required className="input max-w-xs" />
          <input name="category" placeholder={t.admin.category} className="input max-w-xs" />
          <button type="submit" className="btn-primary">
            {t.admin.addTag}
          </button>
        </form>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <form key={tag.id} action={deleteTagAction} className="chip gap-2">
              <input type="hidden" name="locale" value={locale} />
              <input type="hidden" name="id" value={tag.id} />
              <span>{tag.name}</span>
              <button type="submit" className="text-red-600">
                ×
              </button>
            </form>
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">{t.admin.cities}</h2>
        <form action={addCityAction} className="flex flex-wrap gap-2">
          <input type="hidden" name="locale" value={locale} />
          <input name="name" placeholder={t.admin.name} required className="input max-w-xs" />
          <input name="country" placeholder={t.admin.country} defaultValue="HU" className="input max-w-[8rem]" />
          <button type="submit" className="btn-primary">
            {t.admin.addCity}
          </button>
        </form>
        <div className="flex flex-wrap gap-2">
          {cities.map((city) => (
            <form key={city.id} action={deleteCityAction} className="chip gap-2">
              <input type="hidden" name="locale" value={locale} />
              <input type="hidden" name="id" value={city.id} />
              <span>
                {city.name} ({city.country})
              </span>
              <button type="submit" className="text-red-600">
                ×
              </button>
            </form>
          ))}
        </div>
      </section>
    </div>
  );
}
