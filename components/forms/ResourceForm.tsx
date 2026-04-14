"use client";

import { Resource, Team, Vendor } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function ResourceForm({ initialData, teams, vendors }: { initialData?: Resource, teams: Team[], vendors: Vendor[] }) {
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

      const res = await fetch("/api/resources", {
        method,
        body: JSON.stringify(body),
      });

      if (res.ok) {
        router.refresh();
        alert(`Resource ${initialData ? "updated" : "created"} successfully`);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl border border-gray-200 space-y-6 shadow-sm mb-10 text-gray-900">
      <h2 className="text-xl font-black tracking-tight">{initialData ? "Edit Resource" : "Add Resource"}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-2">Full Name</label>
          <input name="fullName" required defaultValue={initialData?.fullName} className="w-full border border-gray-200 rounded-lg p-3 text-sm font-medium" placeholder="Jane Doe" />
        </div>
        <div>
          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-2">Email Address</label>
          <input name="email" type="email" required defaultValue={initialData?.email} className="w-full border border-gray-200 rounded-lg p-3 text-sm font-medium" placeholder="jane@company.com" />
        </div>
        <div>
          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-2">Phone</label>
          <input name="phoneNumber" defaultValue={initialData?.phoneNumber || ""} className="w-full border border-gray-200 rounded-lg p-3 text-sm font-medium" placeholder="+1 234 567 890" />
        </div>
        <div>
          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-2">Team</label>
          <select name="teamId" defaultValue={initialData?.teamId || ""} className="w-full border border-gray-200 rounded-lg p-3 text-sm font-medium bg-gray-50">
            <option value="">No Team</option>
            {teams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
          </select>
        </div>
        <div>
          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-2">Vendor</label>
          <select name="vendorId" defaultValue={initialData?.vendorId || ""} className="w-full border border-gray-200 rounded-lg p-3 text-sm font-medium bg-gray-50">
            <option value="">No Vendor</option>
            {vendors.map(v => <option key={v.id} value={v.id}>{v.name}</option>)}
          </select>
        </div>
      </div>
      <button type="submit" disabled={loading} className="w-full py-4 bg-black text-white rounded-xl font-bold hover:bg-gray-800 transition-all shadow-lg disabled:opacity-50">
        {loading ? "Saving..." : initialData ? "Update Resource" : "Add Resource"}
      </button>
    </form>
  );
}
