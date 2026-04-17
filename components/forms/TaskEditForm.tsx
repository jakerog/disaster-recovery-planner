"use client";

import { Task, Resource, Team, Stage } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { Camera, Save } from "lucide-react";
import StatusMessage from "@/components/ui/StatusMessage";

export default function TaskEditForm({ task, allResources = [], allTeams = [], allStages = [] }: {
  task: Task & { resources?: Resource[] },
  allResources?: Resource[],
  allTeams?: Team[],
  allStages?: Stage[]
}) {
  const router = useRouter();
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");
  const [evidence, setEvidence] = useState(task.evidence || "");
  const [resourceIds, setResourceIds] = useState<string[]>(task.resources?.map(r => r.id) || []);

  const userRole = (session?.user as any)?.role;
  const isOwner = task.resources?.some(r => r.email === session?.user?.email);
  const canEdit = userRole === "Admin" || userRole === "Moderator" || isOwner;

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Support images, excel, word, pdf
    const reader = new FileReader();
    reader.onload = () => {
      setEvidence(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!canEdit) {
      setStatus("Permission Denied: Unauthorized access to task stream.");
      return;
    }

    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const formProps = Object.fromEntries(formData);

    try {
      const res = await fetch("/api/tasks", {
        method: "PATCH",
        body: JSON.stringify({
          ...formProps,
          id: task.id,
          evidence,
          estimatedTime: parseInt(formProps.estimatedTime as string),
          resourceIds,
          startDate: formProps.startDate && formProps.startTime ? new Date(`${formProps.startDate}T${formProps.startTime}`) : null,
          endDate: formProps.endDate && formProps.endTime ? new Date(`${formProps.endDate}T${formProps.endTime}`) : null,
        }),
      });
      if (res.ok) {
        setStatus("Metadata Synchronized");
        setTimeout(() => {
          router.push(`/exercise/${task.exerciseId}`);
          router.refresh();
        }, 1500);
      }
      else {
        setStatus(await res.text());
      }
    } catch (error) {
      console.error(error);
      setStatus("Operation Failed");
    } finally {
      setLoading(false);
    }
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
    <form onSubmit={handleSubmit} className="space-y-12 text-slate-900 clean-card p-10 md:p-16 rounded-[3rem] border border-white shadow-2xl shadow-slate-200/50">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div>
          <label className="text-[10px] font-black text-slate-400 uppercase block mb-3 tracking-widest px-1">Task ID (Number)</label>
          <input name="taskId" type="number" defaultValue={task.taskId} className="clean-inset w-full p-4 text-sm font-bold border-none focus:ring-1 focus:ring-blue-500/20" />
        </div>
        <div>
          <label className="text-[10px] font-black text-slate-400 uppercase block mb-3 tracking-widest px-1">Task Name (Description)</label>
          <input name="name" defaultValue={task.name || ""} className="clean-inset w-full p-4 text-sm font-bold border-none" required />
        </div>
        <div>
          <label className="text-[10px] font-black text-slate-400 uppercase block mb-3 tracking-widest px-1">Operational Stage</label>
          <select name="stageId" defaultValue={task.stageId} className="clean-inset w-full p-4 text-sm font-bold border-none appearance-none cursor-pointer">
            {allStages.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
        </div>
        <div>
          <label className="text-[10px] font-black text-slate-400 uppercase block mb-3 tracking-widest px-1">Status Protocol</label>
          <select name="status" defaultValue={task.status} className="clean-inset w-full p-4 text-sm font-bold border-none appearance-none cursor-pointer">
            <option value="Not started">Not started</option>
            <option value="In Progress">In Progress</option>
            <option value="Failed">Failed</option>
            <option value="Delayed">Delayed</option>
            <option value="Optional">Optional</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
        <div>
          <label className="text-[10px] font-black text-slate-400 uppercase block mb-3 tracking-widest px-1">Workflow Chain</label>
          <select name="workflow" defaultValue={task.workflow} className="clean-inset w-full p-4 text-sm font-bold border-none appearance-none cursor-pointer">
            <option value="Sequential">Sequential</option>
            <option value="Parallel">Parallel</option>
          </select>
        </div>
        <div>
          <label className="text-[10px] font-black text-slate-400 uppercase block mb-3 tracking-widest px-1">Allocation Profile</label>
          <select name="resourceAllocation" defaultValue={task.resourceAllocation} className="clean-inset w-full p-4 text-sm font-bold border-none appearance-none cursor-pointer">
            <option value="Single">Single</option>
            <option value="Multiple">Multiple</option>
          </select>
        </div>
        <div>
          <label className="text-[10px] font-black text-slate-400 uppercase block mb-3 tracking-widest px-1">Estimated Duration (Minutes)</label>
          <input name="estimatedTime" type="number" defaultValue={task.estimatedTime || 0} className="clean-inset w-full p-4 text-sm font-bold border-none" />
        </div>

        <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-10 p-8 clean-inset border border-white/50">
          <div>
            <label className="text-[10px] font-black text-slate-400 uppercase block mb-3 tracking-widest px-1">Commencement Window</label>
            <div className="flex gap-4">
               <input name="startDate" type="date" defaultValue={task.startDate?.toISOString().split('T')[0]} className="bg-white/50 p-3 rounded-xl text-xs font-bold w-full" />
               <input name="startTime" type="time" defaultValue={task.startDate?.toISOString().split('T')[1]?.substring(0,5)} className="bg-white/50 p-3 rounded-xl text-xs font-bold w-full" />
            </div>
          </div>
          <div>
            <label className="text-[10px] font-black text-slate-400 uppercase block mb-3 tracking-widest px-1">Resolution Window</label>
            <div className="flex gap-4">
               <input name="endDate" type="date" defaultValue={task.endDate?.toISOString().split('T')[0]} className="bg-white/50 p-3 rounded-xl text-xs font-bold w-full" />
               <input name="endTime" type="time" defaultValue={task.endDate?.toISOString().split('T')[1]?.substring(0,5)} className="bg-white/50 p-3 rounded-xl text-xs font-bold w-full" />
            </div>
          </div>
        </div>

        <div>
          <label className="text-[10px] font-black text-slate-400 uppercase block mb-3 tracking-widest px-1">Team Mandate</label>
          <select name="teamId" defaultValue={task.teamId || ""} className="clean-inset w-full p-4 text-sm font-bold border-none appearance-none cursor-pointer">
            <option value="">Select Team</option>
            {allTeams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
          </select>
        </div>

        <div className="clean-inset p-4 relative group cursor-pointer hover:bg-white/50 transition-colors">
          <label className="text-[10px] font-black text-slate-400 uppercase block mb-3 tracking-widest px-1">Evidence Cryptography</label>
          <div className="flex items-center justify-between">
             <span className="text-[11px] font-bold text-slate-400">{evidence ? "Evidence Synchronized" : "Upload Evidence (Photos/Logs/Docs)"}</span>
             <Camera size={18} className="text-blue-600" />
          </div>
          <input type="file" onChange={handleFileUpload} accept=".jpg,.jpeg,.png,.webp,.pdf,.doc,.docx,.xls,.xlsx" className="absolute inset-0 opacity-0 cursor-pointer" />
        </div>
      </div>

      {evidence && evidence.startsWith('data:image/') && (
        <div className="mt-4">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Evidence Preview</p>
          <img src={evidence} className="max-w-xs rounded-2xl border border-slate-100 shadow-lg" alt="Evidence" />
        </div>
      )}

      <div>
        <label className="text-[10px] font-black text-slate-400 block mb-4 uppercase tracking-[0.2em] px-1">Assigned Resource(s) [Name | Team]</label>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          {allResources.sort((a: any, b: any) => {
            const teamA = allTeams.find(t => t.id === a.teamId)?.name || 'Z';
            const teamB = allTeams.find(t => t.id === b.teamId)?.name || 'Z';
            return teamA.localeCompare(teamB);
          }).map(r => (
            <button
              key={r.id}
              type="button"
              onClick={() => setResourceIds(prev => prev.includes(r.id) ? prev.filter(i => i !== r.id) : [...prev, r.id])}
              className={`p-4 rounded-2xl border-none uppercase transition-all flex flex-col items-start ${
                resourceIds.includes(r.id) ? "clean-button text-white scale-105" : "clean-inset text-slate-400 opacity-60"
              }`}
            >
              <span className="text-[10px] font-black tracking-widest">{r.fullName}</span>
              <span className={`text-[8px] font-bold ${resourceIds.includes(r.id) ? 'text-blue-200' : 'text-slate-300'}`}>
                {allTeams.find(t => t.id === r.teamId)?.name || 'Independent'}
              </span>
            </button>
          ))}
        </div>
      </div>

      <StatusMessage message={status} />

      <div>
        <label className="text-[10px] font-black text-slate-400 block mb-3 tracking-widest px-1">Operational Intelligence (Notes)</label>
        <textarea name="notes" defaultValue={task.notes || ""} className="clean-inset w-full p-6 text-sm font-bold border-none min-h-[160px] leading-relaxed" />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full clean-button text-white p-8 rounded-[2rem] font-black uppercase tracking-[0.5em] text-[13px] shadow-[0_25px_60px_rgba(37,99,235,0.2)] flex items-center justify-center gap-4 group transition-all"
      >
        <Save size={20} className="group-hover:scale-110 transition-transform" />
        {loading ? "Transmitting..." : "Synchronize Metadata"}
      </button>
    </form>
  );
}
