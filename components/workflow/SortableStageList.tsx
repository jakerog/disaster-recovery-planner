"use client";

import { useState } from "react";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from "@dnd-kit/core";
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Trash2, Edit2 } from "lucide-react";

interface SortableStageProps {
  stage: any;
  onEdit: (stage: any) => void;
  onDelete: (id: string) => void;
}

function SortableStage({ stage, onEdit, onDelete }: SortableStageProps) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: stage.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-gray-50 border border-gray-100 p-4 rounded-xl flex justify-between items-center group shadow-sm hover:shadow-md transition-all mb-4"
    >
      <div className="flex items-center gap-4">
        <div {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing text-gray-300 hover:text-gray-500">
           <GripVertical size={18} />
        </div>
        <span className="text-sm font-black text-gray-800 uppercase tracking-tight">{stage.name}</span>
      </div>
      <div className="flex gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
         <button onClick={() => onEdit(stage)} className="p-2 rounded-lg hover:bg-blue-50 text-blue-400 hover:text-blue-600 transition-colors">
            <Edit2 size={16} />
         </button>
         <button onClick={() => onDelete(stage.id)} className="p-2 rounded-lg hover:bg-rose-50 text-rose-300 hover:text-rose-600 transition-colors">
            <Trash2 size={16} />
         </button>
      </div>
    </div>
  );
}

export default function SortableStageList({ stages, onReorder, onEdit, onDelete }: any) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = stages.findIndex((s: any) => s.id === active.id);
      const newIndex = stages.findIndex((s: any) => s.id === over.id);
      onReorder(arrayMove(stages, oldIndex, newIndex));
    }
  };

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={stages.map((s: any) => s.id)} strategy={verticalListSortingStrategy}>
        <div className="mt-4">
          {stages.map((stage: any) => (
            <SortableStage key={stage.id} stage={stage} onEdit={onEdit} onDelete={onDelete} />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
