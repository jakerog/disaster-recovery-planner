"use client";

import { Team, Vendor, Exercise } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import StatusMessage from "@/components/ui/StatusMessage";

export default function TeamForm({ initialData, vendors, exercises }: { initialData?: Team | null, vendors: Vendor[], exercises: Exercise[] }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");
  const [data, setData] = useState<any>(initialData || { name: "", vendorId: "", description: "", photo: "", exerciseId: "" });

  useEffect(() => {
    if (initialData) setData(initialData);
    else setData({ name: "", vendorId: "", description: "", photo: "", exerciseId: "" });
  }, [initialData]);

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
    <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl border border-gray-200 space-y-6 shadow-sm mb-10 text-gray-900">
      <h2 className="text-xl font-black tracking-tight uppercase">{data.id ? "Modify Team" : "New Recovery Team"}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div><label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Team Name</label>
        <input value={data.name} onChange={e => setData({...data, name: e.target.value})} required className="w-full border p-2 rounded text-sm" /></div>
        <div><label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Vendor Partner</label>
        <select value={data.vendorId || ""} onChange={e => setData({...data, vendorId: e.target.value})} className="w-full border p-2 rounded text-sm">
          <option value="">Independent</option>
          {vendors.map(v => <option key={v.id} value={v.id}>{v.name}</option>)}
        </select></div>
        <div><label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Exercise</label>
        <select value={data.exerciseId || ""} onChange={e => setData({...data, exerciseId: e.target.value})} className="w-full border p-2 rounded text-sm">
          <option value="">Global/None</option>
          {exercises.map(ex => <option key={ex.id} value={ex.id}>{ex.name}</option>)}
        </select></div>
        <div><label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Logo URL</label>
        <input value={data.photo || ""} onChange={e => setData({...data, photo: e.target.value})} className="w-full border p-2 rounded text-sm" /></div>
        <div className="md:col-span-2"><label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Description</label>
        <textarea value={data.description || ""} onChange={e => setData({...data, description: e.target.value})} className="w-full border p-2 rounded text-sm" /></div>
      </div>
      <StatusMessage message={status} />
      <button type="submit" disabled={loading} className="w-full py-3 bg-black text-white rounded font-bold uppercase tracking-widest">Establish Team</button>
    </form>
  );
}
