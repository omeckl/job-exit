import { getPages } from "@/content/pages";

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const page = getPages(locale).cookies;

  return (
    <article className="prose max-w-3xl space-y-4">
      <h1 className="text-2xl font-semibold">{page.title}</h1>
      {page.body.map((paragraph) => (
        <p key={paragraph} className="text-sm leading-6 text-neutral-700">
          {paragraph}
        </p>
      ))}
    </article>
  );
}
