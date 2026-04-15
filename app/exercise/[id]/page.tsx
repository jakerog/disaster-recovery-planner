import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Timer, CheckCircle2, AlertTriangle, FileText, User, Users } from "lucide-react";
import Link from "next/link";

export default async function ExerciseExecutionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const exercise = await prisma.exercise.findUnique({
    where: { id },
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
  });

  if (!exercise) notFound();

  const hasFailures = exercise.stages.some(s => s.tasks.some(t => t.status === "Failed"));

  const sortedStages = exercise.stages.sort((a, b) => {
    const order = ["Pre-Failover", "Failover", "Post-Failover", "Failover-Rollback", "Pre-Failback", "Failback", "Post-Failback", "Failback-Rollback"];
    return order.indexOf(a.name) - order.indexOf(b.name);
  });

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans">
      <div className="max-w-7xl mx-auto p-8">
        <header className="flex justify-between items-end mb-16 border-b pb-8 border-gray-100">
          <div>
            <span className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em] mb-2 block">Mission Control</span>
            <h1 className="text-5xl font-black tracking-tighter uppercase leading-none">{exercise.name}</h1>
          </div>
          <div className="flex flex-col items-end gap-2">
            <div className="flex gap-2">
               {hasFailures && <span className="bg-red-600 text-white px-3 py-1 rounded text-[10px] font-black uppercase tracking-widest animate-pulse">Rollback Active</span>}
               <span className="bg-black text-white px-3 py-1 rounded text-[10px] font-black uppercase tracking-widest">{exercise.status}</span>
            </div>
            <Link href={`/reports/${exercise.id}`} className="text-[10px] font-black uppercase tracking-widest hover:underline text-gray-400">View Analytics Dashboard</Link>
          </div>
        </header>

        <div className="space-y-24">
          {sortedStages.map((stage) => {
            const isRollback = stage.name.toLowerCase().includes("rollback");
            const isLocked = isRollback && !hasFailures;

            return (
              <section key={stage.id} className={`${isLocked ? "opacity-20 pointer-events-none grayscale" : "opacity-100"}`}>
                <div className="flex items-center gap-6 mb-10">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-2xl shadow-2xl ${isRollback ? "bg-red-600 text-white" : "bg-black text-white"}`}>
                    {stage.name.charAt(0)}
                  </div>
                  <div>
                    <h2 className="text-2xl font-black uppercase tracking-tight flex items-center gap-4">
                      {stage.name}
                      {isLocked && <span className="bg-gray-100 text-gray-400 px-3 py-1 rounded text-[10px] tracking-[0.2em] font-black">LOCKED</span>}
                    </h2>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">
                      {stage.tasks.filter(t => t.status === "Completed").length} / {stage.tasks.length} SEQUENTIAL TASKS RESOLVED
                    </p>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-separate border-spacing-y-3">
                    <thead>
                      <tr className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                        <th className="px-6 py-2">ID</th>
                        <th className="px-6 py-2">Recovery Task</th>
                        <th className="px-6 py-2">Workflow</th>
                        <th className="px-6 py-2">Resources</th>
                        <th className="px-6 py-2 text-right">Timing</th>
                        <th className="px-6 py-2 text-right">Status</th>
                        <th className="px-6 py-2"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {stage.tasks.map((task) => (
                        <tr key={task.id} className="group bg-gray-50 hover:bg-gray-100 transition-colors rounded-xl overflow-hidden">
                          <td className="px-6 py-5 first:rounded-l-xl">
                            <span className="text-xs font-mono font-black text-gray-400">{task.taskId}</span>
                          </td>
                          <td className="px-6 py-5">
                            <div className="font-bold text-gray-800 uppercase text-sm tracking-tight">{task.notes || "No Description"}</div>
                            <div className="text-[10px] text-gray-400 font-bold uppercase mt-1">{task.team?.name || "Global Ops"}</div>
                          </td>
                          <td className="px-6 py-5">
                            <span className={`text-[9px] font-black uppercase px-2 py-1 rounded border ${task.workflow === "Sequential" ? "bg-orange-50 text-orange-600 border-orange-100" : "bg-purple-50 text-purple-600 border-purple-100"}`}>
                              {task.workflow}
                            </span>
                          </td>
                          <td className="px-6 py-5">
                            <div className="flex -space-x-2">
                               {task.resources.length > 0 ? task.resources.map(r => (
                                 <div key={r.id} title={r.fullName} className="w-8 h-8 rounded-full bg-white border-2 border-gray-100 flex items-center justify-center text-[10px] font-black text-gray-400 uppercase shadow-sm">
                                   {r.fullName.charAt(0)}
                                 </div>
                               )) : <span className="text-[10px] font-bold text-gray-300 uppercase">Unassigned</span>}
                            </div>
                          </td>
                          <td className="px-6 py-5 text-right">
                             <div className="text-[10px] font-black text-gray-800 uppercase tracking-tighter">{task.estimatedTime}m EST</div>
                             {task.actualDuration && <div className="text-[10px] font-bold text-blue-600 uppercase tracking-tighter">{task.actualDuration}m ACT</div>}
                          </td>
                          <td className="px-6 py-5 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <div className={`w-2 h-2 rounded-full ${
                                task.status === "Completed" ? "bg-green-500" :
                                task.status === "In-Progress" ? "bg-blue-500 animate-pulse" :
                                task.status === "Failed" ? "bg-red-500" : "bg-gray-300"
                              }`}></div>
                              <span className="text-[10px] font-black uppercase tracking-widest">{task.status}</span>
                            </div>
                          </td>
                          <td className="px-6 py-5 last:rounded-r-xl text-right">
                             <Link href={`/exercise/${id}/task/${task.taskId}`} className="p-2 bg-white rounded-lg border border-gray-200 shadow-sm opacity-0 group-hover:opacity-100 transition-all inline-block hover:border-black">
                               <FileText size={14}/>
                             </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            );
          })}
        </div>
      </div>
    </div>
  );
}
