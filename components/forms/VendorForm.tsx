"use client";

import { Vendor } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function VendorForm({ initialData }: { initialData?: Vendor }) {
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

      const res = await fetch("/api/vendors", {
        method,
        body: JSON.stringify(body),
      });

      if (res.ok) {
        router.refresh();
        alert(`Vendor ${initialData ? "updated" : "created"} successfully`);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl border border-gray-200 space-y-6 shadow-sm mb-10 text-gray-900">
      <h2 className="text-xl font-black tracking-tight">{initialData ? "Edit Vendor" : "Add Vendor"}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-2">Vendor Name</label>
          <input name="name" required defaultValue={initialData?.name} className="w-full border border-gray-200 rounded-lg p-3 text-sm font-medium" placeholder="Cloud Solutions Inc." />
        </div>
        <div>
          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-2">Type</label>
          <select name="type" defaultValue={initialData?.type} className="w-full border border-gray-200 rounded-lg p-3 text-sm font-medium bg-gray-50">
            <option value="Internal">Internal</option>
            <option value="External">External</option>
          </select>
        </div>
        <div>
          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-2">Contact Email</label>
          <input name="email" type="email" defaultValue={initialData?.email || ""} className="w-full border border-gray-200 rounded-lg p-3 text-sm font-medium" placeholder="support@vendor.com" />
        </div>
        <div>
          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-2">Contact Phone</label>
          <input name="phone" defaultValue={initialData?.phone || ""} className="w-full border border-gray-200 rounded-lg p-3 text-sm font-medium" placeholder="+1 800 VENDOR" />
        </div>
      </div>
      <button type="submit" disabled={loading} className="w-full py-4 bg-black text-white rounded-xl font-bold hover:bg-gray-800 transition-all shadow-lg disabled:opacity-50">
        {loading ? "Saving..." : initialData ? "Update Vendor" : "Add Vendor"}
      </button>
    </form>
  );
}
