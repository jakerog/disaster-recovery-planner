"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Activity, Shield, Settings, UserCheck, BarChart3 } from "lucide-react";
import { useSession } from "next-auth/react";

export default function MobileNav() {
  const pathname = usePathname();
  const { data: session } = useSession();

  if (!session) return null;
  const userRole = (session.user as any)?.role;

  const navItems = [
    { label: "Mission", href: "/", icon: Shield },
    { label: "Readiness", href: "/availability", icon: UserCheck },
  ];

  if (["Admin", "Moderator"].includes(userRole)) {
    navItems.push({ label: "Admin", href: "/admin/exercises", icon: Settings });
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-lg border-t border-slate-200 px-6 py-3 flex justify-around items-center md:hidden z-[100] safe-area-bottom">
      {navItems.map((item) => {
        const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
        const Icon = item.icon;

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center gap-1 transition-all ${isActive ? "text-blue-600 scale-110" : "text-slate-400"}`}
          >
            <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
            <span className="text-[9px] font-black uppercase tracking-widest">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
