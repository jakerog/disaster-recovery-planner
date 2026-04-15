import Link from "next/link";
import { Shield, ChevronRight, LayoutDashboard, UserCheck } from "lucide-react";
import { auth } from "@/auth";

export default async function Home() {
  const session = await auth();

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-8 font-sans">
      <div className="max-w-xl w-full skeuo-card p-16 rounded-[4rem] border border-white text-center">
        <div className="flex justify-center mb-10">
          <div className="w-24 h-24 bg-black rounded-[2rem] flex items-center justify-center text-white shadow-[0_25px_50px_rgba(0,0,0,0.4)] ring-8 ring-white">
            <Shield size={48} />
          </div>
        </div>

        <h1 className="text-6xl font-black mb-2 tracking-tighter uppercase text-black italic">Sentinel</h1>
        <p className="text-[12px] font-black text-gray-400 uppercase tracking-[0.5em] mb-12">Disaster Recovery Orchestrator</p>

        {session ? (
          <div className="space-y-6">
            <div className="skeuo-inset p-4 border border-white mb-8">
              <span className="text-[10px] font-black uppercase text-gray-400 block mb-1">Authenticated Identity</span>
              <span className="text-sm font-black uppercase text-black">{session.user?.name} ({session.user?.role})</span>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <Link href="/admin/exercises" className="skeuo-button w-full py-5 text-white rounded-[1.5rem] font-black uppercase tracking-[0.3em] text-[11px] flex items-center justify-center gap-3 group transition-all">
                <LayoutDashboard size={18} /> Administrative Control <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link href="/availability" className="skeuo-inset w-full py-5 text-black border border-white rounded-[1.5rem] font-black uppercase tracking-[0.3em] text-[11px] flex items-center justify-center gap-3 hover:bg-white transition-all">
                <UserCheck size={18} /> Resource Check-in
              </Link>
            </div>
          </div>
        ) : (
          <Link href="/login" className="skeuo-button w-full py-6 text-white rounded-[2rem] font-black uppercase tracking-[0.4em] text-[12px] flex items-center justify-center gap-3 shadow-[0_20px_40px_rgba(0,0,0,0.3)] hover:scale-[1.02] transition-all">
            Initiate System Access
          </Link>
        )}

        <p className="mt-16 text-[9px] font-black text-gray-300 uppercase tracking-[0.4em]">Sentinel Global Operations Matrix</p>
      </div>
    </div>
  );
}
