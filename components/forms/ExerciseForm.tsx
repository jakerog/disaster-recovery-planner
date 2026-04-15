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
        alert("Exercise Saved");
      }
    } catch (error) { console.error(error); } finally { setLoading(false); }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl border border-gray-200 space-y-6 shadow-sm mb-10 text-gray-900">
      <h2 className="text-xl font-black tracking-tight uppercase">{initialData ? "Edit Exercise" : "New Exercise"}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2">
          <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Name</label>
          <input name="name" required defaultValue={initialData?.name} className="w-full border p-2 rounded text-sm" />
        </div>
        <div>
          <label className="flex items-center gap-3 skeuo-inset p-3 cursor-pointer">
            <input type="checkbox" name="mock3Required" defaultChecked={initialData?.mock3Required} className="w-5 h-5 accent-black" />
            <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">Require Mock 3 Phase</span>
          </label>
        </div>
        <div>
          <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Start</label>
          <input name="startDate" type="date" defaultValue={initialData?.startDate?.toISOString().split('T')[0]} className="w-full border p-2 rounded text-sm" />
        </div>
        <div>
          <label className="flex items-center gap-3 skeuo-inset p-3 cursor-pointer">
            <input type="checkbox" name="mock3Required" defaultChecked={initialData?.mock3Required} className="w-5 h-5 accent-black" />
            <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">Require Mock 3 Phase</span>
          </label>
        </div>
        <div>
          <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">End</label>
          <input name="endDate" type="date" defaultValue={initialData?.endDate?.toISOString().split('T')[0]} className="w-full border p-2 rounded text-sm" />
        </div>
        <div>
          <label className="flex items-center gap-3 skeuo-inset p-3 cursor-pointer">
            <input type="checkbox" name="mock3Required" defaultChecked={initialData?.mock3Required} className="w-5 h-5 accent-black" />
            <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">Require Mock 3 Phase</span>
          </label>
        </div>
        <div>
          <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Status</label>
          <select name="status" defaultValue={initialData?.status} className="w-full border p-2 rounded text-sm">
            <option>Planned</option><option>In-Progress</option><option>On-Hold</option><option>Completed</option><option>Cancelled</option>
          </select>
        </div>
        <div>
          <label className="flex items-center gap-3 skeuo-inset p-3 cursor-pointer">
            <input type="checkbox" name="mock3Required" defaultChecked={initialData?.mock3Required} className="w-5 h-5 accent-black" />
            <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">Require Mock 3 Phase</span>
          </label>
        </div>
        <div>
          <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Logo URL</label>
          <input name="photo" defaultValue={initialData?.photo || ""} className="w-full border p-2 rounded text-sm" />
        </div>
        <div className="md:col-span-2">
          <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Notes</label>
          <textarea name="notes" defaultValue={initialData?.notes || ""} className="w-full border p-2 rounded text-sm" />
        </div>
      </div>
      <button type="submit" disabled={loading} className="w-full py-4 bg-black text-white rounded font-bold uppercase tracking-widest">
        {loading ? "Processing..." : "Save Exercise"}
      </button>
    </form>
  );
}
