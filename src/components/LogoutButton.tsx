"use client";

import { logoutAction } from "@/app/actions/auth";

export default function LogoutButton({ label, locale }: { label: string; locale: string }) {
  return (
    <button type="button" className="text-neutral-700" onClick={() => logoutAction(locale)}>
      {label}
    </button>
  );
}
