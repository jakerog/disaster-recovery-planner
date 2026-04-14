import { prisma } from "@/lib/prisma";
import ResourceForm from "@/components/forms/ResourceForm";

export default async function AdminResourcesPage() {
  const [resources, teams, vendors] = await Promise.all([
    prisma.resource.findMany({ include: { team: true, vendor: true } }),
    prisma.team.findMany(),
    prisma.vendor.findMany(),
  ]);

  return (
    <div className="p-8 bg-gray-50 min-h-screen text-gray-900">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-black mb-10 tracking-tighter uppercase">Resource Management</h1>

        <ResourceForm teams={teams} vendors={vendors} />

        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-xs font-bold text-gray-500 uppercase tracking-widest">
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Contact</th>
                <th className="px-6 py-4">Assignment</th>
                <th className="px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {resources.map((r) => (
                <tr key={r.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-bold text-gray-900">{r.fullName}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-600">{r.email}</div>
                    <div className="text-[10px] text-gray-400 font-bold uppercase">{r.phoneNumber}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-bold text-gray-700">{r.team?.name || "No Team"}</div>
                    <div className="text-[10px] text-blue-600 font-black uppercase tracking-tighter">{r.vendor?.name}</div>
                  </td>
                  <td className="px-6 py-4 text-sm flex gap-4">
                    <button className="text-gray-400 font-bold hover:text-black transition-colors">Edit</button>
                    <button className="text-red-300 font-bold hover:text-red-600 transition-colors">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
