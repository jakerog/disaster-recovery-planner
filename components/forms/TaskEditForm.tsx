"use client";

import { Task, Resource, Team, Stage } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function TaskEditForm({ task, allResources = [], allTeams = [], allStages = [] }: {
  task: Task & { resources?: Resource[] },
  allResources?: Resource[],
  allTeams?: Team[],
  allStages?: Stage[]
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [resourceIds, setResourceIds] = useState<string[]>(task.resources?.map(r => r.id) || []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const formProps = Object.fromEntries(formData);

    try {
      const res = await fetch("/api/tasks", {
        method: "PATCH",
        body: JSON.stringify({
          ...formProps,
          id: task.id,
          estimatedTime: parseInt(formProps.estimatedTime as string),
          resourceIds,
          startDate: formProps.startDate && formProps.startTime ? new Date(`${formProps.startDate}T${formProps.startTime}`) : null,
          endDate: formProps.endDate && formProps.endTime ? new Date(`${formProps.endDate}T${formProps.endTime}`) : null,
        }),
      });
      if (res.ok) { router.push(`/exercise/${task.exerciseId}`); router.refresh(); }
    } catch (error) { console.error(error); } finally { setLoading(false); }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 text-gray-900">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Task ID</label>
          <input name="taskId" defaultValue={task.taskId} className="w-full border p-2 rounded text-sm" />
        </div>
        <div>
          <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Status</label>
          <select name="status" defaultValue={task.status} className="w-full border p-2 rounded text-sm">
            <option>Not-Started</option><option>In-Progress</option><option>Completed</option><option>Failed</option>
          </select>
        </div>
        <div>
          <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Workflow</label>
          <select name="workflow" defaultValue={task.workflow} className="w-full border p-2 rounded text-sm">
            <option>Sequential</option><option>Parallel</option>
          </select>
        </div>
        <div>
          <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Allocation</label>
          <select name="resourceAllocation" defaultValue={task.resourceAllocation} className="w-full border p-2 rounded text-sm">
            <option>Single</option><option>Multiple</option>
          </select>
        </div>
        <div>
          <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Start Date</label>
          <input name="startDate" type="date" defaultValue={task.startDate?.toISOString().split('T')[0]} className="w-full border p-2 rounded text-sm" />
        </div>
        <div>
          <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Start Time</label>
          <input name="startTime" type="time" defaultValue={task.startDate?.toISOString().split('T')[1]?.substring(0,5)} className="w-full border p-2 rounded text-sm" />
        </div>
        <div>
          <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">End Date</label>
          <input name="endDate" type="date" defaultValue={task.endDate?.toISOString().split('T')[0]} className="w-full border p-2 rounded text-sm" />
        </div>
        <div>
          <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">End Time</label>
          <input name="endTime" type="time" defaultValue={task.endDate?.toISOString().split('T')[1]?.substring(0,5)} className="w-full border p-2 rounded text-sm" />
        </div>
        <div>
          <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Est Min</label>
          <input name="estimatedTime" type="number" defaultValue={task.estimatedTime || 0} className="w-full border p-2 rounded text-sm" />
        </div>
        <div>
          <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Team</label>
          <select name="teamId" defaultValue={task.teamId || ""} className="w-full border p-2 rounded text-sm">
            <option value="">Select Team</option>
            {allTeams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
          </select>
        </div>
      </div>

      <div>
        <label className="text-[10px] font-bold text-gray-400 block mb-2 uppercase">Allocate Resources</label>
        <div className="flex flex-wrap gap-2">
          {allResources.map(r => (
            <button key={r.id} type="button" onClick={() => setResourceIds(prev => prev.includes(r.id) ? prev.filter(i => i !== r.id) : [...prev, r.id])}
              className={`px-3 py-1 rounded text-[10px] font-bold border uppercase tracking-widest ${resourceIds.includes(r.id) ? "bg-black text-white" : "bg-white text-gray-400"}`}>
              {r.fullName}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="text-[10px] font-bold text-gray-400 block mb-1 uppercase">Notes</label>
        <textarea name="notes" defaultValue={task.notes || ""} className="w-full border p-2 rounded text-sm min-h-[80px]" />
      </div>

      <button type="submit" disabled={loading} className="w-full py-4 bg-black text-white rounded font-bold uppercase tracking-widest hover:bg-gray-800 transition-colors">
        {loading ? "Syncing..." : "Update Task Metadata"}
      </button>
    </form>
  );
}
