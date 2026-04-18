"use client";

import { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";
import { Activity, Clock, AlertTriangle, CheckCircle2, TrendingUp, Shield } from "lucide-react";
import BackButton from "@/components/ui/BackButton";

export default function ReportDashboardPage() {
  const [exercises, setExercises] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/exercises")
      .then(res => res.json())
      .then(data => {
        setExercises(data);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="p-20 text-center font-black uppercase tracking-widest text-slate-400 animate-pulse">Aggregating Intelligence...</div>;

  // Process data for charts
  const durationData = exercises.map(ex => {
    const allTasks = ex.phases?.flatMap((p: any) => p.events?.flatMap((e: any) => e.stages?.flatMap((s: any) => s.tasks))) || [];
    const totalEst = allTasks.reduce((acc: number, t: any) => acc + (t.estimatedTime || 0), 0);
    const totalAct = allTasks.reduce((acc: number, t: any) => acc + (t.actualDuration || 0), 0);
    return {
      name: ex.name.length > 15 ? ex.name.substring(0, 15) + '...' : ex.name,
      Estimated: totalEst,
      Actual: totalAct,
      Variance: totalAct - totalEst
    };
  });

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

  return (
    <div className="p-8 md:p-12 lg:p-16 max-w-7xl mx-auto min-h-screen">
      <div className="mb-6"><BackButton /></div>

      <header className="mb-16">
        <div className="flex items-center gap-4 mb-2">
           <div className="p-3 bg-black rounded-xl text-white shadow-xl shadow-slate-200">
              <TrendingUp size={24} />
           </div>
           <h1 className="text-4xl font-black tracking-tighter uppercase">Executive Intelligence</h1>
        </div>
        <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Global Resilience Portfolio Performance</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
         {[
           { label: 'Total Exercises', val: exercises.length, icon: Shield, color: 'text-blue-600' },
           { label: 'Completed Tasks', val: exercises.reduce((acc, ex) => acc + (ex.phases?.flatMap((p:any) => p.events?.flatMap((e:any) => e.stages?.flatMap((s:any) => s.tasks))).filter((t:any) => t.status === "Completed").length || 0), 0), icon: CheckCircle2, color: 'text-green-600' },
           { label: 'Avg Variance', val: (durationData.reduce((acc, d) => acc + d.Variance, 0) / (exercises.length || 1)).toFixed(1) + 'm', icon: Clock, color: 'text-amber-600' },
           { label: 'System Health', val: '99.8%', icon: Activity, color: 'text-blue-600' }
         ].map((stat, i) => (
           <div key={i} className="clean-card p-8 border border-slate-100 shadow-xl shadow-slate-200/50 flex items-center gap-6">
              <div className={`p-4 rounded-2xl bg-slate-50 ${stat.color}`}>
                 <stat.icon size={24} />
              </div>
              <div>
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-2">{stat.label}</p>
                 <p className="text-2xl font-black text-slate-900 tracking-tight">{stat.val}</p>
              </div>
           </div>
         ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">
         <div className="clean-card p-10 border border-slate-100 shadow-xl shadow-slate-200/50">
            <h3 className="text-lg font-black uppercase tracking-tight mb-10 flex items-center gap-3">
               <Activity size={18} className="text-blue-600" />
               Actual vs Estimated Duration (Minutes)
            </h3>
            <div className="h-[400px] w-full">
               <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={durationData}>
                     <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                     <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 900, fill: '#94a3b8'}} dy={10} />
                     <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 900, fill: '#94a3b8'}} />
                     <Tooltip
                        contentStyle={{borderRadius: '1rem', border: 'none', boxShadow: '0 20px 50px rgba(0,0,0,0.1)', fontSize: '12px', fontWeight: 900}}
                        cursor={{fill: '#f8fafc'}}
                     />
                     <Legend verticalAlign="top" align="right" iconType="circle" wrapperStyle={{paddingBottom: '20px', fontSize: '10px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '1px'}} />
                     <Bar dataKey="Estimated" fill="#e2e8f0" radius={[4, 4, 0, 0]} />
                     <Bar dataKey="Actual" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  </BarChart>
               </ResponsiveContainer>
            </div>
         </div>

         <div className="clean-card p-10 border border-slate-100 shadow-xl shadow-slate-200/50">
            <h3 className="text-lg font-black uppercase tracking-tight mb-10 flex items-center gap-3">
               <AlertTriangle size={18} className="text-amber-600" />
               Recovery Variance Distribution
            </h3>
            <div className="h-[400px] w-full">
               <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={durationData}>
                     <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                     <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 900, fill: '#94a3b8'}} dy={10} />
                     <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 900, fill: '#94a3b8'}} />
                     <Tooltip
                        contentStyle={{borderRadius: '1rem', border: 'none', boxShadow: '0 20px 50px rgba(0,0,0,0.1)', fontSize: '12px', fontWeight: 900}}
                     />
                     <Line type="monotone" dataKey="Variance" stroke="#f59e0b" strokeWidth={4} dot={{r: 6, fill: '#f59e0b', strokeWidth: 3, stroke: '#fff'}} />
                  </LineChart>
               </ResponsiveContainer>
            </div>
         </div>
      </div>
    </div>
  );
}
