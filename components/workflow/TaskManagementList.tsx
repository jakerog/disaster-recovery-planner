"use client";

import { Task, Resource, Team, Stage } from "@prisma/client";
import { useState, useEffect } from "react";
import { Plus, Trash2, Edit2, Shield, Activity, Users, Clock, Save, X, GripVertical } from "lucide-react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import SortableTaskItem from "./SortableTaskItem";

export default function TaskManagementList({ exerciseId, stages, teams, resources }: any) {
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingTask, setEditingTask] = useState<any>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );
  const [showForm, setShowForm] = useState(false);
  const [nextTaskId, setNextTaskId] = useState<number>(1);

  const fetchTasks = async () => {
    setLoading(true);
    const res = await fetch(`/api/tasks?exerciseId=${exerciseId}`);
    const data = await res.json();
    // Sort tasks by taskId (number) for initial load
    const sorted = data.sort((a: any, b: any) => (parseInt(a.taskId) || 0) - (parseInt(b.taskId) || 0));
    setTasks(sorted);

    // Calculate next task ID
    if (data.length > 0) {
      const maxId = Math.max(...data.map((t: any) => parseInt(t.taskId) || 0));
      setNextTaskId(maxId + 1);
    } else {
      setNextTaskId(1);
    }

    setLoading(false);
  };

  useEffect(() => { fetchTasks(); }, [exerciseId]);

  const handleDelete = async (id: string) => {
    if (!confirm("Terminate this task? This cannot be reversed.")) return;
    await fetch(`/api/tasks?id=${id}`, { method: "DELETE" });
    fetchTasks();
  };

  const handleDragEnd = async (event: any) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      const oldIndex = tasks.findIndex((t) => t.id === active.id);
      const newIndex = tasks.findIndex((t) => t.id === over.id);

      const newTasks = arrayMove(tasks, oldIndex, newIndex);

      // Coordinate Task IDs based on new order
      const coordinatedTasks = newTasks.map((task, index) => ({
        ...task,
        taskId: (index + 1).toString()
      }));

      setTasks(coordinatedTasks);

      // Persist reordered Task IDs
      await Promise.all(coordinatedTasks.map((task) =>
        fetch("/api/tasks", {
          method: "PATCH",
          body: JSON.stringify({ id: task.id, taskId: task.taskId })
        })
      ));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData);

    const method = editingTask ? "PATCH" : "POST";
    const body = {
      ...data,
      id: editingTask?.id,
      exerciseId,
      estimatedTime: parseInt(data.estimatedTime as string),
      resourceIds: Array.from(formData.getAll("resourceIds"))
    };

    await fetch("/api/tasks", {
      method,
      body: JSON.stringify(body)
    });

    setShowForm(false);
    setEditingTask(null);
    fetchTasks();
  };

  return (
    <div className="mt-20">
      <header className="flex justify-between items-center mb-10">
        <div>
          <h2 className="text-2xl font-black uppercase tracking-tight">Recovery Task Master</h2>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Operational Directive Management</p>
        </div>
        <button
          onClick={() => { setShowForm(true); setEditingTask(null); }}
          className="clean-button py-3 px-8 text-[10px] uppercase tracking-widest flex items-center gap-2"
        >
          <Plus size={14} /> New Task
        </button>
      </header>

      {showForm && (
        <div className="mb-12 clean-card p-10 border-blue-100 shadow-2xl animate-slide-up">
           <div className="flex justify-between items-center mb-8">
              <h3 className="text-lg font-black uppercase tracking-widest text-blue-600">{editingTask ? 'Modify' : 'Initialize'} Recovery Task</h3>
              <button onClick={() => { setShowForm(false); setEditingTask(null); }} className="p-2 rounded-full hover:bg-slate-50 text-slate-400"><X size={20}/></button>
           </div>

           <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-1">Task ID (Number)</label>
                <input name="taskId" type="number" defaultValue={editingTask ? editingTask.taskId : nextTaskId} className="clean-input" required placeholder="101" />
              </div>
              <div className="space-y-2">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-1">Task Name (Description)</label>
                <input name="name" defaultValue={editingTask ? editingTask.name : "Provide Brief Task Description"} className="clean-input" required />
              </div>
              <div className="space-y-2">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-1">Operational Stage</label>
                <select name="stageId" defaultValue={editingTask?.stageId} className="clean-input" required>
                  <option value="">Select Stage</option>
                  {stages.map((s: any) => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-1">Team Mandate</label>
                <select name="teamId" defaultValue={editingTask?.teamId} className="clean-input">
                  <option value="">Global Ops</option>
                  {teams.map((t: any) => <option key={t.id} value={t.id}>{t.name}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-1">Estimated Duration (Minutes)</label>
                <input name="estimatedTime" type="number" defaultValue={editingTask?.estimatedTime || 0} className="clean-input" required />
              </div>
              <div className="space-y-2">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-1">Status Protocol</label>
                <select name="status" defaultValue={editingTask?.status || "Not started"} className="clean-input" required>
                  <option value="Not started">Not started</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Failed">Failed</option>
                  <option value="Delayed">Delayed</option>
                  <option value="Optional">Optional</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-1">Workflow Chain</label>
                <select name="workflow" defaultValue={editingTask?.workflow || "Sequential"} className="clean-input" required>
                  <option value="Sequential">Sequential</option>
                  <option value="Parallel">Parallel</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-1">Resource Allocation</label>
                <select name="resourceAllocation" defaultValue={editingTask?.resourceAllocation || "Single"} className="clean-input" required>
                  <option value="Single">Single</option>
                  <option value="Multiple">Multiple</option>
                </select>
              </div>
              <div className="md:col-span-2 space-y-2">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-1">Operational Intelligence (Notes)</label>
                <textarea name="notes" defaultValue={editingTask?.notes} className="clean-input min-h-[100px]" placeholder="Detailed recovery instructions..." required />
              </div>
              <div className="md:col-span-2 space-y-4">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-1">Assigned Resource(s) [Name | Team]</label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                   {resources.sort((a: any, b: any) => (a.team?.name || 'Z').localeCompare(b.team?.name || 'Z')).map((r: any) => (
                     <label key={r.id} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100 cursor-pointer hover:bg-white transition-colors">
                        <input type="checkbox" name="resourceIds" value={r.id} defaultChecked={editingTask?.resources?.some((tr: any) => tr.id === r.id)} className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500" />
                        <div className="flex flex-col">
                          <span className="text-[10px] font-black uppercase truncate">{r.fullName}</span>
                          <span className="text-[8px] font-bold text-slate-400 uppercase truncate">{r.team?.name || 'Independent'}</span>
                        </div>
                     </label>
                   ))}
                </div>
              </div>

              <div className="md:col-span-2 pt-6 border-t border-slate-50 flex gap-4">
                 <button type="submit" className="flex-1 clean-button py-4 text-[11px] uppercase tracking-widest shadow-blue-200 flex items-center justify-center gap-2">
                    <Save size={16}/> {editingTask ? 'Synchronize' : 'Initialize'} Task Stream
                 </button>
              </div>
           </form>
        </div>
      )}

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={tasks.map(t => t.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-4">
            {tasks.map(task => (
              <SortableTaskItem
                key={task.id}
                task={task}
                onEdit={(t: any) => { setEditingTask(t); setShowForm(true); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                onDelete={handleDelete}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

        {!loading && tasks.length === 0 && (
           <div className="p-20 clean-inset border-dashed text-center">
              <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">No Operational Directives Defined</p>
           </div>
        )}
      </div>
    </div>
  );
}
