"use client";

import { Phase, Exercise } from "@prisma/client";
import { useState } from "react";

export default function AvailabilityForm({ phases }: { phases: (Phase & { exercise: Exercise })[] }) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);

    // Hardcoded user for demo
    const resourceId = "cm6p..."; // We'd get this from session

    try {
      // Logic for submitting multiple at once or just one
      alert("Availability data has been recorded (Simulated)");
      setSuccess(true);
    } catch (error) {
      console.error(error);
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
              <input type="radio" name={`phase-${phase.id}`} value="yes" className="accent-green-600" />
              <span className="text-sm font-bold text-gray-700">Available</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer bg-white px-4 py-2 rounded-lg border border-gray-200 hover:border-red-500 transition-colors">
              <input type="radio" name={`phase-${phase.id}`} value="no" className="accent-red-600" />
              <span className="text-sm font-bold text-gray-700">Unavailable</span>
            </label>
          </div>
        </div>
      ))}

      <button type="submit" disabled={loading} className="w-full py-4 bg-gray-900 text-white rounded-xl font-bold hover:bg-black transition-all shadow-lg shadow-gray-200 disabled:opacity-50">
        {loading ? "Saving..." : success ? "Availability Saved!" : "Confirm Availability"}
      </button>
    </form>
  );
}
