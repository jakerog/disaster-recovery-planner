"use client";

import { Task } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function TaskEditForm({ task }: { task: Task }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

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

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
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

      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-2">Start Date</label>
          <input name="startDate" type="date" defaultValue={task.startDate?.toISOString().split('T')[0]} className="w-full border border-gray-200 rounded-lg p-2 text-sm" />
        </div>
        <div>
          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-2">Start Time</label>
          <input name="startTime" type="time" defaultValue={task.startDate?.toISOString().split('T')[1]?.substring(0,5)} className="w-full border border-gray-200 rounded-lg p-2 text-sm" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-2">End Date</label>
          <input name="endDate" type="date" defaultValue={task.endDate?.toISOString().split('T')[0]} className="w-full border border-gray-200 rounded-lg p-2 text-sm" />
        </div>
        <div>
          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-2">End Time</label>
          <input name="endTime" type="time" defaultValue={task.endDate?.toISOString().split('T')[1]?.substring(0,5)} className="w-full border border-gray-200 rounded-lg p-2 text-sm" />
        </div>
      </div>

      <div>
        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-2">Estimated (Min)</label>
        <input name="estimatedTime" type="number" defaultValue={task.estimatedTime || 0} className="w-full border border-gray-200 rounded-lg p-2 text-sm" />
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
