"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Cell } from "recharts";

interface GranularAnalyticsProps {
  exercise: any;
}

export default function GranularAnalytics({ exercise }: GranularAnalyticsProps) {
  // Extract all stages and their task aggregations
  const stageData = exercise.phases.flatMap((p: any) =>
    p.events.flatMap((e: any) =>
      e.stages.map((s: any) => {
        const estimated = s.tasks.reduce((sum: number, t: any) => sum + (t.estimatedTime || 0), 0);
        const actual = s.tasks.reduce((sum: number, t: any) => sum + (t.actualDuration || 0), 0);
        const variance = actual - estimated;

        return {
          name: s.name,
          event: e.name,
          estimated,
          actual,
          variance
        };
      })
    )
  );

  return (
    <div className="mt-16 space-y-12">
      <div className="clean-card p-8">
        <h2 className="text-xl font-bold text-slate-900 mb-8 border-b border-slate-100 pb-4">
          Stage Performance Matrix
        </h2>

        <div className="h-[450px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={stageData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis
                dataKey="name"
                angle={-45}
                textAnchor="end"
                interval={0}
                height={80}
                tick={{ fontSize: 10, fontWeight: 700, fill: '#64748b' }}
              />
              <YAxis
                label={{ value: 'Minutes', angle: -90, position: 'insideLeft', fontSize: 12, fontWeight: 700 }}
                tick={{ fontSize: 10, fontWeight: 700, fill: '#64748b' }}
              />
              <Tooltip
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                cursor={{ fill: '#f8fafc' }}
              />
              <Legend verticalAlign="top" height={36}/>
              <Bar dataKey="estimated" name="SLA Target" fill="#94a3b8" radius={[4, 4, 0, 0]} />
              <Bar dataKey="actual" name="Actual Performance" fill="#2563eb" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="clean-card p-8">
          <h3 className="text-lg font-bold text-slate-900 mb-6">Efficiency Variance</h3>
          <div className="space-y-4">
            {stageData.map((s: any, idx: number) => (
              <div key={idx} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-100">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{s.event}</p>
                  <p className="text-sm font-bold text-slate-700">{s.name}</p>
                </div>
                <div className="text-right">
                  <p className={`text-lg font-black ${s.variance > 0 ? 'text-rose-500' : 'text-emerald-500'}`}>
                    {s.variance > 0 ? `+${s.variance}` : s.variance}m
                  </p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase">SLA Delta</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="clean-card p-8">
          <h3 className="text-lg font-bold text-slate-900 mb-6">Critical Stage Analysis</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stageData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" hide />
                <Tooltip />
                <Bar dataKey="variance" name="Variance">
                  {stageData.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={entry.variance > 0 ? '#f43f5e' : '#10b981'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="text-xs text-slate-500 mt-6 leading-relaxed italic">
            Visualizing deviation across operational recovery points. Green indicates performance exceeding SLA targets, while Red signals recovery bottlenecks requiring workflow optimization.
          </p>
        </div>
      </div>
    </div>
  );
}
