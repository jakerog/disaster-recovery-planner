import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Shield, ChevronRight, Activity, Calendar } from "lucide-react";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function ExercisesListPage() {
  const session = await auth();
  if (!session) redirect("/login");

  const exercises = await prisma.exercise.findMany({
    orderBy: { startDate: 'desc' },
    include: {
      _count: {
        select: { tasks: true }
      }
    }
  });

  return (
    <div className="min-h-screen bg-slate-50 p-8 md:p-16 font-sans">
      <div className="max-w-5xl mx-auto">
        <header className="mb-16">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-blue-600 rounded-xl text-white shadow-lg shadow-blue-200">
              <Shield size={24} />
            </div>
            <h1 className="text-4xl font-black tracking-tighter uppercase">Mission Control</h1>
          </div>
          <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Active Recovery & Resilience Exercises</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {exercises.map((ex) => (
            <Link
              key={ex.id}
              href={`/exercise/${ex.id}`}
              className="clean-card p-8 group hover:border-blue-500 transition-all animate-slide-up"
            >
              <div className="flex justify-between items-start mb-8">
                <div className="px-3 py-1 rounded-full bg-blue-50 text-blue-600 border border-blue-100 text-[10px] font-black uppercase tracking-widest">
                  {ex.status}
                </div>
                {ex.photo && <img src={ex.photo} className="w-12 h-12 rounded-xl object-cover" alt="Logo" />}
              </div>

              <h2 className="text-2xl font-black text-slate-900 mb-4 group-hover:text-blue-600 transition-colors uppercase tracking-tight">
                {ex.name}
              </h2>

              <div className="space-y-3 mb-8">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                  <Calendar size={14} className="text-slate-300" />
                  <span>{ex.startDate ? new Date(ex.startDate).toLocaleDateString() : "TBD"} — {ex.endDate ? new Date(ex.endDate).toLocaleDateString() : "TBD"}</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                  <Activity size={14} className="text-slate-300" />
                  <span>{ex._count.tasks} Operational Tasks</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-6 border-t border-slate-50">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Enter Tactical Monitor</span>
                <ChevronRight size={16} className="text-slate-300 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
              </div>
            </Link>
          ))}

          {exercises.length === 0 && (
            <div className="col-span-full clean-card p-20 text-center border-dashed">
              <p className="text-slate-400 font-bold uppercase tracking-widest">No Active Exercises Logged</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
