"use client";

import { Vendor } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function VendorForm({ initialData }: { initialData?: Vendor | null }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>(initialData || { name: "", type: "Internal", email: "", phone: "", photo: "" });

  useEffect(() => {
    if (initialData) setData(initialData);
    else setData({ name: "", type: "Internal", email: "", phone: "", photo: "" });
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      const method = data.id ? "PATCH" : "POST";
      const res = await fetch("/api/vendors", { method, body: JSON.stringify(data) });
      if (res.ok) {
        router.refresh();
        if (!data.id) setData({ name: "", type: "Internal", email: "", phone: "", photo: "" });
        alert("Vendor Saved");
      }
    } catch (error) { console.error(error); } finally { setLoading(false); }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl border border-gray-200 space-y-6 shadow-sm mb-10 text-gray-900">
      <h2 className="text-xl font-black tracking-tight uppercase">{data.id ? "Edit Vendor" : "New Vendor"}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <input value={data.name} onChange={e => setData({...data, name: e.target.value})} placeholder="Vendor Name" required className="border p-2 rounded text-sm" />
        <select value={data.type} onChange={e => setData({...data, type: e.target.value})} className="border p-2 rounded text-sm">
          <option value="Internal">Internal</option>
          <option value="External">External</option>
        </select>
        <input value={data.email || ""} onChange={e => setData({...data, email: e.target.value})} placeholder="Contact Email" type="email" className="border p-2 rounded text-sm" />
        <input value={data.phone || ""} onChange={e => setData({...data, phone: e.target.value})} placeholder="Contact Phone" className="border p-2 rounded text-sm" />
        <input value={data.photo || ""} onChange={e => setData({...data, photo: e.target.value})} placeholder="Logo URL" className="border p-2 rounded text-sm" />
      </div>
      <button type="submit" disabled={loading} className="w-full py-3 bg-black text-white rounded font-bold uppercase tracking-widest">
        {loading ? "Saving..." : "Save Vendor Profile"}
      </button>
    </form>
  );
}
