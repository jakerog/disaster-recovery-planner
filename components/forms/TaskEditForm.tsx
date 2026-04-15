"use client";

import { Task, Resource, Team, Stage } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { Camera, Save } from "lucide-react";

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
      if (res.ok) {
        router.push(`/exercise/${task.exerciseId}`);
        router.refresh();
      }
      else { alert(await res.text()); }
    } catch (error) { console.error(error); } finally { setLoading(false); }
  };

  if (!canEdit && session) {
    return (
      <div className="clean-card p-12 text-center">
        <h2 className="text-xl font-black text-red-600 uppercase mb-4">Access Restricted</h2>
        <p className="text-sm font-bold text-gray-500 italic">This recovery task is outside your current operational mandate.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-12 text-gray-900 clean-card p-10 md:p-16 rounded-[3rem] border border-white">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div>
          <label className="text-[10px] font-black text-gray-400 uppercase block mb-3 tracking-widest px-1">Task Designation (ID)</label>
          <input name="taskId" defaultValue={task.taskId} className="clean-inset w-full p-4 text-sm font-bold border-none focus:ring-1 focus:ring-blue-500/20" />
        </div>
        <div>
          <label className="text-[10px] font-black text-gray-400 uppercase block mb-3 tracking-widest px-1">Operational Stage</label>
          <select name="stageId" defaultValue={task.stageId} className="clean-inset w-full p-4 text-sm font-bold border-none appearance-none cursor-pointer">
            {allStages.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
        </div>
        <div>
          <label className="text-[10px] font-black text-gray-400 uppercase block mb-3 tracking-widest px-1">Status Protocol</label>
          <select name="status" defaultValue={task.status} className="clean-inset w-full p-4 text-sm font-bold border-none appearance-none cursor-pointer">
            <option value="Not-Started">Not-Started</option>
            <option value="In-Progress">In-Progress</option>
            <option value="Completed">Completed</option>
            <option value="Failed">Failed</option>
          </select>
        </div>
        <div>
          <label className="text-[10px] font-black text-gray-400 uppercase block mb-3 tracking-widest px-1">Workflow Chain</label>
          <select name="workflow" defaultValue={task.workflow} className="clean-inset w-full p-4 text-sm font-bold border-none appearance-none cursor-pointer">
            <option value="Sequential">Sequential</option>
            <option value="Parallel">Parallel</option>
          </select>
        </div>
        <div>
          <label className="text-[10px] font-black text-gray-400 uppercase block mb-3 tracking-widest px-1">Allocation Profile</label>
          <select name="resourceAllocation" defaultValue={task.resourceAllocation} className="clean-inset w-full p-4 text-sm font-bold border-none appearance-none cursor-pointer">
            <option value="Single">Single</option>
            <option value="Multiple">Multiple</option>
          </select>
        </div>
        <div>
          <label className="text-[10px] font-black text-gray-400 uppercase block mb-3 tracking-widest px-1">Estimated Window (m)</label>
          <input name="estimatedTime" type="number" defaultValue={task.estimatedTime || 0} className="clean-inset w-full p-4 text-sm font-bold border-none" />
        </div>

        <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-10 p-8 clean-inset border border-white/50">
          <div>
            <label className="text-[10px] font-black text-gray-400 uppercase block mb-3 tracking-widest px-1">Commencement Window</label>
            <div className="flex gap-4">
               <input name="startDate" type="date" defaultValue={task.startDate?.toISOString().split('T')[0]} className="bg-white/50 p-3 rounded-xl text-xs font-bold w-full" />
               <input name="startTime" type="time" defaultValue={task.startDate?.toISOString().split('T')[1]?.substring(0,5)} className="bg-white/50 p-3 rounded-xl text-xs font-bold w-full" />
            </div>
          </div>
          <div>
            <label className="text-[10px] font-black text-gray-400 uppercase block mb-3 tracking-widest px-1">Resolution Window</label>
            <div className="flex gap-4">
               <input name="endDate" type="date" defaultValue={task.endDate?.toISOString().split('T')[0]} className="bg-white/50 p-3 rounded-xl text-xs font-bold w-full" />
               <input name="endTime" type="time" defaultValue={task.endDate?.toISOString().split('T')[1]?.substring(0,5)} className="bg-white/50 p-3 rounded-xl text-xs font-bold w-full" />
            </div>
          </div>
        </div>

        <div>
          <label className="text-[10px] font-black text-gray-400 uppercase block mb-3 tracking-widest px-1">Team Mandate</label>
          <select name="teamId" defaultValue={task.teamId || ""} className="clean-inset w-full p-4 text-sm font-bold border-none appearance-none cursor-pointer">
            <option value="">Select Team</option>
            {allTeams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
          </select>
        </div>

        <div>
          <label className="text-[10px] font-black text-gray-400 uppercase block mb-3 tracking-widest px-1">Evidence Cryptography</label>
          <div className="clean-inset p-4 flex items-center justify-between group cursor-pointer hover:bg-white/50 transition-colors">
             <span className="text-[11px] font-bold text-gray-400">Upload Visual Proof (Photos/Logs)</span>
             <Camera size={18} className="text-gray-300" />
          </div>
        </div>
      </div>

      <div>
        <label className="text-[10px] font-black text-gray-400 block mb-4 uppercase tracking-[0.2em] px-1">Agent Matrix Allocation</label>
        <div className="flex flex-wrap gap-3">
          {allResources.map(r => (
            <button
              key={r.id}
              type="button"
              onClick={() => setResourceIds(prev => prev.includes(r.id) ? prev.filter(i => i !== r.id) : [...prev, r.id])}
              className={`px-5 py-2.5 rounded-2xl text-[10px] font-black border-none uppercase tracking-widest transition-all ${
                resourceIds.includes(r.id) ? "clean-button text-white scale-105" : "clean-inset text-gray-400 opacity-60"
              }`}
            >
              {r.fullName}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="text-[10px] font-black text-gray-400 block mb-3 tracking-widest px-1">Operational Intelligence (Notes)</label>
        <textarea name="notes" defaultValue={task.notes || ""} className="clean-inset w-full p-6 text-sm font-bold border-none min-h-[160px] leading-relaxed" />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full clean-button text-white p-8 rounded-[2rem] font-black uppercase tracking-[0.5em] text-[13px] shadow-[0_25px_60px_rgba(0,0,0,0.4)] flex items-center justify-center gap-4 group transition-all"
      >
        <Save size={20} className="group-hover:scale-110 transition-transform" />
        {loading ? "Transmitting..." : "Synchronize Metadata"}
      </button>
    </form>
  );
}
