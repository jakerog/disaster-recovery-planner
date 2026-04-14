"use client";

import { Task, Resource, Team } from "@prisma/client";
import { useState, useRef } from "react";
import { Camera, Clock, User, CheckCircle2, Upload, AlertTriangle } from "lucide-react";
import { useRouter } from "next/navigation";

interface TaskWithRelations extends Task {
  resources: Resource[];
  team: Team | null;
}

export default function TaskCard({ task }: { task: TaskWithRelations }) {
  const [status, setStatus] = useState(task.status);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const statusColors = {
    "Not-Started": "bg-gray-100 text-gray-600 border-gray-200",
    "In-Progress": "bg-blue-50 text-blue-600 border-blue-200",
    "Completed": "bg-green-50 text-green-600 border-green-200",
    "Failed": "bg-red-50 text-red-600 border-red-200",
  };

  const handleUpdate = async (newStatus: string) => {
    setStatus(newStatus);
    await fetch("/api/tasks", {
      method: "PATCH",
      body: JSON.stringify({ id: task.id, status: newStatus })
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
    <div className={`bg-white border p-6 rounded-xl shadow-sm transition-all flex flex-col h-full ${status === "Failed" ? "border-red-300 ring-2 ring-red-100" : "border-gray-100"}`}>
      <div className="flex justify-between items-start mb-4">
        <span className="text-[10px] font-mono font-bold text-gray-400 uppercase tracking-tight">{task.taskId}</span>
        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${statusColors[status as keyof typeof statusColors]}`}>
          {status}
        </span>
      </div>

      <div className="mb-6 flex-grow">
        <h3 className="text-lg font-bold text-gray-900 mb-2 leading-tight">{task.notes || "Task Objective"}</h3>
        <div className="flex flex-wrap gap-2 mb-4">
           {task.resources?.map(r => (
             <span key={r.id} className="text-[10px] font-bold bg-gray-100 px-2 py-0.5 rounded text-gray-500 uppercase">{r.fullName}</span>
           ))}
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-400 font-bold uppercase">
          <Clock size={12} />
          <span>{task.estimatedTime}m est</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 pt-4 border-t border-gray-50">
        <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileUpload} />
        <button onClick={() => handleUpdate(status === "In-Progress" ? "Completed" : "In-Progress")} className="flex items-center justify-center gap-2 p-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors text-xs font-bold shadow-sm shadow-blue-200">
          <CheckCircle2 size={14} />
          {status === "In-Progress" ? "Complete" : "Execute"}
        </button>
        <button onClick={() => handleUpdate("Failed")} className="flex items-center justify-center gap-2 p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors text-xs font-bold">
          <AlertTriangle size={14} />
          Fail
        </button>
      </div>
    </div>
  );
}
