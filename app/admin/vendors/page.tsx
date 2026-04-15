"use client";

import { Vendor, Exercise } from "@prisma/client";
import VendorForm from "@/components/forms/VendorForm";
import { useState, useEffect } from "react";

export default function AdminVendorsPage() {
  const [vendors, setVendors] = useState<any[]>([]);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [editingVendor, setEditingVendor] = useState<Vendor | null>(null);

  const fetchData = async () => {
    const [resV, resE] = await Promise.all([
      fetch("/api/vendors").then(r => r.json()),
      fetch("/api/exercises").then(r => r.json()),
    ]);
    setVendors(resV);
    setExercises(resE);
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
        <h1 className="text-3xl font-black mb-10 tracking-tighter uppercase">Vendor Management</h1>
        <VendorForm initialData={editingVendor} exercises={exercises} />
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm text-gray-900">
          <table className="w-full text-left">
            <tbody className="divide-y divide-gray-100">
              {vendors.map((v) => (
                <tr key={v.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-bold">{v.name} ({v.type})</td>
                  <td className="px-6 py-4 text-sm flex gap-4">
                    <button onClick={() => setEditingVendor(v)} className="text-black font-bold">Edit</button>
                    <button onClick={() => handleDelete(v.id)} className="text-red-600 font-bold">Delete</button>
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
