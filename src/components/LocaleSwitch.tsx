"use client";

import { usePathname, useRouter } from "next/navigation";
import { LOCALES } from "@/lib/taxonomy";

export default function LocaleSwitch({ locale }: { locale: string }) {
  const pathname = usePathname();
  const router = useRouter();

  function switchTo(next: string) {
    const rest = pathname.split("/").slice(2).join("/");
    router.push(`/${next}${rest ? `/${rest}` : ""}`);
  }

  return (
    <div className="flex items-center gap-1 text-xs uppercase">
      {LOCALES.map((item) => (
        <button
          key={item}
          type="button"
          onClick={() => switchTo(item)}
          className={item === locale ? "font-semibold text-neutral-900" : "text-neutral-500"}
        >
          {item}
        </button>
      ))}
    </div>
  );
}
