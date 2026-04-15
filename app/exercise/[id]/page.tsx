import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Timer, CheckCircle2, AlertTriangle, FileText, User, Users, ChevronRight, Activity } from "lucide-react";
import Link from "next/link";

export default async function ExerciseExecutionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const exercise = await prisma.exercise.findUnique({
    where: { id },
    include: {
      phases: {
        orderBy: { order: "asc" },
        include: {
          events: {
            include: {
              stages: {
                include: {
                  tasks: {
                    orderBy: { taskId: "asc" },
                    include: { resources: true, team: true },
                  },
                },
              },
            },
          },
        },
      },
    },
  });

  if (!exercise) notFound();

  const hasFailures = exercise.phases.some(p => p.events.some(e => e.stages.some(s => s.tasks.some(t => t.status === "Failed"))));

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 font-sans pb-20">
      <div className="max-w-7xl mx-auto p-8">
        <header className="flex justify-between items-end mb-16 skeuo-card p-10 rounded-[3rem]">
          <div>
            <div className="flex items-center gap-3 mb-4">
               <Activity size={24} className="text-blue-500 animate-pulse" />
               <span className="text-[11px] font-black text-blue-600 uppercase tracking-[0.4em] block">Tactical Execution Monitor</span>
            </div>
            <h1 className="text-6xl font-black tracking-tighter uppercase leading-none">{exercise.name}</h1>
          </div>
          <div className="flex flex-col items-end gap-4">
            <div className="flex gap-3">
               {hasFailures && <span className="bg-red-600 text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest animate-pulse shadow-lg shadow-red-200">Rollback Triggered</span>}
               <span className="skeuo-button text-white px-5 py-2 rounded-full text-[11px] font-black uppercase tracking-widest">{exercise.status}</span>
            </div>
            <Link href={`/reports/${exercise.id}`} className="text-[11px] font-black uppercase tracking-widest hover:text-blue-600 transition-colors flex items-center gap-2">
               Full Analytics Dashboard <ChevronRight size={14} />
            </Link>
          </div>
        </header>

        <div className="space-y-32">
          {exercise.phases.map((phase) => {
             const isMock3 = phase.name === "Mock 3";
             const isHidden = isMock3 && !exercise.mock3Required;

             if (isHidden) return null;

             return (
               <section key={phase.id} className="relative">
                 <div className="absolute -left-12 top-0 bottom-0 w-px bg-gradient-to-b from-blue-500 to-transparent opacity-20"></div>

                 <div className="flex items-center gap-6 mb-16">
                    <div className="w-16 h-16 skeuo-card rounded-3xl flex items-center justify-center font-black text-3xl text-blue-600">
                      {phase.order}
                    </div>
                    <div>
                      <h2 className="text-4xl font-black uppercase tracking-tighter">{phase.name} Phase</h2>
                      <p className="text-[11px] font-black text-gray-400 uppercase tracking-[0.3em] mt-1">Operational Window Verification</p>
                    </div>
                 </div>

                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                   {phase.events.map((event) => (
                     <div key={event.id} className="skeuo-card p-8 rounded-[2.5rem]">
                        <div className="flex justify-between items-center mb-10 border-b border-gray-100 pb-6">
                           <h3 className="text-xl font-black uppercase tracking-tight flex items-center gap-3">
                             <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                             {event.name} Cycle
                           </h3>
                           <span className="text-[10px] font-bold text-gray-400 uppercase">{event.stages.length} Stages</span>
                        </div>

                        <div className="space-y-12">
                          {event.stages.sort((a,b) => {
                            const order = ["Pre-Failover", "Failover", "Post-Failover", "Failover-Rollback", "Pre-Failback", "Failback", "Post-Failback", "Failback-Rollback"];
                            return order.indexOf(a.name) - order.indexOf(b.name);
                          }).map((stage) => {
                            const isRollback = stage.name.toLowerCase().includes("rollback");
                            const isLocked = isRollback && !hasFailures;

                            return (
                              <div key={stage.id} className={`${isLocked ? "opacity-30 grayscale pointer-events-none" : "opacity-100"}`}>
                                <div className="flex items-center justify-between mb-6">
                                  <h4 className="text-sm font-black uppercase tracking-widest text-gray-800 flex items-center gap-2">
                                    {stage.name}
                                    {isLocked && <span className="text-[8px] bg-gray-200 px-2 py-0.5 rounded">LOCKED</span>}
                                  </h4>
                                  <span className="text-[9px] font-bold text-gray-400 uppercase tracking-tighter">
                                    {stage.tasks.filter(t => t.status === "Completed").length} / {stage.tasks.length} Done
                                  </span>
                                </div>

                                <div className="space-y-3">
                                  {stage.tasks.map((task) => (
                                    <div key={task.id} className="skeuo-inset p-4 flex items-center justify-between group hover:scale-[1.02] transition-transform">
                                       <div className="flex items-center gap-4">
                                          <div className="w-8 h-8 rounded-xl bg-white flex items-center justify-center shadow-sm text-[10px] font-black text-gray-400">
                                            {task.taskId.slice(-2)}
                                          </div>
                                          <div>
                                             <div className="text-[11px] font-black uppercase text-gray-900 leading-none mb-1">{task.notes}</div>
                                             <div className="text-[9px] font-bold text-gray-400 uppercase">{task.team?.name || "Global Ops"}</div>
                                          </div>
                                       </div>

                                       <div className="flex items-center gap-4">
                                          <div className="text-right">
                                             <div className="text-[10px] font-black text-gray-900">{task.estimatedTime}m</div>
                                             <div className={`text-[8px] font-bold uppercase ${
                                               task.status === "Completed" ? "text-green-500" :
                                               task.status === "In-Progress" ? "text-blue-500" : "text-gray-300"
                                             }`}>{task.status}</div>
                                          </div>
                                          <Link href={`/exercise/${id}/task/${task.taskId}`} className="p-2 skeuo-card rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                                             <FileText size={14} />
                                          </Link>
                                       </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                     </div>
                   ))}
                 </div>
               </section>
             );
          })}
        </div>
      </div>
    </div>
  );
}
