"use client";

import { Task, Resource, Team } from "@prisma/client";
import { useState, useRef } from "react";
import { Camera, Clock, User, CheckCircle2, Upload } from "lucide-react";

interface TaskWithRelations extends Task {
  resources: Resource[];
  team: Team | null;
}

export default function TaskCard({ task }: { task: TaskWithRelations }) {
  const [status, setStatus] = useState(task.status);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const statusColors = {
    "Not-Started": "bg-gray-100 text-gray-600 border-gray-200",
    "In-Progress": "bg-blue-50 text-blue-600 border-blue-200",
    "Completed": "bg-green-50 text-green-600 border-green-200",
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    setUploading(true);

    // Simulate upload
    await new Promise(r => setTimeout(r, 1500));

    await fetch("/api/tasks", {
      method: "PATCH",
      body: JSON.stringify({
        id: task.id,
        evidence: "https://example.com/evidence/" + e.target.files[0].name
      })
    });

    setUploading(false);
    alert("Evidence uploaded successfully!");
  };

  return (
    <div className="bg-white border border-gray-100 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow flex flex-col h-full">
      <div className="flex justify-between items-start mb-4">
        <span className="text-xs font-mono font-bold text-gray-400 uppercase tracking-tight">{task.taskId}</span>
        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${statusColors[status as keyof typeof statusColors]}`}>
          {status}
        </span>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-bold text-gray-900 mb-2">{task.notes || "Task Objective"}</h3>
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <User size={14} />
            <span>{task.team?.name || "No Team"}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Clock size={14} />
            <span>{task.estimatedTime}m estimated</span>
          </div>
          {task.evidence && (
            <div className="mt-2 p-2 bg-green-50 text-green-600 text-[10px] font-bold rounded border border-green-100 truncate">
              ATTACHMENT: {task.evidence.split("/").pop()}
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mt-auto pt-4 border-t border-gray-50">
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept="image/*"
          onChange={handleFileUpload}
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="flex items-center justify-center gap-2 p-2 rounded-lg bg-gray-50 text-gray-600 hover:bg-gray-100 transition-colors text-sm font-medium disabled:opacity-50"
        >
          {uploading ? <Upload size={16} className="animate-bounce" /> : <Camera size={16} />}
          Evidence
        </button>
        <button
          onClick={() => setStatus("Completed")}
          className="flex items-center justify-center gap-2 p-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors text-sm font-medium shadow-sm shadow-blue-200"
        >
          <CheckCircle2 size={16} />
          Complete
        </button>
      </div>
    </div>
  );
}
