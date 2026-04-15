"use client";

import { Vendor, Exercise } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function VendorForm({ initialData, exercises }: { initialData?: Vendor | null, exercises: Exercise[] }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>(initialData || { name: "", type: "Internal", email: "", phone: "", photo: "", exerciseId: "" });

  useEffect(() => {
    if (initialData) setData(initialData);
    else setData({ name: "", type: "Internal", email: "", phone: "", photo: "", exerciseId: "" });
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/vendors", { method: data.id ? "PATCH" : "POST", body: JSON.stringify(data) });
      if (res.ok) {
        router.refresh();
        if (!data.id) setData({ name: "", type: "Internal", email: "", phone: "", photo: "", exerciseId: "" });
        alert("Vendor Saved");
      }
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl border border-gray-200 space-y-6 shadow-sm mb-10 text-gray-900">
      <h2 className="text-xl font-black tracking-tight uppercase">{data.id ? "Modify Vendor" : "New Vendor"}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div><label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Vendor Name</label>
        <input value={data.name} onChange={e => setData({...data, name: e.target.value})} required className="w-full border p-2 rounded text-sm" /></div>
        <div><label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Type</label>
        <select value={data.type} onChange={e => setData({...data, type: e.target.value})} className="w-full border p-2 rounded text-sm">
          <option value="Internal">Internal</option><option value="External">External</option>
        </select></div>
        <div><label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Contact Email</label>
        <input value={data.email || ""} onChange={e => setData({...data, email: e.target.value})} className="w-full border p-2 rounded text-sm" /></div>
        <div><label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Contact Phone</label>
        <input value={data.phone || ""} onChange={e => setData({...data, phone: e.target.value})} className="w-full border p-2 rounded text-sm" /></div>
        <div><label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Logo URL</label>
        <input value={data.photo || ""} onChange={e => setData({...data, photo: e.target.value})} className="w-full border p-2 rounded text-sm" /></div>
        <div><label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Assigned Exercise</label>
        <select value={data.exerciseId || ""} onChange={e => setData({...data, exerciseId: e.target.value})} className="w-full border p-2 rounded text-sm">
          <option value="">None</option>
          {exercises.map(ex => <option key={ex.id} value={ex.id}>{ex.name}</option>)}
        </select></div>
      </div>
      <button type="submit" disabled={loading} className="w-full py-3 bg-black text-white rounded font-bold uppercase tracking-widest">Save Vendor</button>
    </form>
  );
}
