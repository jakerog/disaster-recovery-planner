import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import TaskEditForm from "@/components/forms/TaskEditForm";

export default async function TaskEditPage({ params }: { params: Promise<{ id: string, taskId: string }> }) {
  const { id, taskId } = await params;

  const [task, allResources] = await Promise.all([
    prisma.task.findFirst({
      where: { exerciseId: id, taskId: taskId },
      include: { resources: true }
    }),
    prisma.resource.findMany()
  ]);

  if (!task) notFound();

  return (
    <div className="p-8 bg-gray-50 min-h-screen text-gray-900">
      <div className="max-w-2xl mx-auto bg-white border border-gray-200 rounded-2xl shadow-xl p-10">
        <h1 className="text-2xl font-black mb-8 tracking-tighter uppercase text-gray-900">Edit Task: {task.taskId}</h1>
        <TaskEditForm task={task} allResources={allResources} />
      </div>
    </div>
  );
}
