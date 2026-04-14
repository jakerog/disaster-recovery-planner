"use client";

import { Team, Vendor } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function TeamForm({ initialData, vendors }: { initialData?: Team, vendors: Vendor[] }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    try {
      const method = initialData ? "PATCH" : "POST";
      const body = initialData ? { ...data, id: initialData.id } : data;

      const res = await fetch("/api/teams", {
        method,
        body: JSON.stringify(body),
      });

      if (res.ok) {
        router.refresh();
        alert(`Team ${initialData ? "updated" : "created"} successfully`);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl border border-gray-200 space-y-6 shadow-sm mb-10 text-gray-900">
      <h2 className="text-xl font-black tracking-tight">{initialData ? "Edit Team" : "New Recovery Team"}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-2">Team Name</label>
          <input name="name" required defaultValue={initialData?.name} className="w-full border border-gray-200 rounded-lg p-3 text-sm font-medium" placeholder="Cloud Recovery Alpha" />
        </div>
        <div>
          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-2">Vendor Partner</label>
          <select name="vendorId" defaultValue={initialData?.vendorId || ""} className="w-full border border-gray-200 rounded-lg p-3 text-sm font-medium bg-gray-50">
            <option value="">Independent / Internal</option>
            {vendors.map(v => <option key={v.id} value={v.id}>{v.name}</option>)}
          </select>
        </div>
        <div className="md:col-span-2">
          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-2">Description</label>
          <textarea name="description" defaultValue={initialData?.description || ""} className="w-full border border-gray-200 rounded-lg p-3 text-sm font-medium" placeholder="Specialized focus on DB failover..."></textarea>
        </div>
      </div>
      <button type="submit" disabled={loading} className="w-full py-4 bg-black text-white rounded-xl font-bold hover:bg-gray-800 transition-all shadow-lg disabled:opacity-50">
        {loading ? "Saving..." : initialData ? "Update Team" : "Establish Team"}
      </button>
    </form>
  );
}
