"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Activity, Users, Clock, Edit2, Trash2 } from "lucide-react";

export default function SortableTaskItem({ task, onEdit, onDelete }: any) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 0,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="clean-card p-6 flex items-center justify-between group hover:scale-[1.01] transition-all border-white/50 shadow-lg shadow-slate-100/30"
    >
      <div className="flex items-center gap-6">
        <div {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing p-2 hover:bg-slate-50 rounded-lg text-slate-300 hover:text-slate-600 transition-colors">
          <GripVertical size={20} />
        </div>
        <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-[11px] font-black text-blue-600 shadow-inner">
          {task.taskId}
        </div>
        <div>
          <h4 className="text-sm font-black uppercase tracking-tight text-slate-900">{task.name || task.notes}</h4>
          <div className="flex items-center gap-4 mt-1.5">
            <span className="text-[9px] font-black text-slate-400 uppercase flex items-center gap-1.5">
              <Activity size={10} className="text-blue-500" /> {task.stage?.name}
            </span>
            <span className="text-[9px] text-slate-300">•</span>
            <span className="text-[9px] font-black text-slate-400 uppercase flex items-center gap-1.5">
              <Users size={10} className="text-blue-500" /> {task.team?.name || 'Global Ops'}
            </span>
            <span className="text-[9px] text-slate-300">•</span>
            <span className="text-[9px] font-black text-slate-400 uppercase flex items-center gap-1.5">
              <Clock size={10} className="text-blue-500" /> {task.estimatedTime}m
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className={`status-pill ${task.status === 'Completed' ? 'status-pill-green' : 'status-pill-blue'}`}>{task.status}</div>
        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button onClick={() => onEdit(task)} className="p-2 rounded-xl bg-slate-50 text-slate-400 hover:text-blue-600 border border-slate-100 transition-colors">
            <Edit2 size={16}/>
          </button>
          <button onClick={() => onDelete(task.id)} className="p-2 rounded-xl bg-rose-50 text-rose-300 hover:text-rose-600 border border-rose-100 transition-colors">
            <Trash2 size={16}/>
          </button>
        </div>
      </div>
    </div>
  );
}
