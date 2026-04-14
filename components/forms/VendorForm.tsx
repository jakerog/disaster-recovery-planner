"use client";

import { Vendor } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function VendorForm({ initialData }: { initialData?: Vendor | null }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>(initialData || { name: "", type: "Internal", email: "", phone: "" });

  useEffect(() => {
    if (initialData) setData(initialData);
    else setData({ name: "", type: "Internal", email: "", phone: "" });
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const method = data.id ? "PATCH" : "POST";
      const res = await fetch("/api/vendors", {
        method,
        body: JSON.stringify(data),
      });

      if (res.ok) {
        router.refresh();
        if (!data.id) setData({ name: "", type: "Internal", email: "", phone: "" });
        alert(`Vendor ${data.id ? "updated" : "created"} successfully`);
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
        <h2 className="text-xl font-black tracking-tight">{data.id ? "Edit Vendor" : "Add Vendor"}</h2>
        {data.id && <button type="button" onClick={() => setData({ name: "", type: "Internal", email: "", phone: "" })} className="text-xs font-bold text-gray-400 hover:text-black uppercase">Cancel Edit</button>}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Vendor Name</label>
          <input value={data.name} onChange={e => setData({...data, name: e.target.value})} required className="w-full border border-gray-200 rounded-lg p-2 text-sm font-medium" placeholder="Cloud Solutions Inc." />
        </div>
        <div>
          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Type</label>
          <select value={data.type} onChange={e => setData({...data, type: e.target.value})} className="w-full border border-gray-200 rounded-lg p-2 text-sm font-medium bg-gray-50">
            <option value="Internal">Internal</option>
            <option value="External">External</option>
          </select>
        </div>
      </div>
      <button type="submit" disabled={loading} className="w-full py-4 bg-black text-white rounded-xl font-bold hover:bg-gray-800 transition-all shadow-lg disabled:opacity-50">
        {loading ? "Saving..." : data.id ? "Update Vendor" : "Add Vendor"}
      </button>
    </form>
  );
}
