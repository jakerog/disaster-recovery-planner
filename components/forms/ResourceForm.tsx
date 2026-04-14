"use client";

import { Resource, Team, Vendor } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function ResourceForm({ initialData, teams, vendors }: { initialData?: Resource | null, teams: Team[], vendors: Vendor[] }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>(initialData || { fullName: "", email: "", phoneNumber: "", teamId: "", vendorId: "" });

  useEffect(() => {
    if (initialData) setData(initialData);
    else setData({ fullName: "", email: "", phoneNumber: "", teamId: "", vendorId: "" });
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const method = data.id ? "PATCH" : "POST";
      const res = await fetch("/api/resources", {
        method,
        body: JSON.stringify(data),
      });

      if (res.ok) {
        router.refresh();
        if (!data.id) setData({ fullName: "", email: "", phoneNumber: "", teamId: "", vendorId: "" });
        alert(`Resource ${data.id ? "updated" : "created"} successfully`);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl border border-gray-200 space-y-6 shadow-sm mb-10 text-gray-900">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-black tracking-tight">{data.id ? "Edit Resource" : "Add Resource"}</h2>
        {data.id && <button type="button" onClick={() => setData({ fullName: "", email: "", phoneNumber: "", teamId: "", vendorId: "" })} className="text-xs font-bold text-gray-400 hover:text-black uppercase">Cancel Edit</button>}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-2">Full Name</label>
          <input value={data.fullName} onChange={e => setData({...data, fullName: e.target.value})} required className="w-full border border-gray-200 rounded-lg p-3 text-sm font-medium" placeholder="Jane Doe" />
        </div>
        <div>
          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-2">Email Address</label>
          <input value={data.email} onChange={e => setData({...data, email: e.target.value})} type="email" required className="w-full border border-gray-200 rounded-lg p-3 text-sm font-medium" placeholder="jane@company.com" />
        </div>
        <div>
          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-2">Phone</label>
          <input value={data.phoneNumber || ""} onChange={e => setData({...data, phoneNumber: e.target.value})} className="w-full border border-gray-200 rounded-lg p-3 text-sm font-medium" placeholder="+1 234 567 890" />
        </div>
        <div>
          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-2">Team</label>
          <select value={data.teamId || ""} onChange={e => setData({...data, teamId: e.target.value})} className="w-full border border-gray-200 rounded-lg p-3 text-sm font-medium bg-gray-50">
            <option value="">No Team</option>
            {teams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
          </select>
        </div>
        <div>
          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-2">Vendor</label>
          <select value={data.vendorId || ""} onChange={e => setData({...data, vendorId: e.target.value})} className="w-full border border-gray-200 rounded-lg p-3 text-sm font-medium bg-gray-50">
            <option value="">No Vendor</option>
            {vendors.map(v => <option key={v.id} value={v.id}>{v.name}</option>)}
          </select>
        </div>
      </div>
      <button type="submit" disabled={loading} className="w-full py-4 bg-black text-white rounded-xl font-bold hover:bg-gray-800 transition-all shadow-lg disabled:opacity-50">
        {loading ? "Saving..." : data.id ? "Update Resource" : "Add Resource"}
      </button>
    </form>
  );
}
