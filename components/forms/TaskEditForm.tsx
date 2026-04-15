"use client";

import { Task, Resource, Team, Stage } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useSession } from "next-auth/react";

export default function TaskEditForm({ task, allResources = [], allTeams = [], allStages = [] }: {
  task: Task & { resources?: Resource[] },
  allResources?: Resource[],
  allTeams?: Team[],
  allStages?: Stage[]
}) {
  const router = useRouter();
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [resourceIds, setResourceIds] = useState<string[]>(task.resources?.map(r => r.id) || []);

  const userRole = (session?.user as any)?.role;
  const isOwner = task.resources?.some(r => r.email === session?.user?.email);
  const canEdit = userRole === "Admin" || userRole === "Moderator" || isOwner;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!canEdit) return alert("Permission Denied: Unauthorized access to task stream.");

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
      else { alert(await res.text()); }
    } catch (error) { console.error(error); } finally { setLoading(false); }
  };

  if (!canEdit && session) {
    return (
      <div className="skeuo-card p-12 text-center">
        <h2 className="text-xl font-black text-red-600 uppercase mb-4">Access Restricted</h2>
        <p className="text-sm font-bold text-gray-500 italic">This recovery task is outside your current operational mandate.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-10 text-gray-900 skeuo-card p-12 rounded-[2.5rem]">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <label className="text-[10px] font-black text-gray-400 uppercase block mb-2 tracking-widest">Task Designation</label>
          <input name="taskId" defaultValue={task.taskId} className="skeuo-inset w-full p-4 text-sm font-bold border-none" />
        </div>
        <div>
          <label className="text-[10px] font-black text-gray-400 uppercase block mb-2 tracking-widest">Status Protocol</label>
          <select name="status" defaultValue={task.status} className="skeuo-inset w-full p-4 text-sm font-bold border-none appearance-none">
            <option>Not-Started</option><option>In-Progress</option><option>Completed</option><option>Failed</option>
          </select>
        </div>
        <div>
          <label className="text-[10px] font-black text-gray-400 uppercase block mb-2 tracking-widest">Workflow Chain</label>
          <select name="workflow" defaultValue={task.workflow} className="skeuo-inset w-full p-4 text-sm font-bold border-none appearance-none">
            <option>Sequential</option><option>Parallel</option>
          </select>
        </div>
        <div>
          <label className="text-[10px] font-black text-gray-400 uppercase block mb-2 tracking-widest">Allocation Profile</label>
          <select name="resourceAllocation" defaultValue={task.resourceAllocation} className="skeuo-inset w-full p-4 text-sm font-bold border-none appearance-none">
            <option>Single</option><option>Multiple</option>
          </select>
        </div>
        <div>
          <label className="text-[10px] font-black text-gray-400 uppercase block mb-2 tracking-widest">Deployment Date</label>
          <input name="startDate" type="date" defaultValue={task.startDate?.toISOString().split('T')[0]} className="skeuo-inset w-full p-4 text-sm font-bold border-none" />
        </div>
        <div>
          <label className="text-[10px] font-black text-gray-400 uppercase block mb-2 tracking-widest">Commencement Time</label>
          <input name="startTime" type="time" defaultValue={task.startDate?.toISOString().split('T')[1]?.substring(0,5)} className="skeuo-inset w-full p-4 text-sm font-bold border-none" />
        </div>
        <div>
          <label className="text-[10px] font-black text-gray-400 uppercase block mb-2 tracking-widest">Conclusion Date</label>
          <input name="endDate" type="date" defaultValue={task.endDate?.toISOString().split('T')[0]} className="skeuo-inset w-full p-4 text-sm font-bold border-none" />
        </div>
        <div>
          <label className="text-[10px] font-black text-gray-400 uppercase block mb-2 tracking-widest">Resolution Time</label>
          <input name="endTime" type="time" defaultValue={task.endDate?.toISOString().split('T')[1]?.substring(0,5)} className="skeuo-inset w-full p-4 text-sm font-bold border-none" />
        </div>
        <div>
          <label className="text-[10px] font-black text-gray-400 uppercase block mb-2 tracking-widest">Estimated Window (m)</label>
          <input name="estimatedTime" type="number" defaultValue={task.estimatedTime || 0} className="skeuo-inset w-full p-4 text-sm font-bold border-none" />
        </div>
        <div>
          <label className="text-[10px] font-black text-gray-400 uppercase block mb-2 tracking-widest">Team Mandate</label>
          <select name="teamId" defaultValue={task.teamId || ""} className="skeuo-inset w-full p-4 text-sm font-bold border-none appearance-none">
            <option value="">Select Team</option>
            {allTeams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
          </select>
        </div>
      </div>

      <div>
        <label className="text-[10px] font-black text-gray-400 block mb-4 uppercase tracking-[0.2em]">Matrix Allocation</label>
        <div className="flex flex-wrap gap-3">
          {allResources.map(r => (
            <button key={r.id} type="button" onClick={() => setResourceIds(prev => prev.includes(r.id) ? prev.filter(i => i !== r.id) : [...prev, r.id])}
              className={`px-4 py-2 rounded-xl text-[10px] font-black border uppercase tracking-widest transition-all ${resourceIds.includes(r.id) ? "skeuo-button text-white" : "skeuo-inset text-gray-400"}`}>
              {r.fullName}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="text-[10px] font-black text-gray-400 block mb-2 uppercase tracking-widest">Operational Intel</label>
        <textarea name="notes" defaultValue={task.notes || ""} className="skeuo-inset w-full p-4 text-sm font-bold border-none min-h-[120px]" />
      </div>

      <button type="submit" disabled={loading} className="w-full skeuo-button text-white p-6 rounded-2xl font-black uppercase tracking-[0.4em] text-[12px] shadow-2xl">
        {loading ? "Synchronizing Matrix..." : "Update Task Metadata"}
      </button>
    </form>
  );
}
