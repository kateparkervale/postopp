"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { COLORS } from "@/lib/constants";

const NAV_ITEMS = [
  { href: "/", label: "Home", icon: "🏠" },
  { href: "/history", label: "History", icon: "📋" },
  { href: "/settings", label: "Settings", icon: "⚙️" },
];

export default function NavBar() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 h-16 flex items-center justify-around border-t border-gray-700"
      style={{ backgroundColor: COLORS.bg.primary }}
      role="navigation"
      aria-label="Main navigation"
    >
      {NAV_ITEMS.map((item) => {
        const isActive =
          item.href === "/"
            ? pathname === "/"
            : pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            className="flex flex-col items-center justify-center w-20 h-14 rounded-lg focus:outline-none focus:ring-2 focus:ring-white"
            style={{
              color: isActive ? COLORS.nav.active : COLORS.nav.inactive,
            }}
            aria-current={isActive ? "page" : undefined}
          >
            <span className="text-2xl" aria-hidden="true">
              {item.icon}
            </span>
            <span className="text-xs font-medium mt-0.5">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
