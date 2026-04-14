"use client";

import { Task, Resource } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function TaskEditForm({ task, allResources = [] }: { task: Task & { resources?: Resource[] }, allResources?: Resource[] }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [selectedResources, setSelectedResources] = useState<string[]>(task.resources?.map(r => r.id) || []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    try {
      const res = await fetch("/api/tasks", {
        method: "PATCH",
        body: JSON.stringify({
          id: task.id,
          taskId: data.taskId,
          status: data.status,
          workflow: data.workflow,
          resourceAllocation: data.resourceAllocation,
          notes: data.notes,
          estimatedTime: parseInt(data.estimatedTime as string),
          startDate: data.startDate && data.startTime ? new Date(`${data.startDate}T${data.startTime}`) : null,
          endDate: data.endDate && data.endTime ? new Date(`${data.endDate}T${data.endTime}`) : null,
          resourceIds: selectedResources,
        }),
      });

      if (res.ok) {
        router.push(`/exercise/${task.exerciseId}`);
        router.refresh();
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const toggleResource = (id: string) => {
    setSelectedResources(prev =>
      prev.includes(id) ? prev.filter(r => r !== id) : [...prev, id]
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 text-gray-900">
       <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-2">Task ID</label>
          <input name="taskId" defaultValue={task.taskId} className="w-full border border-gray-200 rounded-lg p-2 text-sm font-medium" />
        </div>
        <div>
          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-2">Status</label>
          <select name="status" defaultValue={task.status} className="w-full border border-gray-200 rounded-lg p-2 text-sm font-bold bg-gray-50">
            <option value="Not-Started">Not-Started</option>
            <option value="In-Progress">In-Progress</option>
            <option value="Completed">Completed</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-2">Workflow</label>
          <select name="workflow" defaultValue={task.workflow} className="w-full border border-gray-200 rounded-lg p-2 text-sm font-medium">
            <option value="Sequential">Sequential</option>
            <option value="Parallel">Parallel</option>
          </select>
        </div>
        <div>
          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-2">Allocation</label>
          <select name="resourceAllocation" defaultValue={task.resourceAllocation} className="w-full border border-gray-200 rounded-lg p-2 text-sm font-medium">
            <option value="Single">Single</option>
            <option value="Multiple">Multiple</option>
          </select>
        </div>
      </div>

      <div>
        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-2">Assigned Resources</label>
        <div className="flex flex-wrap gap-2 mt-2">
          {allResources.map(r => (
            <button
              key={r.id}
              type="button"
              onClick={() => toggleResource(r.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                selectedResources.includes(r.id)
                  ? "bg-black text-white border-black"
                  : "bg-white text-gray-400 border-gray-200 hover:border-gray-400"
              }`}
            >
              {r.fullName}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-2">Estimated (Min)</label>
          <input name="estimatedTime" type="number" defaultValue={task.estimatedTime || 0} className="w-full border border-gray-200 rounded-lg p-2 text-sm" />
        </div>
      </div>

      <div>
        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-2">Notes</label>
        <textarea name="notes" defaultValue={task.notes || ""} className="w-full border border-gray-200 rounded-lg p-3 text-sm min-h-[100px]" placeholder="Execution details..."></textarea>
      </div>

      <div className="pt-6 border-t border-gray-100 flex gap-4">
        <button type="submit" disabled={loading} className="flex-1 py-3 bg-black text-white rounded-xl font-bold hover:bg-gray-800 transition-all disabled:opacity-50">
          {loading ? "Saving..." : "Save Changes"}
        </button>
        <button type="button" onClick={() => router.back()} className="px-6 py-3 bg-white text-gray-500 border border-gray-200 rounded-xl font-bold">Cancel</button>
      </div>
    </form>
  );
}
