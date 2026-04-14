"use client";

import { Vendor } from "@prisma/client";
import VendorForm from "@/components/forms/VendorForm";
import { useState, useEffect } from "react";

export default function AdminVendorsPage() {
  const [vendors, setVendors] = useState<any[]>([]);
  const [editingVendor, setEditingVendor] = useState<Vendor | null>(null);

  const fetchData = async () => {
    const res = await fetch("/api/vendors").then(r => r.json());
    setVendors(res);
  };

  useEffect(() => { fetchData(); }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure?")) return;
    await fetch(`/api/vendors?id=${id}`, { method: "DELETE" });
    fetchData();
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen text-gray-900">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-black mb-10 tracking-tighter uppercase text-gray-900">Vendor Management</h1>

        <VendorForm initialData={editingVendor} />

        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
          <table className="w-full text-left text-gray-900">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-xs font-bold text-gray-500 uppercase tracking-widest">
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Type</th>
                <th className="px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {vendors.map((v) => (
                <tr key={v.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-bold">{v.name}</td>
                  <td className="px-6 py-4 text-sm">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${v.type === "Internal" ? "bg-green-50 text-green-700 border border-green-100" : "bg-blue-50 text-blue-700 border border-blue-100"}`}>
                      {v.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm flex gap-4">
                    <button onClick={() => setEditingVendor(v)} className="text-gray-400 font-bold hover:text-black transition-colors">Edit</button>
                    <button onClick={() => handleDelete(v.id)} className="text-red-300 font-bold hover:text-red-600 transition-colors">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
