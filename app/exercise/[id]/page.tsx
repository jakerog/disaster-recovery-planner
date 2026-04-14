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

  const sortedStages = exercise.stages.sort((a, b) => {
    const order = ["Pre-Failover", "Failover", "Post-Failover", "Failover-Rollback", "Pre-Failback", "Failback", "Post-Failback", "Failback-Rollback"];
    return order.indexOf(a.name) - order.indexOf(b.name);
  });

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-5xl mx-auto">
        <header className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-3xl font-black tracking-tighter text-gray-900 uppercase">{exercise.name}</h1>
            <p className="text-gray-500 font-medium">Live Execution Monitor</p>
          </div>
          <div className="px-4 py-1.5 bg-blue-600 text-white rounded-full text-xs font-bold uppercase tracking-widest animate-pulse">
            {exercise.status}
          </div>
        </header>

        <div className="space-y-20">
          {sortedStages.map((stage) => (
            <section key={stage.id} className="relative">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 rounded-xl bg-black text-white flex items-center justify-center font-black text-xl shadow-xl shadow-gray-200">
                  {stage.name.charAt(0)}
                </div>
                <div>
                  <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight">{stage.name}</h2>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                    {stage.tasks.filter(t => t.status === "Completed").length} / {stage.tasks.length} Completed
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {stage.tasks.map((task) => (
                  <TaskCard key={task.id} task={task as any} />
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
