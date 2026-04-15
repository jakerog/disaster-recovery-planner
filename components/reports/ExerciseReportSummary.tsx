"use client";

import { Exercise, Phase, Event, Stage, Task } from "@prisma/client";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface Props {
  exercise: Exercise & {
    phases: (Phase & {
      events: (Event & {
        stages: (Stage & {
          tasks: Task[]
        })[]
      })[]
    })[]
  };
}

export default function ExerciseReportSummary({ exercise }: Props) {
  const allEvents = exercise.phases.flatMap(p => p.events.map(e => ({
    ...e,
    phaseName: p.name,
    actual: e.stages.reduce((sum, s) => sum + s.tasks.reduce((tSum, t) => tSum + (t.actualDuration || 0), 0), 0),
    estimated: e.stages.reduce((sum, s) => sum + s.tasks.reduce((tSum, t) => tSum + (t.estimatedTime || 0), 0), 0)
  })));

  const failoverEvents = allEvents.filter(e => e.name === "Failover");
  const failbackEvents = allEvents.filter(e => e.name === "Failback");

  const totalActual = allEvents.reduce((sum, e) => sum + e.actual, 0);
  const totalEst = allEvents.reduce((sum, e) => sum + e.estimated, 0);
  const variance = totalActual - totalEst;

  return (
    <div className="space-y-24 text-gray-900 font-sans">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {[
          { label: "Total Recovery Time", val: `${totalActual}m` },
          { label: "SLA Variance", val: `${variance > 0 ? "+" : ""}${variance}m`, color: variance > 0 ? "text-red-600" : "text-green-600" },
          { label: "Efficiency Rating", val: `${totalEst ? Math.max(0, Math.floor(100 - (variance / totalEst) * 100)) : 100}%` },
          { label: "Phase Completion", val: `${Math.floor((exercise.phases.length / 4) * 100)}%` }
        ].map((stat, i) => (
          <div key={i} className="skeuo-card p-10 rounded-[2rem] border border-white">
            <span className="text-gray-400 font-black uppercase text-[10px] block mb-2 tracking-[0.2em]">{stat.label}</span>
            <span className={`text-5xl font-black tracking-tighter ${stat.color || "text-black"}`}>{stat.val}</span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        <section>
          <div className="flex justify-between items-center mb-8 px-4">
            <h2 className="text-2xl font-black tracking-tight uppercase">Failover Track</h2>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Aggregate across all phases</span>
          </div>
          <div className="skeuo-card p-10 rounded-[3rem] border border-white h-[450px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={failoverEvents.map(e => ({ name: e.phaseName, Actual: e.actual, Estimated: e.estimated }))}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="name" stroke="#999" fontSize={11} axisLine={false} tickLine={false} />
                <YAxis stroke="#999" fontSize={11} axisLine={false} tickLine={false} />
                <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '24px', border: 'none', boxShadow: '0 20px 50px rgba(0,0,0,0.1)'}} />
                <Bar dataKey="Actual" fill="#000" radius={[8, 8, 0, 0]} barSize={35} />
                <Bar dataKey="Estimated" fill="#e2e8f0" radius={[8, 8, 0, 0]} barSize={35} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section>
          <div className="flex justify-between items-center mb-8 px-4">
            <h2 className="text-2xl font-black tracking-tight uppercase">Failback Track</h2>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Aggregate across all phases</span>
          </div>
          <div className="skeuo-card p-10 rounded-[3rem] border border-white h-[450px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={failbackEvents.map(e => ({ name: e.phaseName, Actual: e.actual, Estimated: e.estimated }))}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="name" stroke="#999" fontSize={11} axisLine={false} tickLine={false} />
                <YAxis stroke="#999" fontSize={11} axisLine={false} tickLine={false} />
                <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '24px', border: 'none', boxShadow: '0 20px 50px rgba(0,0,0,0.1)'}} />
                <Bar dataKey="Actual" fill="#000" radius={[8, 8, 0, 0]} barSize={35} />
                <Bar dataKey="Estimated" fill="#e2e8f0" radius={[8, 8, 0, 0]} barSize={35} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>
      </div>

      <section className="mt-20">
         <h2 className="text-2xl font-black tracking-tight uppercase mb-10 px-4">Detailed Stage Performance</h2>
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {allEvents.flatMap(e => e.stages).map(s => {
               const act = s.tasks.reduce((sum, t) => sum + (t.actualDuration || 0), 0);
               const est = s.tasks.reduce((sum, t) => sum + (t.estimatedTime || 0), 0);
               const varMin = act - est;
               return (
                  <div key={s.id} className="skeuo-inset p-6 border border-white/50">
                     <div className="text-[9px] font-black text-gray-400 uppercase mb-2 tracking-widest">{s.name}</div>
                     <div className="flex justify-between items-end">
                        <div className="text-2xl font-black">{act}m</div>
                        <div className={`text-[10px] font-black uppercase ${varMin > 0 ? "text-red-500" : "text-green-600"}`}>
                           {varMin > 0 ? "+" : ""}{varMin}m
                        </div>
                     </div>
                  </div>
               );
            })}
         </div>
      </section>
    </div>
  );
}
