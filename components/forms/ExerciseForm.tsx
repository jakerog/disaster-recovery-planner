"use client";

import { Exercise } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function ExerciseForm({ initialData }: { initialData?: Exercise }) {
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

      const res = await fetch("/api/exercises", {
        method,
        body: JSON.stringify({
          ...body,
          startDate: data.startDate ? new Date(data.startDate as string) : null,
          endDate: data.endDate ? new Date(data.endDate as string) : null,
        }),
      });

      if (res.ok) {
        router.refresh();
        alert(`Exercise ${initialData ? "updated" : "created"} successfully`);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl border border-gray-200 space-y-6 shadow-sm mb-10">
      <h2 className="text-xl font-black tracking-tight">{initialData ? "Edit Exercise" : "Create New Exercise"}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-900">
        <div className="md:col-span-2">
          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-2">Exercise Name</label>
          <input name="name" required defaultValue={initialData?.name} className="w-full border border-gray-200 rounded-lg p-3 text-sm font-medium" placeholder="Global Switchover Q3" />
        </div>
        <div>
          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-2">Start Date</label>
          <input name="startDate" type="date" defaultValue={initialData?.startDate?.toISOString().split('T')[0]} className="w-full border border-gray-200 rounded-lg p-3 text-sm" />
        </div>
        <div>
          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-2">End Date</label>
          <input name="endDate" type="date" defaultValue={initialData?.endDate?.toISOString().split('T')[0]} className="w-full border border-gray-200 rounded-lg p-3 text-sm" />
        </div>
        <div>
          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-2">Status</label>
          <select name="status" defaultValue={initialData?.status} className="w-full border border-gray-200 rounded-lg p-3 text-sm font-bold bg-gray-50">
            <option value="Planned">Planned</option>
            <option value="In-Progress">In-Progress</option>
            <option value="On-Hold">On-Hold</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
      </div>
      <button type="submit" disabled={loading} className="w-full py-4 bg-black text-white rounded-xl font-bold hover:bg-gray-800 transition-all shadow-lg shadow-gray-100 disabled:opacity-50">
        {loading ? "Saving..." : initialData ? "Update Exercise" : "Initialize Exercise"}
      </button>
    </form>
  );
}
