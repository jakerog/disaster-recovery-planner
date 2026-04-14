import { prisma } from "@/lib/prisma";

export default async function AdminExercisesPage() {
  const exercises = await prisma.exercise.findMany();

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold mb-8 tracking-tight">Exercise Orchestration</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {exercises.map(e => (
            <div key={e.id} className="bg-white border border-gray-200 p-6 rounded-xl hover:border-blue-500 transition-colors cursor-pointer group shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-gray-50 rounded-lg group-hover:bg-blue-50 transition-colors italic font-bold text-gray-400">EXE</div>
                <span className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">{e.status}</span>
              </div>
              <h2 className="text-lg font-bold text-gray-900 mb-1">{e.name}</h2>
              <p className="text-sm text-gray-500 mb-6">Planned for {e.startDate?.toDateString()}</p>
              <button className="w-full py-2 bg-gray-900 text-white rounded-lg text-sm font-bold hover:bg-black transition-colors">
                Configure Workflow
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
