"use client";

import { Vendor, Exercise } from "@prisma/client";
import VendorForm from "@/components/forms/VendorForm";
import { useState, useEffect } from "react";
import { Building2, Mail, Phone, Globe, Trash2, Edit3, ShieldCheck } from "lucide-react";

export default function AdminVendorsPage() {
  const [vendors, setVendors] = useState<any[]>([]);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [editingVendor, setEditingVendor] = useState<Vendor | null>(null);

  const fetchData = async () => {
    const [resV, resE] = await Promise.all([
      fetch("/api/vendors").then(r => r.json()),
      fetch("/api/exercises").then(r => r.json()),
    ]);
    setVendors(resV);
    setExercises(resE);
  };

  useEffect(() => { fetchData(); }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Remove this vendor partnership?")) return;
    await fetch(`/api/vendors?id=${id}`, { method: "DELETE" });
    fetchData();
  };

  return (
    <div className="p-4 md:p-8 bg-slate-50 min-h-screen text-slate-900 font-sans pb-24">
      <div className="max-w-6xl mx-auto">
        <header className="mb-12 flex flex-col md:flex-row md:items-center justify-between gap-6">
           <div>
              <h1 className="text-4xl font-black tracking-tighter uppercase leading-none">Vendor Alliance</h1>
              <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mt-2">Strategic Partner Ecosystem</p>
           </div>
           <div className="flex items-center gap-4 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
              <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white">
                 <Building2 size={20} />
              </div>
              <div>
                 <p className="text-[10px] font-black text-slate-400 uppercase">Verified Partners</p>
                 <p className="text-lg font-black">{vendors.length}</p>
              </div>
           </div>
        </header>

        <VendorForm initialData={editingVendor} exercises={exercises} />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
           {vendors.map((v) => (
             <div key={v.id} className="clean-card p-6 flex flex-col group animate-slide-up">
                <div className="flex items-center gap-4 mb-6">
                   {v.photo ? (
                     <img src={v.photo} className="w-14 h-14 rounded-2xl object-cover shadow-md border border-white" alt={v.name} />
                   ) : (
                     <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400">
                        <Building2 size={24} />
                     </div>
                   )}
                   <div>
                      <h3 className="font-black text-slate-900 leading-tight">{v.name}</h3>
                      <div className="flex items-center gap-1.5 mt-1">
                         <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full border ${
                           v.type === 'Internal' ? 'bg-blue-50 text-blue-600 border-blue-100' : 'bg-slate-100 text-slate-600 border-slate-200'
                         }`}>
                           {v.type}
                         </span>
                      </div>
                   </div>
                </div>

                <div className="space-y-3 mb-8 flex-1">
                   <div className="flex items-center gap-2 text-[11px] font-bold text-slate-500">
                      <Mail size={12} className="text-slate-300" /> {v.email || "No Node Defined"}
                   </div>
                   {v.phone && (
                     <div className="flex items-center gap-2 text-[11px] font-bold text-slate-500">
                        <Phone size={12} className="text-slate-300" /> {v.phone}
                     </div>
                   )}
                   <div className="pt-3 border-t border-slate-50 mt-3">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Resource Pool</p>
                      <p className="text-[11px] font-black text-slate-700">{v.resources?.length || 0} recovery agents assigned</p>
                   </div>
                </div>

                <div className="flex gap-2">
                   <button
                     onClick={() => { setEditingVendor(v); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                     className="flex-1 clean-button-secondary py-2 text-[10px] uppercase tracking-widest flex items-center justify-center gap-2"
                   >
                      <Edit3 size={12} /> Modify
                   </button>
                   <button
                     onClick={() => handleDelete(v.id)}
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
