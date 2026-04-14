"use client";

import { Phase, Exercise } from "@prisma/client";
import { useState } from "react";

export default function AvailabilityForm({ phases, resourceId }: { phases: (Phase & { exercise: Exercise })[], resourceId: string }) {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);

    try {
      const promises = phases.map(phase => {
        const available = formData.get(`phase-${phase.id}`) === "yes";
        return fetch("/api/availability", {
          method: "POST",
          body: JSON.stringify({
            resourceId,
            phaseId: phase.id,
            exerciseId: phase.exerciseId,
            available,
            notes: "Checked in via portal"
          })
        });
      });

      await Promise.all(promises);
      setStatus("Successfully recorded your availability.");
      alert("Availability Saved");
    } catch (error) {
      console.error(error);
      setStatus("Failed to save availability.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {phases.map(phase => (
        <div key={phase.id} className="p-6 border border-gray-100 rounded-xl bg-gray-50 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full uppercase mb-1 inline-block">
              {phase.exercise.name}
            </span>
            <h3 className="text-lg font-bold text-gray-900">{phase.name}</h3>
          </div>
          <div className="flex gap-4">
            <label className="flex items-center gap-2 cursor-pointer bg-white px-4 py-2 rounded-lg border border-gray-200 hover:border-green-500 transition-colors">
              <input type="radio" name={`phase-${phase.id}`} value="yes" defaultChecked className="accent-green-600" />
              <span className="text-sm font-bold text-gray-700">Available</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer bg-white px-4 py-2 rounded-lg border border-gray-200 hover:border-red-500 transition-colors">
              <input type="radio" name={`phase-${phase.id}`} value="no" className="accent-red-600" />
              <span className="text-sm font-bold text-gray-700">Unavailable</span>
            </label>
          </div>
        </div>
      ))}

      <div>
        <button type="submit" disabled={loading} className="w-full py-4 bg-black text-white rounded-xl font-bold hover:bg-gray-800 transition-all shadow-lg disabled:opacity-50 uppercase tracking-widest text-xs">
          {loading ? "Syncing..." : "Confirm Presence"}
        </button>
        {status && <p className="mt-4 text-center text-sm font-bold text-green-600 uppercase tracking-tight">{status}</p>}
      </div>
    </form>
  );
}
