"use client";

import { Phase, Exercise, Event, Stage, Resource, Task, Availability } from "@prisma/client";
import { useState } from "react";
import { CheckCircle2, XCircle, Clock, Shield, ChevronRight, Activity } from "lucide-react";

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
      initial[`${a.phaseId}_${a.stageId || 'global'}`] = a.available;
    });
    return initial;
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const availabilityData: any[] = [];

    phases.forEach(phase => {
      // Global phase availability
      availabilityData.push({
        resourceId,
        exerciseId: phase.exerciseId,
        phaseId: phase.id,
        stageId: null,
        available: localAvail[`${phase.id}_global`] ?? true,
      });

      // Stage specific availability
      phase.events.forEach(event => {
        event.stages.forEach(stage => {
          availabilityData.push({
            resourceId,
            exerciseId: phase.exerciseId,
            phaseId: phase.id,
            stageId: stage.id,
            available: localAvail[`${phase.id}_${stage.id}`] ?? true,
          });
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

  const toggle = (phaseId: string, stageId: string | null, val: boolean) => {
    setLocalAvail(prev => ({
      ...prev,
      [`${phaseId}_${stageId || 'global'}`]: val
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
             <div className="flex gap-2">
                <ToggleButton
                  active={localAvail[`${phase.id}_global`] ?? true}
                  onToggle={(v) => toggle(phase.id, null, v)}
                  label="Phase Access"
                />
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
                      // A stage is ready if ALL resources assigned to tasks in that stage have confirmed availability for this stage.
                      // Note: We only have full visibility into OTHER resources via stage.availabilities (which we included in the query)
                      const otherAvails = stage.availabilities;
                      const allConfirmed = stageResources.every(r => {
                        if (r.id === resourceId) return localAvail[`${phase.id}_${stage.id}`] ?? true;
                        const record = otherAvails.find(a => a.resourceId === r.id);
                        return record ? record.available : true; // Default to true if no record yet
                      });

                      if (stageResources.length === 0) return null;

                      return (
                        <div key={stage.id} className={`clean-card p-8 border-2 transition-all ${allConfirmed ? 'border-green-500 bg-green-50/30' : 'border-white shadow-xl shadow-gray-100'}`}>
                           <div className="flex justify-between items-start mb-8">
                              <div>
                                 <h4 className={`text-lg font-black uppercase tracking-tight ${allConfirmed ? 'text-green-700' : 'text-black'}`}>
                                    {stage.name}
                                 </h4>
                                 {allConfirmed && (
                                   <span className="text-[9px] font-black text-green-600 uppercase tracking-widest flex items-center gap-1.5 mt-1">
                                      <Activity size={10} /> Ready to proceed
                                   </span>
                                 )}
                              </div>
                              <ToggleButton
                                active={localAvail[`${phase.id}_${stage.id}`] ?? true}
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
                                      ? (localAvail[`${phase.id}_${stage.id}`] ?? true)
                                      : (otherAvails.find(a => a.resourceId === r.id)?.available ?? true);

                                    return (
                                      <div key={r.id} className="flex items-center justify-between p-3 bg-white/50 rounded-xl border border-white">
                                         <div className="flex items-center gap-3">
                                            <div className={`w-2 h-2 rounded-full ${isConfirmed ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]' : 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]'}`}></div>
                                            <span className={`text-[11px] font-bold ${isMe ? 'text-blue-600' : 'text-gray-700'}`}>
                                               {r.fullName} {isMe && "(You)"}
                                            </span>
                                         </div>
                                         <span className={`text-[9px] font-black uppercase tracking-widest ${isConfirmed ? 'text-green-600' : 'text-red-600'}`}>
                                            {isConfirmed ? 'Confirmed' : 'Unavailable'}
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
      {label && <span className="text-[9px] font-black uppercase tracking-widest text-gray-400">{label}</span>}
    </div>
  );
}
