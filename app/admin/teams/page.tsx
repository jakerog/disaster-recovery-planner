import { prisma } from "@/lib/prisma";
import TeamForm from "@/components/forms/TeamForm";

export default async function AdminTeamsPage() {
  const [teams, vendors] = await Promise.all([
    prisma.team.findMany({ include: { vendor: true, _count: { select: { resources: true, tasks: true } } } }),
    prisma.vendor.findMany(),
  ]);

  return (
    <div className="p-8 bg-gray-50 min-h-screen text-gray-900">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-black mb-10 tracking-tighter uppercase text-gray-900">Recovery Teams</h1>

        <TeamForm vendors={vendors} />

        <div className="grid gap-6">
          {teams.map(t => (
            <div key={t.id} className="bg-white border border-gray-200 p-6 rounded-xl shadow-sm flex items-center justify-between group hover:border-black transition-colors">
              <div>
                <h2 className="text-lg font-black tracking-tight">{t.name}</h2>
                <div className="flex items-center gap-3 mt-1 text-sm text-gray-500 font-medium">
                  <span>{t.vendor?.name || "Independent"}</span>
                  <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">{t._count.resources} Members</span>
                </div>
              </div>
              <div className="flex gap-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="text-gray-400 font-bold hover:text-black transition-colors">Edit</button>
                <button className="text-red-300 font-bold hover:text-red-600 transition-colors">Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
