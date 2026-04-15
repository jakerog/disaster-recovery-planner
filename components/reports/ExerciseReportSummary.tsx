"use client";

import { Exercise, Stage, Task } from "@prisma/client";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";

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
    <div className="space-y-20 text-gray-900 font-sans">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="bg-gray-50 p-8 rounded-3xl border border-gray-100 shadow-sm">
          <span className="text-gray-400 font-black uppercase text-[10px] block mb-2 tracking-[0.2em]">Total Uptime Risk</span>
          <span className="text-5xl font-black tracking-tighter">{totalActual} <small className="text-xl">min</small></span>
        </div>
        <div className="bg-gray-50 p-8 rounded-3xl border border-gray-100 shadow-sm">
          <span className="text-gray-400 font-black uppercase text-[10px] block mb-2 tracking-[0.2em]">SLA Variance</span>
          <span className={`text-5xl font-black tracking-tighter ${variance > 0 ? "text-red-600" : "text-green-600"}`}>
            {variance > 0 ? "+" : ""}{variance} <small className="text-xl">min</small>
          </span>
        </div>
        <div className="bg-gray-50 p-8 rounded-3xl border border-gray-100 shadow-sm">
          <span className="text-gray-400 font-black uppercase text-[10px] block mb-2 tracking-[0.2em]">Efficiency Score</span>
          <span className="text-5xl font-black tracking-tighter">
            {totalEst ? Math.max(0, Math.floor(100 - (variance / totalEst) * 100)) : 100}%
          </span>
        </div>
        <div className="bg-gray-50 p-8 rounded-3xl border border-gray-100 shadow-sm">
          <span className="text-gray-400 font-black uppercase text-[10px] block mb-2 tracking-[0.2em]">Task Integrity</span>
          <span className="text-5xl font-black tracking-tighter">
            {Math.floor((exercise.stages.reduce((sum, s) => sum + s.tasks.filter(t => t.status === "Completed").length, 0) / Math.max(1, exercise.stages.reduce((sum, s) => sum + s.tasks.length, 0))) * 100)}%
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        <section>
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-xl font-black tracking-tight uppercase">Failover Recovery Cycle</h2>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{failoverData.length} STAGES ANALYZED</span>
          </div>
          <div className="h-[400px] w-full bg-white border border-gray-100 p-8 rounded-3xl shadow-2xl shadow-gray-100">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={failoverData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="name" stroke="#999" fontSize={10} axisLine={false} tickLine={false} />
                <YAxis stroke="#999" fontSize={10} axisLine={false} tickLine={false} />
                <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 20px 50px rgba(0,0,0,0.1)'}} />
                <Bar dataKey="Actual" fill="#000" radius={[6, 6, 0, 0]} barSize={30} />
                <Bar dataKey="Estimated" fill="#e2e8f0" radius={[6, 6, 0, 0]} barSize={30} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section>
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-xl font-black tracking-tight uppercase">Failback Recovery Cycle</h2>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{failbackData.length} STAGES ANALYZED</span>
          </div>
          <div className="h-[400px] w-full bg-white border border-gray-100 p-8 rounded-3xl shadow-2xl shadow-gray-100">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={failbackData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="name" stroke="#999" fontSize={10} axisLine={false} tickLine={false} />
                <YAxis stroke="#999" fontSize={10} axisLine={false} tickLine={false} />
                <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 20px 50px rgba(0,0,0,0.1)'}} />
                <Bar dataKey="Actual" fill="#000" radius={[6, 6, 0, 0]} barSize={30} />
                <Bar dataKey="Estimated" fill="#e2e8f0" radius={[6, 6, 0, 0]} barSize={30} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>
      </div>
    </div>
  );
}
