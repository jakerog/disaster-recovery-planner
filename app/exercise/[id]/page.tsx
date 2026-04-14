import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import TaskCard from "@/components/execution/TaskCard";

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

  // Detect if any task has failed to activate Rollback
  const hasFailures = exercise.stages.some(s => s.tasks.some(t => t.status === "Failed"));

  const sortedStages = exercise.stages.sort((a, b) => {
    const order = ["Pre-Failover", "Failover", "Post-Failover", "Failover-Rollback", "Pre-Failback", "Failback", "Post-Failback", "Failback-Rollback"];
    return order.indexOf(a.name) - order.indexOf(b.name);
  });

  return (
    <div className="min-h-screen bg-gray-50 p-8 text-gray-900">
      <div className="max-w-5xl mx-auto">
        <header className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-3xl font-black tracking-tighter text-gray-900 uppercase">{exercise.name}</h1>
            <p className="text-gray-500 font-medium">Recovery Orchestration Engine</p>
          </div>
          <div className="flex gap-4 items-center">
            {hasFailures && <span className="px-4 py-1.5 bg-red-600 text-white rounded-full text-[10px] font-black uppercase tracking-widest animate-pulse shadow-lg shadow-red-100">Rollback Activated</span>}
            <div className="px-4 py-1.5 bg-black text-white rounded-full text-[10px] font-black uppercase tracking-widest">
              {exercise.status}
            </div>
          </div>
        </header>

        <div className="space-y-20">
          {sortedStages.map((stage) => {
            const isRollback = stage.name.toLowerCase().includes("rollback");
            const shouldDim = isRollback && !hasFailures;

            return (
              <section key={stage.id} className={`relative transition-all ${shouldDim ? "opacity-20 pointer-events-none grayscale" : "opacity-100"}`}>
                <div className="flex items-center gap-4 mb-8">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-black text-xl shadow-xl shadow-gray-100 ${isRollback ? "bg-red-500 text-white" : "bg-black text-white"}`}>
                    {stage.name.charAt(0)}
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight flex items-center gap-3">
                       {stage.name}
                       {isRollback && !hasFailures && <span className="text-[10px] bg-gray-200 text-gray-400 px-2 py-0.5 rounded tracking-widest">LOCKED</span>}
                       {isRollback && hasFailures && <span className="text-[10px] bg-red-100 text-red-600 px-2 py-0.5 rounded tracking-widest">ACTIVE</span>}
                    </h2>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                      {stage.tasks.filter(t => t.status === "Completed").length} / {stage.tasks.length} Resolved
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {stage.tasks.map((task) => (
                    <TaskCard key={task.id} task={task as any} />
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
