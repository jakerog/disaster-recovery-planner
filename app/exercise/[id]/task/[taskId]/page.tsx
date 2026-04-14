import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

export default async function TaskEditPage({ params }: { params: Promise<{ id: string, taskId: string }> }) {
  const { id, taskId } = await params;

  const task = await prisma.task.findFirst({
    where: { exerciseId: id, taskId: taskId },
    include: { team: true, stage: true, resources: true }
  });

  if (!task) notFound();

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-2xl mx-auto bg-white border border-gray-200 rounded-2xl shadow-xl p-10">
        <h1 className="text-2xl font-black mb-8 tracking-tighter uppercase">Edit Task: {task.taskId}</h1>

        <form className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-2">Workflow</label>
              <select defaultValue={task.workflow} className="w-full border border-gray-200 rounded-lg p-2 text-sm font-medium">
                <option>Sequential</option>
                <option>Parallel</option>
              </select>
            </div>
            <div>
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-2">Allocation</label>
              <select defaultValue={task.resourceAllocation} className="w-full border border-gray-200 rounded-lg p-2 text-sm font-medium">
                <option>Single</option>
                <option>Multiple</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-2">Status</label>
            <select defaultValue={task.status} className="w-full border border-gray-200 rounded-lg p-3 text-sm font-bold bg-gray-50">
              <option>Not-Started</option>
              <option>In-Progress</option>
              <option>Completed</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-2">Start Date</label>
              <input type="date" defaultValue={task.startDate?.toISOString().split('T')[0]} className="w-full border border-gray-200 rounded-lg p-2 text-sm" />
            </div>
            <div>
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-2">Estimated (Min)</label>
              <input type="number" defaultValue={task.estimatedTime || 0} className="w-full border border-gray-200 rounded-lg p-2 text-sm" />
            </div>
          </div>

          <div>
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-2">Notes</label>
            <textarea defaultValue={task.notes || ""} className="w-full border border-gray-200 rounded-lg p-3 text-sm min-h-[100px]" placeholder="Execution details..."></textarea>
          </div>

          <div className="pt-6 border-t border-gray-100 flex gap-4">
            <button type="submit" className="flex-1 py-3 bg-black text-white rounded-xl font-bold hover:bg-gray-800 transition-all">Save Changes</button>
            <button type="button" className="px-6 py-3 bg-white text-gray-500 border border-gray-200 rounded-xl font-bold">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}
