"use client";

import { useState, useEffect } from "react";
import { ListChecks, Shield, Search, Filter } from "lucide-react";
import TaskManagementList from "@/components/workflow/TaskManagementList";
import BackButton from "@/components/ui/BackButton";

export default function GlobalTaskManagementPage() {
  const [exercises, setExercises] = useState<any[]>([]);
  const [selectedExerciseId, setSelectedExerciseId] = useState<string>("");
  const [teams, setTeams] = useState<any[]>([]);
  const [resources, setResources] = useState<any[]>([]);
  const [stages, setStages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const [exRes, teamsRes, resourcesRes] = await Promise.all([
        fetch("/api/exercises"),
        fetch("/api/teams"),
        fetch("/api/resources")
      ]);

      const exData = await exRes.json();
      const teamsData = await teamsRes.json();
      const resourcesData = await resourcesRes.json();

      setExercises(exData);
      setTeams(teamsData);
      setResources(resourcesData);

      if (exData.length > 0) {
        setSelectedExerciseId(exData[0].id);
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (selectedExerciseId) {
      const ex = exercises.find(e => e.id === selectedExerciseId);
      if (ex) {
        const allStages = ex.phases?.flatMap((p: any) => p.events?.flatMap((e: any) => e.stages || []) || []) || [];
        setStages(allStages);
      }
    }
  }, [selectedExerciseId, exercises]);

  if (loading) return (
    <div className="p-12 text-center">
      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 animate-pulse">Initializing Global Task Stream...</p>
    </div>
  );

  return (
    <div className="p-8 md:p-12 lg:p-16 max-w-7xl mx-auto min-h-screen">
      <div className="mb-6"><BackButton /></div>

      <header className="mb-12 flex flex-col md:flex-row md:items-center justify-between gap-8">
        <div>
          <div className="flex items-center gap-4 mb-2">
            <div className="p-3 bg-black rounded-xl text-white shadow-xl shadow-slate-200">
              <ListChecks size={24} />
            </div>
            <h1 className="text-4xl font-black tracking-tighter uppercase">Operational Directives</h1>
          </div>
          <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Command Center Task Master</p>
        </div>

        <div className="flex items-center gap-4 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm min-w-[300px]">
           <Filter size={18} className="text-slate-300" />
           <div className="flex-1">
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Target Exercise</p>
              <select
                value={selectedExerciseId}
                onChange={(e) => setSelectedExerciseId(e.target.value)}
                className="w-full bg-transparent font-black text-sm uppercase tracking-tight focus:outline-none cursor-pointer"
              >
                {exercises.map(ex => (
                  <option key={ex.id} value={ex.id}>{ex.name}</option>
                ))}
              </select>
           </div>
        </div>
      </header>

      {selectedExerciseId ? (
        <TaskManagementList
           exerciseId={selectedExerciseId}
           stages={stages}
           teams={teams}
           resources={resources}
        />
      ) : (
        <div className="clean-inset p-20 text-center">
           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">No Exercise Selected</p>
        </div>
      )}
    </div>
  );
}
