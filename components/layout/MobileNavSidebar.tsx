"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Wifi, User, LayoutDashboard, X } from "lucide-react";
import clsx from "clsx";

const navItems = [
  { icon: Home, label: "Home", href: "/" },
  { icon: Wifi, label: "Buy Data", href: "/buy" },
  { icon: User, label: "Profile", href: "/profile" },
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
];

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function MobileNavSidebar({ open, onClose }: Props) {
  const pathname = usePathname();

  return (
    <>
      {/* Backdrop */}
      <div
        role="button"
        tabIndex={0}
        aria-label="Close menu"
        onClick={onClose}
        onKeyDown={(e) => e.key === "Escape" && onClose()}
        className={clsx(
          "fixed inset-0 bg-black/40 z-40 transition-opacity duration-300 md:hidden",
          open ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
      />
      {/* Sidebar */}
      <aside
        className={clsx(
          "fixed top-0 left-0 z-50 h-full w-[min(280px,85vw)] bg-white shadow-xl",
          "flex flex-col overflow-y-auto",
          "transition-transform duration-300 ease-out md:hidden",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex items-center justify-between p-4 border-b border-zinc-100">
          <span className="text-sm font-semibold text-zinc-500">Menu</span>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-zinc-100 text-zinc-600 transition-colors"
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        </div>
        <nav className="flex flex-col p-3 gap-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={clsx(
                  "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all",
                  isActive
                    ? "bg-[#0e0947] text-white"
                    : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
                )}
              >
                <item.icon size={20} strokeWidth={2} />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
