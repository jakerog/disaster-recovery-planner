"use client";

import { Task, Resource, Team } from "@prisma/client";
import { useState, useRef } from "react";
import { Camera, Clock, User, CheckCircle2, Upload, AlertTriangle, Info, Timer } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface TaskWithRelations extends Task {
  resources: Resource[];
  team: Team | null;
}

export default function TaskCard({ task }: { task: TaskWithRelations }) {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const statusColors = {
    "Not-Started": "bg-gray-100 text-gray-500 border-gray-200",
    "In-Progress": "bg-blue-50 text-blue-600 border-blue-200",
    "Completed": "bg-green-50 text-green-600 border-green-200",
    "Failed": "bg-red-50 text-red-600 border-red-200",
  };

  const handleUpdate = async (newStatus: string) => {
    const now = new Date();
    const payload: any = { id: task.id, status: newStatus };
    if (newStatus === "In-Progress") payload.startDate = now;
    if (newStatus === "Completed") payload.endDate = now;

    await fetch("/api/tasks", {
      method: "PATCH",
      body: JSON.stringify(payload)
    });
    router.refresh();
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    setUploading(true);
    await new Promise(r => setTimeout(r, 1000));
    await fetch("/api/tasks", {
      method: "PATCH",
      body: JSON.stringify({ id: task.id, evidence: "https://example.com/evidence/" + e.target.files[0].name })
    });
    setUploading(false);
    router.refresh();
  };

  return (
    <div className={`skeuo-card p-6 rounded-3xl transition-all flex flex-col h-full ${task.status === "Failed" ? "border-red-300 ring-4 ring-red-50" : "border-gray-100"}`}>
      <div className="flex justify-between items-start mb-4">
        <span className="text-[10px] font-mono font-black text-gray-400 uppercase tracking-widest">{task.taskId}</span>
        <div className="flex gap-2">
           <Link href={`/exercise/${task.exerciseId}/task/${task.taskId}`} className="p-1 hover:bg-gray-100 rounded text-gray-400"><Info size={14}/></Link>
           <span className={`px-3 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${statusColors[task.status as keyof typeof statusColors]}`}>
            {task.status}
           </span>
        </div>
      </div>

      <div className="mb-6 flex-grow">
        <h3 className="text-lg font-black text-gray-900 mb-3 leading-tight uppercase tracking-tight">{task.notes || "Task Objective"}</h3>

        <div className="grid grid-cols-2 gap-y-3 mb-6">
           <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase">
             <User size={12}/> {task.team?.name || "Unassigned"}
           </div>
           <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase">
             <Clock size={12}/> {task.estimatedTime}m est
           </div>
           {task.actualDuration !== null && (
             <div className="flex items-center gap-2 text-[10px] font-bold text-blue-600 uppercase">
               <Timer size={12}/> {task.actualDuration}m actual
             </div>
           )}
           {task.varianceDuration !== null && (
             <div className={`flex items-center gap-2 text-[10px] font-bold uppercase ${task.varianceDuration > 0 ? "text-red-500" : "text-green-600"}`}>
               Var: {task.varianceDuration > 0 ? "+" : ""}{task.varianceDuration}m
             </div>
           )}
        </div>

        <div className="flex flex-wrap gap-2">
           {task.resources?.map(r => (
             <span key={r.id} className="text-[9px] font-black bg-gray-50 border border-gray-100 px-2 py-0.5 rounded text-gray-500 uppercase tracking-tighter">{r.fullName}</span>
           ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 pt-4 border-t border-gray-50">
        <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileUpload} />
        <button
          onClick={() => handleUpdate(task.status === "In-Progress" ? "Completed" : "In-Progress")}
          className={`flex items-center justify-center gap-2 p-3 rounded-xl text-white transition-all text-[10px] font-black uppercase tracking-widest shadow-lg ${task.status === "Completed" ? "bg-green-600 shadow-green-100" : "skeuo-button"}`}
        >
          <CheckCircle2 size={14} />
          {task.status === "Not-Started" ? "Start" : task.status === "In-Progress" ? "Finish" : "Done"}
        </button>
        <button onClick={() => handleUpdate("Failed")} className="flex items-center justify-center gap-2 p-3 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 transition-colors text-[10px] font-black uppercase tracking-widest">
          <AlertTriangle size={14} />
          Fail
        </button>
      </div>
    </div>
  );
}
