"use client";

import { useState, useEffect } from "react";
import { Timer, CheckCircle2, ChevronRight, Activity, Shield, Play, Check, Clock, Maximize2, Minimize2 } from "lucide-react";
import BackButton from "@/components/ui/BackButton";

export default function TacticalMonitorClient({ exercise, session, initialAvailabilities }: any) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [activeStageId, setActiveStageId] = useState<string | null>(null);
  const [tasks, setTasks] = useState<any[]>([]);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsed, setElapsed] = useState(0);

  // Initialize tasks
  useEffect(() => {
    const allTasks = exercise.phases.flatMap((p: any) =>
      p.events.flatMap((e: any) =>
        e.stages.flatMap((s: any) => s.tasks.map((t: any) => ({ ...t, stageName: s.name, stageId: s.id })))
      )
    );
    setTasks(allTasks);

    // Resume timer if tasks are in progress
    const runningTask = allTasks.find((t: any) => t.status === "In-Progress");
    if (runningTask && runningTask.startDate) {
      setStartTime(new Date(runningTask.startDate).getTime());
    }
  }, [exercise]);

  // Global Timer logic
  useEffect(() => {
    let interval: any;
    if (startTime) {
      interval = setInterval(() => {
        setElapsed(Math.floor((Date.now() - startTime) / 1000));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [startTime]);

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleStartTask = async (taskId: string) => {
    const now = new Date();
    if (!startTime) setStartTime(now.getTime());

    const res = await fetch("/api/tasks", {
      method: "PATCH",
      body: JSON.stringify({
        id: tasks.find(t => t.taskId === taskId).id,
        status: "In-Progress",
        startDate: now.toISOString()
      })
    });

    if (res.ok) {
      const updated = await res.json();
      setTasks(prev => prev.map(t => t.id === updated.id ? { ...t, ...updated } : t));
    }
  };

  const handleFinishTask = async (taskId: string) => {
    const now = new Date();
    const task = tasks.find(t => t.taskId === taskId);

    const res = await fetch("/api/tasks", {
      method: "PATCH",
      body: JSON.stringify({
        id: task.id,
        status: "Completed",
        endDate: now.toISOString()
      })
    });

    if (res.ok) {
      const updated = await res.json();
      setTasks(prev => {
        const newTasks = prev.map(t => t.id === updated.id ? { ...t, ...updated } : t);
        // If this was the last task, stop timer?
        if (newTasks.every(t => t.status === "Completed" || t.status === "Cancelled")) {
          // Logic for stop timer could go here
        }
        return newTasks;
      });
    }
  };

  const calculateProgress = () => {
    const total = tasks.length;
    if (total === 0) return 0;
    const completed = tasks.filter(t => t.status === "Completed").length;
    return Math.round((completed / total) * 100);
  };

  const getStageResources = (stageId: string) => {
     const stage = exercise.phases.flatMap((p: any) => p.events.flatMap((e: any) => e.stages)).find((s: any) => s.id === stageId);
     return Array.from(new Set(stage?.tasks.flatMap((t: any) => t.resources) || []));
  };

  const isStageReady = (stageId: string) => {
     const resources = getStageResources(stageId);
     if (resources.length === 0) return true;
     return resources.every((r: any) => {
        const avail = initialAvailabilities.find((a: any) => a.resourceId === r.id && a.stageId === stageId);
        return avail?.available === true;
     });
  };

  return (
    <div className={`min-h-screen bg-gray-100 text-gray-900 font-sans transition-all ${isFullscreen ? 'fixed inset-0 z-[100] overflow-y-auto p-0' : 'pb-32'}`}>
      <nav className={`sticky top-0 z-50 clean-glass border-b border-white/50 px-8 py-4 flex justify-between items-center mb-12 ${isFullscreen ? 'bg-black text-white border-none rounded-none' : ''}`}>
         <div className="flex items-center gap-4">
            {!isFullscreen && <BackButton />}
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-lg ${isFullscreen ? 'bg-white text-black' : 'bg-black text-white'}`}>
               <Shield size={20} />
            </div>
            <div>
               <div className={`text-[10px] font-black uppercase tracking-[0.2em] leading-none mb-1 ${isFullscreen ? 'text-blue-400' : 'text-blue-600'}`}>Command node</div>
               <div className="text-sm font-black uppercase tracking-tighter">Sentinel Tactical Monitor</div>
            </div>
         </div>

         {startTime && (
           <div className="flex items-center gap-8 px-10 border-x border-white/10">
              <div className="flex flex-col items-center">
                 <span className="text-[8px] font-black uppercase tracking-widest opacity-50">Mission Time</span>
                 <span className="text-2xl font-black tabular-nums tracking-tight">{formatTime(elapsed)}</span>
              </div>
              <div className="w-48 h-2 bg-white/10 rounded-full overflow-hidden">
                 <div className="h-full bg-blue-500 transition-all duration-500" style={{ width: `${calculateProgress()}%` }}></div>
              </div>
           </div>
         )}

         <button
           onClick={() => setIsFullscreen(!isFullscreen)}
           className={`p-3 rounded-xl transition-all ${isFullscreen ? 'bg-white/10 hover:bg-white/20' : 'clean-card hover:scale-110'}`}
         >
            {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
         </button>
      </nav>

      <div className={`${isFullscreen ? 'w-full px-12' : 'max-w-7xl mx-auto px-8'}`}>
        {!isFullscreen && (
          <header className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-20 clean-card p-12 rounded-[4rem] border border-white">
            <div>
              <div className="flex items-center gap-3 mb-6">
                 <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse shadow-[0_0_15px_rgba(34,197,94,0.5)]"></div>
                 <span className="text-[12px] font-black text-gray-400 uppercase tracking-[0.5em] block">Mission Critical Stream</span>
              </div>
              <h1 className="text-7xl font-black tracking-tighter uppercase leading-[0.8] mb-4">{exercise.name}</h1>
            </div>
          </header>
        )}

        <div className="space-y-40">
          {exercise.phases.map((phase: any) => (
            <section key={phase.id}>
              <div className="flex items-center gap-8 mb-20 px-4">
                 <div className="w-20 h-20 clean-card rounded-[2rem] flex items-center justify-center font-black text-4xl text-blue-600 border border-white">
                   {phase.order}
                 </div>
                 <h2 className="text-5xl font-black uppercase tracking-tighter">{phase.name} Phase</h2>
              </div>

              <div className="grid grid-cols-1 gap-16">
                 {phase.events.map((event: any) => (
                   <div key={event.id} className="space-y-12">
                      <div className="flex items-center gap-4">
                         <div className="px-6 py-2 bg-black text-white text-xs font-black uppercase tracking-[0.2em] rounded-xl">Vector: {event.name}</div>
                         <div className="h-px flex-1 bg-gray-200"></div>
                      </div>

                      <div className="grid grid-cols-1 gap-12">
                         {event.stages.sort((a:any, b:any) => {
                            // Define order requirements
                            const orderMap: any = {
                               'Pre-Failover': 1, 'Failover-Application Shutdown': 2, 'Failover-Application Cutover': 3, 'Post-Failover': 4,
                               'Pre-Failback': 1, 'Failback-Application Shutdown': 2, 'Failback-Application Cutover': 3, 'Post-Failback': 4
                            };
                            return (orderMap[a.name] || 99) - (orderMap[b.name] || 99);
                         }).map((stage: any) => {
                            const ready = isStageReady(stage.id);
                            const isActive = activeStageId === stage.id;

                            return (
                              <div key={stage.id} className={`clean-card p-10 border-2 transition-all ${ready ? 'border-green-500 bg-green-50/20' : 'border-rose-500 bg-rose-50/10'}`}>
                                 <div className="flex justify-between items-center mb-10">
                                    <div>
                                       <h3 className={`text-3xl font-black uppercase tracking-tighter ${ready ? 'text-green-700' : 'text-rose-700'}`}>{stage.name}</h3>
                                       <span className={`text-[10px] font-black uppercase tracking-widest flex items-center gap-2 mt-1 ${ready ? 'text-green-600' : 'text-rose-600'}`}>
                                          {ready ? <><CheckCircle2 size={12} /> Ready to start</> : <><Activity size={12} /> Not ready to start</>}
                                       </span>
                                    </div>
                                    {ready && !isActive && (
                                      <button
                                        onClick={() => { setActiveStageId(stage.id); setIsFullscreen(true); }}
                                        className="clean-button py-4 px-10 text-xs flex items-center gap-3"
                                      >
                                         <Play size={16} fill="currentColor" /> START STAGE PROTOCOL
                                      </button>
                                    )}
                                 </div>

                                 <div className="grid grid-cols-1 gap-4">
                                    {tasks.filter(t => t.stageId === stage.id).map(task => {
                                       const isCompleted = task.status === "Completed";
                                       return (
                                         <div key={task.id} className={`p-6 rounded-3xl border transition-all flex items-center justify-between ${isCompleted ? 'bg-green-500 text-white border-green-600 shadow-lg' : 'bg-white border-gray-100 shadow-sm'}`}>
                                            <div className="flex items-center gap-6">
                                               <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-sm shadow-inner ${isCompleted ? 'bg-white/20' : 'bg-gray-50 text-blue-600'}`}>
                                                  {task.taskId}
                                               </div>
                                               <div>
                                                  <div className="font-black uppercase tracking-tight text-lg">{task.name || task.notes}</div>
                                                  <div className="flex items-center gap-4 mt-1 opacity-60">
                                                     <span className="text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5">
                                                        <Timer size={10} /> EST: {task.estimatedTime}m
                                                     </span>
                                                     {task.actualDuration && (
                                                       <span className="text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5">
                                                          <Clock size={10} /> ACT: {task.actualDuration}m
                                                       </span>
                                                     )}
                                                  </div>
                                               </div>
                                            </div>

                                            <div className="flex items-center gap-4">
                                               {!task.startDate ? (
                                                  <button onClick={() => handleStartTask(task.taskId)} className={`py-2.5 px-6 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 transition-all ${isCompleted ? 'bg-white/20 hover:bg-white/30' : 'bg-blue-600 text-white shadow-lg shadow-blue-200'}`}>
                                                     <Play size={12} fill="currentColor" /> Start
                                                  </button>
                                               ) : !task.endDate ? (
                                                  <button onClick={() => handleFinishTask(task.taskId)} className="bg-green-600 text-white py-2.5 px-6 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 shadow-lg animate-pulse">
                                                     <Check size={14} /> Finish
                                                  </button>
                                               ) : (
                                                  <div className="bg-white/20 py-2.5 px-6 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                                                     <CheckCircle2 size={14} /> COMPLETED
                                                  </div>
                                               )}
                                            </div>
                                         </div>
                                       );
                                    })}
                                 </div>
                              </div>
                            );
                         })}
                      </div>
                   </div>
                 ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
