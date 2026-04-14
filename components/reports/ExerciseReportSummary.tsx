"use client";

import { Exercise, Stage, Task } from "@prisma/client";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface Props {
  exercise: Exercise & { stages: (Stage & { tasks: Task[] })[] };
}

export default function ExerciseReportSummary({ exercise }: Props) {
  const processStages = (filter: string) => exercise.stages
    .filter(s => s.name.toLowerCase().includes(filter.toLowerCase()))
    .map(stage => ({
      name: stage.name,
      Actual: stage.tasks.reduce((sum, task) => sum + (task.actualDuration || 0), 0),
      Estimated: stage.tasks.reduce((sum, task) => sum + (task.estimatedTime || 0), 0),
    }));

  const failoverData = processStages("Failover");
  const failbackData = processStages("Failback");

  const totalActual = exercise.stages.reduce((sum, s) => sum + s.tasks.reduce((tSum, t) => tSum + (t.actualDuration || 0), 0), 0);
  const totalEst = exercise.stages.reduce((sum, s) => sum + s.tasks.reduce((tSum, t) => tSum + (t.estimatedTime || 0), 0), 0);
  const variance = totalActual - totalEst;

  return (
    <div className="space-y-12 text-gray-900">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white border p-8 rounded-2xl shadow-sm">
          <span className="text-gray-400 font-bold uppercase text-[10px] block mb-1 tracking-widest">Failover Duration</span>
          <span className="text-4xl font-black tracking-tighter">{failoverData.reduce((s, d) => s + d.Actual, 0)} min</span>
        </div>
        <div className="bg-white border p-8 rounded-2xl shadow-sm">
          <span className="text-gray-400 font-bold uppercase text-[10px] block mb-1 tracking-widest">Failback Duration</span>
          <span className="text-4xl font-black tracking-tighter">{failbackData.reduce((s, d) => s + d.Actual, 0)} min</span>
        </div>
        <div className="bg-white border p-8 rounded-2xl shadow-sm">
          <span className="text-gray-400 font-bold uppercase text-[10px] block mb-1 tracking-widest">Total Variance</span>
          <span className={`text-4xl font-black tracking-tighter ${variance > 0 ? "text-red-500" : "text-green-600"}`}>{variance} min</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white border p-10 rounded-2xl shadow-sm">
          <h2 className="text-lg font-black mb-8 tracking-tighter uppercase">Failover Track</h2>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={failoverData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="name" stroke="#999" fontSize={10} />
                <YAxis stroke="#999" fontSize={10} />
                <Tooltip />
                <Bar dataKey="Actual" fill="#000" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Estimated" fill="#e2e8f0" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="bg-white border p-10 rounded-2xl shadow-sm">
          <h2 className="text-lg font-black mb-8 tracking-tighter uppercase">Failback Track</h2>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={failbackData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="name" stroke="#999" fontSize={10} />
                <YAxis stroke="#999" fontSize={10} />
                <Tooltip />
                <Bar dataKey="Actual" fill="#000" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Estimated" fill="#e2e8f0" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
