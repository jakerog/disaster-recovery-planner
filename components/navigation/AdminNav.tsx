"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, UserCheck, ShieldAlert, Mail, ClipboardList, Briefcase, Building2 } from "lucide-react";

const links = [
  { href: "/admin/exercises", label: "Exercises", icon: LayoutDashboard },
  { href: "/admin/resources", label: "Resources", icon: Users },
  { href: "/admin/teams", label: "Teams", icon: Briefcase },
  { href: "/admin/vendors", label: "Vendors", icon: Building2 },
  { href: "/admin/email-templates", label: "Templates", icon: ClipboardList },
  { href: "/admin/email-lists", label: "Email Lists", icon: UserCheck },
  { href: "/admin/email-scheduler", label: "Scheduler", icon: Mail },
];

export default function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="w-64 border-r border-gray-100 p-6 flex flex-col gap-2 h-screen sticky top-0">
      <div className="mb-10 px-4">
        <h2 className="text-xl font-black uppercase tracking-tighter italic">Sentinel</h2>
      </div>
      {links.map((link) => {
        const Icon = link.icon;
        const isActive = pathname === link.href;
        return (
          <Link
            key={link.href}
            href={link.href}
            className={`flex items-center gap-3 p-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
              isActive ? "bg-black text-white shadow-xl" : "text-gray-400 hover:bg-gray-50"
            }`}
          >
            <Icon size={16} />
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
