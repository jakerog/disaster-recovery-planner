"use client";

import { Team, Vendor, Exercise } from "@prisma/client";
import TeamForm from "@/components/forms/TeamForm";
import { useState, useEffect } from "react";

export default function AdminTeamsPage() {
  const [teams, setTeams] = useState<any[]>([]);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [editingTeam, setEditingTeam] = useState<Team | null>(null);

  const fetchData = async () => {
    const [resT, resV, resE] = await Promise.all([
      fetch("/api/teams").then(r => r.json()),
      fetch("/api/vendors").then(r => r.json()),
      fetch("/api/exercises").then(r => r.json()),
    ]);
    setTeams(resT);
    setVendors(resV);
    setExercises(resE);
  };

  useEffect(() => { fetchData(); }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure?")) return;
    await fetch(`/api/teams?id=${id}`, { method: "DELETE" });
    fetchData();
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen text-gray-900">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-black mb-10 tracking-tighter uppercase">Recovery Teams</h1>
        <TeamForm initialData={editingTeam} vendors={vendors} exercises={exercises} />
        <div className="grid gap-4">
          {teams.map(t => (
            <div key={t.id} className="bg-white border border-gray-200 p-6 rounded-xl flex items-center justify-between">
              <div><h2 className="font-bold uppercase tracking-tight">{t.name}</h2><p className="text-xs text-gray-400 font-bold uppercase">{t.vendor?.name || "Internal"}</p></div>
              <div className="flex gap-4">
                <button onClick={() => setEditingTeam(t)} className="text-xs font-bold uppercase tracking-widest text-black">Edit</button>
                <button onClick={() => handleDelete(t.id)} className="text-xs font-bold uppercase tracking-widest text-red-600">Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
