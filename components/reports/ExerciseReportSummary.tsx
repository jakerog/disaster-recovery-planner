"use client";

import { Exercise, Stage, Task } from "@prisma/client";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface Props {
  exercise: Exercise & { stages: (Stage & { tasks: Task[] })[] };
}

export default function ExerciseReportSummary({ exercise }: Props) {
  const chartData = exercise.stages.map(stage => {
    const totalActual = stage.tasks.reduce((sum, task) => sum + (task.actualDuration || 0), 0);
    const totalEst = stage.tasks.reduce((sum, task) => sum + (task.estimatedTime || 0), 0);
    const totalVar = stage.tasks.reduce((sum, task) => sum + (task.varianceDuration || 0), 0);

    return {
      name: stage.name,
      Actual: totalActual,
      Estimated: totalEst,
      Variance: totalVar,
    };
  });

  const totalDuration = chartData.reduce((sum, d) => sum + d.Actual, 0);
  const totalVariance = chartData.reduce((sum, d) => sum + d.Variance, 0);

  return (
    <div className="space-y-12">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-gray-900">
        <div className="bg-white border border-gray-200 p-8 rounded-2xl shadow-sm">
          <span className="text-gray-400 font-black uppercase text-[10px] tracking-widest block mb-1">Total Duration</span>
          <span className="text-4xl font-black tracking-tighter">{totalDuration} min</span>
        </div>
        <div className="bg-white border border-gray-200 p-8 rounded-2xl shadow-sm">
          <span className="text-gray-400 font-black uppercase text-[10px] tracking-widest block mb-1">Overall Variance</span>
          <span className={`text-4xl font-black tracking-tighter ${totalVariance > 0 ? "text-red-500" : "text-green-600"}`}>
            {totalVariance > 0 ? `+${totalVariance}` : totalVariance} min
          </span>
        </div>
        <div className="bg-white border border-gray-200 p-8 rounded-2xl shadow-sm">
          <span className="text-gray-400 font-black uppercase text-[10px] tracking-widest block mb-1">Tasks Completed</span>
          <span className="text-4xl font-black tracking-tighter">
            {exercise.stages.reduce((sum, s) => sum + s.tasks.filter(t => t.status === "Completed").length, 0)}
          </span>
        </div>
      </div>

      <div className="bg-white border border-gray-200 p-10 rounded-2xl shadow-sm">
        <h2 className="text-lg font-black text-gray-900 mb-8 tracking-tighter uppercase">Stage Performance</h2>
        <div className="h-[350px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis dataKey="name" stroke="#999" fontSize={10} tickLine={false} axisLine={false} />
              <YAxis stroke="#999" fontSize={10} tickLine={false} axisLine={false} />
              <Tooltip
                cursor={{ fill: '#f8fafc' }}
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 20px 50px rgba(0,0,0,0.1)', fontWeight: 'bold' }}
              />
              <Bar dataKey="Actual" fill="#000" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Estimated" fill="#e2e8f0" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
