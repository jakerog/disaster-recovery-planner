"use client";

import { Team, Vendor, Exercise } from "@prisma/client";
import TeamForm from "@/components/forms/TeamForm";
import { useState, useEffect } from "react";
import { Users, Building2, Trash2, Edit3, Shield, Layout } from "lucide-react";

export default function AdminTeamsPage() {
  const [teams, setTeams] = useState<any[]>([]);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [editingTeam, setEditingTeam] = useState<Team | null>(null);

  const fetchData = async () => {
    const [resT, resV, resE] = await Promise.all([
      fetch("/api/teams").then(r => r.json()),
      fetch("/api/vendors").then(r => r.json()),
      fetch("/api/exercises").then(r => r.json()),
    ]);
    setTeams(resT);
    setVendors(resV);
    setExercises(resE);
  };

  useEffect(() => { fetchData(); }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Deactivate this recovery team?")) return;
    await fetch(`/api/teams?id=${id}`, { method: "DELETE" });
    fetchData();
  };

  return (
    <div className="p-4 md:p-8 bg-slate-50 min-h-screen text-slate-900 font-sans pb-24">
      <div className="max-w-6xl mx-auto">
        <header className="mb-12 flex flex-col md:flex-row md:items-center justify-between gap-6">
           <div>
              <h1 className="text-4xl font-black tracking-tighter uppercase leading-none">Operational Units</h1>
              <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mt-2">Recovery Team Orchestration</p>
           </div>
           <div className="flex items-center gap-4 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
              <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white">
                 <Users size={20} />
              </div>
              <div>
                 <p className="text-[10px] font-black text-slate-400 uppercase">Active Units</p>
                 <p className="text-lg font-black">{teams.length}</p>
              </div>
           </div>
        </header>

        <TeamForm initialData={editingTeam} vendors={vendors} exercises={exercises} />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
           {teams.map((t) => (
             <div key={t.id} className="clean-card p-6 flex flex-col group animate-slide-up">
                <div className="flex items-center gap-4 mb-6">
                   {t.photo ? (
                     <img src={t.photo} className="w-14 h-14 rounded-2xl object-cover shadow-md border border-white" alt={t.name} />
                   ) : (
                     <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400">
                        <Shield size={24} />
                     </div>
                   )}
                   <div className="flex-1">
                      <h3 className="font-black text-slate-900 leading-tight uppercase tracking-tight">{t.name}</h3>
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">
                        {t.vendor?.name || "Independent Ops"}
                      </p>
                   </div>
                </div>

                <div className="space-y-4 mb-8 flex-1">
                   <p className="text-xs font-bold text-slate-500 italic line-clamp-3 leading-relaxed">
                     {t.description || "Unit operational objectives not defined."}
                   </p>

                   <div className="pt-4 border-t border-slate-50 flex items-center justify-between">
                      <div>
                         <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Team Size</p>
                         <p className="text-[11px] font-black text-slate-700">{t.resources?.length || 0} agents</p>
                      </div>
                      <div className="text-right">
                         <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Active Tasks</p>
                         <p className="text-[11px] font-black text-slate-700">{t.tasks?.length || 0} recovery ops</p>
                      </div>
                   </div>
                </div>

                <div className="flex gap-2">
                   <button
                     onClick={() => { setEditingTeam(t); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                     className="flex-1 clean-button-secondary py-2 text-[10px] uppercase tracking-widest flex items-center justify-center gap-2"
                   >
                      <Edit3 size={12} /> Sync Unit
                   </button>
                   <button
                     onClick={() => handleDelete(t.id)}
                     className="p-2 rounded-xl bg-rose-50 text-rose-600 border border-rose-100 hover:bg-rose-100 transition-colors"
                   >
                      <Trash2 size={16} />
                   </button>
                </div>
             </div>
           ))}
        </div>
      </div>
    </div>
  );
}
