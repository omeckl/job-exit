import type { Prisma } from "@prisma/client";

export type SearchParams = Record<string, string | string[] | undefined>;

function single(params: SearchParams, key: string) {
  const value = params[key];
  return (Array.isArray(value) ? value[0] : value)?.trim() || undefined;
}

export function buildWhere(params: SearchParams): Prisma.ListingWhereInput {
  const where: Prisma.ListingWhereInput = {
    status: "ACTIVE",
    hiddenByAdmin: false,
    owner: { emailVerifiedAt: { not: null }, isBanned: false },
  };
  const and: Prisma.ListingWhereInput[] = [];

  const title = single(params, "q");
  if (title) and.push({ title: { contains: title, mode: "insensitive" } });

  const text = single(params, "s");
  if (text) {
    and.push({
      OR: [
        { tasks: { has: text } },
        { techTags: { has: text } },
        { companyName: { contains: text, mode: "insensitive" } },
        { companyDescription: { contains: text, mode: "insensitive" } },
        { goodParts: { contains: text, mode: "insensitive" } },
        { hardParts: { contains: text, mode: "insensitive" } },
      ],
    });
  }

  const simple: Array<[string, keyof Prisma.ListingWhereInput]> = [
    ["country", "country"],
    ["field", "field"],
    ["domain", "domain"],
    ["mode", "workMode"],
    ["seniority", "seniority"],
    ["employmentType", "employmentType"],
    ["schedule", "schedule"],
    ["industry", "industry"],
    ["companySize", "companySize"],
    ["listingLanguage", "listingLanguage"],
  ];
  for (const [param, column] of simple) {
    const value = single(params, param);
    if (value) and.push({ [column]: value } as Prisma.ListingWhereInput);
  }

  const city = single(params, "city");
  if (city) and.push({ city: { equals: city, mode: "insensitive" } });

  const company = single(params, "company");
  if (company) and.push({ companyName: { contains: company, mode: "insensitive" } });

  const workLanguage = single(params, "workLanguage");
  if (workLanguage) and.push({ workLanguages: { has: workLanguage } });

  const tags = params.tags;
  const tagList = (Array.isArray(tags) ? tags : tags ? [tags] : []).filter(Boolean);
  if (tagList.length > 0) and.push({ techTags: { hasSome: tagList } });

  if (single(params, "hasReports") === "1") and.push({ hasReports: true });

  const vacancy = Number(single(params, "vacancy"));
  if ([7, 30, 90].includes(vacancy)) {
    and.push({ lastWorkingDay: { lte: new Date(Date.now() + vacancy * 24 * 60 * 60 * 1000) } });
  }

  const posted = Number(single(params, "posted"));
  if ([1, 7, 30].includes(posted)) {
    and.push({ createdAt: { gte: new Date(Date.now() - posted * 24 * 60 * 60 * 1000) } });
  }

  if (and.length > 0) where.AND = and;
  return where;
}
