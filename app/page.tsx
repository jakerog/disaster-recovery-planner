import { auth } from "@/auth";
import Link from "next/link";
import { Shield, Settings, Activity, UserCheck } from "lucide-react";
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
        <header className="text-center mb-16">
          <div className="inline-flex p-4 bg-white border border-slate-200 rounded-2xl shadow-sm mb-6">
            <Shield className="text-blue-600" size={48} />
          </div>
          <h1 className="text-5xl font-extrabold tracking-tight text-slate-900 mb-2">
            SENTINEL
          </h1>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.4em]">
            Disaster Recovery Orchestrator
          </p>
        </header>

        <div className="clean-card p-8 mb-8">
          <div className="flex items-center gap-4 mb-8 pb-8 border-b border-slate-100">
            <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center font-bold text-slate-600">
              {user.name?.[0] || "U"}
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Operator Identity</p>
              <h2 className="text-xl font-bold text-slate-900">{user.name} ({user.role})</h2>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {["Admin", "Moderator"].includes(user.role) && (
              <Link
                href="/admin/exercises"
                className="group flex items-center gap-4 p-6 bg-slate-50 border border-slate-100 rounded-xl hover:bg-blue-600 hover:border-blue-600 transition-all duration-200"
              >
                <div className="p-3 bg-white border border-slate-100 rounded-lg group-hover:bg-blue-50 group-hover:border-blue-400 transition-colors">
                  <Settings className="text-slate-600 group-hover:text-white" size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 group-hover:text-white">Admin Console</h3>
                  <p className="text-xs text-slate-500 group-hover:text-blue-100">Manage assets & workflows</p>
                </div>
              </Link>
            )}

            <Link
              href="/availability"
              className="group flex items-center gap-4 p-6 bg-slate-50 border border-slate-100 rounded-xl hover:bg-blue-600 hover:border-blue-600 transition-all duration-200"
            >
              <div className="p-3 bg-white border border-slate-100 rounded-lg group-hover:bg-blue-50 group-hover:border-blue-400 transition-colors">
                <UserCheck className="text-slate-600 group-hover:text-white" size={24} />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 group-hover:text-white">Readiness Portal</h3>
                <p className="text-xs text-slate-500 group-hover:text-blue-100">Validate resource availability</p>
              </div>
            </Link>
          </div>
        </div>

        <p className="text-center text-[10px] font-bold text-slate-300 uppercase tracking-[0.2em]">
          Global Operations Matrix v2.0
        </p>
      </div>
    </div>
  );
}
