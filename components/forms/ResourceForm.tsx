"use client";

import { Resource, Team, Vendor } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function ResourceForm({ initialData, teams, vendors }: { initialData?: Resource | null, teams: Team[], vendors: Vendor[] }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>(initialData || { fullName: "", email: "", phoneNumber: "", telephoneNumber: "", teamId: "", vendorId: "", photo: "" });

  useEffect(() => {
    if (initialData) setData(initialData);
    else setData({ fullName: "", email: "", phoneNumber: "", telephoneNumber: "", teamId: "", vendorId: "", photo: "" });
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      const method = data.id ? "PATCH" : "POST";
      const res = await fetch("/api/resources", { method, body: JSON.stringify(data) });
      if (res.ok) {
        router.refresh();
        if (!data.id) setData({ fullName: "", email: "", phoneNumber: "", telephoneNumber: "", teamId: "", vendorId: "", photo: "" });
        alert("Success");
      }
    } catch (error) { console.error(error); } finally { setLoading(false); }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl border border-gray-200 space-y-6 shadow-sm mb-10 text-gray-900">
      <h2 className="text-xl font-black tracking-tight">{data.id ? "Edit Resource" : "Add Resource"}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <input value={data.fullName} onChange={e => setData({...data, fullName: e.target.value})} placeholder="Full Name" required className="border p-2 rounded" />
        <input value={data.email} onChange={e => setData({...data, email: e.target.value})} placeholder="Email" type="email" required className="border p-2 rounded" />
        <input value={data.phoneNumber || ""} onChange={e => setData({...data, phoneNumber: e.target.value})} placeholder="Phone" className="border p-2 rounded" />
        <input value={data.telephoneNumber || ""} onChange={e => setData({...data, telephoneNumber: e.target.value})} placeholder="Telephone" className="border p-2 rounded" />
        <select value={data.teamId || ""} onChange={e => setData({...data, teamId: e.target.value})} className="border p-2 rounded">
          <option value="">Select Team</option>
          {teams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
        </select>
        <select value={data.vendorId || ""} onChange={e => setData({...data, vendorId: e.target.value})} className="border p-2 rounded">
          <option value="">Select Vendor</option>
          {vendors.map(v => <option key={v.id} value={v.id}>{v.name}</option>)}
        </select>
      </div>
      <button type="submit" disabled={loading} className="w-full py-3 bg-black text-white rounded font-bold">{loading ? "Saving..." : "Save"}</button>
    </form>
  );
}
