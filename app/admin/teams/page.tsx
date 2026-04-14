"use client";

import { Team, Vendor } from "@prisma/client";
import TeamForm from "@/components/forms/TeamForm";
import { useState, useEffect } from "react";

export default function AdminTeamsPage() {
  const [teams, setTeams] = useState<any[]>([]);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [editingTeam, setEditingTeam] = useState<Team | null>(null);

  const fetchData = async () => {
    const [resT, resV] = await Promise.all([
      fetch("/api/teams").then(r => r.json()),
      fetch("/api/vendors").then(r => r.json()),
    ]);
    setTeams(resT);
    setVendors(resV);
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
        <h1 className="text-3xl font-black mb-10 tracking-tighter uppercase text-gray-900">Recovery Teams</h1>

        <TeamForm initialData={editingTeam} vendors={vendors} />

        <div className="grid gap-6">
          {teams.map(t => (
            <div key={t.id} className="bg-white border border-gray-200 p-6 rounded-xl shadow-sm flex items-center justify-between group hover:border-black transition-colors">
              <div>
                <h2 className="text-lg font-black tracking-tight">{t.name}</h2>
                <div className="flex items-center gap-3 mt-1 text-sm text-gray-500 font-medium">
                  <span>{t.vendor?.name || "Independent"}</span>
                  <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">{t.resources?.length || 0} Members</span>
                </div>
              </div>
              <div className="flex gap-4">
                <button onClick={() => setEditingTeam(t)} className="px-4 py-1.5 rounded-lg border border-gray-200 text-xs font-bold hover:bg-gray-50">Edit</button>
                <button onClick={() => handleDelete(t.id)} className="px-4 py-1.5 rounded-lg border border-red-100 text-red-600 text-xs font-bold hover:bg-red-50">Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
