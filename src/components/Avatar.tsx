export default function Avatar({
  name,
  photoUrl,
  size = 36,
}: {
  name: string | null;
  photoUrl: string | null;
  size?: number;
}) {
  const initials = (name ?? "?")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");

  if (photoUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={photoUrl}
        alt={name ?? ""}
        width={size}
        height={size}
        className="rounded-full object-cover"
        style={{ width: size, height: size }}
      />
    );
  }

  return (
    <span
      className="inline-flex items-center justify-center rounded-full bg-[color:var(--color-brand-soft)] text-xs font-semibold text-[color:var(--color-brand)]"
      style={{ width: size, height: size }}
    >
      {initials || "?"}
    </span>
  );
}
