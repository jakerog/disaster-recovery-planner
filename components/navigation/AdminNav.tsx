"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { LayoutDashboard, Users, UserCheck, Mail, ClipboardList, Briefcase, Building2, LogOut } from "lucide-react";

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
    <nav className="w-64 border-r border-gray-100 p-6 flex flex-col gap-2 h-screen sticky top-0 bg-gray-50/50 backdrop-blur-xl">
      <div className="mb-10 px-4">
        <h2 className="text-2xl font-black uppercase tracking-tighter italic text-black">Sentinel</h2>
        <div className="w-8 h-1 bg-black mt-1"></div>
      </div>
      <div className="flex-1 flex flex-col gap-1">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 p-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
                isActive ? "bg-black text-white shadow-2xl scale-105" : "text-gray-400 hover:bg-white hover:text-black hover:shadow-sm"
              }`}
            >
              <Icon size={16} />
              {link.label}
            </Link>
          );
        })}
      </div>

      <button
        onClick={() => signOut({ callbackUrl: "/login" })}
        className="flex items-center gap-3 p-4 rounded-2xl text-[10px] font-black uppercase tracking-widest text-red-400 hover:bg-red-50 hover:text-red-600 transition-all mt-auto border border-dashed border-red-100"
      >
        <LogOut size={16} />
        Terminate Session
      </button>
    </nav>
  );
}
