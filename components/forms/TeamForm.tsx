"use client";

import { Team, Vendor, Exercise } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import StatusMessage from "@/components/ui/StatusMessage";
import { Camera, Users, Shield, Layout, Info } from "lucide-react";

export default function TeamForm({ initialData, vendors, exercises }: { initialData?: Team | null, vendors: Vendor[], exercises: Exercise[] }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");
  const [data, setData] = useState<any>(initialData || { name: "", vendorId: "", description: "", photo: "", exerciseId: "" });

  useEffect(() => {
    if (initialData) setData(initialData);
    else setData({ name: "", vendorId: "", description: "", photo: "", exerciseId: "" });
  }, [initialData]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setData({ ...data, photo: reader.result as string });
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/teams", { method: data.id ? "PATCH" : "POST", body: JSON.stringify(data) });
      if (res.ok) {
        router.refresh();
        if (!data.id) setData({ name: "", vendorId: "", description: "", photo: "", exerciseId: "" });
        setStatus("Team Saved");
        setTimeout(() => setStatus(""), 3000);
      } else {
        setStatus("Failed to save team");
      }
    } catch (err) {
      console.error(err);
      setStatus("Operation Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="clean-card p-8 md:p-12 rounded-[2.5rem] border border-slate-100 space-y-8 mb-10 text-slate-900 shadow-xl shadow-slate-200/50">
      <div className="flex justify-between items-center border-b border-slate-50 pb-6">
        <h2 className="text-2xl font-black tracking-tighter uppercase">{data.id ? "Update Operational Team" : "Mobilize New Team"}</h2>
        {data.photo ? (
          <img src={data.photo} className="w-16 h-16 rounded-2xl object-cover ring-4 ring-slate-50 shadow-md" alt="Preview" />
        ) : (
          <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400">
            <Users size={32} />
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="clean-inset p-4">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2 px-1">Team Designation</label>
          <input value={data.name} onChange={e => setData({...data, name: e.target.value})} required className="w-full bg-transparent border-none text-sm font-bold focus:ring-0" placeholder="Team Name" />
        </div>

        <div className="clean-inset p-4">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2 px-1">Vendor Partner</label>
          <select value={data.vendorId || ""} onChange={e => setData({...data, vendorId: e.target.value})} className="w-full bg-transparent border-none text-sm font-bold focus:ring-0 appearance-none">
            <option value="">Independent</option>
            {vendors.map(v => <option key={v.id} value={v.id}>{v.name}</option>)}
          </select>
        </div>

        <div className="clean-inset p-4">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2 px-1">Strategic Mandate</label>
          <select value={data.exerciseId || ""} onChange={e => setData({...data, exerciseId: e.target.value})} className="w-full bg-transparent border-none text-sm font-bold focus:ring-0 appearance-none">
            <option value="">Global / Permanent</option>
            {exercises.map(ex => <option key={ex.id} value={ex.id}>{ex.name}</option>)}
          </select>
        </div>

        <div className="clean-inset p-4 relative group cursor-pointer hover:bg-slate-50 transition-colors">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2 px-1">Tactical Insignia (Logo)</label>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400">{data.photo ? "Insignia Uploaded" : "Upload Team Logo"}</span>
            <Camera size={18} className="text-blue-600" />
          </div>
          <input type="file" onChange={handleFileUpload} accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" />
        </div>

        <div className="md:col-span-2 clean-inset p-4">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2 px-1">Operational Mandate (Description)</label>
          <textarea value={data.description || ""} onChange={e => setData({...data, description: e.target.value})} className="w-full bg-transparent border-none text-sm font-bold focus:ring-0 min-h-[100px]" placeholder="Define the team's recovery objectives..." />
        </div>
      </div>

      <StatusMessage message={status} />
      <button type="submit" disabled={loading} className="w-full clean-button py-5 text-xs uppercase tracking-[0.3em] shadow-lg shadow-blue-200">
        {loading ? "Deploying Team..." : "Synchronize Team Data"}
      </button>
    </form>
  );
}
