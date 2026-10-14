"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { navigation } from "@/lib/content";

export default function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  return (
    <ul className="ca-navlist">
      {navigation.map((item) => {
        const active = item.href === "/" ? pathname === "/" : pathname?.startsWith(item.href);
        return (
          <li key={item.href}>
            <Link href={item.href} aria-current={active ? "page" : undefined} onClick={onNavigate}>
              {item.label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
