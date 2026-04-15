import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Timer, CheckCircle2, AlertTriangle, FileText, User, Users, ChevronRight, Activity, Shield, LogOut } from "lucide-react";
import Link from "next/link";
import { auth } from "@/auth";

export default async function ExerciseExecutionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth();

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
    <div className="min-h-screen bg-gray-100 text-gray-900 font-sans pb-32">
      <nav className="sticky top-0 z-50 clean-glass border-b border-white/50 px-8 py-4 flex justify-between items-center mb-12">
         <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center text-white shadow-lg">
               <Shield size={20} />
            </div>
            <div>
               <div className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600 leading-none mb-1">Command node</div>
               <div className="text-sm font-black uppercase tracking-tighter">Sentinel Tactical Monitor</div>
            </div>
         </div>
         <div className="flex items-center gap-8">
            <div className="text-right hidden sm:block">
               <div className="text-[10px] font-black uppercase tracking-widest text-gray-400">Operator</div>
               <div className="text-[11px] font-black uppercase tracking-tight">{session?.user?.name}</div>
            </div>
            <Link href="/" className="p-3 clean-card rounded-xl hover:scale-110 transition-transform">
               <LogOut size={16} className="text-red-500" />
            </Link>
         </div>
      </nav>

      <div className="max-w-7xl mx-auto px-8">
        <header className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-20 clean-card p-12 rounded-[4rem] border border-white">
          <div>
            <div className="flex items-center gap-3 mb-6">
               <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse shadow-[0_0_15px_rgba(34,197,94,0.5)]"></div>
               <span className="text-[12px] font-black text-gray-400 uppercase tracking-[0.5em] block">Mission Critical Stream</span>
            </div>
            <h1 className="text-7xl font-black tracking-tighter uppercase leading-[0.8] mb-4">{exercise.name}</h1>
          </div>
          <div className="flex flex-col items-end gap-6 mt-8 lg:mt-0">
            <div className="flex gap-4">
               {hasFailures && <span className="bg-red-600 text-white px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.3em] animate-pulse shadow-[0_10px_30px_rgba(220,38,38,0.3)]">Rollback Protocols Active</span>}
               <span className="clean-button text-white px-8 py-2.5 rounded-full text-[12px] font-black uppercase tracking-[0.3em]">{exercise.status}</span>
            </div>
            <Link href={`/reports/${exercise.id}`} className="clean-inset px-6 py-3 rounded-2xl text-[11px] font-black uppercase tracking-[0.3em] hover:text-blue-600 transition-all flex items-center gap-3 border border-white">
               Technical Dossier <ChevronRight size={14} />
            </Link>
          </div>
        </header>

        <div className="space-y-40">
          {exercise.phases.map((phase) => {
             const isMock3 = phase.name === "Mock 3";
             const isHidden = isMock3 && !exercise.mock3Required;

             if (isHidden) return null;

             return (
               <section key={phase.id} className="relative">
                 <div className="absolute -left-12 top-0 bottom-0 w-px bg-gradient-to-b from-blue-500 via-gray-200 to-transparent opacity-30"></div>

                 <div className="flex items-center gap-8 mb-20 px-4">
                    <div className="w-20 h-20 clean-card rounded-[2rem] flex items-center justify-center font-black text-4xl text-blue-600 border border-white">
                      {phase.order}
                    </div>
                    <div>
                      <h2 className="text-5xl font-black uppercase tracking-tighter">{phase.name} Phase</h2>
                      <p className="text-[12px] font-black text-gray-400 uppercase tracking-[0.4em] mt-2 italic">Standardized Recovery Sequence</p>
                    </div>
                 </div>

                 <div className="grid grid-cols-1 xl:grid-cols-2 gap-16">
                   {phase.events.map((event) => (
                     <div key={event.id} className="clean-card p-12 rounded-[3.5rem] border border-white">
                        <div className="flex justify-between items-center mb-12 border-b border-gray-100 pb-8">
                           <h3 className="text-3xl font-black uppercase tracking-tighter flex items-center gap-4">
                             <div className="w-4 h-4 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]"></div>
                             {event.name}
                           </h3>
                           <div className="flex flex-col items-end">
                              <span className="text-[10px] font-black text-black uppercase tracking-widest">{event.stages.length} Operational Stages</span>
                              <span className="text-[9px] font-bold text-gray-400 uppercase">{event.startDate ? new Date(event.startDate).toLocaleDateString() : "Pending"}</span>
                           </div>
                        </div>

                        <div className="space-y-16">
                          {event.stages.sort((a,b) => {
                            const order = ["Pre-Failover", "Failover", "Post-Failover", "Failover-Rollback", "Pre-Failback", "Failback", "Post-Failback", "Failback-Rollback"];
                            return order.indexOf(a.name) - order.indexOf(b.name);
                          }).map((stage) => {
                            const isRollback = stage.name.toLowerCase().includes("rollback");
                            const isLocked = isRollback && !hasFailures;

                            return (
                              <div key={stage.id} className={`${isLocked ? "opacity-20 grayscale pointer-events-none" : "opacity-100"}`}>
                                <div className="flex items-center justify-between mb-8">
                                  <h4 className="text-[11px] font-black uppercase tracking-[0.3em] text-gray-400 flex items-center gap-3">
                                    <ChevronRight size={12} className="text-blue-500" />
                                    {stage.name}
                                    {isLocked && <span className="text-[9px] bg-gray-100 border border-white px-3 py-0.5 rounded-full text-gray-300">SECURE_LOCK</span>}
                                  </h4>
                                </div>

                                <div className="space-y-4">
                                  {stage.tasks.sort((a, b) => a.taskId.localeCompare(b.taskId)).map((task) => (
                                    <div key={task.id} className="clean-inset p-5 flex items-center justify-between group hover:scale-[1.01] transition-all border border-white/50">
                                       <div className="flex items-center gap-5">
                                          <div className="w-10 h-10 rounded-2xl clean-card border-none flex items-center justify-center text-[11px] font-black text-blue-600 shadow-md">
                                            {task.taskId.slice(-3)}
                                          </div>
                                          <div>
                                             <div className="text-[12px] font-black uppercase text-black leading-none mb-1.5 tracking-tight">{task.notes}</div>
                                             <div className="flex items-center gap-3">
                                                <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1">
                                                   <Users size={8} /> {task.team?.name || "Global Ops"}
                                                </span>
                                                <span className="text-[9px] font-black text-gray-300 uppercase tracking-widest">•</span>
                                                <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1">
                                                   <Timer size={8} /> {task.estimatedTime}m window
                                                </span>
                                             </div>
                                          </div>
                                       </div>

                                       <div className="flex items-center gap-6">
                                          <div className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                                            task.status === "Completed" ? "bg-green-50 text-green-600 border-green-100" :
                                            task.status === "In-Progress" ? "bg-blue-50 text-blue-600 border-blue-100 animate-pulse" :
                                            task.status === "Failed" ? "bg-red-50 text-red-600 border-red-100" : "bg-gray-50 text-gray-400 border-gray-100"
                                          }`}>{task.status}</div>

                                          <Link href={`/exercise/${id}/task/${task.taskId}`} className="p-2.5 clean-card border-none rounded-xl opacity-0 group-hover:opacity-100 transition-all hover:scale-110">
                                             <FileText size={16} className="text-black" />
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
