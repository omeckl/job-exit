import { saveSearchAction } from "@/app/actions/applications";

export default function SaveSearchButton({
  locale,
  label,
  query,
}: {
  locale: string;
  label: string;
  query: string;
}) {
  return (
    <form action={saveSearchAction}>
      <input type="hidden" name="locale" value={locale} />
      <input type="hidden" name="query" value={query} />
      <button type="submit" className="text-sm text-[color:var(--color-brand)] underline">
        {label}
      </button>
    </form>
  );
}
