import { auth } from "@/auth";
import Link from "next/link";
import { Shield, Settings, Activity, UserCheck, LayoutGrid } from "lucide-react";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function Home() {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  const user = session.user as any;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-100">
      <div className="max-w-4xl mx-auto py-20 px-6">
        <header className="text-center mb-16 animate-slide-up">
          <div className="inline-flex p-5 bg-white border border-slate-100 rounded-[2rem] shadow-xl shadow-slate-200/50 mb-8 ring-8 ring-slate-50">
            <Shield className="text-blue-600" size={56} strokeWidth={1.5} />
          </div>
          <h1 className="text-6xl font-black tracking-tighter text-slate-900 mb-3">
            SENTINEL
          </h1>
          <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.5em]">
            Disaster Recovery Orchestrator
          </p>
        </header>

        <div className="clean-card p-8 md:p-12 mb-12 animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <div className="flex items-center gap-6 mb-10 pb-10 border-b border-slate-50">
            <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center font-black text-2xl text-slate-400 shadow-inner">
              {user.name?.[0] || "U"}
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Operator Identity</p>
              <h2 className="text-2xl font-black text-slate-900 leading-none">{user.name}</h2>
              <span className="inline-block mt-2 px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-widest border border-blue-100">
                {user.role} Authority
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Link
              href="/exercises"
              className="group flex items-center gap-5 p-6 bg-slate-50 border border-slate-100 rounded-3xl hover:bg-white hover:border-blue-500 hover:shadow-2xl hover:shadow-blue-100 transition-all duration-300"
            >
              <div className="p-4 bg-white rounded-2xl shadow-sm group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all">
                <LayoutGrid size={24} />
              </div>
              <div>
                <h3 className="font-black text-slate-900 uppercase tracking-tight">Mission Control</h3>
                <p className="text-xs font-bold text-slate-400">Tactical execution & monitor</p>
              </div>
            </Link>

            <Link
              href="/availability"
              className="group flex items-center gap-5 p-6 bg-slate-50 border border-slate-100 rounded-3xl hover:bg-white hover:border-blue-500 hover:shadow-2xl hover:shadow-blue-100 transition-all duration-300"
            >
              <div className="p-4 bg-white rounded-2xl shadow-sm group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all">
                <UserCheck size={24} />
              </div>
              <div>
                <h3 className="font-black text-slate-900 uppercase tracking-tight">Readiness Portal</h3>
                <p className="text-xs font-bold text-slate-400">Validate availability status</p>
              </div>
            </Link>

            {["Admin", "Moderator"].includes(user.role) && (
              <Link
                href="/admin/exercises"
                className="group flex items-center gap-5 p-6 bg-slate-50 border border-slate-100 rounded-3xl hover:bg-white hover:border-blue-500 hover:shadow-2xl hover:shadow-blue-100 transition-all duration-300 md:col-span-2"
              >
                <div className="p-4 bg-white rounded-2xl shadow-sm group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all">
                  <Settings size={24} />
                </div>
                <div>
                  <h3 className="font-black text-slate-900 uppercase tracking-tight">Command Center (Admin)</h3>
                  <p className="text-xs font-bold text-slate-400">Asset management & strategic configuration</p>
                </div>
              </Link>
            )}
          </div>
        </div>

        <div className="text-center animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.4em]">
            Global Operations Matrix v2.0
          </p>
        </div>
      </div>
    </div>
  );
}
