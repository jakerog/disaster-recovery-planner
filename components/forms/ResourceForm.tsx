"use client";

import { Resource, Team, Vendor, Exercise } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import StatusMessage from "@/components/ui/StatusMessage";

export default function ResourceForm({ initialData, teams, vendors, exercises }: { initialData?: Resource | null, teams: Team[], vendors: Vendor[], exercises: Exercise[] }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");
  const [data, setData] = useState<any>(initialData || { fullName: "", email: "", phoneNumber: "", telephoneNumber: "", photo: "", teamId: "", vendorId: "", exerciseId: "" });

  useEffect(() => {
    if (initialData) setData(initialData);
    else setData({ fullName: "", email: "", phoneNumber: "", telephoneNumber: "", photo: "", teamId: "", vendorId: "", exerciseId: "" });
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/resources", {
        method: data.id ? "PATCH" : "POST",
        body: JSON.stringify(data),
      });
      if (res.ok) {
        router.refresh();
        if (!data.id) setData({ fullName: "", email: "", phoneNumber: "", telephoneNumber: "", photo: "", teamId: "", vendorId: "", exerciseId: "" });
        setStatus("Resource Synchronized");
        setTimeout(() => setStatus(""), 3000);
      } else {
        setStatus("Failed to sync resource");
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
      <h2 className="text-xl font-black tracking-tight uppercase">{data.id ? "Modify Resource" : "Create Resource"}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div><label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Full Name</label>
        <input value={data.fullName} onChange={e => setData({...data, fullName: e.target.value})} required className="w-full border p-2 rounded text-sm" /></div>
        <div><label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Email</label>
        <input value={data.email} onChange={e => setData({...data, email: e.target.value})} type="email" required className="w-full border p-2 rounded text-sm" /></div>
        <div><label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Phone</label>
        <input value={data.phoneNumber || ""} onChange={e => setData({...data, phoneNumber: e.target.value})} className="w-full border p-2 rounded text-sm" /></div>
        <div><label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Telephone</label>
        <input value={data.telephoneNumber || ""} onChange={e => setData({...data, telephoneNumber: e.target.value})} className="w-full border p-2 rounded text-sm" /></div>
        <div><label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Photo URL</label>
        <input value={data.photo || ""} onChange={e => setData({...data, photo: e.target.value})} className="w-full border p-2 rounded text-sm" /></div>
        <div><label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Team</label>
        <select value={data.teamId || ""} onChange={e => setData({...data, teamId: e.target.value})} className="w-full border p-2 rounded text-sm">
          <option value="">No Team</option>
          {teams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
        </select></div>
        <div><label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Vendor</label>
        <select value={data.vendorId || ""} onChange={e => setData({...data, vendorId: e.target.value})} className="w-full border p-2 rounded text-sm">
          <option value="">No Vendor</option>
          {vendors.map(v => <option key={v.id} value={v.id}>{v.name}</option>)}
        </select></div>
        <div><label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Exercise</label>
        <select value={data.exerciseId || ""} onChange={e => setData({...data, exerciseId: e.target.value})} className="w-full border p-2 rounded text-sm">
          <option value="">No Exercise</option>
          {exercises.map(ex => <option key={ex.id} value={ex.id}>{ex.name}</option>)}
        </select></div>
      </div>
      <StatusMessage message={status} />
      <button type="submit" disabled={loading} className="w-full py-3 bg-black text-white rounded font-bold uppercase tracking-widest">{loading ? "Processing..." : "Sync Resource"}</button>
    </form>
  );
}
