"use client";

import { Exercise } from "@prisma/client";
import ExerciseForm from "@/components/forms/ExerciseForm";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Shield, Calendar, Activity, Layout, Trash2, Edit3, Settings2 } from "lucide-react";
import BackButton from "@/components/ui/BackButton";

export default function AdminExercisesPage() {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [editingExercise, setEditingExercise] = useState<Exercise | null>(null);

  const fetchData = async () => {
    const res = await fetch("/api/exercises").then(r => r.json());
    setExercises(res);
  };

  useEffect(() => { fetchData(); }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this exercise and all associated recovery data? This cannot be reversed.")) return;
    await fetch(`/api/exercises?id=${id}`, { method: "DELETE" });
    fetchData();
  };

  return (
    <div className="p-4 md:p-8 bg-slate-50 min-h-screen text-slate-900 font-sans pb-24">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6"><BackButton /></div>
        <header className="mb-12 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-4xl font-black tracking-tighter uppercase leading-none">Exercise Master</h1>
            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mt-2">Recovery Orchestration Control</p>
          </div>
          <div className="flex items-center gap-4 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
            <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white">
              <Activity size={20} />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase">Operational Mandates</p>
              <p className="text-lg font-black">{exercises.length}</p>
            </div>
          </div>
        </header>

        <ExerciseForm initialData={editingExercise || undefined} />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
          {exercises.map(e => (
            <div key={e.id} className="clean-card p-8 hover:border-blue-500 transition-all cursor-pointer group shadow-xl shadow-slate-200/50 flex flex-col animate-slide-up">
              <div className="flex justify-between items-start mb-8">
                {e.photo ? (
                  <img src={e.photo} className="w-16 h-16 rounded-2xl object-cover ring-4 ring-slate-50 shadow-md" alt={e.name} />
                ) : (
                  <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center font-black text-slate-300 text-xs shadow-inner">
                    EXE
                  </div>
                )}
                <span className="status-pill status-pill-blue">{e.status}</span>
              </div>

              <h2 className="text-2xl font-black text-slate-900 mb-4 leading-tight uppercase tracking-tight group-hover:text-blue-600 transition-colors">{e.name}</h2>

              <div className="space-y-3 mb-10 flex-1">
                <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.1em]">
                  <Calendar size={12} className="text-slate-300" />
                  <span>{e.startDate ? new Date(e.startDate).toLocaleDateString() : "TBD"} — {e.endDate ? new Date(e.endDate).toLocaleDateString() : "TBD"}</span>
                </div>
                {e.mock3Required && (
                  <div className="flex items-center gap-2 text-[9px] font-black text-amber-600 uppercase bg-amber-50 px-2 py-1 rounded border border-amber-100 w-fit">
                    Mock 3 Phase Active
                  </div>
                )}
              </div>

              <div className="mt-auto space-y-3 pt-6 border-t border-slate-50">
                <div className="grid grid-cols-2 gap-3">
                   <Link href={`/admin/exercises/${e.id}/workflow`} className="flex items-center justify-center gap-2 py-3 clean-button-secondary text-[10px] uppercase tracking-widest">
                     <Layout size={14}/> Workflow
                   </Link>
                   <button onClick={() => { setEditingExercise(e); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="flex items-center justify-center gap-2 py-3 clean-button-secondary text-[10px] uppercase tracking-widest">
                     <Edit3 size={14}/> Edit
                   </button>
                </div>
                <button onClick={() => handleDelete(e.id)} className="w-full py-3 bg-rose-50 text-rose-600 border border-rose-100 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-rose-100 transition-colors flex items-center justify-center gap-2">
                  <Trash2 size={14}/> Terminate Mandate
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
