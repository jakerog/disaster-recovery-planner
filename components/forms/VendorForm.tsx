"use client";

import { Vendor, Exercise } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import StatusMessage from "@/components/ui/StatusMessage";
import { Camera, Building2, Globe, Mail, Phone } from "lucide-react";

export default function VendorForm({ initialData, exercises }: { initialData?: Vendor | null, exercises: Exercise[] }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");
  const [data, setData] = useState<any>(initialData || { name: "", type: "Internal", email: "", phone: "", photo: "", exerciseId: "" });

  useEffect(() => {
    if (initialData) setData(initialData);
    else setData({ name: "", type: "Internal", email: "", phone: "", photo: "", exerciseId: "" });
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
      const res = await fetch("/api/vendors", { method: data.id ? "PATCH" : "POST", body: JSON.stringify(data) });
      if (res.ok) {
        router.refresh();
        if (!data.id) setData({ name: "", type: "Internal", email: "", phone: "", photo: "", exerciseId: "" });
        setStatus("Vendor Saved");
        setTimeout(() => setStatus(""), 3000);
      } else {
        setStatus("Failed to save vendor");
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
        <h2 className="text-2xl font-black tracking-tighter uppercase">{data.id ? "Update Vendor Profile" : "Register New Vendor"}</h2>
        {data.photo ? (
          <img src={data.photo} className="w-16 h-16 rounded-2xl object-cover ring-4 ring-slate-50 shadow-md" alt="Preview" />
        ) : (
          <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400">
            <Building2 size={32} />
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="clean-inset p-4">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2 px-1">Vendor Identity</label>
          <input value={data.name} onChange={e => setData({...data, name: e.target.value})} required className="w-full bg-transparent border-none text-sm font-bold focus:ring-0" placeholder="Vendor Name" />
        </div>

        <div className="clean-inset p-4">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2 px-1">Entity Type</label>
          <select value={data.type} onChange={e => setData({...data, type: e.target.value})} className="w-full bg-transparent border-none text-sm font-bold focus:ring-0 appearance-none">
            <option value="Internal">Internal</option>
            <option value="External">External</option>
          </select>
        </div>

        <div className="clean-inset p-4">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2 px-1">Communications Node</label>
          <input value={data.email || ""} onChange={e => setData({...data, email: e.target.value})} className="w-full bg-transparent border-none text-sm font-bold focus:ring-0" placeholder="contact@vendor.com" />
        </div>

        <div className="clean-inset p-4">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2 px-1">Support Hotline</label>
          <input value={data.phone || ""} onChange={e => setData({...data, phone: e.target.value})} className="w-full bg-transparent border-none text-sm font-bold focus:ring-0" placeholder="+1 (555) 000-0000" />
        </div>

        <div className="clean-inset p-4 relative group cursor-pointer hover:bg-slate-50 transition-colors">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2 px-1">Corporate Sigil (Logo)</label>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400">{data.photo ? "Logo Uploaded" : "Upload Brand Mark"}</span>
            <Camera size={18} className="text-blue-600" />
          </div>
          <input type="file" onChange={handleFileUpload} accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" />
        </div>

        <div className="clean-inset p-4">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2 px-1">Strategic Mandate</label>
          <select value={data.exerciseId || ""} onChange={e => setData({...data, exerciseId: e.target.value})} className="w-full bg-transparent border-none text-sm font-bold focus:ring-0 appearance-none">
            <option value="">None / Global</option>
            {exercises.map(ex => <option key={ex.id} value={ex.id}>{ex.name}</option>)}
          </select>
        </div>
      </div>

      <StatusMessage message={status} />
      <button type="submit" disabled={loading} className="w-full clean-button py-5 text-xs uppercase tracking-[0.3em] shadow-lg shadow-blue-200">
        {loading ? "Establishing Alliance..." : "Synchronize Vendor Metadata"}
      </button>
    </form>
  );
}
