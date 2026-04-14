import { prisma } from "@/lib/prisma";
import ExerciseForm from "@/components/forms/ExerciseForm";

export default async function AdminExercisesPage() {
  const exercises = await prisma.exercise.findMany();

  return (
    <div className="p-8 bg-gray-50 min-h-screen text-gray-900">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-black mb-10 tracking-tighter uppercase">Exercise Orchestration</h1>

        <ExerciseForm />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {exercises.map(e => (
            <div key={e.id} className="bg-white border border-gray-200 p-8 rounded-2xl hover:border-black transition-all cursor-pointer group shadow-sm">
              <div className="flex justify-between items-start mb-6">
                <div className="p-4 bg-gray-50 rounded-xl group-hover:bg-gray-100 transition-colors font-black text-gray-400 tracking-tighter">EXE</div>
                <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-3 py-1 rounded-full uppercase tracking-widest border border-blue-100">{e.status}</span>
              </div>
              <h2 className="text-xl font-black text-gray-900 mb-2 leading-tight uppercase tracking-tight">{e.name}</h2>
              <p className="text-xs font-bold text-gray-400 mb-8 uppercase tracking-widest">
                {e.startDate?.toLocaleDateString()} — {e.endDate?.toLocaleDateString()}
              </p>
              <div className="flex gap-4">
                <button className="flex-1 py-3 bg-gray-900 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-black transition-colors shadow-xl shadow-gray-200">
                  Configure
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
