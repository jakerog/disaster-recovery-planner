"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { Shield, ChevronRight, Activity, Calendar, Clock, Plus, Zap, Trash2, ArrowLeft, MoreHorizontal, Settings, GripVertical, FileText } from "lucide-react";
import Link from "next/link";
import SortableStageList from "@/components/workflow/SortableStageList";
import BackButton from "@/components/ui/BackButton";
import TaskManagementList from "@/components/workflow/TaskManagementList";

export default function WorkflowManagementPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: exerciseId } = use(params);
  const router = useRouter();
  const [exercise, setExercise] = useState<any>(null);
  const [teams, setTeams] = useState<any[]>([]);
  const [resources, setResources] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchWorkflow = async () => {
    setLoading(true);
    const res = await fetch(`/api/exercises`);
    const data = await res.json();
    const found = data.find((e: any) => e.id === exerciseId);

    // Sort phases by order
    if (found?.phases) {
      found.phases.sort((a: any, b: any) => a.order - b.order);
      // Sort stages within events
      found.phases.forEach((p: any) => {
        p.events?.forEach((e: any) => {
          e.stages?.sort((a: any, b: any) => a.order - b.order);
        });
      });
    }

    setExercise(found);

    // Fetch teams and resources for task management
    const [teamsRes, resourcesRes] = await Promise.all([
      fetch("/api/teams"),
      fetch("/api/resources")
    ]);
    const teamsData = await teamsRes.json();
    const resourcesData = await resourcesRes.json();

    setTeams(teamsData);
    setResources(resourcesData);

    setLoading(false);
  };

  useEffect(() => { fetchWorkflow(); }, []);

  const addPhase = async () => {
    const name = prompt("Operational Phase Designation (e.g. Mock 3)?");
    if (!name) return;
    const start = prompt("Commencement Window (YYYY-MM-DD HH:MM)?");
    const end = prompt("Resolution Window (YYYY-MM-DD HH:MM)?");

    await fetch("/api/phases", {
      method: "POST",
      body: JSON.stringify({
        name,
        order: (exercise?.phases?.length || 0) + 1,
        exerciseId,
        startDate: start ? new Date(start) : null,
        endDate: end ? new Date(end) : null
      })
    });
    fetchWorkflow();
  };

  const addEvent = async (phaseId: string) => {
    const name = prompt("Vector Type (Failover / Failback)?");
    if (!name) return;
    await fetch("/api/events", {
      method: "POST",
      body: JSON.stringify({ name, phaseId })
    });
    fetchWorkflow();
  };

  const editEvent = async (event: any) => {
    const name = prompt("Redesignate Vector?", event.name);
    if (!name) return;
    await fetch("/api/events", {
      method: "PATCH",
      body: JSON.stringify({ id: event.id, name })
    });
    fetchWorkflow();
  };

  const deleteEvent = async (id: string) => {
    if (!confirm("PROTOCOL WARNING: This action will purge all associated stages and tasks. Proceed?")) return;
    await fetch(`/api/events?id=${id}`, { method: "DELETE" });
    fetchWorkflow();
  };

  const addStage = async (eventId: string, currentStages: any[]) => {
    const name = prompt("Stage Designation?");
    if (!name) return;
    await fetch("/api/stages", {
      method: "POST",
      body: JSON.stringify({
        name,
        exerciseId,
        eventId,
        order: currentStages.length
      })
    });
    fetchWorkflow();
  };

  const editStage = async (stage: any) => {
    const name = prompt("Redesignate Stage?", stage.name);
    if (!name) return;
    await fetch("/api/stages", {
      method: "PATCH",
      body: JSON.stringify({ id: stage.id, name })
    });
    fetchWorkflow();
  };

  const deleteStage = async (id: string) => {
    if (!confirm("PROTOCOL WARNING: PURGING STAGE WILL ERASE ALL SEQUENTIAL TASKS. AUTHORIZE?")) return;
    await fetch(`/api/stages?id=${id}`, { method: "DELETE" });
    fetchWorkflow();
  };

  const handleReorderStages = async (eventId: string, newStages: any[]) => {
    // Update local state for immediate feedback
    const updatedExercise = { ...exercise };
    updatedExercise.phases.forEach((p: any) => {
      p.events?.forEach((e: any) => {
        if (e.id === eventId) {
          e.stages = newStages;
        }
      });
    });
    setExercise(updatedExercise);

    // Persist reorder
    await Promise.all(newStages.map((stage, index) =>
      fetch("/api/stages", {
        method: "PATCH",
        body: JSON.stringify({ id: stage.id, order: index })
      })
    ));
  };

  if (loading) return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
       <p className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-400 animate-pulse">Synchronizing Workflow Matrix...</p>
    </div>
  );

  return (
    <div className="p-4 md:p-12 lg:p-20 bg-slate-50 min-h-screen text-slate-900 font-sans selection:bg-blue-100">
      <div className="max-w-6xl mx-auto">
        <nav className="mb-16 flex items-center justify-between">
           <div className="flex items-center gap-4">
              <BackButton />
              <Link href="/admin/exercises" className="clean-button-secondary py-3 px-6 flex items-center gap-3">
                 <ArrowLeft size={16} /> <span className="text-[11px] font-black uppercase tracking-widest">Exercise Registry</span>
              </Link>
           </div>
           <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-100 ring-4 ring-white">
                 <Settings size={22} />
              </div>
              <div>
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-tight">Configuration Mode</p>
                 <p className="text-sm font-black text-slate-900 uppercase">Sentinel Workflow Node</p>
              </div>
           </div>
        </nav>

        <header className="mb-20 clean-card p-12 md:p-16 border-white shadow-2xl shadow-slate-200/50">
          <div className="flex items-center gap-3 mb-6">
             <div className="w-2 h-2 rounded-full bg-blue-500 animate-ping"></div>
             <span className="text-[10px] font-black text-blue-600 uppercase tracking-[0.4em]">Active Directive</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase leading-[0.85] text-slate-900 mb-8">{exercise?.name}</h1>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-8 border-t border-slate-50">
             <div className="flex flex-col gap-1">
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Exercise Status</span>
                <span className="text-sm font-black text-slate-900 uppercase tracking-tight flex items-center gap-2">
                   <Activity size={14} className="text-blue-500" /> {exercise?.status}
                </span>
             </div>
             <div className="flex flex-col gap-1">
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Workflow Scale</span>
                <span className="text-sm font-black text-slate-900 uppercase tracking-tight flex items-center gap-2">
                   <Zap size={14} className="text-blue-500" /> {exercise?.phases?.length} Phases Configured
                </span>
             </div>
             <div className="flex flex-col gap-1">
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Timeline Alignment</span>
                <span className="text-sm font-black text-slate-900 uppercase tracking-tight flex items-center gap-2">
                   <Calendar size={14} className="text-blue-500" /> {exercise?.startDate ? new Date(exercise.startDate).toLocaleDateString() : 'TBD'}
                </span>
             </div>
          </div>
        </header>

        <div className="space-y-32">
          {exercise?.phases?.map((phase: any) => (
            <section key={phase.id} className="relative group">
              <div className="absolute -left-12 top-0 bottom-0 w-px bg-gradient-to-b from-blue-500 via-slate-200 to-transparent opacity-30"></div>

              <div className="flex items-center justify-between mb-16 px-4">
                 <div className="flex items-center gap-8">
                    <div className="w-20 h-20 clean-card rounded-[2.5rem] flex items-center justify-center font-black text-4xl text-blue-600 border border-white shadow-xl shadow-blue-50 group-hover:scale-105 transition-transform">
                      {phase.order}
                    </div>
                    <div>
                      <h2 className="text-5xl font-black uppercase tracking-tighter text-slate-900">{phase.name} Phase</h2>
                      <div className="flex items-center gap-4 mt-2">
                         <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] flex items-center gap-2">
                            <Clock size={10} /> {phase.startDate ? new Date(phase.startDate).toLocaleDateString() : 'WINDOW PENDING'}
                         </span>
                         <span className="text-[9px] text-slate-300">•</span>
                         <button className="text-[10px] font-black text-blue-500 uppercase tracking-widest hover:text-black transition-colors">Adjust Window</button>
                      </div>
                    </div>
                 </div>
                 <div className="flex gap-4">
                    <button onClick={() => addEvent(phase.id)} className="clean-button py-3 px-8 text-[10px] uppercase tracking-widest flex items-center gap-2 shadow-blue-200">
                       <Plus size={14} /> Add Vector
                    </button>
                    <button className="p-3 clean-inset bg-white border-white rounded-2xl text-slate-300 hover:text-rose-500 transition-colors">
                       <Trash2 size={18} />
                    </button>
                 </div>
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-2 gap-12">
                {phase.events?.map((event: any) => (
                  <div key={event.id} className="clean-card p-10 md:p-14 rounded-[3.5rem] border border-white shadow-xl shadow-slate-100/50 group/event">
                    <div className="flex justify-between items-center mb-12 border-b border-slate-50 pb-8">
                       <div className="flex flex-col gap-2">
                          <div className="flex items-center gap-4">
                             <h3 className="text-3xl font-black uppercase tracking-tighter text-slate-900 flex items-center gap-3">
                               <div className="w-3 h-3 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]"></div>
                               {event.name}
                             </h3>
                             <div className="flex gap-2 opacity-0 group-hover/event:opacity-100 transition-opacity">
                                <button onClick={() => editEvent(event)} className="p-1.5 rounded-lg hover:bg-slate-50 text-slate-300 hover:text-blue-500 transition-colors">
                                   <Activity size={14} />
                                </button>
                                <button onClick={() => deleteEvent(event.id)} className="p-1.5 rounded-lg hover:bg-rose-50 text-slate-300 hover:text-rose-500 transition-colors">
                                   <Trash2 size={14} />
                                </button>
                             </div>
                          </div>
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                             <Activity size={10} /> {event.stages?.length || 0} Operational Stages
                          </span>
                       </div>
                       <button onClick={() => addStage(event.id, event.stages)} className="p-4 clean-inset bg-slate-50 hover:bg-white border-none rounded-2xl text-blue-600 hover:scale-110 transition-all shadow-sm">
                          <Plus size={20} strokeWidth={3} />
                       </button>
                    </div>

                    <SortableStageList
                       stages={event.stages || []}
                       onReorder={(newStages: any[]) => handleReorderStages(event.id, newStages)}
                       onEdit={editStage}
                       onDelete={deleteStage}
                    />

                    <div className="mt-12 pt-8 border-t border-slate-50 flex justify-between items-center">
                       <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Sequential Order Protocol</span>
                       <Link href={`/exercise/${exercise.id}`} className="text-[10px] font-black text-blue-500 uppercase tracking-widest hover:underline flex items-center gap-2">
                          View Execution Stream <ChevronRight size={10} />
                       </Link>
                    </div>
                  </div>
                ))}

                {phase.events?.length === 0 && (
                   <div className="clean-inset border-dashed p-16 text-center col-span-2">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">No Operational Vectors Initialized</p>
                      <button onClick={() => addEvent(phase.id)} className="clean-button py-3 px-8 text-[10px] uppercase tracking-widest">Initialize Vector</button>
                   </div>
                )}
              </div>
            </section>
          ))}

          <button onClick={addPhase} className="w-full py-10 clean-card border-dashed bg-slate-50/50 hover:bg-white text-slate-400 font-black uppercase tracking-[0.5em] text-[13px] hover:border-blue-500 hover:text-blue-600 transition-all group shadow-inner">
            <span className="group-hover:scale-110 inline-block transition-transform">+ Append Strategic Phase</span>
          </button>
        </div>

        <TaskManagementList
           exerciseId={exerciseId}
           stages={exercise?.phases?.flatMap((p: any) => p.events?.flatMap((e: any) => e.stages || []) || []) || []}
           teams={teams}
           resources={resources}
        />

        <footer className="mt-40 pt-12 border-t border-slate-100 text-center pb-20">
           <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.5em]">Sentinel Global Resilience Orchestrator v2.0</p>
        </footer>
      </div>
    </div>
  );
}
