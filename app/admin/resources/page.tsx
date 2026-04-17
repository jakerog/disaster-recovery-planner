"use client";

import { Resource, Team, Vendor, Exercise } from "@prisma/client";
import ResourceForm from "@/components/forms/ResourceForm";
import { useState, useEffect } from "react";
import { User, Trash2, Edit3, Shield, Mail, Phone } from "lucide-react";
import BackButton from "@/components/ui/BackButton";

export default function AdminResourcesPage() {
  const [resources, setResources] = useState<any[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [editingResource, setEditingResource] = useState<Resource | null>(null);

  const fetchData = async () => {
    const [resR, resT, resV, resE] = await Promise.all([
      fetch("/api/resources").then(r => r.json()),
      fetch("/api/teams").then(r => r.json()),
      fetch("/api/vendors").then(r => r.json()),
      fetch("/api/exercises").then(r => r.json()),
    ]);
    setResources(resR);
    setTeams(resT);
    setVendors(resV);
    setExercises(resE);
  };

  useEffect(() => { fetchData(); }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Terminate this resource access? This action cannot be undone.")) return;
    await fetch(`/api/resources?id=${id}`, { method: "DELETE" });
    fetchData();
  };

  return (
    <div className="p-4 md:p-8 bg-slate-50 min-h-screen text-slate-900 font-sans pb-24">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6"><BackButton /></div>
        <header className="mb-12 flex flex-col md:flex-row md:items-center justify-between gap-6">
           <div>
              <h1 className="text-4xl font-black tracking-tighter uppercase leading-none">Personnel Registry</h1>
              <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mt-2">Resource Allocation & Identity Node</p>
           </div>
           <div className="flex items-center gap-4 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
              <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white">
                 <Shield size={20} />
              </div>
              <div>
                 <p className="text-[10px] font-black text-slate-400 uppercase">Active Agents</p>
                 <p className="text-lg font-black">{resources.length}</p>
              </div>
           </div>
        </header>

        <ResourceForm initialData={editingResource} teams={teams} vendors={vendors} exercises={exercises} />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
           {resources.map((r) => (
             <div key={r.id} className="clean-card p-6 flex flex-col group animate-slide-up">
                <div className="flex items-center gap-4 mb-6">
                   {r.photo ? (
                     <img src={r.photo} className="w-14 h-14 rounded-2xl object-cover shadow-md border border-white" alt={r.fullName} />
                   ) : (
                     <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400">
                        <User size={24} />
                     </div>
                   )}
                   <div>
                      <h3 className="font-black text-slate-900 leading-tight">{r.fullName}</h3>
                      <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest">{r.role}</p>
                   </div>
                </div>

                <div className="space-y-3 mb-8 flex-1">
                   <div className="flex items-center gap-2 text-[11px] font-bold text-slate-500">
                      <Mail size={12} className="text-slate-300" /> {r.email}
                   </div>
                   {r.phoneNumber && (
                     <div className="flex items-center gap-2 text-[11px] font-bold text-slate-500">
                        <Phone size={12} className="text-slate-300" /> {r.phoneNumber}
                     </div>
                   )}
                   <div className="pt-3 border-t border-slate-50 mt-3">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Unit Assignment</p>
                      <p className="text-[11px] font-black text-slate-700">{r.team?.name || "Independent"} / {r.vendor?.name || "Internal"}</p>
                   </div>
                </div>

                <div className="flex gap-2">
                   <button
                     onClick={() => { setEditingResource(r); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                     className="flex-1 clean-button-secondary py-2 text-[10px] uppercase tracking-widest flex items-center justify-center gap-2"
                   >
                      <Edit3 size={12} /> Edit
                   </button>
                   <button
                     onClick={() => handleDelete(r.id)}
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
