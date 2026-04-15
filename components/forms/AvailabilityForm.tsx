"use client";

import { Phase, Exercise, Event } from "@prisma/client";
import { useState } from "react";
import { CheckCircle2, XCircle, Clock, MapPin } from "lucide-react";

interface PhaseWithRelations extends Phase {
  exercise: Exercise;
  events: Event[];
}

export default function AvailabilityForm({ phases, resourceId }: { phases: PhaseWithRelations[], resourceId: string }) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);

    const availabilityData = phases.map(phase => ({
      resourceId,
      exerciseId: phase.exerciseId,
      phaseId: phase.id,
      available: formData.get(`avail_${phase.id}`) === "true",
      notes: formData.get(`notes_${phase.id}`) as string,
    }));

    await fetch("/api/availability", {
      method: "POST",
      body: JSON.stringify(availabilityData),
    });

    setLoading(false);
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-12">
      {phases.map((phase) => (
        <div key={phase.id} className="skeuo-inset p-8 border border-white/50 space-y-8">
          <div className="flex justify-between items-start">
             <div>
                <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest block mb-1">{phase.exercise.name}</span>
                <h3 className="text-2xl font-black uppercase tracking-tight text-black">{phase.name}</h3>
             </div>
             <div className="flex gap-4">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input type="radio" name={`avail_${phase.id}`} value="true" defaultChecked className="hidden peer" />
                  <div className="w-10 h-10 skeuo-card rounded-xl flex items-center justify-center text-gray-300 peer-checked:text-green-500 peer-checked:scale-110 transition-all border-none">
                    <CheckCircle2 size={24} />
                  </div>
                  <span className="text-[10px] font-black uppercase text-gray-400 peer-checked:text-black">Available</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input type="radio" name={`avail_${phase.id}`} value="false" className="hidden peer" />
                  <div className="w-10 h-10 skeuo-card rounded-xl flex items-center justify-center text-gray-300 peer-checked:text-red-500 peer-checked:scale-110 transition-all border-none">
                    <XCircle size={24} />
                  </div>
                  <span className="text-[10px] font-black uppercase text-gray-400 peer-checked:text-black">Unavailable</span>
                </label>
             </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-100">
             {phase.events.map(event => (
               <div key={event.id} className="bg-white/50 p-4 rounded-2xl flex items-center gap-4 border border-white">
                  <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center text-white shadow-lg">
                    <Clock size={16} />
                  </div>
                  <div>
                    <div className="text-[10px] font-black uppercase text-black">{event.name} Window</div>
                    <div className="text-[11px] font-bold text-gray-500 uppercase tracking-tighter">
                       {event.startDate ? new Date(event.startDate).toLocaleString() : "TBD"}
                    </div>
                  </div>
               </div>
             ))}
          </div>

          <div className="pt-2">
            <textarea
              name={`notes_${phase.id}`}
              placeholder="Operational constraints or specific availability notes..."
              className="w-full bg-white/40 border-none skeuo-inset p-4 text-xs font-bold text-gray-700 placeholder:text-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500/30 rounded-2xl min-h-[100px]"
            />
          </div>
        </div>
      ))}

      <button
        type="submit"
        disabled={loading}
        className="w-full skeuo-button text-white p-6 rounded-3xl font-black uppercase tracking-[0.5em] text-[12px] shadow-[0_20px_50px_rgba(0,0,0,0.3)] hover:scale-[1.01] active:scale-[0.98] transition-all"
      >
        {loading ? "Transmitting..." : success ? "Validation Successful" : "Commit Participation Profile"}
      </button>
    </form>
  );
}
