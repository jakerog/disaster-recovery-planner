"use client";

import { Exercise } from "@prisma/client";
import ExerciseForm from "@/components/forms/ExerciseForm";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function AdminExercisesPage() {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [editingExercise, setEditingExercise] = useState<Exercise | null>(null);

  const fetchData = async () => {
    const res = await fetch("/api/exercises").then(r => r.json());
    setExercises(res);
  };

  useEffect(() => { fetchData(); }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this exercise and all associated data?")) return;
    await fetch(`/api/exercises?id=${id}`, { method: "DELETE" });
    fetchData();
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen text-gray-900 font-sans">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-black mb-10 tracking-tighter uppercase leading-none">Exercise Master</h1>

        <ExerciseForm initialData={editingExercise || undefined} />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {exercises.map(e => (
            <div key={e.id} className="bg-white border border-gray-100 p-8 rounded-3xl hover:border-black transition-all cursor-pointer group shadow-sm flex flex-col">
              <div className="flex justify-between items-start mb-6">
                <div className="p-4 bg-gray-50 rounded-2xl group-hover:bg-gray-100 transition-colors font-black text-gray-400 tracking-tighter text-xs">EXE</div>
                <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-3 py-1 rounded-full uppercase tracking-widest border border-blue-100">{e.status}</span>
              </div>
              <h2 className="text-xl font-black text-gray-900 mb-2 leading-tight uppercase tracking-tight">{e.name}</h2>
              <div className="text-[10px] font-black text-gray-400 mb-8 uppercase tracking-widest flex flex-col gap-1">
                <span>START: {e.startDate ? new Date(e.startDate).toLocaleDateString() : "TBD"}</span>
                <span>END: {e.endDate ? new Date(e.endDate).toLocaleDateString() : "TBD"}</span>
              </div>

              <div className="mt-auto space-y-3">
                <div className="flex gap-2">
                   <Link href={`/admin/exercises/${e.id}/workflow`} className="flex-1 py-3 bg-gray-50 text-black border border-gray-100 rounded-xl text-[10px] font-black uppercase tracking-widest text-center hover:bg-gray-100">Workflow</Link>
                   <button onClick={() => setEditingExercise(e)} className="flex-1 py-3 bg-gray-50 text-black border border-gray-100 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-gray-100">Edit</button>
                </div>
                <button onClick={() => handleDelete(e.id)} className="w-full py-3 bg-red-50 text-red-600 border border-red-100 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-100">Terminate</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
