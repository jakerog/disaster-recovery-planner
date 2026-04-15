"use client";

import { Stage, Task } from "@prisma/client";

interface StageWithTasks extends Stage {
  tasks: Task[];
}

export default function StagePerformanceTable({ stages }: { stages: StageWithTasks[] }) {
  return (
    <div className="mt-20 skeuo-card p-10 rounded-[3rem] border border-white overflow-hidden">
      <h2 className="text-2xl font-black tracking-tight uppercase mb-8 px-4">Stage Analytics Protocol</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-separate border-spacing-y-4">
          <thead>
            <tr className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
              <th className="px-6 py-2">Recovery Stage</th>
              <th className="px-6 py-2">Operational Time</th>
              <th className="px-6 py-2">SLA Target</th>
              <th className="px-6 py-2">Variance</th>
              <th className="px-6 py-2">Integrity</th>
            </tr>
          </thead>
          <tbody>
            {stages.map((stage) => {
              const actual = stage.tasks.reduce((sum, t) => sum + (t.actualDuration || 0), 0);
              const target = stage.tasks.reduce((sum, t) => sum + (t.estimatedTime || 0), 0);
              const variance = actual - target;
              const successRate = stage.tasks.length ? Math.floor((stage.tasks.filter(t => t.status === "Completed").length / stage.tasks.length) * 100) : 0;

              return (
                <tr key={stage.id} className="skeuo-inset bg-white/40 group hover:scale-[1.01] transition-transform">
                  <td className="px-6 py-5 rounded-l-2xl">
                    <div className="text-sm font-black uppercase tracking-tight">{stage.name}</div>
                    <div className="text-[9px] font-bold text-gray-400 uppercase">{stage.tasks.length} Tasks Decoded</div>
                  </td>
                  <td className="px-6 py-5 text-xl font-black">{actual}m</td>
                  <td className="px-6 py-5 text-sm font-bold text-gray-400">{target}m</td>
                  <td className={`px-6 py-5 text-sm font-black ${variance > 0 ? "text-red-500" : "text-green-500"}`}>
                    {variance > 0 ? "+" : ""}{variance}m
                  </td>
                  <td className="px-6 py-5 rounded-r-2xl">
                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden skeuo-inset border-none">
                        <div
                          className={`h-full transition-all duration-1000 ${successRate === 100 ? "bg-green-500" : "bg-blue-500"}`}
                          style={{ width: `${successRate}%` }}
                        />
                      </div>
                      <span className="text-[10px] font-black">{successRate}%</span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
