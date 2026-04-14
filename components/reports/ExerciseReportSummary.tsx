"use client";

import { Exercise, Stage, Task } from "@prisma/client";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface Props {
  exercise: Exercise & { stages: (Stage & { tasks: Task[] })[] };
}

export default function ExerciseReportSummary({ exercise }: Props) {
  const processStages = (filter: string) => exercise.stages
    .filter(s => s.name.toLowerCase().includes(filter))
    .map(stage => ({
      name: stage.name,
      Actual: stage.tasks.reduce((sum, task) => sum + (task.actualDuration || 0), 0),
      Estimated: stage.tasks.reduce((sum, task) => sum + (task.estimatedTime || 0), 0),
    }));

  const failoverData = processStages("failover");
  const failbackData = processStages("failback");

  const totalActual = exercise.stages.reduce((sum, s) => sum + s.tasks.reduce((tSum, t) => tSum + (t.actualDuration || 0), 0), 0);
  const totalEst = exercise.stages.reduce((sum, s) => sum + s.tasks.reduce((tSum, t) => tSum + (t.estimatedTime || 0), 0), 0);
  const variance = totalActual - totalEst;

  const MetricCard = ({ label, value, colorClass = "text-black" }: any) => (
    <div className="bg-white border border-gray-200 p-8 rounded-2xl shadow-sm">
      <span className="text-gray-400 font-black uppercase text-[10px] tracking-widest block mb-1">{label}</span>
      <span className={`text-4xl font-black tracking-tighter ${colorClass}`}>{value}</span>
    </div>
  );

  const ChartSection = ({ title, data }: any) => (
    <div className="bg-white border border-gray-200 p-10 rounded-2xl shadow-sm">
      <h2 className="text-lg font-black text-gray-900 mb-8 tracking-tighter uppercase">{title} Metrics</h2>
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
            <XAxis dataKey="name" stroke="#999" fontSize={10} tickLine={false} axisLine={false} />
            <YAxis stroke="#999" fontSize={10} tickLine={false} axisLine={false} />
            <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 20px 50px rgba(0,0,0,0.1)', fontWeight: 'bold' }} />
            <Bar dataKey="Actual" fill="#000" radius={[4, 4, 0, 0]} />
            <Bar dataKey="Estimated" fill="#e2e8f0" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );

  return (
    <div className="space-y-12 text-gray-900">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <MetricCard label="Total Actual Recovery" value={`${totalActual} min`} />
        <MetricCard label="Recovery Variance" value={`${variance > 0 ? "+" : ""}${variance} min`} colorClass={variance > 0 ? "text-red-500" : "text-green-600"} />
        <MetricCard label="Efficiency Rating" value={`${Math.max(0, 100 - Math.floor((variance/totalEst)*100)) || 100}%`} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
         <ChartSection title="Failover" data={failoverData} />
         <ChartSection title="Failback" data={failbackData} />
      </div>
    </div>
  );
}
