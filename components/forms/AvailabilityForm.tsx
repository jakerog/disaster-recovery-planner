"use client";

import { Phase, Exercise, Event, Stage, Resource, Task, Availability } from "@prisma/client";
import { useState } from "react";
import { CheckCircle2, XCircle, Clock, Shield, ChevronRight, Activity, Zap } from "lucide-react";

interface StageWithRelations extends Stage {
  tasks: (Task & { resources: Resource[] })[];
  availabilities: (Availability & { resource: Resource })[];
}

interface EventWithRelations extends Event {
  stages: StageWithRelations[];
}

interface PhaseWithRelations extends Phase {
  exercise: Exercise;
  events: EventWithRelations[];
}

export default function AvailabilityForm({
  phases,
  resourceId,
  initialAvailabilities
}: {
  phases: PhaseWithRelations[],
  resourceId: string,
  initialAvailabilities: any[]
}) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Track local toggle state for immediate "Ready to proceed" logic
  // key: phaseId_stageId
  const [localAvail, setLocalAvail] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    initialAvailabilities.forEach(a => {
      // Defaulting to FALSE (Red) as per requirement: "default status 'Not Confirmed'/Red toggle"
      if (a.stageId) {
        initial[`${a.phaseId}_${a.stageId}`] = a.available;
      }
    });
    return initial;
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const availabilityData: any[] = [];

    phases.forEach(phase => {
      phase.events.forEach(event => {
        event.stages.forEach(stage => {
          // Only sync if I am assigned to this stage
          const isMeAssigned = stage.tasks.some(t => t.resources.some(r => r.id === resourceId));
          if (isMeAssigned) {
            availabilityData.push({
              resourceId,
              exerciseId: phase.exerciseId,
              phaseId: phase.id,
              stageId: stage.id,
              available: localAvail[`${phase.id}_${stage.id}`] ?? false,
            });
          }
        });
      });
    });

    await fetch("/api/availability", {
      method: "POST",
      body: JSON.stringify(availabilityData),
    });

    setLoading(false);
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  };

  const toggle = (phaseId: string, stageId: string, val: boolean) => {
    setLocalAvail(prev => ({
      ...prev,
      [`${phaseId}_${stageId}`]: val
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-20">
      {phases.map((phase) => (
        <div key={phase.id} className="space-y-10">
          <header className="flex justify-between items-end border-b-2 border-black pb-6">
             <div>
                <span className="text-[10px] font-black text-blue-600 uppercase tracking-[0.4em] block mb-2">{phase.exercise.name}</span>
                <h3 className="text-4xl font-black uppercase tracking-tighter text-black">{phase.name} Phase</h3>
             </div>
          </header>

          <div className="grid grid-cols-1 gap-12">
             {phase.events.map(event => (
               <div key={event.id} className="space-y-8">
                  <div className="flex items-center gap-4">
                     <div className="px-4 py-1 bg-black text-white text-[10px] font-black uppercase tracking-widest rounded-lg">
                        Vector: {event.name}
                     </div>
                     <div className="h-px flex-1 bg-gray-100"></div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {event.stages.map(stage => {
                      const stageResources = Array.from(new Set(stage.tasks.flatMap(t => t.resources)));
                      const isMeAssigned = stageResources.some(r => r.id === resourceId);

                      // Calculate "Ready to proceed" logic
                      // A stage is ready if ALL resources assigned to tasks in that stage have confirmed availability.
                      const otherAvails = stage.availabilities;
                      const allConfirmed = stageResources.length > 0 && stageResources.every(r => {
                        if (r.id === resourceId) return localAvail[`${phase.id}_${stage.id}`] ?? false;
                        const record = otherAvails.find(a => a.resourceId === r.id);
                        return record ? record.available : false; // Default to false
                      });

                      if (stageResources.length === 0) return null;

                      return (
                        <div key={stage.id} className={`clean-card p-8 border-2 transition-all ${allConfirmed ? 'border-green-500 bg-green-50/30 shadow-[0_20px_50px_rgba(34,197,94,0.1)]' : 'border-rose-500 bg-rose-50/10 shadow-xl shadow-gray-100'}`}>
                           <div className="flex justify-between items-start mb-8">
                              <div>
                                 <h4 className={`text-lg font-black uppercase tracking-tight ${allConfirmed ? 'text-green-700' : 'text-rose-700'}`}>
                                    {stage.name}
                                 </h4>
                                 <span className={`text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5 mt-1 ${allConfirmed ? 'text-green-600' : 'text-rose-600'}`}>
                                    {allConfirmed ? <><Activity size={10} /> Ready To Proceed</> : <><Zap size={10} /> Not Ready To Proceed</>}
                                 </span>
                              </div>
                              <ToggleButton
                                active={localAvail[`${phase.id}_${stage.id}`] ?? false}
                                onToggle={(v) => toggle(phase.id, stage.id, v)}
                                disabled={!isMeAssigned}
                              />
                           </div>

                           <div className="space-y-4">
                              <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Assigned Agent Matrix</p>
                              <div className="grid grid-cols-1 gap-2">
                                 {stageResources.map(r => {
                                    const isMe = r.id === resourceId;
                                    const isConfirmed = isMe
                                      ? (localAvail[`${phase.id}_${stage.id}`] ?? false)
                                      : (otherAvails.find(a => a.resourceId === r.id)?.available ?? false);

                                    return (
                                      <div key={r.id} className="flex items-center justify-between p-3 bg-white/50 rounded-xl border border-white">
                                         <div className="flex items-center gap-3">
                                            <div className={`w-2 h-2 rounded-full ${isConfirmed ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]' : 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]'}`}></div>
                                            <span className={`text-[11px] font-bold ${isMe ? 'text-blue-600' : 'text-gray-700'}`}>
                                               {r.fullName} {isMe && "(You)"}
                                            </span>
                                         </div>
                                         <span className={`text-[9px] font-black uppercase tracking-widest ${isConfirmed ? 'text-green-600' : 'text-red-600'}`}>
                                            {isConfirmed ? 'Confirmed' : 'Not Confirmed'}
                                         </span>
                                      </div>
                                    );
                                 })}
                              </div>
                           </div>
                        </div>
                      );
                    })}
                  </div>
               </div>
             ))}
          </div>
        </div>
      ))}

      <div className="sticky bottom-8 z-50">
        <button
          type="submit"
          disabled={loading}
          className="w-full clean-button text-white p-8 rounded-[2.5rem] font-black uppercase tracking-[0.6em] text-[14px] shadow-[0_30px_70px_rgba(0,0,0,0.4)] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-4"
        >
          {loading ? "Synchronizing Protocols..." : success ? "Protocols Validated" : "Synchronize Availability Matrix"}
        </button>
      </div>
    </form>
  );
}

function ToggleButton({ active, onToggle, label, disabled = false }: { active: boolean, onToggle: (v: boolean) => void, label?: string, disabled?: boolean }) {
  if (disabled) return (
    <div className="opacity-30 grayscale cursor-not-allowed flex flex-col items-center">
       <div className="w-12 h-6 bg-gray-200 rounded-full"></div>
       {label && <span className="text-[8px] font-black uppercase mt-1 text-gray-400">{label}</span>}
    </div>
  );

  return (
    <div className="flex flex-col items-center gap-1.5">
      <button
        type="button"
        onClick={() => onToggle(!active)}
        className={`relative w-14 h-7 rounded-full transition-all duration-300 ${active ? 'bg-green-500 shadow-[0_0_15px_rgba(34,197,94,0.3)]' : 'bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.3)]'}`}
      >
        <div className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow-lg transition-all duration-300 ${active ? 'left-8' : 'left-1'}`}></div>
      </button>
      <span className="text-[9px] font-black uppercase tracking-widest text-gray-400">{active ? "Confirmed" : "Unavailable"}</span>
    </div>
  );
}
